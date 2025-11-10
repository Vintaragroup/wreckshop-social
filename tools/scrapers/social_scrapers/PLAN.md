# Scrapers roadmap and action plan

This document tracks what’s done, what we need to improve, and the next concrete tasks to make scrapers reliable and high-yield.

## What’s done

- Last.fm scraper
  - Tag-based discovery (top artists → listeners), artist listeners page scrape
  - Seed-user crawl (neighbours/neighbors, followers, following) with headless Selenium
  - Optional cookies, progressive delays, proxy support
  - API enrichment via `user.getInfo`, `user.getTopTags`, `user.getTopArtists`
  - JSONL output and backend ingestion with jitter
- YouTube web scraper (no API)
  - Channel-filtered search, consent handling, desktop UA, anti-automation flags
  - Related channels from seed handle/channel ID
  - Best-effort enrichment: subscriber count text + meta description
  - JSONL + ingestion
- TikTok scraper (web)
  - User search scraping with improved UA, selectors, consent attempt, and stability
  - Best-effort enrichment: followers/following/likes counts
  - JSONL + ingestion
- Instagram scraper (cookie-based)
  - Followers/following dialog scroll, JSONL + ingestion
- Facebook scraper (cookie-based)
  - Mobile site people search scroll, JSONL + ingestion
- Infra
  - Scripts container with Chromium/Chromedriver; headful via `xvfb` available
  - Backend supports providers: lastfm, youtube, tiktok, instagram, facebook, etc.
  - Frontend badges for Instagram, Facebook, TikTok

## Improvements needed

- YouTube
  - Add reliable consent dismissal and region cookie presets; support cookie file in addition to inline header
  - Increase scroll coverage with backoff and stale checks; add retry for transient load failures
  - Optional: parse channel About tab for location/links; add thumbnails
- TikTok
  - Expose `--cookie` flag and use it (parser exists) for a logged-in session to bypass gating
  - Expand selectors to alternative layouts; backoff for interstitials; detect challenge pages
  - Consider rotating proxies, jittered headful runs for better volume
- Instagram/Facebook
  - Improve selector resilience, increase scroll duration, stabilize batch size
  - Optional enrichment: fetch avatar/bio after ingestion (provider-level or via scraper)
- Error handling and resilience
  - Unified consent/cookie management helpers
  - Structured logs for scrape rate and block detection
- Scheduling/automation
  - Add simple cron/task runner with daily seeds + rotating queries
  - De-dupe and cap per provider/day to respect site load

## Next tasks

1) YouTube volume pass
- [ ] Add cookie-file support (e.g., Netscape cookie txt) and flag `--cookie-file`
- [ ] If cookie present, pre-seed session, then run channel-filtered search and related crawl
- [ ] Save enriched fields in JSONL (subscriberCountText, description)

2) TikTok volume pass
- [ ] Expose `--cookie` and wire to pre-seed session (parser exists)
- [ ] Add challenge/interstitial detector with backoff and optional headful fallback
- [ ] Expand selectors to catch variant page structures

3) IG/FB smoke with cookies
- [ ] Run 10–50 pulls with cookies and verify ingestion + UI display
- [ ] Add optional enrichers to fetch avatar/bio where feasible

4) Orchestrated runs
- [ ] Create a small runner script to rotate: Last.fm genres + YouTube queries + TikTok queries
- [ ] Emit JSONL per run and push ingestion with jitter

5) Provider enrichers
- [ ] Add `fetchProfileDetails` for YouTube (API-based when key present) to fetch thumbnails and channel description
- [ ] Consider TikTok enrichment via web (if stable selectors)

## How to run (quick examples)

- YouTube web 10 channels:
  docker exec wreckshop-scripts python /app/scripts/social_scrapers/youtube_web_scraper.py --query "r&b music" --max-users 10 --backend http://backend:4002 --ingest

- TikTok 10 users (public; may yield low volume without cookies):
  docker exec wreckshop-scripts python /app/scripts/social_scrapers/tiktok_scraper.py --query "r&b" --max-users 10 --backend http://backend:4002 --ingest

- Last.fm 200 users by tag with enrichment + ingest:
  docker exec wreckshop-scripts python /app/scripts/lastfm_scraper/lastfm_scraper.py --genre "R&B" --max-users 200 --emit-jsonl /app/out-lastfm-rnb-200.jsonl --backend http://backend:4002 --ingest

- Instagram followers (cookie required):
  docker exec wreckshop-scripts python /app/scripts/social_scrapers/instagram_scraper.py --seed-user someuser --followers --limit 20 --cookie "<cookie>" --backend http://backend:4002 --ingest

- Facebook people search (cookie required):
  docker exec wreckshop-scripts python /app/scripts/social_scrapers/facebook_scraper.py --query "r&b singer" --limit 20 --cookie "<cookie>" --backend http://backend:4002 --ingest
