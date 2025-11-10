#!/usr/bin/env python3
"""
Spotify user discovery scraper using Selenium and web scraping.
Discovers users by genre/artist/playlist, crawls followers/following, and ingests to backend.

Usage:
  # Search by artist's listeners
  python spotify_scraper.py --artist "Drake" --max-users 50 --backend http://localhost:4002 --ingest

  # Search by playlist
  python spotify_scraper.py --playlist "Top 50 R&B" --max-users 50 --backend http://localhost:4002 --ingest

  # Crawl seed user's followers/following
  python spotify_scraper.py --seed-user "username" --followers --following --max-users 100 --backend http://localhost:4002 --ingest

  # With headless browser, emit JSONL
  python spotify_scraper.py --artist "The Weeknd" --max-users 20 --emit-jsonl out.jsonl --headless
"""

import argparse
import asyncio
import os
import re
import sys
from dataclasses import dataclass, asdict
from typing import Iterable, Optional, Set, List, Dict, Union
import random
import time

import httpx
from bs4 import BeautifulSoup
from fake_useragent import UserAgent
from tenacity import retry, stop_after_attempt, wait_exponential

# Selenium
from selenium.webdriver.chrome.options import Options
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

UA = UserAgent()

SPOTIFY_BASE = "https://open.spotify.com"


@dataclass
class Candidate:
    provider: str
    handle: str
    profile_url: str
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None
    followers: Optional[int] = None
    following: Optional[int] = None


def parse_spotify_user_url(url: str) -> Optional[str]:
    """Extract username from Spotify profile URL."""
    try:
        # https://open.spotify.com/user/1234567890 or /user/username
        m = re.search(r'/user/([^/?#]+)', url)
        if m:
            return m.group(1)
    except Exception:
        pass
    return None


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=0.5, min=1, max=5), reraise=True)
async def fetch_html(client: httpx.AsyncClient, url: str) -> str:
    """Fetch HTML with retry and random UA."""
    resp = await client.get(url, headers={"User-Agent": UA.random}, follow_redirects=True)
    resp.raise_for_status()
    return resp.text


def selenium_scroll_collect(url: str, max_users: int = 100, headless: bool = True, 
                           scroll_delay_range: tuple = (1.0, 2.0), 
                           stagnant_limit: int = 8,
                           proxy_server: Optional[str] = None) -> List[Candidate]:
    """
    Use Selenium to load Spotify page and scroll through user lists (followers, following, playlist followers, etc).
    Collect user profile URLs and basic info.
    """
    options = Options()
    if headless:
        options.add_argument("--headless=new")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument(f"--user-agent={UA.random}")
    
    if proxy_server:
        options.add_argument(f"--proxy-server={proxy_server}")
    
    chrome_bin = os.environ.get("CHROME_BIN")
    if chrome_bin:
        options.binary_location = chrome_bin
    
    driver_path = os.environ.get("CHROMEDRIVER", "/usr/bin/chromedriver")
    service = Service(driver_path)
    driver = webdriver.Chrome(service=service, options=options)
    
    try:
        driver.set_page_load_timeout(45)
        driver.get(url)
        
        # Wait for profile links to appear
        try:
            WebDriverWait(driver, 25).until(
                EC.presence_of_all_elements_located((By.CSS_SELECTOR, "a[href*='/user/']"))
            )
        except Exception:
            pass
        
        seen: Set[str] = set()
        results: List[Candidate] = []
        last_count = 0
        stagnant_ticks = 0
        
        while len(results) < max_users and stagnant_ticks < stagnant_limit:
            # Extract user profile links
            anchors = driver.find_elements(By.CSS_SELECTOR, "a[href*='/user/']")
            for a in anchors:
                href = a.get_attribute("href") or ""
                # Parse user ID/username
                user = parse_spotify_user_url(href)
                if not user or user in seen:
                    continue
                
                seen.add(user)
                display_name = a.text.strip() or user
                results.append(Candidate(
                    provider="spotify",
                    handle=user,
                    profile_url=href,
                    display_name=display_name
                ))
                
                if len(results) >= max_users:
                    break
            
            # Scroll down to load more
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            delay = random.uniform(scroll_delay_range[0], scroll_delay_range[1])
            time.sleep(delay)
            
            # Check for stagnation
            if len(results) == last_count:
                stagnant_ticks += 1
            else:
                stagnant_ticks = 0
                last_count = len(results)
        
        return results[:max_users]
    
    finally:
        driver.quit()


async def discover_by_artist(artist: str, max_users: int, headless: bool, 
                            proxy_server: Optional[str] = None) -> List[Candidate]:
    """
    Search for an artist on Spotify, then collect users from the artist's profile
    (followers or public playlists with artist).
    """
    # Spotify search doesn't expose a public "listeners" page, so we'll try:
    # 1. Artist's followers list (if publicly visible)
    # 2. Search results and collect from there
    
    artist_slug = re.sub(r"\s+", "+", artist.strip())
    
    # Try artist's public profile (may not expose followers in web version)
    search_url = f"{SPOTIFY_BASE}/search?q={artist_slug}&type=artist"
    
    return selenium_scroll_collect(
        search_url,
        max_users=max_users,
        headless=headless,
        proxy_server=proxy_server
    )


async def discover_by_playlist(playlist_name: str, max_users: int, headless: bool,
                              proxy_server: Optional[str] = None) -> List[Candidate]:
    """
    Search for a playlist and collect followers from it.
    """
    playlist_slug = re.sub(r"\s+", "+", playlist_name.strip())
    search_url = f"{SPOTIFY_BASE}/search?q={playlist_slug}&type=playlist"
    
    return selenium_scroll_collect(
        search_url,
        max_users=max_users,
        headless=headless,
        proxy_server=proxy_server
    )


def collect_from_seed_user(seed_user: str, max_users: int, headless: bool,
                          include_followers: bool = True, 
                          include_following: bool = True,
                          scroll_delay_range: tuple = (1.0, 2.0),
                          proxy_server: Optional[str] = None) -> List[Candidate]:
    """
    Crawl a seed user's followers and/or following lists.
    """
    collected: List[Candidate] = []
    seen: Set[str] = set()
    
    def _collect(path: str, label: str):
        nonlocal collected, seen
        if len(collected) >= max_users:
            return
        
        url = f"{SPOTIFY_BASE}/user/{seed_user}/{path}"
        users = selenium_scroll_collect(
            url,
            max_users=max_users - len(collected),
            headless=headless,
            scroll_delay_range=scroll_delay_range,
            proxy_server=proxy_server
        )
        
        for u in users:
            if u.handle not in seen:
                seen.add(u.handle)
                collected.append(u)
    
    if include_followers:
        _collect("followers", "followers")
    
    if include_following:
        _collect("following", "following")
    
    return collected[:max_users]


async def post_to_backend(backend: str, cand: Candidate) -> None:
    """Post discovered user to backend ingest endpoint."""
    url = backend.rstrip("/") + "/api/profiles/ingest"
    async with httpx.AsyncClient(timeout=20) as client:
        try:
            await client.post(url, json={
                "provider": "spotify",
                "handleOrUrl": cand.profile_url or f"{SPOTIFY_BASE}/user/{cand.handle}"
            })
        except Exception as e:
            print(f"Failed to ingest {cand.handle}: {e}", file=sys.stderr)


def write_jsonl(path: str, items: Iterable[Candidate]):
    """Write candidates to JSONL file."""
    try:
        import orjson
        with open(path, "wb") as f:
            for c in items:
                f.write(orjson.dumps(asdict(c)))
                f.write(b"\n")
    except ImportError:
        import json
        with open(path, "w") as f:
            for c in items:
                f.write(json.dumps(asdict(c)) + "\n")


async def main():
    p = argparse.ArgumentParser(
        description="Scrape Spotify users by artist, playlist, or seed user."
    )
    p.add_argument("--artist", type=str, help="Artist name to discover from")
    p.add_argument("--playlist", type=str, help="Playlist name to discover from")
    p.add_argument("--seed-user", type=str, help="Seed username to crawl followers/following")
    p.add_argument("--followers", dest="followers", action="store_true", 
                   help="Include followers (default true when --seed-user)")
    p.add_argument("--no-followers", dest="followers", action="store_false")
    p.set_defaults(followers=True)
    p.add_argument("--following", dest="following", action="store_true",
                   help="Include following (default true when --seed-user)")
    p.add_argument("--no-following", dest="following", action="store_false")
    p.set_defaults(following=True)
    p.add_argument("--max-users", type=int, default=100)
    p.add_argument("--emit-jsonl", type=str, help="Path to write JSONL output")
    p.add_argument("--backend", type=str, help="Backend URL (e.g., http://localhost:4002)")
    p.add_argument("--ingest", action="store_true", help="Post to backend ingest")
    p.add_argument("--headless", action="store_true", default=True, help="Headless mode")
    p.add_argument("--headful", action="store_true", help="Show browser UI")
    p.add_argument("--scroll-delay-min", type=float, default=1.0)
    p.add_argument("--scroll-delay-max", type=float, default=2.0)
    p.add_argument("--ingest-delay-min-ms", type=int, default=150)
    p.add_argument("--ingest-delay-max-ms", type=int, default=500)
    p.add_argument("--proxy-server", type=str, help="Proxy server (e.g., http://user:pass@host:port)")
    
    args = p.parse_args()
    
    effective_headless = False if args.headful else bool(args.headless)
    scroll_range = (
        max(0.2, args.scroll_delay_min),
        max(max(0.2, args.scroll_delay_min), args.scroll_delay_max)
    )
    
    if not args.artist and not args.playlist and not args.seed_user:
        print("Provide --artist, --playlist, or --seed-user", file=sys.stderr)
        sys.exit(2)
    
    # Collect candidates
    cands: List[Candidate] = []
    
    if args.seed_user:
        cands = collect_from_seed_user(
            seed_user=args.seed_user,
            max_users=args.max_users,
            headless=effective_headless,
            include_followers=args.followers,
            include_following=args.following,
            scroll_delay_range=scroll_range,
            proxy_server=args.proxy_server
        )
    elif args.artist:
        cands = await discover_by_artist(
            artist=args.artist,
            max_users=args.max_users,
            headless=effective_headless,
            proxy_server=args.proxy_server
        )
    elif args.playlist:
        cands = await discover_by_playlist(
            playlist_name=args.playlist,
            max_users=args.max_users,
            headless=effective_headless,
            proxy_server=args.proxy_server
        )
    
    # Write JSONL
    if args.emit_jsonl:
        write_jsonl(args.emit_jsonl, cands)
        print(f"Wrote {len(cands)} users to {args.emit_jsonl}")
    
    # Ingest to backend
    if args.backend and args.ingest:
        for idx, c in enumerate(cands):
            await post_to_backend(args.backend, c)
            delay_ms = random.randint(args.ingest_delay_min_ms, args.ingest_delay_max_ms)
            await asyncio.sleep(delay_ms / 1000.0)
        print(f"Ingest requested for {len(cands)} users at {args.backend}")
    
    # Summary
    print(f"Discovered {len(cands)} users")
    if cands:
        print(f"Example: @{cands[0].handle} -> {cands[0].profile_url}")


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        pass
