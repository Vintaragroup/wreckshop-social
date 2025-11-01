# Last.fm interest scraper (experimental)

Scrapes public Last.fm pages to discover users by music interest (genre/tag or artist) and optionally posts each user to the backend ingestion endpoint.

Notes
- This uses a mix of HTTP scraping (httpx + BeautifulSoup) and a Selenium headless browser to scroll pages when needed.
- Site layouts can change and scraping may violate terms of service. Use responsibly and only for accounts you’re authorized to access.
- Requires Python 3.10+ on macOS.

## Install

```bash
cd scripts/lastfm_scraper
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Run

Discover users by genre (uses scraping under the hood):

```bash
python lastfm_scraper.py --genre "R&B" --max-users 100 --emit-jsonl out.jsonl
```

Discover users by artist listeners page:

```bash
python lastfm_scraper.py --artist "The Weeknd" --max-users 100 --emit-jsonl weeknd.jsonl
```

Post discovered users to the backend for ingestion (requires backend running):

```bash
python lastfm_scraper.py --genre "R&B" --backend http://localhost:4002 --ingest
```

Flags
- `--genre`: human-readable tag (e.g., "R&B", "Afrobeats").
- `--artist`: artist name for +listeners scraping.
- `--max-users`: upper bound of users to collect.
- `--emit-jsonl`: path to write JSONL of discovered users.
- `--backend`: backend base URL (e.g., http://localhost:4002).
- `--ingest`: when provided with `--backend`, enqueue ingestion via /api/profiles/ingest.
- `--headless`: force Selenium headless mode (default on).

## Output format (JSONL)
Each line is a JSON object like:
```json
{"provider":"lastfm","handle":"someuser","profile_url":"https://www.last.fm/user/someuser","display_name":"Some User"}
```

## Implementation sketch
- For `--genre`, scrape top artists from `https://www.last.fm/tag/{tag}/artists` and then scrape listeners for the top N artists.
- For `--artist`, go straight to `https://www.last.fm/music/{artist}/+listeners` and scroll.
- We parse anchor links matching `/user/{username}` and dedupe.
- When `--backend` and `--ingest` are set, POST `{ provider: 'lastfm', handleOrUrl: 'https://www.last.fm/user/{handle}' }` to `/api/profiles/ingest`.

Use at your own risk. 

## Run with Docker (recommended)

Build the scripts image and open a shell:

```bash
docker compose build scripts
docker compose run --rm scripts bash
```

From inside the container:

```bash
python scripts/lastfm_scraper/lastfm_scraper.py --genre "R&B" --max-users 50 --emit-jsonl /app/out.jsonl
python scripts/lastfm_scraper/lastfm_scraper.py --artist "The Weeknd" --max-users 50 --backend http://backend:4002 --ingest
```

Notes
- The container includes Chromium + chromedriver for Selenium headless.
- BACKEND_BASE_URL is available as an env var (http://backend:4002). You can omit --backend and the script will still write JSONL.
- If you see Chrome crashes due to shared memory, the Compose service defines `shm_size: 2gb`.