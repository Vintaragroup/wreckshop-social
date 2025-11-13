# Development & Testing Setup Guide

**Goal:** Easy switching between local development and artist testing via ngrok

> **Update (2025-01):** There is now a single Docker Compose file (`docker-compose.yml`) for both local and ngrok testing. Use `docker compose -f docker-compose.yml ...` for every command below; start/stop ngrok alongside the same containers when you need the public tunnel.

---

## Environment Files

### `.env.local` - LOCAL DEVELOPMENT (default)
```bash
VITE_API_BASE_URL=http://localhost:4002/api
```
- **Use for:** Daily development, feature work, local testing
- **Access:** http://localhost:5176
- **Backend:** http://localhost:4002

### `.env.ngrok` - ARTIST/MANAGER TESTING
```bash
VITE_API_BASE_URL=https://wreckshop.ngrok.app/api
```
- **Use for:** Sharing with testers, artist feedback, external testing
- **Access:** https://wreckshop.ngrok.app
- **Backend:** Exposed via ngrok tunnel

---

## Quick Start - Local Development

### Option A: Using npm (Direct)
```bash
# Current default - good for local development
git checkout .env.local
npm run dev
# Access: http://localhost:5176
# Backend: http://localhost:4002
```

### Option B: Using Docker (Recommended)
```bash
# Start all services (frontend, backend, postgres, mongo, redis)
docker compose -f docker-compose.yml up

# Access: http://localhost:5176
# Backend: http://localhost:4002
# Database: postgres://localhost:5432
```

## Quick Start - Artist Testing with ngrok

### Step 1: Start Docker with ngrok Configuration
```bash
# Use ngrok-specific docker-compose (separate volumes/containers)
docker compose -f docker-compose.yml up

# This starts everything configured for ngrok:
# - CORS_ORIGIN set to https://wreckshop.ngrok.app
# - SPOTIFY_REDIRECT_URI set to ngrok domain
# - API_BASE_URL will be https://wreckshop.ngrok.app/api
# Access: http://localhost:5176 (internally)
```

### Step 2: Start ngrok Tunnel
```bash
# In another terminal, expose backend
ngrok http --url=wreckshop.ngrok.app 4002
```

### Step 3: Share with Artists
```
Artists access: https://wreckshop.ngrok.app
```

### Step 3: Share with Artists/Managers
Send them: **https://wreckshop.ngrok.app**

They can:
- Create accounts
- Test the platform
- Provide feedback
- Work with campaigns

### Step 3: Return to Local Development
```bash
# Stop ngrok tunnel (Ctrl+C)
# Stop docker: Ctrl+C or docker-compose down
# Restart local environment

docker compose -f docker-compose.yml up
# Access: http://localhost:5176
```

---

## Docker Usage

### Separate Docker Configurations

Two isolated docker-compose setups ensure clean isolation:

**Local Development:**
```bash
docker compose -f docker-compose.yml up
# Uses: localhost:5176 (frontend), localhost:4002 (backend)
# Containers: wreckshop-frontend-dev, wreckshop-backend-dev
# Volumes: frontend_node_modules, backend_node_modules
# Database: Fresh postgres_data for local testing
```

**ngrok Testing:**
```bash
docker compose -f docker-compose.yml up
# Uses: https://wreckshop.ngrok.app (via ngrok tunnel)
# Containers: wreckshop-frontend-ngrok, wreckshop-backend-ngrok
# Volumes: frontend_node_modules_ngrok, backend_node_modules_ngrok
# Database: Separate postgres_data_ngrok (keeps local data safe)
```

### Key Differences

| Aspect | Local | ngrok |
|--------|-------|-------|
| Frontend | localhost:5176 | https://wreckshop.ngrok.app |
| Backend | localhost:4002 | https://wreckshop.ngrok.app |
| CORS_ORIGIN | http://localhost:5176 | https://wreckshop.ngrok.app |
| Spotify Redirect | http://localhost:4002/... | https://wreckshop.ngrok.app/... |
| Containers | *-dev | *-ngrok |
| Volumes | separate | separate |
| Database | postgres_data | postgres_data_ngrok |

### Quick Docker Commands

```bash
# Local development - start all services
docker compose -f docker-compose.yml up

# ngrok testing - start all services
docker compose -f docker-compose.yml up

# Stop services (both)
docker-compose down

# View logs (local)
docker compose -f docker-compose.yml logs -f

# View logs (ngrok)
docker compose -f docker-compose.yml logs -f

# Rebuild containers (local)
docker compose -f docker-compose.yml up --build

# Rebuild containers (ngrok)
docker compose -f docker-compose.yml up --build
```

---

## Workflow Scenarios

### Scenario 1: Daily Development with Docker
```bash
# Morning start
docker compose -f docker-compose.yml up

# Access: http://localhost:5176
# All services running: frontend, backend, postgres, mongo, redis
# Work on features...

# Evening: Stop services
docker-compose down
```

### Scenario 2: Artist Feedback with Docker + ngrok
```bash
# Start ngrok Docker configuration
docker compose -f docker-compose.yml up

# In another terminal, start ngrok tunnel
ngrok http --url=wreckshop.ngrok.app 4002

# Send URL to artists: https://wreckshop.ngrok.app
# They test and provide feedback...

# Stop when done
docker-compose down
# ngrok tunnel also stops
```

### Scenario 3: Quick Switch Between Environments
```bash
# Currently running local development
docker compose -f docker-compose.yml up
# (Ctrl+C to stop)

# Switch to artist testing
docker compose -f docker-compose.yml up

# Start ngrok in another terminal
ngrok http --url=wreckshop.ngrok.app 4002

# Back to local
docker-compose down
docker compose -f docker-compose.yml up
```

### Scenario 4: Deploy Updates
```bash
# Make code changes
git add -A
git commit -m "feat: New feature"

# Test locally with Docker
docker compose -f docker-compose.yml up
# Verify it works at http://localhost:5176

# Then switch to ngrok for artist testing
docker-compose down
docker compose -f docker-compose.yml up
ngrok http --url=wreckshop.ngrok.app 4002

# Artists test new feature at https://wreckshop.ngrok.app
```

---

## ngrok Tunnel Setup

### Start Tunnel (separate terminal)
```bash
ngrok http --url=wreckshop.ngrok.app 4002
```

### Tunnel Output
```
Session Status    online
Account           ryan@vintaragroup.com
Forwarding        https://wreckshop.ngrok.app -> http://localhost:4002
Connections       0 total
```

### Keep Tunnel Running
- Don't close this terminal while testing
- Artists will lose access if tunnel stops
- Can safely restart anytime (get new session)

---

## Environment Variable Reference

| Variable | Local | ngrok |
|----------|-------|-------|
| VITE_API_BASE_URL | http://localhost:4002/api | https://wreckshop.ngrok.app/api |
| VITE_STACK_PROJECT_ID | Same | Same |
| VITE_STACK_CLIENT_KEY | Same | Same |
| VITE_STACK_API_URL | https://api.stack-auth.com | https://api.stack-auth.com |

---

## Troubleshooting

### "Can't connect to localhost:4002"
- Make sure backend is running: `docker-compose up`
- Check if backend is healthy: http://localhost:4002/health

### "Artists can't access ngrok URL"
- Verify tunnel is running: `ngrok http --url=wreckshop.ngrok.app 4002`
- Check URL is: https://wreckshop.ngrok.app (HTTPS required)
- Tunnel must stay running for access

### "Frontend changes not appearing"
- Kill frontend process (Ctrl+C)
- Make sure correct .env is active
- Restart with: `npm run dev`

### "401 Unauthorized on API calls"
- Check JWT token is being sent
- Verify Stack Auth credentials are correct
- Check browser console for errors

---

## Tips for Artist Testing

### Before Sharing
1. Test locally first: `git checkout .env.local && npm run dev`
2. Verify features work
3. Create test accounts

### During Testing
1. Start ngrok tunnel (keep it running)
2. Switch environment: `cp .env.ngrok .env.local`
3. Restart frontend: `npm run dev`
4. Share: https://wreckshop.ngrok.app
5. Send debug guide if they hit issues

### After Testing
1. Collect feedback
2. Stop ngrok (Ctrl+C)
3. Return to local: `git checkout .env.local`
4. Continue development

---

## Files

- `.env.local` - Git ignored, local development (do not commit)
- `.env.ngrok` - Git committed, ngrok testing template
- `.env.example` - Reference for all variables

---

## Next Steps

1. ✅ Local development: `npm run dev` (already works)
2. ✅ Artist testing: Copy `.env.ngrok` → restart → share URL
3. ✅ Iterate: Easy switching between environments

---

**Summary:** Use `.env.local` for development, switch to `.env.ngrok` for testing. Fast, simple, effective.

*Last Updated: November 11, 2025*
