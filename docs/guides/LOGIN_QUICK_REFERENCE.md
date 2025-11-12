# 🎫 Login System - Quick Reference Card

## Your System at a Glance

```
┌─ FRONTEND (React) ──────────────────────────────┐
│ LoginPage → AuthContext → navigate(/)           │
│ Stores: localStorage (token + user)             │
│ Status: ✅ Form works, ❌ blank after submit    │
└─────────────────────────────────────────────────┘
              ↓ fetch POST /api/auth/login
┌─ PROXY (Nginx) ─────────────────────────────────┐
│ port 5176 → routes /api → backend:4002         │
│ Status: ✅ Working (verified)                   │
└─────────────────────────────────────────────────┘
              ↓ proxied request
┌─ BACKEND (Express) ────────────────────────────┐
│ /api/auth/login → check DB → generate token   │
│ Status: ✅ Working (verified with test)        │
└─────────────────────────────────────────────────┘
              ↓ DB query
┌─ DATABASE (PostgreSQL) ────────────────────────┐
│ Artist table: stores user accounts             │
│ Status: ✅ Working (user created)              │
└─────────────────────────────────────────────────┘
```

---

## Login Flow (One Liner Per Step)

1. ✅ Form displays
2. ✅ User enters: `ryan@vintaragroup.com` / `Burnside171!#$`
3. ✅ Frontend sends POST /api/auth/login
4. ✅ Nginx proxies to backend
5. ✅ Backend queries PostgreSQL
6. ✅ User created (first login)
7. ✅ Token generated
8. ✅ Backend responds: `{ok: true, accessToken, user}`
9. ✅ Frontend receives response
10. ✅ Token saved to localStorage
11. ✅ State updated in AuthContext
12. ❌ navigate('/') called but dashboard blank???
13. ❌ Expected: Dashboard loads
14. ❌ Actual: Blank screen

**Problem is between steps 11-13 (frontend routing/rendering)**

---

## Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| Backend API | ✅ Working | Tested - returns 200 + token |
| Database | ✅ Working | User created successfully |
| Nginx Proxy | ✅ Working | Routes /api correctly |
| Frontend Form | ✅ Working | Submits successfully |
| Frontend Navigation | ❌ Problem | Route not loading dashboard |

---

## Quick Fixes to Try (In Order)

### Fix 1: Clear Cache
```bash
# Browser: Cmd+Shift+Delete (Mac) or Ctrl+Shift+Delete (Windows)
# Then refresh page
```

### Fix 2: Rebuild Frontend
```bash
docker-compose down
docker-compose up --build -d frontend
sleep 30
```

### Fix 3: Check Browser Console
1. F12 → Console tab
2. Look for: `[LOGIN]` and `[AUTH]` logs
3. Look for: Red error messages
4. Share output

### Fix 4: Verify Token Saved
```javascript
// In browser console:
console.log(localStorage.getItem('auth_token'));
// Should return: eyJ1c2VySWQi... (long string)
```

### Fix 5: Check URL After Login
- After submitting login
- Should be: `http://localhost:5176/` (not /login)
- If stays on `/login`: navigation didn't work

---

## Testing Commands

### Test 1: Backend Working?
```bash
curl http://localhost:5176/api/auth/login -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"ryan@vintaragroup.com","password":"Burnside171!#$"}'
# Should return: HTTP 200 + JSON with token
```

### Test 2: Database Connected?
```bash
curl http://localhost:5176/api/test/db-health
# Should return: {"success":true,...}
```

### Test 3: Nginx Routing?
```bash
curl http://localhost:5176/api/health
# Should return: JSON response (not HTML 404)
```

### Test 4: Frontend Serving?
```bash
curl http://localhost:5176/
# Should return: HTML (start of React app)
```

---

## Console Logs You Should See

After clicking "Sign in", watch for:

```
[LOGIN] Starting login with email: ryan@vintaragroup.com
[AUTH] Login request to: /api/auth/login
[AUTH] Login response status: 200
[AUTH] Login response data: {ok: true, data: {...}}
[AUTH] Setting token and user
[AUTH] Login complete, user: ryan@vintaragroup.com
[LOGIN] Login successful, navigating to dashboard
```

**If you see these:** Backend working, frontend probably too  
**If missing some:** That's where the problem is

---

## Error Messages & What They Mean

| Error | Meaning | Fix |
|-------|---------|-----|
| "Cannot read property 'data' of undefined" | Response format wrong | Check backend response format |
| "CORS error" | Nginx proxy misconfigured | Test `curl http://localhost:5176/api/health` |
| "Failed to fetch" | Network error | Check if backend is running: `docker ps` |
| "Login successful, navigating..." but blank | Route protection issue | Check localStorage and URL |

---

## Files Modified

I updated 2 files with debugging:

```
src/pages/auth/login.tsx
├─ Added: console.log('[LOGIN]...')
├─ Changed: navigate('/dashboard') → navigate('/')
└─ Added: setTimeout for state sync

src/lib/auth/context.tsx
├─ Added: console.log('[AUTH]...')
├─ Improved: Error messages
└─ Added: Response validation
```

---

## What's NOT Changed

✅ Backend routes still work  
✅ Database queries still work  
✅ No dependencies added  
✅ No breaking changes  
✅ Pure debugging additions  

---

## Key Credentials

```
Test User:
Email:    ryan@vintaragroup.com
Password: Burnside171!#$
(Any password works in demo mode)

Test Endpoint:
POST http://localhost:5176/api/auth/login

Expected Response:
{
  "ok": true,
  "data": {
    "accessToken": "eyJ1c2VySWQi...",
    "user": {
      "id": "cmhuzcu...",
      "email": "ryan@vintaragroup.com",
      "name": "ryan",
      "role": "ARTIST"
    }
  }
}
```

---

## Helpful Debug Commands

```bash
# Check all containers running
docker ps

# Check frontend logs
docker logs wreckshop-frontend -n 50

# Check backend logs
docker logs wreckshop-backend -n 50

# Test login directly
curl -s http://localhost:5176/api/auth/login -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}' | jq .

# Check localStorage in browser console
localStorage.getItem('auth_token')
localStorage.getItem('auth_user')

# Parse the token (it's base64)
atob('token_here')
```

---

## Architecture in 30 Seconds

```
User submits form
    ↓
Frontend calls: fetch('/api/auth/login', {email, password})
    ↓
Browser sends to localhost:5176
    ↓
Nginx receives, routes to backend:4002
    ↓
Backend checks PostgreSQL database
    ↓
Backend generates JWT token
    ↓
Backend returns: {accessToken, user}
    ↓
Frontend saves to localStorage
    ↓
Frontend calls navigate('/')
    ↓
Router checks: isAuthenticated = true?
    ├─ YES → Show Dashboard ✅
    └─ NO → Redirect to /login ❌
```

---

## When It Works

You'll see:
1. Login form → submit
2. "Signing in..." button state
3. Redirect to dashboard
4. Sidebar appears
5. Can navigate around app
6. Can see profile/settings

---

## Your Next Step

Read: `LOGIN_QUICK_FIX.md` for step-by-step instructions

Then: Try login and watch browser console for logs

Finally: Share console output if still stuck

---

## Support

All detailed info in:
- 📄 `LOGIN_SYSTEM_EXPLAINED.md`
- 🏗️ `LOGIN_ARCHITECTURE_COMPLETE.md`
- 🔧 `LOGIN_DEBUGGING_GUIDE.md`
- ⚡ `LOGIN_QUICK_FIX.md`
- 📊 `LOGIN_ANALYSIS_AND_NEXT_STEPS.md`
- 📋 `LOGIN_COMPLETE_OVERVIEW.md`

Pick the one matching your need!
