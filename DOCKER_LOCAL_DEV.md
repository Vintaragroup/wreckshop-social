# Local Docker Development Stack

## Overview

We run a **single Docker Compose stack** for all development. No ngrok, no multiple configurations. Fast iteration cycle with hot reloading on file changes.

**Stack:**
- **Frontend:** Vite dev server (port 5176) with hot reload
- **Backend:** Node.js with Nodemon (port 4002) with auto-reload  
- **Postgres:** wreckshop-postgres (port 5432)
- **Redis:** wreckshop-redis (port 6380 → 6379)
- **Mongo:** wreckshop-mongo (port 27020 → 27017)

---

## Quick Start

### 1. Set up environment

Create `.env` in the project root (consumed by docker-compose.yml):

```bash
# Stack Auth (for OAuth flows; hosted sign-in via app.stack-auth.com)
STACK_PROJECT_ID=63928c12-12fd-4780-82c4-b21c2706650f
STACK_CLIENT_KEY=pck_86xrchmcnqmyeeb9rdfsp3bt5gn24dev36zf7xcb9rse8
STACK_SERVER_KEY=ssk_23s2yr67atdrjbvhbd870yqznxgq7paz0k6kkag9zne2r
STACK_WEBHOOK_SECRET=whsec_xxxx

# Frontend will also be able to use VITE_STACK_PROJECT_ID from this .env
VITE_STACK_PROJECT_ID=63928c12-12fd-4780-82c4-b21c2706650f
VITE_ENABLE_SPOTIFY_SSO=true

# Integrations (optional for now)
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_secret
LASTFM_API_KEY=your_key
INSTAGRAM_APP_ID=your_id
INSTAGRAM_APP_SECRET=your_secret
ADMIN_API_KEY=admin_secret
```

### 2. Start the stack

```bash
docker compose up -d
```

Watch logs for all services:

```bash
docker compose logs -f
```

Watch only backend:

```bash
docker compose logs -f backend
```

Watch only frontend:

```bash
docker compose logs -f frontend
```

### 3. Verify services

```bash
docker compose ps
```

Expected output:
```
NAME              IMAGE                     STATUS
wreckshop-backend   wreckshop-social-backend   Up
wreckshop-frontend  wreckshop-social-frontend  Up
wreckshop-postgres  postgres:16-alpine        Up (healthy)
wreckshop-redis     redis:7-alpine            Up (healthy)
wreckshop-mongo     mongo:7                   Up (healthy)
```

---

## Development Workflow

### Hot Reloading

**Frontend (Vite):**
- Edit `src/**` files → Vite detects and hot-reloads in the browser
- Changes visible at `http://localhost:5176`

**Backend (Nodemon):**
- Edit `backend/src/**` files → Nodemon detects and restarts the server
- Changes visible immediately; check logs with `docker compose logs -f backend`

### Making Code Changes

1. **Edit your file** (e.g., `src/pages/auth/login-stack.tsx` or `backend/src/routes/auth.routes.ts`)
2. **Save** → Nodemon/Vite auto-detect
3. **Check logs** → Verify no errors
4. **Refresh browser** → See changes

### Common Tasks

**Rebuild a single service:**
```bash
docker compose build backend
docker compose up -d backend
```

**View database:**

Postgres:
```bash
docker exec -it wreckshop-postgres psql -U wreckshop_user -d wreckshop_dev
```

Redis:
```bash
docker exec -it wreckshop-redis redis-cli
```

Mongo:
```bash
docker exec -it wreckshop-mongo mongosh -u wreckshop_admin -p wreckshop_password
```

**Stop stack:**
```bash
docker compose down
```

**Stop and remove volumes (fresh start):**
```bash
docker compose down -v
```

---

## Debugging

### Backend Logs
```bash
docker compose logs -f backend
```

Look for:
- Prisma migration errors
- Port conflicts (4002)
- Database connection issues
- Stack Auth errors

### Frontend Logs
```bash
docker compose logs -f frontend
```

Look for:
- Vite build errors
- Browser console (F12 in browser)
- API connectivity issues

### Test API Health

```bash
curl http://localhost:4002/api/health
```

Expected response:
```json
{"ok": true}
```

### Test Auth Endpoint

```bash
curl -X POST http://localhost:4002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

---

## Stack Auth Integration

The backend connects to Stack Auth via:
- **STACK_PROJECT_ID:** Your Stack Auth project
- **STACK_SERVER_KEY:** Server secret for token validation
- **STACK_WEBHOOK_SECRET:** For webhook verification

All env vars are passed from the `.env` file to both frontend and backend containers.

**Frontend environment variables** (passed to Vite):
- `VITE_STACK_PROJECT_ID` → for SSO URLs
- `VITE_API_BASE_URL` → always empty in docker (proxied via nginx)

**Backend environment variables**:
- All Stack Auth server keys
- Database URLs (compose internal networking)
- Integration secrets (Spotify, etc.)

---

## Troubleshooting

### "Port 5176 already in use"
```bash
# Find and stop the process
lsof -i :5176
kill -9 <PID>

# Or change the port in docker-compose.yml
```

### "Connection refused" (backend)
Check that postgres is healthy:
```bash
docker compose logs postgres
```

Should see:
```
database system is ready to accept connections
```

### Prisma migrations failing
Run manually:
```bash
docker exec wreckshop-backend npx prisma migrate deploy
```

### Volumes not updating (hot reload not working)
Make sure volumes are mounted in `docker-compose.yml`:
```yaml
volumes:
  - ./backend/src:/app/src
  - ./src:/app/src
```

Restart the container:
```bash
docker compose restart backend
```

---

## Next Steps

Once Stack Auth is fully working and tested locally:

1. Push changes to repo
2. Prepare `render.yaml` or Render service configs
3. Deploy to Render.com (one service per container)
4. Update `CORS_ORIGIN`, database URLs, Redis/Mongo endpoints for production

**For now:** Stay in Docker. Keep iterating. We'll migrate when it's stable.

---

## Quick Reference Commands

```bash
# Start/rebuild
docker compose up -d --build

# View all logs
docker compose logs -f

# View backend logs
docker compose logs -f backend

# View frontend logs
docker compose logs -f frontend

# Stop everything
docker compose down

# Fresh start (remove volumes)
docker compose down -v && docker compose up -d --build

# Rebuild one service
docker compose build backend && docker compose up -d backend

# Shell into a container
docker exec -it wreckshop-backend sh
docker exec -it wreckshop-frontend sh

# Check health
docker compose ps
curl http://localhost:4002/api/health
```
