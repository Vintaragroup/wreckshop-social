# Social scrapers

This folder contains keyless, Selenium- and HTTPX-based scrapers to discover audience profiles across platforms and ingest them into the backend.

Tools included:

- Spotify user discovery (followers, following, artist/playlist search): `spotify_scraper.py`
- YouTube web scraper (no API): `youtube_web_scraper.py`
- TikTok user search scraper: `tiktok_scraper.py`
- Instagram followers/following scraper (cookie-based): `instagram_scraper.py`
- Facebook people search scraper (cookie-based): `facebook_scraper.py`
- Shared utils: `common.py`

## Prereqs

- Docker Compose environment up (backend, redis, mongo, scripts) so the backend is reachable as `http://backend:4002` from the scripts container.
- Scripts container has Chromium + Chromedriver installed (provided by `Dockerfile.scripts`) and enough shared memory (`shm_size: 2gb`).
- For Instagram and Facebook, capture a logged-in session cookie header string from your browser and pass it with `--cookie`.

## Quick start

Spotify artist listeners:

docker exec wreckshop-scripts python /app/scripts/social_scrapers/spotify_scraper.py --artist "Drake" --max-users 50 --backend http://backend:4002 --ingest

Spotify seed user's followers and following:

docker exec wreckshop-scripts python /app/scripts/social_scrapers/spotify_scraper.py --seed-user "myusername" --followers --following --max-users 100 --backend http://backend:4002 --ingest

YouTube search (no API key):

docker exec wreckshop-scripts python /app/scripts/social_scrapers/youtube_web_scraper.py --query "r&b music" --max-users 10 --backend http://backend:4002 --ingest

Related channels from a handle:

docker exec wreckshop-scripts python /app/scripts/social_scrapers/youtube_web_scraper.py --seed-handle someartist --max-users 10 --backend http://backend:4002 --ingest

TikTok user search:

docker exec wreckshop-scripts python /app/scripts/social_scrapers/tiktok_scraper.py --query "r&b" --max-users 10 --backend http://backend:4002 --ingest

Instagram followers (requires cookie):

docker exec wreckshop-scripts python /app/scripts/social_scrapers/instagram_scraper.py --seed-user someuser --followers --limit 20 --cookie "<paste-your-cookie>" --backend http://backend:4002 --ingest

Facebook people search (requires cookie):

docker exec wreckshop-scripts python /app/scripts/social_scrapers/facebook_scraper.py --query "r&b singer" --limit 20 --cookie "<paste-your-cookie>" --backend http://backend:4002 --ingest

Options:

- Add `--headful` for visual browsing (usually not available in headless containers).
- Add `--proxy-server http://user:pass@host:port` to route traffic via a proxy.
- Add `--emit-jsonl /app/output.jsonl` to write results to a file as well.

## Notes

- Instagram and Facebook do not expose stable public APIs for this use case; cookie-based scraping is used. Adjust delays and consider proxies to reduce blocks.
- The backend now supports `instagram` and `facebook` providers for ingestion; they currently record identity and return empty taste. Enrichment hooks can be added later.
