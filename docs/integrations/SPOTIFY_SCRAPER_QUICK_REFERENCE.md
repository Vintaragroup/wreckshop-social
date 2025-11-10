# Spotify Scraper Quick Reference

## One-liners for common tasks

### Discover users from an artist
```bash
docker exec wreckshop-scripts python /app/scripts/social_scrapers/spotify_scraper.py \
  --artist "Drake" --max-users 50 --backend http://backend:4002 --ingest
```

### Discover users from a playlist
```bash
docker exec wreckshop-scripts python /app/scripts/social_scrapers/spotify_scraper.py \
  --playlist "Top 50 R&B" --max-users 50 --backend http://backend:4002 --ingest
```

### Crawl seed user's followers
```bash
docker exec wreckshop-scripts python /app/scripts/social_scrapers/spotify_scraper.py \
  --seed-user "username" --followers --max-users 100 --backend http://backend:4002 --ingest
```

### Crawl seed user's followers + following
```bash
docker exec wreckshop-scripts python /app/scripts/social_scrapers/spotify_scraper.py \
  --seed-user "username" --followers --following --max-users 200 --backend http://backend:4002 --ingest
```

### Save results to file
```bash
docker exec wreckshop-scripts python /app/scripts/social_scrapers/spotify_scraper.py \
  --artist "The Weeknd" --max-users 30 --emit-jsonl /app/spotify-users.jsonl
```

### With proxy (for distributed scraping)
```bash
docker exec wreckshop-scripts python /app/scripts/social_scrapers/spotify_scraper.py \
  --artist "Drake" --max-users 50 --backend http://backend:4002 --ingest \
  --proxy-server http://proxy.example.com:8080
```

### Headful mode (see browser)
```bash
docker exec -it wreckshop-scripts python /app/scripts/social_scrapers/spotify_scraper.py \
  --artist "Drake" --max-users 10 --headful
```

## What was added to the system

### 1. **Spotify Scraper** (`scripts/social_scrapers/spotify_scraper.py`)
   - Discovers Spotify users via artist/playlist search or seed user crawling
   - Same tech stack as Last.fm scraper (Selenium, httpx, beautifulsoup)
   - Outputs to JSONL or directly ingests to backend

### 2. **Enhanced Spotify Provider** (`backend/src/providers/spotify.provider.ts`)
   - New `fetchProfileDetails()` method
   - Fetches followers/following counts via Spotify Web API
   - Requires OAuth access token

### 3. **UI Display**
   - Profile cards now show Spotify follower/following counts
   - Detail pages display them too
   - Format: "X followers • Y following"

## Verification

### Check it's installed
```bash
python3 /app/scripts/social_scrapers/spotify_scraper.py --help
```

### Test with small batch
```bash
docker exec wreckshop-scripts python /app/scripts/social_scrapers/spotify_scraper.py \
  --artist "Drake" --max-users 5 --emit-jsonl /app/test.jsonl
```

### Check results in backend
```bash
curl http://localhost:4002/api/profiles/count?provider=spotify
```

## Requirements

✓ Already installed:
- Selenium 4.24.0
- httpx 0.27.0
- BeautifulSoup4 4.12.3
- fake-useragent 1.5.1
- tenacity 8.5.0

✓ Already available:
- Chromium/Chromedriver in scripts container
- Backend ingest endpoint
- MongoDB for profile storage

## Limitations & Notes

1. **Spotify rate limits web scraping** - expect delays and potential blocks with large batches
2. **No music metadata** - scraper only finds user profiles, doesn't enrich taste data (use OAuth token for that)
3. **Search results depend on Spotify's algorithm** - results may vary
4. **Public data only** - scraper uses public web pages, doesn't access private user data
5. **Selector updates** - if Spotify changes their UI, scraper selectors may need updates

## Integration Points

- **Discovery**: Uses Selenium to scroll through search results and user lists
- **Backend**: Posts to `/api/profiles/ingest` with provider=spotify
- **Ingest**: Backend fetches follower/following counts if Spotify OAuth token provided
- **UI**: Displays counts on profiles page and detail page
- **Segmentation**: Can filter/segment by follower/following counts for campaigns

## Example workflow

```bash
# 1. Discover 100 Drake listeners
docker exec wreckshop-scripts python /app/scripts/social_scrapers/spotify_scraper.py \
  --artist "Drake" --max-users 100 --backend http://backend:4002 --ingest

# 2. Check profile count
curl http://localhost:4002/api/profiles/count?provider=spotify

# 3. View in frontend
open http://localhost:5176/audience/profiles?provider=spotify

# 4. Filter by followers count
curl "http://localhost:4002/api/profiles?provider=spotify&limit=20"
```

## Performance Tips

- **Start small**: Test with 5-10 users first
- **Use delays**: Default 1-2s scroll delay, 150-500ms ingest delay
- **Use proxies**: For large-scale runs, rotate proxies to avoid blocks
- **Batch jobs**: Run in background; set `--max-users` to manageable chunks
- **Monitor**: Check logs and backend ingestion status

## For more details

See: `SPOTIFY_SCRAPER_IMPLEMENTATION.md` (comprehensive technical documentation)
