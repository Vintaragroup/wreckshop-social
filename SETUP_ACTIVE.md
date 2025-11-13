# ✅ Setup Active - Ready for Testing

**Status:** All systems running  
**Date:** November 11, 2025  
**Time:** 10:50 PM

---

## What's Running

### ✅ Frontend
- **URL (Local):** http://localhost:5177/
- **URL (Artists):** https://wreckshop.ngrok.app
- **Status:** Running
- **Command:** `npm run dev`

### ✅ ngrok Tunnel
- **Domain:** wreckshop.ngrok.app
- **Backend Port:** 4002
- **Status:** Active
- **Command:** `ngrok http 4002`

### 📝 What You Need to Do

**Backend is NOT yet running.** You need to start it separately.

In a new terminal:
```bash
cd backend
npm install
npm run dev
```

Or if you prefer Docker (after it finishes building):
```bash
docker compose -f docker-compose.yml up
```

---

## Testing URLs

### Once Backend is Running:

**Local Development:**
```
http://localhost:5177/
Backend: http://localhost:4002/api
```

**Artist Testing:**
```
https://wreckshop.ngrok.app
Backend: https://wreckshop.ngrok.app/api (via ngrok tunnel)
```

---

## Quick Checklist

- [x] Frontend running (`npm run dev`)
- [x] ngrok tunnel active (`ngrok http 4002`)
- [ ] Backend running (start in new terminal)
- [ ] Can access http://localhost:5177/
- [ ] Can access https://wreckshop.ngrok.app
- [ ] Can sign in with test account
- [ ] All Phase 2 features working

---

## Start Backend

```bash
# Option 1: npm (recommended for now - faster)
cd backend
npm install
npm run dev

# Option 2: Docker (if you prefer, but may be slower)
docker compose -f docker-compose.yml up
```

---

## Test Credentials

Use your Stack Auth account to sign in or create a new test account.

---

## Stop Services

When done testing:

```bash
# Frontend (Terminal with npm)
Ctrl+C

# ngrok (Terminal with ngrok running)
Ctrl+C

# Backend (Terminal with backend npm)
Ctrl+C
```

---

**Next:** Start backend and test!
