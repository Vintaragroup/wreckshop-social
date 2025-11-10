# Tools & Utilities

Development tools, scrapers, configuration, and Docker setup files organized for easy access.

## Structure

### `scrapers/`
Data extraction and discovery tools for various platforms.

**Last.fm Scraper**
- `lastfm_scraper/` - Last.fm artist discovery and metadata enrichment
  - `lastfm_scraper.py` - Main scraper script
  - `requirements.txt` - Python dependencies

**Social Platform Scrapers**
- `social_scrapers/` - Multi-platform social discovery tools
  - `spotify_scraper.py` - Spotify playlist and user data extraction
  - `instagram_scraper.py` - Instagram profile and audience data
  - `youtube_scraper.py` - YouTube API-based data extraction
  - `youtube_web_scraper.py` - YouTube web-based scraping
  - `tiktok_scraper.py` - TikTok audience discovery
  - `facebook_scraper.py` - Facebook platform data
  - `common.py` - Shared utilities across scrapers
  - `README.md` - Scraper documentation
  - `PLAN.md` - Development planning for scrapers

### `docker/`
Docker configuration and orchestration files.

**Dockerfiles**
- `Dockerfile.frontend-root` - Frontend (Vite dev) container
- `Dockerfile.scripts` - Python tools container with Selenium, Chromium
  - Based on Python 3.11 slim
  - Includes headless Chrome and chromedriver for web scraping
  - Pre-installs all scraper dependencies

**Docker Compose**
- `docker-compose.yml` - Main services (backend, frontend, MongoDB, Redis)
- `docker-compose.cloud.yml` - MongoDB Atlas override configuration

**Usage**
```bash
# Local development with containers
npm run docker:dev:cloud

# Infrastructure up/down
npm run infra:up
npm run infra:down

# View logs
npm run docker:logs
```

### `config/`
Build and test configuration files.

- `vitest.config.ts` - Testing framework configuration
  - Unit and integration test setup
  - Test runner options
  - Coverage configuration

### `build/`
Build artifacts and compiled output (ignored by git).

- `dist/` - Frontend compiled code (generated during build)
- Other build outputs

---

## Quick Reference

| Tool | Purpose | Command |
|------|---------|---------|
| Last.fm Scraper | Artist discovery | `python tools/scrapers/lastfm_scraper/lastfm_scraper.py` |
| Spotify Scraper | User taste profiles | `python tools/scrapers/social_scrapers/spotify_scraper.py` |
| Docker Dev | Full stack containers | `npm run docker:dev:cloud` |
| Test Suite | Unit/integration tests | `npm run test` |
| Test Watch | Auto-rerun tests | `npm run test:watch` |
| Test UI | Visual test runner | `npm run test:ui` |

## Docker Images

### frontend-root
- **Purpose**: Development frontend server
- **Base**: Node.js 20 Alpine
- **Ports**: 5176
- **Command**: Vite dev server

### scripts
- **Purpose**: Data extraction tools
- **Base**: Python 3.11 Slim
- **Tools**: Chromium, ChromeDriver, Selenium
- **Python packages**: See `tools/scrapers/lastfm_scraper/requirements.txt`
- **Command**: Long-running shell for executing scraper commands

## Configuration Management

**Vitest Configuration** (`tools/config/vitest.config.ts`)
- Test discovery and execution
- Module resolution
- Coverage reporting
- UI test interface

## Development Workflow

### Running Scrapers
```bash
# Using Docker container
docker-compose run scripts python tools/scrapers/lastfm_scraper/lastfm_scraper.py

# Using local Python environment
python tools/scrapers/social_scrapers/spotify_scraper.py
```

### Building Applications
```bash
# Full stack build
npm run build

# Frontend only
npm run frontend:build

# Backend
npm --prefix backend run build
```

### Testing
```bash
# Run all tests once
npm run test

# Watch mode - re-run on changes
npm run test:watch

# Interactive UI
npm run test:ui
```

### Container Management
```bash
# Build and start
npm run docker:dev:cloud

# Stop everything
npm run docker:down

# View real-time logs
npm run docker:logs
```

## Adding New Tools

1. Create subdirectory in `tools/` matching tool category
2. Add tool files (scripts, configs, etc.)
3. Create `README.md` with usage documentation
4. Update this main `README.md` with new tool reference
5. Add npm scripts or commands to main `package.json` if needed

## File Locations

| Item | Location |
|------|----------|
| Frontend dev config | `vite.config.ts` (root) |
| Backend config | `backend/` (separate package) |
| Scrapers | `tools/scrapers/` |
| Docker setup | `tools/docker/` |
| Test config | `tools/config/` |
| Build output | `tools/build/` (git ignored) |

## Environment Setup

### Python Scrapers
Requires Python 3.11+:
```bash
pip install -r tools/scrapers/lastfm_scraper/requirements.txt
```

### Docker
Requires Docker & Docker Compose:
```bash
# Check installation
docker --version
docker-compose --version
```

### Node Tools
Requires Node.js 18+:
```bash
npm --version
```

---

**Last Updated**: November 10, 2025  
**Structure Version**: 1.0  
**Status**: ✅ All tools organized and documented
