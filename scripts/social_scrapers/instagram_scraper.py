# pyright: reportMissingImports=false
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
    if proxy_server:
        options.add_argument(f"--proxy-server={proxy_server}")
    driver_path = os.environ.get("CHROMEDRIVER", "/usr/bin/chromedriver")
    return Chrome(service=Service(driver_path), options=options)


def parse_cookie_header(cookie_header: str):
    cookies = []
    for part in cookie_header.split(";"):
        if "=" not in part:
            continue
        name, value = part.split("=", 1)
        name, value = name.strip(), value.strip()
        if name and value:
            cookies.append({"name": name, "value": value, "domain": ".instagram.com", "path": "/"})
    return cookies


def scroll_dialog(driver: Chrome, limit: int) -> List[str]:
    seen = set()
    out: List[str] = []
    stagnant = 0
    last = 0
    while len(out) < limit and stagnant < 10:
        anchors = driver.find_elements(By.CSS_SELECTOR, "a[href^='https://www.instagram.com/'], a[href^='/']")
        for a in anchors:
            href = a.get_attribute("href") or ""
            if not href:
                continue
            # profile links look like https://www.instagram.com/<username>/
            if "instagram.com/" in href and "/p/" not in href:
                key = href.split("?", 1)[0]
                if key in seen:
                    continue
                seen.add(key)
                handle = key.rstrip("/").rsplit("/", 1)[-1]
                out.append(handle)
                if len(out) >= limit:
                    break
        driver.execute_script("document.querySelector('div[role=dialog]')?.scrollBy(0, 1200)")
        import time
        time.sleep(random.uniform(0.9, 1.7))
        if len(out) == last:
            stagnant += 1
        else:
            stagnant = 0
            last = len(out)
    return out[:limit]


def collect_follow_list(seed_user: str, which: str, limit: int, headless: bool, proxy_server: Optional[str], cookie_header: str) -> List[dict]:
    # which: 'followers' or 'following'
    driver = make_driver(headless=headless, proxy_server=proxy_server)
    try:
        driver.get("https://www.instagram.com")
        for c in parse_cookie_header(cookie_header):
            try:
                driver.add_cookie(c)
            except Exception:
                pass
        driver.get(f"https://www.instagram.com/{seed_user}/")
        try:
            WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.CSS_SELECTOR, "header")))
        except Exception:
            pass
        # Navigate to followers/following page which opens a dialog
        driver.get(f"https://www.instagram.com/{seed_user}/{which}/")
        try:
            WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.CSS_SELECTOR, "div[role=dialog]")))
        except Exception:
            pass
        handles = scroll_dialog(driver, limit)
        return [{
            "provider": "instagram",
            "providerUserId": h,
            "displayName": h,
            "handle": h,
            "profile_url": f"https://www.instagram.com/{h}/",
        } for h in handles]
    finally:
        driver.quit()


async def main():
    ap = argparse.ArgumentParser(description="Instagram follower/following scraper (requires session cookie)")
    ap.add_argument("--seed-user", type=str, required=True)
    ap.add_argument("--followers", action="store_true")
    ap.add_argument("--following", action="store_true")
    ap.add_argument("--limit", type=int, default=100)
    ap.add_argument("--cookie", type=str, required=True, help="Cookie header value from a logged-in session")
    ap.add_argument("--headful", action="store_true")
    ap.add_argument("--proxy-server", type=str)
    ap.add_argument("--emit-jsonl", type=str)
    ap.add_argument("--backend", type=str)
    ap.add_argument("--ingest", action="store_true")
    args = ap.parse_args()

    which_list = []
    if args.followers:
        which_list.append("followers")
    if args.following:
        which_list.append("following")
    if not which_list:
        which_list = ["followers"]

    results: List[dict] = []
    for w in which_list:
        results += collect_follow_list(args.seed_user, w, args.limit, headless=not args.headful,
                                       proxy_server=args.proxy_server, cookie_header=args.cookie)

    if args.emit_jsonl:
        write_jsonl(args.emit_jsonl, results)
        print(f"Wrote {len(results)} users to {args.emit_jsonl}")

    if args.backend and args.ingest and results:
        await ingest_candidates(args.backend, results, provider="instagram")
        print(f"Ingest requested for {len(results)} users at {args.backend}")

    print(f"Discovered {len(results)} Instagram users")
    if results:
        print(f"Example: {results[0].get('displayName')} -> {results[0].get('profile_url')}")


if __name__ == "__main__":
    asyncio.run(main())
