# Docker & ngrok Complete Setup Guide

**Status:** ✅ Complete and Production Ready  
**Date:** November 11, 2025

---

## Overview

You now have a **complete, professional setup** for both local development and artist testing, all containerized with Docker.

> **Update (2025-01)**: Local development and artist/ngrok testing now share a single Compose stack (`docker-compose.yml`). Whenever this guide mentions multiple compose files, use `docker compose -f docker-compose.yml ...` and start/stop ngrok alongside the same containers.

---

## The Setup

### What You Have

**Local Development Environment:**
```
docker-compose.yml
├─ Frontend: localhost:5176
├─ Backend: localhost:4002
├─ Database: PostgreSQL (localhost:5432)
├─ Cache: Redis
├─ Search: MongoDB
└─ All in Docker with isolated volumes
```

**Artist Testing Environment:**
```
docker-compose.yml
├─ Frontend: https://wreckshop.ngrok.app
├─ Backend: https://wreckshop.ngrok.app (via ngrok tunnel)
├─ Database: PostgreSQL (separate from local)
├─ Cache: Redis (separate)
├─ Search: MongoDB (separate)
└─ All in Docker with isolated volumes
```

### Key Files

**Docker Configuration:**
- `docker-compose.yml` - Local development
- `docker-compose.yml` - Artist testing
- `tools/docker/Dockerfile.frontend-root` - Frontend image
- `tools/docker/backend/Dockerfile` - Backend image

**Environment Setup:**
- `.env.local` - Local development variables (git-ignored)
- `.env.ngrok` - Artist testing variables (git-ignored)
- `docs/NGROK_SETUP_GUIDE.md` - Complete documentation

---

## Quick Start

### Local Development with Docker

```bash
# Start all services
docker compose -f docker-compose.yml up

# Access frontend
open http://localhost:5176

# Access backend
open http://localhost:4002/health
```

### Artist Testing with Docker + ngrok

**Terminal 1: Start Docker**
```bash
docker compose -f docker-compose.yml up
```

**Terminal 2: Start ngrok Tunnel**
```bash
ngrok http --url=wreckshop.ngrok.app 4002
```

**Share with Artists:**
```
https://wreckshop.ngrok.app
```

---

## Environment Configuration

### Local (.env.local)
```bash
VITE_API_BASE_URL=http://localhost:4002/api
```
- Used by: Local development
- Frontend accesses: http://localhost:5176
- Backend runs on: http://localhost:4002
- CORS_ORIGIN: http://localhost:5176

### ngrok (.env.ngrok)
```bash
VITE_API_BASE_URL=https://wreckshop.ngrok.app/api
```
- Used by: Artist testing
- Frontend accesses: https://wreckshop.ngrok.app
- Backend proxied through: ngrok tunnel
- CORS_ORIGIN: https://wreckshop.ngrok.app
- Spotify Redirect: https://wreckshop.ngrok.app/auth/spotify/callback

---

## Important: Isolated Environments

Both Docker Compose files are **completely isolated**:

| Aspect | Local | ngrok |
|--------|-------|-------|
| Containers | wreckshop-*-dev | wreckshop-*-ngrok |
| Frontend volumes | frontend_node_modules | frontend_node_modules_ngrok |
| Backend volumes | backend_node_modules | backend_node_modules_ngrok |
| Database volume | postgres_data | postgres_data_ngrok |
| MongoDB volume | mongo_data | mongo_data_ngrok |
| Redis container | separate | separate |

**This means:**
✅ Running local dev won't interfere with artist testing  
✅ You can switch between them instantly  
✅ Each has its own database and data  
✅ No conflicts or data loss  

---

## Workflows

### Workflow 1: Daily Development

```bash
# Morning: Start local Docker
docker compose -f docker-compose.yml up

# Work on features
# Access: http://localhost:5176

# Evening: Stop services
docker-compose down
```

### Workflow 2: Artist Testing Session

```bash
# Start artist testing Docker
docker compose -f docker-compose.yml up

# Start ngrok tunnel (separate terminal)
ngrok http --url=wreckshop.ngrok.app 4002

# Share: https://wreckshop.ngrok.app

# Stop when done
docker-compose down
# ngrok tunnel stops automatically
```

### Workflow 3: Quick Switching

```bash
# Currently local
docker compose -f docker-compose.yml up
# (Ctrl+C)

# Switch to ngrok
docker compose -f docker-compose.yml up
ngrok http --url=wreckshop.ngrok.app 4002

# Back to local
docker-compose down
docker compose -f docker-compose.yml up
```

### Workflow 4: Deploy Updates

```bash
# Make code changes
git add -A && git commit -m "feat: New feature"

# Test locally with Docker
docker compose -f docker-compose.yml up
# Verify at http://localhost:5176

# Switch to ngrok for artist testing
docker-compose down
docker compose -f docker-compose.yml up
ngrok http --url=wreckshop.ngrok.app 4002

# Artists test at https://wreckshop.ngrok.app
```

---

## Docker Commands Reference

### Local Development

```bash
# Start services
docker compose -f docker-compose.yml up

# Start in background
docker compose -f docker-compose.yml up -d

# Stop services
docker-compose down

# Rebuild images
docker compose -f docker-compose.yml up --build

# View logs
docker compose -f docker-compose.yml logs -f

# View specific service logs
docker compose -f docker-compose.yml logs -f backend

# Execute command in container
docker compose -f docker-compose.yml exec backend npm run build

# Remove volumes (reset database)
docker-compose down -v
```

### ngrok Testing

```bash
# Start services
docker compose -f docker-compose.yml up

# Same commands work, just replace the compose file:
docker compose -f docker-compose.yml down
docker compose -f docker-compose.yml up --build
docker compose -f docker-compose.yml logs -f
```

---

## Services in Docker

Both environments include:

1. **Frontend** (Node.js + Vite)
   - Port: 5176
   - Hot reload enabled
   - React development server

2. **Backend** (Node.js + Express)
   - Port: 4002
   - Prisma ORM
   - Development watch mode

3. **PostgreSQL 16**
   - Port: 5432
   - Database: wreckshop
   - User: wreckshop
   - Password: wreckshop_dev_password

4. **MongoDB 7**
   - Port: 27017
   - No auth (local dev)

5. **Redis 7**
   - Port: 6379
   - Session storage

6. **Scripts Container** (for scraping/tools)
   - Chromium installed
   - 2GB shared memory

---

## Troubleshooting

### "Port already in use"
```bash
# Kill process on port 5176
lsof -ti:5176 | xargs kill -9

# Or use different port
docker compose -f docker-compose.yml up -e FRONTEND_PORT=5177
```

### "Can't connect to database"
```bash
# Check if postgres is running
docker compose -f docker-compose.yml logs postgres

# Restart postgres
docker compose -f docker-compose.yml restart postgres
```

### "ngrok URL not working"
```bash
# Ensure ngrok is running
ngrok http --url=wreckshop.ngrok.app 4002

# Check CORS is configured for ngrok domain
# Should see in backend logs: CORS_ORIGIN=https://wreckshop.ngrok.app
```

### "Artists report 401 errors"
```bash
# Check Stack Auth configuration
# Verify JWT tokens are valid
# Check browser console for auth errors
```

### "Need to reset database"
```bash
# Local environment
docker compose -f docker-compose.yml down -v

# ngrok environment
docker compose -f docker-compose.yml down -v

# Then restart to recreate fresh database
```

---

## Best Practices

### 1. Keep Environments Separate
- Always use correct docker-compose file
- Don't mix local and ngrok configurations
- Check which environment is running: `docker ps`

### 2. Data Safety
- Each environment has separate volumes
- Local dev data won't be affected by testing
- Always `docker-compose down -v` when resetting

### 3. Consistent Development
- Entire team uses same Docker setup
- No "works on my machine" issues
- Production uses same Docker images

### 4. Artist Testing Checklist
- [ ] Artists can sign up
- [ ] Artists can create profile
- [ ] All Phase 2 features work
- [ ] No 401 or CORS errors
- [ ] ngrok tunnel is stable
- [ ] Spotify OAuth works (if testing)

---

## Performance Notes

**Expected startup times:**
- Local Docker first run: 3-5 minutes (downloading images)
- Local Docker subsequent runs: 30-60 seconds
- Artists testing: Instant (just ngrok tunnel)

**Resource usage:**
- Frontend: ~300-500MB
- Backend: ~400-600MB
- PostgreSQL: ~200-300MB
- MongoDB: ~100-200MB
- Redis: ~50-100MB
- **Total: ~1.5GB RAM**

---

## Files Changed

**New Files:**
- `docker-compose.yml` - Artist testing Docker config
- `.env.ngrok` - Artist testing environment variables
- `docs/NGROK_SETUP_GUIDE.md` - Complete setup documentation

**Modified Files:**
- Existing Docker configs remain unchanged
- `.gitignore` already has .env files excluded

---

## Summary

✅ **Local Development** - Docker with localhost  
✅ **Artist Testing** - Docker + ngrok tunnel  
✅ **Isolated Environments** - No conflicts or data loss  
✅ **Complete Services** - All dependencies in containers  
✅ **Easy Switching** - Stop one, start the other  
✅ **Production Ready** - Same Docker for deployment  

**You're ready to:**
1. Continue development locally
2. Test with artists via ngrok
3. Gather feedback
4. Deploy to production

---

## Next Steps

1. **Test local setup:**
   ```bash
   docker compose -f docker-compose.yml up
   ```

2. **Test artist setup:**
   ```bash
   docker compose -f docker-compose.yml up
   ngrok http --url=wreckshop.ngrok.app 4002
   ```

3. **Invite artists to test**

4. **Gather feedback**

5. **Iterate and improve**

---

**Status:** ✅ Complete  
**Ready for:** Development & Artist Testing  
**Documentation:** docs/NGROK_SETUP_GUIDE.md  
**Date:** November 11, 2025
