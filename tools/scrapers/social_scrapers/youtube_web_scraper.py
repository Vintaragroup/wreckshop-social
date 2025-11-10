#!/usr/bin/env python3
import argparse
import asyncio
import os
import random
import sys
from typing import List, Optional

from selenium.webdriver.chrome.options import Options
from selenium.webdriver import Chrome
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from social_scrapers.common import write_jsonl, ingest_candidates


def make_driver(headless: bool = True, proxy_server: Optional[str] = None) -> Chrome:
    options = Options()
    if headless:
        options.add_argument("--headless=new")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--lang=en-US")
    options.add_argument("--window-size=1280,2000")
    options.add_argument("--disable-blink-features=AutomationControlled")
    # Set a desktop UA to reduce consent/anti-bot friction
    ua = os.environ.get("SCRAPER_UA", "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
    options.add_argument(f"--user-agent={ua}")
    if proxy_server:
        options.add_argument(f"--proxy-server={proxy_server}")
    driver_path = os.environ.get("CHROMEDRIVER", "/usr/bin/chromedriver")
    return Chrome(service=Service(driver_path), options=options)


def sleep_rand(a=0.9, b=1.8):
    import time
    time.sleep(random.uniform(a, b))


def try_accept_consent(driver: Chrome):
    # Try to accept cookie/consent banners to unlock search results
    try:
        # Common buttons: "Accept all", "I agree"
        candidates = [
            (By.XPATH, "//button//*[contains(translate(text(),'ACEIPT','ACEIPT'),'ACCEPT')]/ancestor::button"),
            (By.XPATH, "//button//*[contains(translate(text(),'AGREE','AGREE'),'AGREE')]/ancestor::button"),
            (By.XPATH, "//ytd-button-renderer//yt-button-shape//button")
        ]
        for how, sel in candidates:
            els = driver.find_elements(how, sel)
            for el in els:
                try:
                    label = (el.text or "").strip().lower()
                    if not label or any(x in label for x in ["accept", "agree", "consent"]):
                        el.click()
                        sleep_rand(0.6, 1.2)
                        return
                except Exception:
                    pass
    except Exception:
        pass


def scrape_search(query: str, max_users: int, headless: bool, proxy_server: Optional[str]) -> List[dict]:
    # Use channel-filtered search param sp=EgIQAg%3D%3D which corresponds to "Type: Channel"
    url = f"https://www.youtube.com/results?search_query={query.replace(' ', '+')}&sp=EgIQAg%253D%253D"
    driver = make_driver(headless=headless, proxy_server=proxy_server)
    try:
        driver.set_page_load_timeout(45)
        driver.get(url)
        try:
            WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.CSS_SELECTOR, "ytd-search")))
        except Exception:
            pass
        try_accept_consent(driver)
        seen = set()
        results: List[dict] = []
        stagnant = 0
        last = 0
        while len(results) < max_users and stagnant < 10:
            # Prefer channel renderers (since sp filters to channels, this should be plentiful)
            items = driver.find_elements(By.CSS_SELECTOR, "ytd-channel-renderer a[href*='/channel/'], ytd-channel-renderer a[href^='https://www.youtube.com/@']")
            anchors = [it.get_attribute("href") or "" for it in items]
            # Fallback: any channel links
            if not anchors:
                more = driver.find_elements(By.CSS_SELECTOR, "a[href*='/channel/'], a[href^='https://www.youtube.com/@']")
                anchors = [a.get_attribute("href") or "" for a in more]
            for href in anchors:
                if not href:
                    continue
                if "/channel/" in href or "/@" in href:
                    key = href.split("?")[0]
                    if key in seen:
                        continue
                    seen.add(key)
                    display = None
                    try:
                        el = driver.find_element(By.CSS_SELECTOR, f"a[href='{href}']")
                        display = el.text.strip() or None
                    except Exception:
                        pass
                    results.append({
                        "provider": "youtube",
                        "providerUserId": key.rsplit('/', 1)[-1],
                        "displayName": display or key.rsplit('/', 1)[-1],
                        "profile_url": key,
                    })
                    if len(results) >= max_users:
                        break
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            sleep_rand()
            if len(results) == last:
                stagnant += 1
            else:
                stagnant = 0
                last = len(results)
        return results[:max_users]
    finally:
        driver.quit()


def scrape_channel_related(seed: str, is_handle: bool, max_users: int, headless: bool, proxy_server: Optional[str]) -> List[dict]:
    base = f"https://www.youtube.com/{('@' + seed) if is_handle else ('channel/' + seed)}"
    url = base + "/channels"  # 'Channels' tab shows featured/related channels
    driver = make_driver(headless=headless, proxy_server=proxy_server)
    try:
        driver.set_page_load_timeout(45)
        driver.get(url)
        try:
            WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.CSS_SELECTOR, "ytd-tabbed-page-header-renderer, ytd-browse")))
        except Exception:
            pass
        try_accept_consent(driver)
        seen = set()
        results: List[dict] = []
        stagnant = 0
        last = 0
        while len(results) < max_users and stagnant < 10:
            anchors = driver.find_elements(By.CSS_SELECTOR, "a[href*='/channel/'], a[href^='https://www.youtube.com/@']")
            for a in anchors:
                href = a.get_attribute("href") or ""
                if not href:
                    continue
                if "/channel/" in href or "/@" in href:
                    key = href.split("?")[0]
                    if key in seen or key == base:
                        continue
                    seen.add(key)
                    display = a.text.strip() or key.rsplit('/', 1)[-1]
                    results.append({
                        "provider": "youtube",
                        "providerUserId": key.rsplit('/', 1)[-1],
                        "displayName": display,
                        "profile_url": key,
                    })
                    if len(results) >= max_users:
                        break
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            sleep_rand()
            if len(results) == last:
                stagnant += 1
            else:
                stagnant = 0
                last = len(results)
        return results[:max_users]
    finally:
        driver.quit()


def enrich_channel_details(items: List[dict], headless: bool, proxy_server: Optional[str], limit: int = 10) -> List[dict]:
    # Best-effort enrichment: subscriber count and description from channel page
    driver = make_driver(headless=headless, proxy_server=proxy_server)
    try:
        for i, it in enumerate(items[:limit]):
            url = it.get("profile_url")
            if not url:
                continue
            try:
                driver.set_page_load_timeout(35)
                driver.get(url)
                try_accept_consent(driver)
                try:
                    WebDriverWait(driver, 12).until(EC.presence_of_element_located((By.CSS_SELECTOR, "ytd-browse, ytd-app")))
                except Exception:
                    pass
                # Subscriber count
                subs = None
                try:
                    sub_el = driver.find_element(By.CSS_SELECTOR, "#subscriber-count, yt-formatted-string#subscriber-count")
                    subs = (sub_el.text or "").strip()
                except Exception:
                    pass
                # Meta description as quick bio
                desc = None
                try:
                    meta = driver.find_element(By.CSS_SELECTOR, "meta[name='description']")
                    desc = meta.get_attribute("content")
                except Exception:
                    pass
                if subs:
                    it["subscriberCountText"] = subs
                if desc:
                    it["description"] = desc
            except Exception:
                continue
    finally:
        driver.quit()
    return items


def parse_cookie_header(cookie_header: str):
    cookies = []
    for part in cookie_header.split(";"):
        if "=" not in part:
            continue
        name, value = part.split("=", 1)
        name, value = name.strip(), value.strip()
        if name and value:
            cookies.append({"name": name, "value": value, "domain": ".youtube.com", "path": "/"})
    return cookies


async def main():
    ap = argparse.ArgumentParser(description="YouTube web scraper (no API)")
    ap.add_argument("--query", type=str, help="Search query to discover channels")
    ap.add_argument("--seed-handle", type=str, help="YouTube handle without @")
    ap.add_argument("--seed-channel-id", type=str, help="Channel ID starting with UC…")
    ap.add_argument("--max-users", type=int, default=40)
    ap.add_argument("--emit-jsonl", type=str)
    ap.add_argument("--backend", type=str)
    ap.add_argument("--ingest", action="store_true")
    ap.add_argument("--headful", action="store_true")
    ap.add_argument("--proxy-server", type=str)
    ap.add_argument("--cookie", type=str, help="Cookie header string for youtube.com to bypass consent/login gates")
    args = ap.parse_args()

    if not args.query and not args.seed_handle and not args.seed_channel_id:
        print("Provide --query or --seed-handle/--seed-channel-id", flush=True)
        return

    headless = not args.headful
    # If cookies provided, prime them on the domain first
    if args.cookie:
        d = make_driver(headless=headless, proxy_server=args.proxy_server)
        try:
            d.get("https://www.youtube.com")
            for c in parse_cookie_header(args.cookie):
                try:
                    d.add_cookie(c)
                except Exception:
                    pass
        finally:
            d.quit()

    if args.query:
        results = scrape_search(args.query, args.max_users, headless, args.proxy_server)
    else:
        is_handle = bool(args.seed_handle)
        seed = args.seed_handle or args.seed_channel_id
        results = scrape_channel_related(seed, is_handle, args.max_users, headless, args.proxy_server)

    if args.emit_jsonl:
        # Enrich a subset before writing if we didn't ingest to backend
        write_jsonl(args.emit_jsonl, enrich_channel_details(list(results), headless, args.proxy_server, limit=min(10, len(results))))
        print(f"Wrote {len(results)} channels to {args.emit_jsonl}")

    if args.backend and args.ingest and results:
        await ingest_candidates(args.backend, results, provider="youtube")
        print(f"Ingest requested for {len(results)} users at {args.backend}")

    # Best-effort enrichment printed for visibility
    results = enrich_channel_details(list(results), headless, args.proxy_server, limit=min(10, len(results)))
    print(f"Discovered {len(results)} channels")
    if results:
        print(f"Example: {results[0].get('displayName')} -> {results[0].get('profile_url')}")


if __name__ == "__main__":
    asyncio.run(main())
