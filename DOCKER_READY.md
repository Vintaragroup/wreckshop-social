# ✅ Docker Stack - Complete & Ready for Development

**All systems operational. No ngrok needed. Hot reload enabled.**

---

## 🚀 Stack Status

```
NAME              IMAGE                    STATUS                    PORTS
wreckshop-backend   wreckshop-social-backend   Up (running)             4002
wreckshop-frontend  wreckshop-social-frontend  Up (running, hot reload) 5176
wreckshop-postgres  postgres:16-alpine         Up (healthy)             5432
wreckshop-redis     redis:7-alpine             Up (healthy)             6380
wreckshop-mongo     mongo:7                    Up (healthy)             27020
```

---

## 🎯 What's Working

✅ **Backend API** - `http://localhost:4002/api/health` → `{"ok": true}`  
✅ **Frontend Vite Dev** - `http://localhost:5176` → Served with HMR  
✅ **Hot Reload** - Save any `src/**` file → Auto-reload in browser  
✅ **Backend Restart** - Save any `backend/src/**` file → Nodemon restarts  
✅ **All Databases** - Postgres, Redis, Mongo connected and healthy  
✅ **OAuth Buttons** - Google, Facebook visible on `/login` and `/signup`  
✅ **Callback Handler** - `/auth/oauth/callback/:provider` route ready  

---

## 🔧 Quick Commands

### Start/Rebuild
```bash
docker compose up -d --build
```

### View Logs
```bash
docker compose logs -f              # all services
docker compose logs -f backend      # backend only
docker compose logs -f frontend     # frontend only
```

### Stop Everything
```bash
docker compose down
```

### Fresh Start (remove volumes)
```bash
docker compose down -v && docker compose up -d --build
```

---

## 📝 Environment Setup

Create `.env` at project root:

```env
# Stack Auth (for OAuth providers)
STACK_PROJECT_ID=63928c12-12fd-4780-82c4-b21c2706650f
STACK_SERVER_KEY=ssk_23s2yr67atdrjbvhbd870yqznxgq7paz0k6kkag9zne2r
STACK_WEBHOOK_SECRET=whsec_xxxx

# Frontend
VITE_STACK_PROJECT_ID=63928c12-12fd-4780-82c4-b21c2706650f
VITE_ENABLE_SPOTIFY_SSO=true

# Integrations
SPOTIFY_CLIENT_ID=your_id
SPOTIFY_CLIENT_SECRET=your_secret
```

---

## 🧪 Testing OAuth Flows

### 1. Open Login Page
```
http://localhost:5176/login
```

### 2. Click "Sign in with Google" (or Facebook/Spotify)

### 3. You'll be redirected to:
```
https://app.stack-auth.com/{projectId}/sign-in?provider=google&redirect_uri=...
```

### 4. After authentication, redirected back to:
```
http://localhost:5176/auth/oauth/callback/google?code=...&state=...
```

### 5. Our callback handler will:
- Exchange code for token
- Fetch user profile via `/api/auth/me`
- Store in AuthContext
- Redirect to dashboard (/)

---

## 🐛 Debugging

### Check Backend Logs
```bash
docker compose logs -f backend 2>&1 | grep -i error
```

### Check Frontend Console
Open browser DevTools (F12) → Console tab

### Test API Health
```bash
curl http://localhost:4002/api/health | jq
```

### Test Frontend
```bash
curl http://localhost:5176 | head -20
```

### Inspect Database
```bash
# Postgres
docker exec -it wreckshop-postgres psql -U wreckshop_user -d wreckshop_dev

# Redis
docker exec -it wreckshop-redis redis-cli

# Mongo
docker exec -it wreckshop-mongo mongosh -u wreckshop_admin -p wreckshop_password
```

---

## 🗂️ Key Files

| File | Purpose |
|------|---------|
| `docker-compose.yml` | The ONE stack definition (no ngrok, no alternatives) |
| `Dockerfile.dev` | Frontend dev mode (Vite dev server, hot reload) |
| `backend/Dockerfile` | Backend with Nodemon auto-restart |
| `src/pages/auth/login-stack.tsx` | Sign-in page with OAuth buttons |
| `src/pages/auth/signup-stack.tsx` | Sign-up page with OAuth buttons |
| `src/pages/auth/oauth-callback.tsx` | OAuth callback handler |
| `src/lib/auth/context.tsx` | AuthContext with completeSsoLogin |
| `backend/src/routes/auth.routes.ts` | Backend auth routes including `/api/auth/sso/exchange` |
| `.env` | Environment variables (Stack Auth keys, etc.) |
| `DOCKER_LOCAL_DEV.md` | Complete dev guide |

---

## ⚡ Development Workflow

1. **Make a code change** (e.g., `src/pages/auth/login-stack.tsx`)
2. **Save the file**
3. **Vite detects and hot-reloads** (frontend) or Nodemon restarts (backend)
4. **Refresh your browser or see changes auto-reload**
5. **Check logs if needed**: `docker compose logs -f`

---

## 📦 What Changed Today

- ✅ Removed ngrok dependency entirely
- ✅ Simplified to **single docker-compose.yml**
- ✅ Removed `@stackframe/stack` SDK (not needed for hosted flow)
- ✅ Fixed Frontend build error (`process is not defined`)
- ✅ Created `Dockerfile.dev` for Vite hot reload
- ✅ Updated backend Dockerfile to ensure Prisma generation
- ✅ All 5 services running and healthy
- ✅ Created comprehensive dev documentation

---

## 🎓 No More

❌ ngrok tunnels  
❌ Multiple docker-compose files  
❌ Separate dev/prod setups  
❌ Stack Auth SDK wrapper components  
❌ Manual container rebuilds for code changes  

---

## ➡️ Next Steps

1. **Test OAuth flows** - Try signing in with Google/Facebook
2. **Iterate on bugs** - Edit code, save, watch changes live
3. **Once stable** - Prepare Render.com migration (same containers, production config)

**All development now happens in this single Docker stack. Fast. Simple. Ready.**

See `DOCKER_LOCAL_DEV.md` for the complete reference guide.
