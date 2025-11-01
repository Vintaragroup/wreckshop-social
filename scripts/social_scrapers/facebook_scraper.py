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
            # Facebook supports both www and m subdomains; set to parent domain
            cookies.append({"name": name, "value": value, "domain": ".facebook.com", "path": "/"})
    return cookies


def search_people(driver: Chrome, query: str, limit: int) -> List[dict]:
    # Use mobile site for simpler DOM
    driver.get(f"https://m.facebook.com/search/people/?q={query}")
    try:
        WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.TAG_NAME, "body")))
    except Exception:
        pass

    seen = set()
    out: List[dict] = []
    stagnant = 0
    last = 0
    import time
    while len(out) < limit and stagnant < 10:
        anchors = driver.find_elements(By.CSS_SELECTOR, "a[href*='facebook.com/']")
        for a in anchors:
            href = a.get_attribute("href") or ""
            if not href:
                continue
            # Normalize to www domain for profile pages
            if "m.facebook.com/" in href:
                href = href.replace("m.facebook.com/", "www.facebook.com/")
            if "www.facebook.com/" not in href:
                continue
            if any(p in href for p in ["/groups/", "/pages/", "/marketplace/", "/events/"]):
                continue
            # Prefer clean slugs or id-based profiles; drop query params
            base = href.split("?", 1)[0]
            if not base.endswith("/"):
                base = base + "/"
            if base in seen:
                continue
            seen.add(base)
            handle = base.rstrip("/").rsplit("/", 1)[-1]
            if not handle or handle in ("profile.php", "login", "search"):
                continue
            display = a.text.strip() or handle
            out.append({
                "provider": "facebook",
                "providerUserId": handle,
                "displayName": display,
                "handle": handle,
                "profile_url": base,
            })
            if len(out) >= limit:
                break
        driver.execute_script("window.scrollBy(0, 1200);")
        time.sleep(random.uniform(0.9, 1.7))
        if len(out) == last:
            stagnant += 1
        else:
            stagnant = 0
            last = len(out)
    return out[:limit]


async def main():
    ap = argparse.ArgumentParser(description="Facebook people search scraper (requires session cookie)")
    ap.add_argument("--query", type=str, required=True)
    ap.add_argument("--limit", type=int, default=100)
    ap.add_argument("--cookie", type=str, required=True, help="Cookie header value from a logged-in session")
    ap.add_argument("--headful", action="store_true")
    ap.add_argument("--proxy-server", type=str)
    ap.add_argument("--emit-jsonl", type=str)
    ap.add_argument("--backend", type=str)
    ap.add_argument("--ingest", action="store_true")
    args = ap.parse_args()

    driver = make_driver(headless=not args.headful, proxy_server=args.proxy_server)
    results: List[dict] = []
    try:
        driver.get("https://www.facebook.com")
        for c in parse_cookie_header(args.cookie):
            try:
                driver.add_cookie(c)
            except Exception:
                pass
        results = search_people(driver, args.query, args.limit)
    finally:
        driver.quit()

    if args.emit_jsonl:
        write_jsonl(args.emit_jsonl, results)
        print(f"Wrote {len(results)} users to {args.emit_jsonl}")

    if args.backend and args.ingest and results:
        await ingest_candidates(args.backend, results, provider="facebook")
        print(f"Ingest requested for {len(results)} users at {args.backend}")

    print(f"Discovered {len(results)} Facebook users")
    if results:
        print(f"Example: {results[0].get('displayName')} -> {results[0].get('profile_url')}")


if __name__ == "__main__":
    asyncio.run(main())
