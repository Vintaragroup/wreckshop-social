
  # Music Promotion App Colors

  This is a code bundle for Music Promotion App Colors. The original project is available at https://www.figma.com/design/nOYyJPCmBuqIXQGfu2AMoL/Music-Promotion-App-Colors.

  ## Run instructions (dev, Docker-first)

  One-touch setup for local dev with backend and frontend:

  1) Install deps
  
  - npm install

  2) Use MongoDB Atlas (recommended) and run the full stack with Docker
  
  - echo "ATLAS_MONGODB_URI=mongodb+srv://<db_username>:<db_password>@programdata-wreckshop-1.vd9dpc.mongodb.net/?appName=ProgramData-Wreckshop-1" >> .env.docker
  - npm run docker:dev:cloud

  3) Start both apps concurrently
  
  - npm run dev:all

  This will:
  - Build and start backend and frontend in containers.
  - Expose frontend at http://localhost:5176 and backend at http://localhost:4002.
  - Point the browser to the backend via VITE_API_BASE_URL.

  When finished, stop:
  
  - npm run docker:down

  ### Use MongoDB Atlas (cloud)

  If you prefer Atlas over a local Mongo container:

  1) In `backend/.env`, set `MONGODB_URI` to your Atlas SRV string, for example:
     
    MONGODB_URI=mongodb+srv://<db_username>:<db_password>@programdata-wreckshop-1.vd9dpc.mongodb.net/?appName=ProgramData-Wreckshop-1

  2) Option A (no Docker for backend): just run
     
    - npm run dev:all

    Backend will connect directly to Atlas; you can skip `npm run infra:up` if you don’t need local Redis. Otherwise, keep Redis running.

  3) Option B (Docker with Atlas): populate `.env.docker` with `ATLAS_MONGODB_URI` and use the Compose override that avoids the local Mongo container:
     
    - echo "ATLAS_MONGODB_URI=<your Atlas SRV here>" >> .env.docker
    - npm run infra:up:cloud

  Notes:
  - Ensure your Atlas Network Access allows your local IP (or 0.0.0.0/0 for quick dev).
  - Create a Database User that matches the credentials in your SRV URI.
  - No code changes are required; Mongoose supports `mongodb+srv` automatically.

  ### Individual app scripts
  
  Frontend (local-only, optional):
  - npm run frontend:dev     # Vite dev on http://localhost:5176
  - npm run frontend:build   # Vite build
  - npm run frontend:preview # Preview built app on http://localhost:5176

  Backend (local-only, optional):
  - npm run backend:dev      # tsx watch src/index.ts
  - npm run backend:start    # node dist/index.js (build first if needed)

  ### Environment
  
  The Docker defaults expose ports:
  - Frontend: 5176 (host) → 5176 (container)
  - Backend:  4002 (host) → 4002 (container)

  Local-only env (optional):
  - VITE_API_BASE_URL=http://localhost:4002
  
  Backend with Docker uses service names internally (mongo/redis), but from the browser we call `http://localhost:<BACKEND_PORT>`.

  ### Provider feature flags (frontend)
  The Profiles page can optionally expose additional providers behind Vite env flags:
  - VITE_ENABLE_LASTFM=true
  - VITE_ENABLE_SOUNDCLOUD=true
  - VITE_ENABLE_DEEZER=true
  - VITE_ENABLE_YOUTUBE=true
  - VITE_ENABLE_AUDIUS=true

  You can set these in a .env.local file at the repo root alongside VITE_API_BASE_URL, for example:

  VITE_API_BASE_URL=http://localhost:4002
  VITE_ENABLE_LASTFM=true
  VITE_ENABLE_SOUNDCLOUD=true
  VITE_ENABLE_DEEZER=true
  VITE_ENABLE_YOUTUBE=true
  VITE_ENABLE_AUDIUS=true

  When enabled, “Last.fm” and “SoundCloud” appear in the provider select for ingestion.
  When enabled, “Deezer” also appears; Deezer uses public APIs and typically requires no key for public playlists.
  When enabled, “YouTube” also appears; requires a YouTube Data API v3 key.
  When enabled, “Audius” also appears; uses public discovery APIs and requires no keys.

  ### Backend environment (Last.fm)
  The Last.fm provider stub will attempt to fetch top artists if LASTFM_API_KEY is set in the backend environment. Without it, ingest still works and simply returns an empty taste profile.
  - Set LASTFM_API_KEY in backend/.env or your shell env if you want real taste data.

  ### Backend environment (SoundCloud)
  The SoundCloud provider uses the public API with a required client id:
  - Set SOUNDCLOUD_CLIENT_ID in backend/.env or your shell environment to enable identity resolution and taste fetching.
  - With the client id set, we resolve the numeric user id and fetch tracks, playlists, and likes to derive taste.
  - Without it, SoundCloud ingest still creates/updates a profile using the handle/URL, but taste will be empty.

  ### Backend environment (Deezer)
  Deezer public endpoints do not require credentials for basic public reads.
  - We resolve Deezer user id from profile URLs and fetch public playlists.
  - Favorite tracks and followed artists may not be available for all users without OAuth; the provider gracefully falls back to playlists-only.

  ### Backend environment (YouTube)
  The YouTube provider uses the YouTube Data API v3 to resolve channels and list playlists/uploads.
  - Set YOUTUBE_API_KEY in backend/.env
  - We resolve channelId via search (for @handles/custom names) or accept /channel/UC... URLs directly.
  - We fetch public playlists and populate topTracks from the channel uploads playlist.

  ### Backend environment (Audius)
  Audius uses a public discovery API to select a node and fetch public user data.
  - No keys required.
  - We fetch user tracks, favorites, and playlists when available.

  ### What to expect
  - Navigate the dashboard and sidebar routes.
  - Audience → Profiles lets you search and ingest; jobs enqueue via the backend.
  - With MSW enabled in dev (VITE_USE_MSW=true), frontend mocks are used for profiles.
  