# Spotify Scraper Implementation

## Overview
Applied the same scraper system used for Last.fm to Spotify, enabling discovery of users through artist/playlist search and seed user crawling (followers/following).

## What was implemented

### 1. Spotify Web Scraper (`scripts/social_scrapers/spotify_scraper.py`)

A Selenium-based scraper following the same pattern as the Last.fm scraper:

**Discovery Methods:**
- **By Artist**: Search for an artist and collect profiles from search results
- **By Playlist**: Search for a playlist and collect profiles from followers/results
- **By Seed User**: Crawl followers and/or following lists from a known user

**Features:**
- Headless Selenium browser with Chrome/Chromium
- Automatic scrolling and pagination handling
- Stagnation detection (stops scrolling when no new users found)
- Random user-agent rotation via `fake_useragent`
- Proxy support for distributed scraping
- Configurable delays between requests
- JSONL output for bulk ingestion
- Direct backend ingestion with rate limiting

**Command Examples:**
```bash
# Discover users from an artist
docker exec wreckshop-scripts python /app/scripts/social_scrapers/spotify_scraper.py \
  --artist "Drake" \
  --max-users 50 \
  --backend http://backend:4002 \
  --ingest

# Crawl seed user's followers and following
docker exec wreckshop-scripts python /app/scripts/social_scrapers/spotify_scraper.py \
  --seed-user "myusername" \
  --followers --following \
  --max-users 100 \
  --backend http://backend:4002 \
  --ingest

# With browser visible and JSONL output
docker exec wreckshop-scripts python /app/scripts/social_scrapers/spotify_scraper.py \
  --playlist "Top 50 R&B" \
  --max-users 20 \
  --emit-jsonl /app/out-spotify.jsonl \
  --headful
```

### 2. Enhanced Spotify Provider (`backend/src/providers/spotify.provider.ts`)

Added `fetchProfileDetails()` method to retrieve user metadata:

**Fetches from Spotify Web API (`/v1/me`):**
- Display name
- Avatar URL (profile picture)
- Followers count
- Following count
- Profile URL

These counts are stored as identity-level fields and displayed in the UI alongside Last.fm and YouTube counts.

**Requirements:**
- OAuth access token with appropriate scopes (user-read-private, user-read-email for profile details)
- Gracefully handles missing tokens or insufficient scopes (returns empty details)

### 3. Frontend UI Updates

**Profiles List & Detail Pages** now display Spotify social counts:
- "X followers" and "Y following" appear in the social counts line
- Displayed alongside Last.fm (friends/neighbours) and YouTube (subscribers) counts
- Format: "X followers • Y following • Z friends • W neighbours • V subscribers"

**Files updated:**
- `src/pages/audience/profiles.tsx`
- `src/pages/audience/profile-detail.tsx`

### 4. Documentation

**Updated `scripts/social_scrapers/README.md`:**
- Added Spotify scraper to tools list
- Added quick-start examples for artist discovery and seed user crawling
- Documented supported modes and options

## Architecture Pattern

The Spotify scraper follows the established Last.fm scraper pattern:

```
┌─────────────────────────────────────┐
│   Discovery/Search Methods          │
│ (artist, playlist, seed user)       │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│   Selenium Web Scraper              │
│ (scroll, collect user profile URLs) │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│   Candidates Collection             │
│ (List[Candidate] with profile URLs) │
└────────────┬────────────────────────┘
             │
    ┌────────┴────────┐
    ▼                 ▼
┌──────────┐    ┌──────────────┐
│ JSONL    │    │ Backend      │
│ Output   │    │ Ingest       │
└──────────┘    └──────────────┘
                       │
                       ▼
                ┌─────────────────┐
                │ Profile DB      │
                │ (MongoDB)       │
                └─────────────────┘
```

## Dependencies

All required dependencies already installed via existing `scripts/lastfm_scraper/requirements.txt`:
- `selenium` - Web browser automation
- `httpx` - Async HTTP client
- `beautifulsoup4` - HTML parsing
- `fake-useragent` - UA rotation
- `tenacity` - Retry logic
- `orjson` - Fast JSON serialization

**No new dependencies added.**

## How to Use

### Basic Usage: Artist Discovery

```bash
# Pull 50 users who follow Drake
docker exec wreckshop-scripts python /app/scripts/social_scrapers/spotify_scraper.py \
  --artist "The Weeknd" \
  --max-users 50 \
  --backend http://backend:4002 \
  --ingest
```

### Seed User Crawling

```bash
# Crawl followers of a known user
docker exec wreckshop-scripts python /app/scripts/social_scrapers/spotify_scraper.py \
  --seed-user "1234567890" \
  --followers \
  --max-users 100 \
  --backend http://backend:4002 \
  --ingest

# Crawl both followers and following
docker exec wreckshop-scripts python /app/scripts/social_scrapers/spotify_scraper.py \
  --seed-user "1234567890" \
  --followers --following \
  --max-users 200 \
  --backend http://backend:4002 \
  --ingest
```

### With Proxy and Output

```bash
docker exec wreckshop-scripts python /app/scripts/social_scrapers/spotify_scraper.py \
  --artist "Drake" \
  --max-users 50 \
  --emit-jsonl /app/out-spotify.jsonl \
  --backend http://backend:4002 \
  --ingest \
  --proxy-server http://proxy.example.com:8080
```

## Configuration

**Command-line Options:**

```
--artist TEXT           Artist name to discover from
--playlist TEXT         Playlist name to discover from
--seed-user TEXT        Seed username to crawl followers/following
--followers             Include followers (default true with --seed-user)
--no-followers          Exclude followers
--following             Include following (default true with --seed-user)
--no-following          Exclude following
--max-users INT         Maximum users to collect (default 100)
--emit-jsonl PATH       Write results to JSONL file
--backend URL           Backend base URL for ingestion
--ingest                Post to backend ingest endpoint
--headless              Run in headless mode (default true)
--headful               Show browser UI
--scroll-delay-min SEC  Min delay between scrolls (default 1.0)
--scroll-delay-max SEC  Max delay between scrolls (default 2.0)
--ingest-delay-min-ms   Min delay between backend posts (default 150)
--ingest-delay-max-ms   Max delay between backend posts (default 500)
--proxy-server URL      Proxy server for Selenium
```

## Testing Recommendations

1. **Test with small batch first:**
   ```bash
   docker exec wreckshop-scripts python /app/scripts/social_scrapers/spotify_scraper.py \
     --artist "Drake" \
     --max-users 5 \
     --emit-jsonl /app/test-spotify.jsonl
   ```

2. **Verify ingestion:**
   ```bash
   curl http://localhost:4002/api/profiles/count?provider=spotify
   ```

3. **Check UI:**
   - Navigate to `http://localhost:5176/audience/profiles`
   - Filter by Spotify provider
   - Verify profiles appear with follower/following counts

## Integration with Existing Workflows

The Spotify scraper integrates seamlessly with the existing system:

1. **Discovered profiles** are posted to `/api/profiles/ingest`
2. **Backend ingest service** processes them with the Spotify provider
3. **Profile details** (followers/following) are fetched automatically if an access token is available
4. **UI displays** the counts in the profiles list and detail pages
5. **Segmentation** can filter by follower/following counts for targeted campaigns

## Differences from Last.fm Scraper

| Aspect | Last.fm | Spotify |
|--------|---------|---------|
| **Source** | Genre tags + artist listeners + user lists | Artist/playlist search + user social graphs |
| **Public Data** | Extensive; tag pages, artist listeners, user followers | Limited; search results, user profiles require login |
| **Enrichment** | Full API integration (tags, artists, playcount, country) | Basic profile details only (followers, following, avatar) |
| **Rate Limiting** | Last.fm API enforced; web pages relatively stable | Spotify heavily rate limits; pagination limited |
| **Recommended Use** | Large-scale discovery; detailed music metadata | Social graph exploration; follower seed identification |

## Next Steps

1. **Tune discovery strategies**: Spotify's search UI may change; watch for UI selector updates
2. **Add enrichment**: Optional: fetch user's top tracks/artists via authenticated API if available
3. **Extend filtering**: Add genre/keyword filters to discovery queries
4. **Monitor stability**: Spotify frequently updates their web UI; may require scraper maintenance
5. **Consider API**: For production scale, evaluate Spotify's official APIs or partnership programs

## Files Modified/Created

**Created:**
- `scripts/social_scrapers/spotify_scraper.py` - Main Spotify scraper

**Modified:**
- `scripts/social_scrapers/README.md` - Added Spotify scraper examples
- `backend/src/providers/spotify.provider.ts` - Added `fetchProfileDetails()` method
- `src/pages/audience/profiles.tsx` - Display Spotify social counts
- `src/pages/audience/profile-detail.tsx` - Display Spotify social counts on detail page

**No changes to dependencies or Docker configuration needed** - existing setup supports all required libraries.

## Status

✅ Implementation complete
✅ Tests pass
✅ Build succeeds
✅ Ready for testing with real Spotify data
