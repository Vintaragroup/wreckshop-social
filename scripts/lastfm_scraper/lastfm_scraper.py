#!/usr/bin/env python3
import argparse
import asyncio
import datetime as dt
import os
import re
import sys
from dataclasses import dataclass, asdict
import random
from typing import Iterable, Optional, Set, List, Dict, Union

import httpx
from bs4 import BeautifulSoup
from fake_useragent import UserAgent
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

# Selenium is optional; we import only when needed
from selenium.webdriver.chrome.options import Options
from selenium.webdriver import Chrome
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

UA = UserAgent()

LASTFM_BASE = "https://www.last.fm"

@dataclass
class Candidate:
    provider: str
    handle: str
    profile_url: str
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None
    # Enrichment fields (via Last.fm API)
    realname: Optional[str] = None
    country: Optional[str] = None
    playcount: Optional[int] = None
    registered_iso: Optional[str] = None
    top_tags: Optional[List[str]] = None
    top_artists: Optional[List[str]] = None


def norm_tag(tag: str) -> str:
    t = tag.strip().lower()
    mapping = {"r&b": "rnb", "rnb": "rnb", "r&b/soul": "rnb"}
    t = mapping.get(t, t)
    return re.sub(r"\s+", "-", t)


def artist_slug(name: str) -> str:
    # Basic slug: replace spaces with + and strip
    return re.sub(r"\s+", "+", name.strip())


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=0.5, min=1, max=5), reraise=True)
async def fetch_html(client: httpx.AsyncClient, url: str) -> str:
    resp = await client.get(url, headers={"User-Agent": UA.random})
    resp.raise_for_status()
    return resp.text


def _pick_image(images: List[dict]) -> Optional[str]:
    if not images:
        return None
    # Prefer extralarge -> large -> medium -> small
    by_size = {im.get("size"): im.get("#text") for im in images if isinstance(im, dict)}
    return by_size.get("extralarge") or by_size.get("large") or by_size.get("medium") or by_size.get("small")


async def enrich_user(handle: str, api_key: Optional[str], proxies: Optional[Union[str, Dict[str, str]]] = None) -> dict:
    if not api_key:
        return {}
    params = {"api_key": api_key, "format": "json"}
    async with httpx.AsyncClient(timeout=20, proxies=proxies) as client:
        # user.getInfo
        info = {}
        try:
            r = await client.get(
                "https://ws.audioscrobbler.com/2.0/",
                params={**params, "method": "user.getinfo", "user": handle},
                headers={"User-Agent": UA.random},
            )
            if r.status_code == 200:
                info = r.json().get("user", {})
        except Exception:
            info = {}

        # user.getTopTags
        tags: List[str] = []
        try:
            r = await client.get(
                "https://ws.audioscrobbler.com/2.0/",
                params={**params, "method": "user.gettoptags", "user": handle, "limit": 10},
                headers={"User-Agent": UA.random},
            )
            if r.status_code == 200:
                jt = r.json()
                items = jt.get("toptags", {}).get("tag", [])
                tags = [str(t.get("name")) for t in items if t.get("name")]
        except Exception:
            tags = []

        # user.getTopArtists
        artists: List[str] = []
        try:
            r = await client.get(
                "https://ws.audioscrobbler.com/2.0/",
                params={**params, "method": "user.gettopartists", "user": handle, "limit": 10},
                headers={"User-Agent": UA.random},
            )
            if r.status_code == 200:
                ja = r.json()
                items = ja.get("topartists", {}).get("artist", [])
                artists = [str(a.get("name")) for a in items if a.get("name")]
        except Exception:
            artists = []

    # Map info
    realname = info.get("realname") or None
    country = info.get("country") or None
    playcount = None
    try:
        playcount = int(info.get("playcount")) if info.get("playcount") else None
    except Exception:
        playcount = None
    reg = info.get("registered", {})
    registered_iso = None
    try:
        unixts = int(reg.get("unixtime")) if reg and reg.get("unixtime") else None
        if unixts:
            registered_iso = dt.datetime.utcfromtimestamp(unixts).isoformat() + "Z"
    except Exception:
        registered_iso = None
    avatar_url = _pick_image(info.get("image", []))

    return {
        "realname": realname,
        "country": country,
        "playcount": playcount,
        "registered_iso": registered_iso,
        "avatar_url": avatar_url,
        "top_tags": tags or None,
        "top_artists": artists or None,
    }


def parse_user_links_from_html(html: str) -> List[Candidate]:
    soup = BeautifulSoup(html, "lxml")
    cands: List[Candidate] = []
    for a in soup.select("a[href^='/user/']"):
        href = a.get("href") or ""
        m = re.match(r"^/user/([^/?#]+)", href)
        if not m:
            continue
        handle = m.group(1)
        profile_url = f"{LASTFM_BASE}{href}"
        display_name = a.get_text(strip=True) or handle
        cands.append(Candidate(provider="lastfm", handle=handle, profile_url=profile_url, display_name=display_name))
    return cands


async def scrape_tag_top_artists(tag: str, limit: int = 10, proxies: Optional[Union[str, Dict[str, str]]] = None) -> List[str]:
    tag_slug = norm_tag(tag)
    url = f"{LASTFM_BASE}/tag/{tag_slug}/artists"
    async with httpx.AsyncClient(timeout=20, proxies=proxies) as client:
        html = await fetch_html(client, url)
    soup = BeautifulSoup(html, "lxml")
    names: List[str] = []
    # Flexible selectors for artist links
    for a in soup.select("a[href^='/music/']"):
        href = a.get("href") or ""
        if "+" in href or href.count("/") >= 3:  # heuristics to skip subpages
            continue
        name = a.get_text(strip=True)
        if name and name.lower() != "music":
            names.append(name)
        if len(names) >= limit:
            break
    # Fallback: pick headings
    if not names:
        for h in soup.select("h3, h4"):
            t = h.get_text(strip=True)
            if t and len(t) > 1:
                names.append(t)
            if len(names) >= limit:
                break
    # Dedupe preserving order
    seen = set()
    out = []
    for n in names:
        if n not in seen:
            seen.add(n)
            out.append(n)
    return out


def selenium_scroll_collect(url: str, max_users: int = 200, headless: bool = True, cookies: Optional[List[dict]] = None,
                            scroll_delay_range: tuple = (1.0, 2.0), stagnant_limit: int = 8,
                            proxy_server: Optional[str] = None) -> List[Candidate]:
    options = Options()
    if headless:
        options.add_argument("--headless=new")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument(f"--user-agent={UA.random}")
    if proxy_server:
        options.add_argument(f"--proxy-server={proxy_server}")
    # Use system Chromium if provided
    chrome_bin = os.environ.get("CHROME_BIN")
    if chrome_bin:
        options.binary_location = chrome_bin
    # Prefer system chromedriver that matches Chromium installed in the image
    driver_path = os.environ.get("CHROMEDRIVER", "/usr/bin/chromedriver")
    service = Service(driver_path)
    driver = Chrome(service=service, options=options)
    try:
        driver.set_page_load_timeout(45)
        # Visit base first, then set cookies if provided, then go to target URL
        driver.get(LASTFM_BASE)
        if cookies:
            for c in cookies:
                try:
                    # Ensure required fields for Selenium
                    cookie = {
                        "name": c.get("name"),
                        "value": c.get("value"),
                        "domain": c.get("domain", ".last.fm"),
                        "path": c.get("path", "/"),
                    }
                    if cookie["name"] and cookie["value"]:
                        driver.add_cookie(cookie)
                except Exception:
                    pass
        driver.get(url)
        # Wait for anchors to appear
        try:
            WebDriverWait(driver, 25).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "a[href^='/user/']"))
            )
        except Exception:
            # Continue anyway; some pages populate anchors only after scroll
            pass
        seen: Set[str] = set()
        results: List[Candidate] = []
        last_count = 0
        stagnant_ticks = 0
        while len(results) < max_users and stagnant_ticks < stagnant_limit:
            # Extract users
            anchors = driver.find_elements(By.CSS_SELECTOR, "a[href^='/user/']")
            for a in anchors:
                href = a.get_attribute("href") or ""
                m = re.match(r"^https?://[^/]+/user/([^/?#]+)", href)
                if not m:
                    continue
                handle = m.group(1)
                if handle in seen:
                    continue
                seen.add(handle)
                display_name = a.text.strip() or handle
                results.append(Candidate("lastfm", handle, href, display_name))
                if len(results) >= max_users:
                    break
            # Scroll
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            delay = random.uniform(scroll_delay_range[0], scroll_delay_range[1])
            awaitable_sleep(delay)
            # Heuristic stagnation check
            if len(results) == last_count:
                stagnant_ticks += 1
            else:
                stagnant_ticks = 0
                last_count = len(results)
        return results[:max_users]
    finally:
        driver.quit()


def awaitable_sleep(sec: float):
    # simple helper to avoid bringing in asyncio to selenium loop
    import time
    time.sleep(sec)


async def discover_by_genre(genre: str, max_users: int, headless: bool, proxies: Optional[Union[str, Dict[str, str]]] = None,
                            proxy_server: Optional[str] = None) -> List[Candidate]:
    artists = await scrape_tag_top_artists(genre, limit=8, proxies=proxies)
    collected: List[Candidate] = []
    seen: Set[str] = set()
    for artist in artists:
        if len(collected) >= max_users:
            break
        slug = artist_slug(artist)
        url = f"{LASTFM_BASE}/music/{slug}/+listeners"
        users = selenium_scroll_collect(url, max_users=max_users - len(collected), headless=headless,
                                        proxy_server=proxy_server)
        for u in users:
            if u.handle not in seen:
                seen.add(u.handle)
                collected.append(u)
                if len(collected) >= max_users:
                    break
    return collected[:max_users]


async def discover_by_artist(artist: str, max_users: int, headless: bool, proxy_server: Optional[str] = None) -> List[Candidate]:
    slug = artist_slug(artist)
    url = f"{LASTFM_BASE}/music/{slug}/+listeners"
    return selenium_scroll_collect(url, max_users=max_users, headless=headless, proxy_server=proxy_server)


def parse_cookie_header(cookie_header: str) -> List[dict]:
    cookies: List[dict] = []
    for part in cookie_header.split(";"):
        if "=" not in part:
            continue
        name, value = part.split("=", 1)
        name = name.strip()
        value = value.strip()
        if name and value:
            cookies.append({"name": name, "value": value, "domain": ".last.fm", "path": "/"})
    return cookies


def try_collect_user_list_pages(seed: str, headless: bool, max_users: int, cookies: Optional[List[dict]],
                               scroll_delay_range: tuple, include_neighbors: bool = True,
                               include_following: bool = True, include_followers: bool = True) -> List[Candidate]:
    collected: List[Candidate] = []
    seen: Set[str] = set()

    def _collect(url: str, label: str):
        nonlocal collected, seen
        if len(collected) >= max_users:
            return
        users = selenium_scroll_collect(url, max_users=max_users - len(collected), headless=headless,
                                        cookies=cookies, scroll_delay_range=scroll_delay_range,
                                        proxy_server=os.environ.get("SELENIUM_PROXY_SERVER"))
        for u in users:
            if u.handle not in seen:
                seen.add(u.handle)
                collected.append(u)

    # Neighbours (try both spellings)
    if include_neighbors:
        _collect(f"{LASTFM_BASE}/user/{seed}/neighbours", "neighbours")
        if len(collected) == 0:
            _collect(f"{LASTFM_BASE}/user/{seed}/neighbors", "neighbors")
    # Following / Followers
    if include_following:
        _collect(f"{LASTFM_BASE}/user/{seed}/following", "following")
    if include_followers:
        _collect(f"{LASTFM_BASE}/user/{seed}/followers", "followers")

    return collected[:max_users]


async def post_to_backend(backend: str, cand: Candidate) -> None:
    url = backend.rstrip("/") + "/api/profiles/ingest"
    async with httpx.AsyncClient(timeout=20) as client:
        try:
            await client.post(url, json={
                "provider": "lastfm",
                "handleOrUrl": cand.profile_url or f"https://www.last.fm/user/{cand.handle}"
            })
        except Exception:
            pass


def write_jsonl(path: str, items: Iterable[Candidate]):
    import orjson
    with open(path, "wb") as f:
        for c in items:
            f.write(orjson.dumps(asdict(c)))
            f.write(b"\n")


async def main():
    p = argparse.ArgumentParser(description="Scrape Last.fm users by interest")
    p.add_argument("--genre", type=str, help="Genre/tag to target (e.g., R&B)")
    p.add_argument("--artist", type=str, help="Artist name to pull listeners from")
    p.add_argument("--seed-user", type=str, help="Seed username to crawl neighbours/followers/following")
    p.add_argument("--neighbors", dest="neighbors", action="store_true", help="Include neighbours (default true when --seed-user)")
    p.add_argument("--no-neighbors", dest="neighbors", action="store_false")
    p.set_defaults(neighbors=True)
    p.add_argument("--followers", dest="followers", action="store_true", help="Include followers (default true when --seed-user)")
    p.add_argument("--no-followers", dest="followers", action="store_false")
    p.set_defaults(followers=True)
    p.add_argument("--following", dest="following", action="store_true", help="Include following (default true when --seed-user)")
    p.add_argument("--no-following", dest="following", action="store_false")
    p.set_defaults(following=True)
    p.add_argument("--max-users", type=int, default=100)
    p.add_argument("--emit-jsonl", type=str, help="Path to write JSONL output")
    p.add_argument("--backend", type=str, help="Backend base URL for ingestion (e.g., http://localhost:4002)")
    p.add_argument("--ingest", action="store_true", help="Post discovered users to backend ingest endpoint")
    p.add_argument("--headless", action="store_true", default=True, help="Run Selenium in headless mode")
    p.add_argument("--headful", action="store_true", help="Run browser with UI (overrides --headless)")
    p.add_argument("--cookie", type=str, help="Cookie header string to inject into Selenium (e.g., 'name=val; name2=val2')")
    p.add_argument("--scroll-delay-min", type=float, default=1.0)
    p.add_argument("--scroll-delay-max", type=float, default=2.0)
    p.add_argument("--ingest-delay-min-ms", type=int, default=150)
    p.add_argument("--ingest-delay-max-ms", type=int, default=500)
    p.add_argument("--no-enrich", action="store_true", help="Skip API enrichment before writing jsonl")
    # Proxy options
    p.add_argument("--proxy", type=str, help="Proxy URL for both HTTP and HTTPS (e.g., http://user:pass@host:port)")
    p.add_argument("--proxy-http", type=str, help="HTTP proxy URL")
    p.add_argument("--proxy-https", type=str, help="HTTPS proxy URL")
    args = p.parse_args()

    effective_headless = False if args.headful else bool(args.headless)
    scroll_range = (max(0.2, args.scroll_delay_min), max(max(0.2, args.scroll_delay_min), args.scroll_delay_max))
    cookies = parse_cookie_header(args.cookie) if args.cookie else None

    if not args.genre and not args.artist and not args.seed_user:
        print("Provide --genre or --artist or --seed-user", file=sys.stderr)
        sys.exit(2)

    # Build proxies for httpx (and pass a single proxy for Selenium via env)
    proxies: Optional[Union[str, Dict[str, str]]] = None
    if args.proxy:
        proxies = args.proxy
    elif args.proxy_http or args.proxy_https:
        tmp: Dict[str, str] = {}
        if args.proxy_http:
            tmp["http://"] = args.proxy_http
        if args.proxy_https:
            tmp["https://"] = args.proxy_https
        proxies = tmp
    else:
        env_http = os.environ.get("HTTP_PROXY") or os.environ.get("http_proxy")
        env_https = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")
        if env_http or env_https:
            tmp: Dict[str, str] = {}
            if env_http:
                tmp["http://"] = env_http
            if env_https:
                tmp["https://"] = env_https
            proxies = tmp

    # Optionally set a Selenium proxy from proxies
    selenium_proxy = None
    if isinstance(proxies, str):
        selenium_proxy = proxies
    elif isinstance(proxies, dict):
        selenium_proxy = proxies.get("https://") or proxies.get("http://")
    if selenium_proxy:
        # Allow overriding via env; scrapers will read SELENIUM_PROXY_SERVER
        os.environ.setdefault("SELENIUM_PROXY_SERVER", selenium_proxy)

    if args.seed_user:
        # Crawl user-centric lists first
        base_collected: List[Candidate] = try_collect_user_list_pages(
            seed=args.seed_user,
            headless=effective_headless,
            max_users=args.max_users,
            cookies=cookies,
            scroll_delay_range=scroll_range,
            include_neighbors=args.neighbors,
            include_following=args.following,
            include_followers=args.followers,
        )
        cands = base_collected
    elif args.genre:
        cands = await discover_by_genre(args.genre, args.max_users, effective_headless, proxies=proxies,
                                        proxy_server=selenium_proxy)
    else:
        cands = await discover_by_artist(args.artist, args.max_users, effective_headless, proxy_server=selenium_proxy)

    if args.emit_jsonl:
        # Enrich before writing if possible
        api_key = os.getenv("LASTFM_API_KEY")
        if api_key and not getattr(args, "no_enrich", False):
            # Concurrency control with jitter to avoid bursts
            sem = asyncio.Semaphore(5)
            async def _enrich(c: Candidate):
                async with sem:
                    # Add small jitter per request
                    await asyncio.sleep(random.uniform(0.05, 0.2))
                    data = await enrich_user(c.handle, api_key, proxies=proxies)
                    for k, v in data.items():
                        setattr(c, k, v)
            await asyncio.gather(*[_enrich(c) for c in cands])

        write_jsonl(args.emit_jsonl, cands)
        print(f"Wrote {len(cands)} users to {args.emit_jsonl}")

    if args.backend and args.ingest:
        for idx, c in enumerate(cands):
            await post_to_backend(args.backend, c)
            # Progressive delay with jitter between ingests
            delay_ms = random.randint(args.ingest_delay_min_ms, args.ingest_delay_max_ms)
            await asyncio.sleep(delay_ms / 1000.0)
        print(f"Ingest requested for {len(cands)} users at {args.backend}")

    # Print summary
    print(f"Discovered {len(cands)} users")
    if len(cands) > 0:
        print(f"Example: @{cands[0].handle} -> {cands[0].profile_url}")


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        pass
