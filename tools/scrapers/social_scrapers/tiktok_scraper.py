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
    options.add_argument("--window-size=1280,2000")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("--lang=en-US")
    ua = os.environ.get("SCRAPER_UA", "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
    options.add_argument(f"--user-agent={ua}")
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
            cookies.append({"name": name, "value": value, "domain": ".tiktok.com", "path": "/"})
    return cookies


def search_users(query: str, max_users: int = 50, headless: bool = True, proxy_server: Optional[str] = None, cookie_header: Optional[str] = None) -> List[dict]:
    url = f"https://www.tiktok.com/search/user?q={query}&lang=en"
    driver = make_driver(headless=headless, proxy_server=proxy_server)
    try:
        driver.set_page_load_timeout(45)
        # If cookies provided, set them first
        driver.get("https://www.tiktok.com")
        if cookie_header:
            for c in parse_cookie_header(cookie_header):
                try:
                    driver.add_cookie(c)
                except Exception:
                    pass
        driver.get(url)
        try:
            WebDriverWait(driver, 25).until(EC.presence_of_element_located((By.CSS_SELECTOR, "a[href^='/@']")))
        except Exception:
            pass
        # Attempt cookie consent accept
        try:
            buttons = driver.find_elements(By.XPATH, "//button//*[contains(translate(text(),'ACEIPT','ACEIPT'),'ACCEPT')]/ancestor::button")
            for b in buttons:
                try:
                    b.click()
                    import time
                    time.sleep(random.uniform(0.6, 1.2))
                    break
                except Exception:
                    pass
        except Exception:
            pass
        seen = set()
        results: List[dict] = []
        last = 0
        stagnant = 0
        while len(results) < max_users and stagnant < 10:
            anchors = driver.find_elements(By.CSS_SELECTOR, "a[href^='/@'], a[href^='https://www.tiktok.com/@']")
            for a in anchors:
                href = a.get_attribute("href") or ""
                if not href or "/video/" in href:
                    continue
                # profile URLs look like https://www.tiktok.com/@username
                if href in seen:
                    continue
                seen.add(href)
                handle = href.rstrip('/').split('/')[-1]
                if not handle or handle == '@':
                    continue
                # Try to get display name from nearby label if anchor text is empty
                display = a.text.strip()
                if not display:
                    try:
                        parent = a.find_element(By.XPATH, "ancestor::div[1]")
                        txt = parent.text.strip()
                        if txt:
                            display = txt.splitlines()[0]
                    except Exception:
                        pass
                display = display or handle
                results.append({
                    "provider": "tiktok",
                    "providerUserId": handle,
                    "displayName": display,
                    "handle": handle,
                    "profile_url": href,
                })
                if len(results) >= max_users:
                    break
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            import time
            time.sleep(random.uniform(0.9, 1.9))
            if len(results) == last:
                stagnant += 1
            else:
                stagnant = 0
                last = len(results)
        return results[:max_users]
    finally:
        driver.quit()


def enrich_tiktok_details(items: List[dict], headless: bool, proxy_server: Optional[str], limit: int = 10) -> List[dict]:
    driver = make_driver(headless=headless, proxy_server=proxy_server)
    try:
        for it in items[:limit]:
            url = it.get("profile_url")
            if not url:
                continue
            try:
                driver.set_page_load_timeout(35)
                driver.get(url)
                try:
                    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, "body")))
                except Exception:
                    pass
                # Extract counts from common data-e2e attributes
                def txt(sel: str):
                    try:
                        el = driver.find_element(By.CSS_SELECTOR, sel)
                        return (el.text or "").strip()
                    except Exception:
                        return None
                followers = txt('[data-e2e="followers-count"]') or txt('strong[data-e2e="followers-count"]')
                following = txt('[data-e2e="following-count"]') or txt('strong[data-e2e="following-count"]')
                likes = txt('[data-e2e="likes-count"]') or txt('strong[data-e2e="likes-count"]')
                if followers:
                    it['followersText'] = followers
                if following:
                    it['followingText'] = following
                if likes:
                    it['likesText'] = likes
            except Exception:
                continue
    finally:
        driver.quit()
    return items


async def main():
    ap = argparse.ArgumentParser(description="TikTok user search scraper (public search)")
    ap.add_argument("--query", type=str, help="Search query for users")
    ap.add_argument("--max-users", type=int, default=50)
    ap.add_argument("--emit-jsonl", type=str)
    ap.add_argument("--backend", type=str)
    ap.add_argument("--ingest", action="store_true")
    ap.add_argument("--headful", action="store_true")
    ap.add_argument("--proxy-server", type=str)
    args = ap.parse_args()

    if not args.query:
        print("Provide --query", flush=True)
        return

    results = search_users(args.query, max_users=args.max_users,
                           headless=not args.headful, proxy_server=args.proxy_server, cookie_header=None)

    if args.emit_jsonl:
        write_jsonl(args.emit_jsonl, enrich_tiktok_details(list(results), headless=not args.headful, proxy_server=args.proxy_server, limit=min(10, len(results))))
        print(f"Wrote {len(results)} users to {args.emit_jsonl}")

    if args.backend and args.ingest and results:
        await ingest_candidates(args.backend, results, provider="tiktok")
        print(f"Ingest requested for {len(results)} users at {args.backend}")

    results = enrich_tiktok_details(list(results), headless=not args.headful, proxy_server=args.proxy_server, limit=min(10, len(results)))
    print(f"Discovered {len(results)} TikTok users")
    if results:
        print(f"Example: {results[0].get('displayName')} -> {results[0].get('profile_url')}")


if __name__ == "__main__":
    asyncio.run(main())
