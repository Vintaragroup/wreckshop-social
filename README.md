# Wreckshop Social - Music Industry Marketing Automation

  # Music Promotion App Colors

Music industry audience discovery, segmentation, and engagement platform built with React, Node.js, and MongoDB.

  This is a code bundle for Music Promotion App Colors. The original project is available at https://www.figma.com/design/nOYyJPCmBuqIXQGfu2AMoL/Music-Promotion-App-Colors.

**Status**: ✅ Production Ready | **Version**: 1.0 | **Last Updated**: November 10, 2025

  ## Run instructions (dev, Docker-first)

---

  One-touch setup for local dev with backend and frontend:

## 📚 Documentation

  1) Install deps

**All documentation has been moved to the [`docs/`](docs/) folder for better organization.**  

  - npm install

### Quick Navigation

- 🚀 **Getting Started**: [`docs/guides/QUICK_START_GUIDE.md`](docs/guides/QUICK_START_GUIDE.md)  2) Use MongoDB Atlas (recommended) and run the full stack with Docker

- 🔐 **Security & Secrets**: [`docs/security/SECURITY_ENV_GUIDE.md`](docs/security/SECURITY_ENV_GUIDE.md)  

- 🔌 **Integrations**: [`docs/integrations/INTEGRATIONS_QUICK_REFERENCE.md`](docs/integrations/INTEGRATIONS_QUICK_REFERENCE.md)  - echo "ATLAS_MONGODB_URI=mongodb+srv://<db_username>:<db_password>@programdata-wreckshop-1.vd9dpc.mongodb.net/?appName=ProgramData-Wreckshop-1" >> .env.docker

- 📖 **Full Index**: [`docs/README.md`](docs/README.md)  - npm run docker:dev:cloud



---  3) Start both apps concurrently

  

## 🎯 Core Features  - npm run dev:all



### Audience Discovery  This will:

- Spotify OAuth integration for user taste profiling  - Build and start backend and frontend in containers.

- Genre affinity scoring and playlist analysis  - Expose frontend at http://localhost:5176 and backend at http://localhost:4002.

- Cross-platform identity resolution  - Point the browser to the backend via VITE_API_BASE_URL.

- Artist-follower relationship mapping

  When finished, stop:

### Campaign Management  

- Multi-channel campaign orchestration (Email, SMS, Push)  - npm run docker:down

- A/B testing framework with statistical significance

- Campaign analytics with genre-weighted metrics  ### Use MongoDB Atlas (cloud)

- Artist performance tracking

  If you prefer Atlas over a local Mongo container:

### Geographic Targeting

- Venue-based radius targeting  1) In `backend/.env`, set `MONGODB_URI` to your Atlas SRV string, for example:

- Music market segmentation     

- Timezone-optimized delivery scheduling    MONGODB_URI=mongodb+srv://<db_username>:<db_password>@programdata-wreckshop-1.vd9dpc.mongodb.net/?appName=ProgramData-Wreckshop-1

- Scene-based audience clustering

- Real-time geofencing capabilities  2) Option A (no Docker for backend): just run

     

### Audience Segmentation    - npm run dev:all

- Advanced rule-based segment builder

- Music taste segmentation    Backend will connect directly to Atlas; you can skip `npm run infra:up` if you don’t need local Redis. Otherwise, keep Redis running.

- Fan engagement level classification

- Platform-specific filtering  3) Option B (Docker with Atlas): populate `.env.docker` with `ATLAS_MONGODB_URI` and use the Compose override that avoids the local Mongo container:

     

### Integrations    - echo "ATLAS_MONGODB_URI=<your Atlas SRV here>" >> .env.docker

- ✅ **Spotify** - Full OAuth with profile enrichment    - npm run infra:up:cloud

- ✅ **Instagram** - OAuth with connection management

- 🟡 **YouTube**, **TikTok**, **Facebook** - Ready for implementation  Notes:

- 🟡 **Email** - SendGrid, Postmark  - Ensure your Atlas Network Access allows your local IP (or 0.0.0.0/0 for quick dev).

- 🟡 **SMS** - Twilio, TextMagic  - Create a Database User that matches the credentials in your SRV URI.

  - No code changes are required; Mongoose supports `mongodb+srv` automatically.

---

  ### Individual app scripts

## 🚀 Quick Start  

  Frontend (local-only, optional):

```bash  - npm run frontend:dev     # Vite dev on http://localhost:5176

# 1. Install dependencies  - npm run frontend:build   # Vite build

npm install  - npm run frontend:preview # Preview built app on http://localhost:5176



# 2. Create local environment (see docs/security/)  Backend (local-only, optional):

cp backend/.env.example backend/.env  - npm run backend:dev      # tsx watch src/index.ts

# Add your credentials to backend/.env  - npm run backend:start    # node dist/index.js (build first if needed)



# 3. Start development servers  ### Environment

npm run dev:all  

# Frontend: http://localhost:5176  The Docker defaults expose ports:

# Backend:  http://localhost:4002  - Frontend: 5176 (host) → 5176 (container)

```  - Backend:  4002 (host) → 4002 (container)



**For detailed setup**, see [`docs/guides/QUICK_START_GUIDE.md`](docs/guides/QUICK_START_GUIDE.md)  Local-only env (optional):

  - VITE_API_BASE_URL=http://localhost:4002

---  

  Backend with Docker uses service names internally (mongo/redis), but from the browser we call `http://localhost:<BACKEND_PORT>`.

## 📁 Project Structure

  ### Provider feature flags (frontend)

```  The Profiles page can optionally expose additional providers behind Vite env flags:

wreckshop-social/  - VITE_ENABLE_LASTFM=true

├── docs/                          # 📚 All documentation (organized by category)  - VITE_ENABLE_SOUNDCLOUD=true

│   ├── guides/                    # How-to guides and tutorials  - VITE_ENABLE_DEEZER=true

│   ├── integrations/              # Platform integration docs  - VITE_ENABLE_YOUTUBE=true

│   ├── features/                  # Feature documentation  - VITE_ENABLE_AUDIUS=true

│   ├── security/                  # Security and secrets management

│   ├── reference/                 # Technical references  You can set these in a .env.local file at the repo root alongside VITE_API_BASE_URL, for example:

│   └── archive/                   # Historical documentation

├── src/                           # Frontend (React + TypeScript)  VITE_API_BASE_URL=http://localhost:4002

│   ├── components/                # React components  VITE_ENABLE_LASTFM=true

│   ├── App.tsx                    # Main app component  VITE_ENABLE_SOUNDCLOUD=true

│   └── main.tsx                   # Entry point  VITE_ENABLE_DEEZER=true

├── backend/                       # Backend (Node.js + Express)  VITE_ENABLE_YOUTUBE=true

│   ├── src/  VITE_ENABLE_AUDIUS=true

│   │   ├── routes/                # API routes

│   │   ├── services/              # Business logic  When enabled, “Last.fm” and “SoundCloud” appear in the provider select for ingestion.

│   │   ├── models/                # Database schemas  When enabled, “Deezer” also appears; Deezer uses public APIs and typically requires no key for public playlists.

│   │   └── index.ts               # Server entry  When enabled, “YouTube” also appears; requires a YouTube Data API v3 key.

│   └── .env.example               # Environment template  When enabled, “Audius” also appears; uses public discovery APIs and requires no keys.

├── README.md                      # This file

└── package.json                   # Dependencies  ### Backend environment (Last.fm)

```  The Last.fm provider stub will attempt to fetch top artists if LASTFM_API_KEY is set in the backend environment. Without it, ingest still works and simply returns an empty taste profile.

  - Set LASTFM_API_KEY in backend/.env or your shell env if you want real taste data.

---

  ### Backend environment (SoundCloud)

## 🔧 Available Commands  The SoundCloud provider uses the public API with a required client id:

  - Set SOUNDCLOUD_CLIENT_ID in backend/.env or your shell environment to enable identity resolution and taste fetching.

### Development  - With the client id set, we resolve the numeric user id and fetch tracks, playlists, and likes to derive taste.

```bash  - Without it, SoundCloud ingest still creates/updates a profile using the handle/URL, but taste will be empty.

npm run dev:all          # Run frontend + backend concurrently

npm run frontend:dev     # Frontend only (Vite dev server)  ### Backend environment (Deezer)

npm run backend:dev      # Backend only (Node.js with tsx)  Deezer public endpoints do not require credentials for basic public reads.

```  - We resolve Deezer user id from profile URLs and fetch public playlists.

  - Favorite tracks and followed artists may not be available for all users without OAuth; the provider gracefully falls back to playlists-only.

### Build & Production

```bash  ### Backend environment (YouTube)

npm run build            # Build both frontend and backend  The YouTube provider uses the YouTube Data API v3 to resolve channels and list playlists/uploads.

npm run start            # Run production build  - Set YOUTUBE_API_KEY in backend/.env

```  - We resolve channelId via search (for @handles/custom names) or accept /channel/UC... URLs directly.

  - We fetch public playlists and populate topTracks from the channel uploads playlist.

### Database & Infrastructure

```bash  ### Backend environment (Audius)

npm run docker:dev:cloud # Run with Docker using MongoDB Atlas  Audius uses a public discovery API to select a node and fetch public user data.

npm run infra:up         # Start local infrastructure (MongoDB, Redis)  - No keys required.

npm run infra:down       # Stop local infrastructure  - We fetch user tracks, favorites, and playlists when available.

```

  ### What to expect

---  - Navigate the dashboard and sidebar routes.

  - Audience → Profiles lets you search and ingest; jobs enqueue via the backend.

## 🔐 Environment Setup  - With MSW enabled in dev (VITE_USE_MSW=true), frontend mocks are used for profiles.

  
**DO NOT commit `.env` files with real credentials!**

1. Copy template: `cp backend/.env.example backend/.env`
2. Add your credentials (see [`docs/security/`](docs/security/))
3. File is auto-ignored by git (`.gitignore` configured)

Required variables:
- `MONGODB_URI` - MongoDB connection string
- `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET` - Spotify OAuth credentials
- `INSTAGRAM_APP_ID` / `INSTAGRAM_APP_SECRET` - Instagram OAuth credentials

---

## 🏗️ Technology Stack

**Frontend**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- shadcn/ui (component library)

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- Redis (caching)
- TypeScript

**Integrations**
- Spotify API v1
- Instagram Graph API v20
- OAuth 2.0

---

## 📊 Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| Instagram OAuth | ✅ Complete | Full integration, tested |
| Spotify OAuth | ✅ Complete | Profile enrichment working |
| Geofencing | ✅ Complete | Real-time venue targeting |
| Segmentation | ✅ Complete | Rule-based audience builder |
| A/B Testing | ✅ Complete | Statistical significance |
| Email Campaigns | ✅ Ready | SendGrid/Postmark integration ready |
| SMS Campaigns | ✅ Ready | Twilio/TextMagic integration ready |
| YouTube OAuth | 🟡 Ready | Implementation template available |
| TikTok OAuth | 🟡 Ready | Implementation template available |

---

## 🤝 Contributing

### Before You Commit
1. **Never commit secrets** - Use `.env.example` template
2. **Check .gitignore** - Verify `.env` files are ignored
3. **Run tests** - Ensure all changes are tested
4. **Update docs** - Add documentation for new features

### Adding Documentation
1. Choose appropriate category in [`docs/`](docs/)
2. Follow existing naming conventions
3. Link from relevant index pages
4. Keep files focused and concise

---

## 🐛 Troubleshooting

**"failed to fetch" OAuth errors?**
→ See [`docs/security/SECURITY_ENV_GUIDE.md`](docs/security/SECURITY_ENV_GUIDE.md)

**MongoDB connection issues?**
→ Verify `MONGODB_URI` in `backend/.env`

**Frontend not connecting to backend?**
→ Check Vite proxy config in `vite.config.ts`

**Need help?**
→ See [`docs/README.md`](docs/README.md) for complete documentation index

---

## 📞 Support

- **GitHub Issues**: Report bugs or feature requests
- **Documentation**: [`docs/`](docs/) folder
- **Email**: Contact team lead

---

## 📄 License

[Add license information here]

---

**Development by**: Vintaragroup  
**Repository**: https://github.com/Vintaragroup/wreckshop-social  
**Latest Docs**: [`docs/reference/RESTORE_POINT_2025_11_10.md`](docs/reference/RESTORE_POINT_2025_11_10.md)
