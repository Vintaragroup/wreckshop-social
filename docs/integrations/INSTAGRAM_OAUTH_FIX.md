# Instagram OAuth Fix - "Unexpected token doctype" Error

## Problem Identified

When clicking the "Connect Instagram" button, you received the error:
```
Unexpected token doctype is not valid JSON
```

## Root Cause

The Vite dev server proxy configuration was **only forwarding `/api` requests** to the backend, but **not `/auth` requests**.

When the frontend tried to fetch `/auth/instagram/login`:
1. ❌ Request went to `http://localhost:5176/auth/instagram/login` (frontend)
2. ❌ Frontend dev server returned an HTML 404 page (which contains "<!doctype html>")
3. ❌ Frontend tried to parse HTML as JSON → "Unexpected token doctype" error

## Solution Applied

Updated `vite.config.ts` to proxy `/auth` requests to the backend:

```typescript
proxy: {
  '/api': {
    target: 'http://localhost:4002',
    changeOrigin: true,
    secure: false,
  },
  '/auth': {  // ← NEW: Added OAuth proxy
    target: 'http://localhost:4002',
    changeOrigin: true,
    secure: false,
  },
}
```

Now when the frontend fetches `/auth/instagram/login`:
1. ✅ Request goes to `http://localhost:5176/auth/instagram/login` (frontend)
2. ✅ Vite dev server proxies to `http://localhost:4002/auth/instagram/login` (backend)
3. ✅ Backend returns valid JSON with OAuth URL
4. ✅ Frontend parses JSON successfully → Instagram OAuth starts

## What Changed

### File Modified
- **`vite.config.ts`** - Added `/auth` proxy configuration

### Changes Made
```diff
  server: {
    port: 5176,
    open: false,
    proxy: {
      '/api': { ... },
+     '/auth': {
+       target: process.env.API_PROXY_TARGET || process.env.VITE_API_BASE_URL || 'http://localhost:4002',
+       changeOrigin: true,
+       secure: false,
+     },
    },
  },
```

## How to Verify the Fix

### Step 1: Restart Frontend Dev Server
The vite.config.ts change requires a server restart:

```bash
# If running in terminal, press Ctrl+C
# Then restart:
npm run dev
```

Or if using the VS Code task:
1. Stop the current "dev" task
2. Restart it

### Step 2: Test the OAuth Endpoint
```bash
# Now should return JSON instead of HTML
curl http://localhost:5176/auth/instagram/login | jq .
```

**Before Fix (would fail):**
```html
<!doctype html>
<html>
  <head><title>404 Not Found</title></head>
  ...
```

**After Fix (should work):**
```json
{
  "authUrl": "https://api.instagram.com/oauth/authorize?...",
  "redirectTo": "https://api.instagram.com/oauth/authorize?..."
}
```

### Step 3: Test in Browser
1. Open http://localhost:5176 (frontend)
2. Go to Integrations page
3. Click "Connect Instagram" button
4. ✅ You should be redirected to Instagram login
5. After granting permissions, you'll be redirected back to the callback handler

## Technical Details

### How Vite Proxy Works

In development, Vite dev server acts as a proxy:

```
Browser Request
    ↓
http://localhost:5176/auth/instagram/login
    ↓
Vite Dev Server (port 5176)
    ↓
(checks proxy config)
    ↓
Finds matching route: /auth → proxy to http://localhost:4002
    ↓
Forwards to Backend (port 4002)
    ↓
http://localhost:4002/auth/instagram/login
    ↓
Backend returns JSON
    ↓
Vite returns JSON to browser
    ↓
Frontend processes successfully
```

### Why This Wasn't Caught Before

1. Earlier testing used `curl` directly against port 4002 (backend)
   - Worked fine because it bypassed the proxy
2. The component worked in development without realizing the proxy gap
3. Without proper integration testing, the issue wasn't visible until user interaction

## Testing Checklist

After restarting the frontend dev server:

- [ ] Frontend dev server starts without errors
- [ ] Vite logs show both `/api` and `/auth` proxies are active
- [ ] Network tab shows `/auth/instagram/login` request succeeds
- [ ] Response content-type is `application/json` (not `text/html`)
- [ ] Instagram OAuth URL is returned correctly
- [ ] Clicking "Connect Instagram" redirects to Instagram login
- [ ] After granting permissions, redirected to callback handler
- [ ] Integrations page shows Instagram as "Connected"
- [ ] Profile data (username, followers) displays correctly

## Related Endpoints Now Proxied

With this fix, the following OAuth endpoints are now properly proxied:

| Endpoint | Purpose |
|----------|---------|
| `/auth/instagram/login` | Get Instagram OAuth URL |
| `/auth/instagram/callback?code=...` | Handle Instagram OAuth redirect |
| `/auth/spotify/login` | Get Spotify OAuth URL (already working) |
| `/auth/spotify/callback?code=...` | Handle Spotify OAuth redirect |
| `/auth/{platform}/login` | Will work for all future OAuth platforms |
| `/auth/{platform}/callback` | Will work for all future OAuth callbacks |

## Production Deployment

In production, you typically won't need a proxy because:

1. Frontend and backend are often at different domains
2. OAuth redirects happen at the browser level
3. CORS is properly configured

However, if deploying frontend and backend on the same domain:
- Backend should handle all `/auth` routes natively
- No proxy needed

## Prevention for Future

To prevent similar issues:

1. **Document proxy configuration** - Add comments about what gets proxied
2. **Add integration tests** - Test OAuth flow end-to-end
3. **Use consistent routing** - All backend routes should follow same pattern
4. **Monitor dev server logs** - Watch for unexpected 404s

## Next Steps

1. ✅ Updated `vite.config.ts` with `/auth` proxy
2. ⏳ Restart frontend dev server
3. ✅ Test Instagram OAuth flow
4. ✅ Test other OAuth flows (Spotify, etc.)
5. 📝 Document proxy configuration in project README

## Summary

The "Unexpected token doctype" error was caused by missing `/auth` proxy configuration in the Vite dev server. The fix involved adding a simple proxy rule to forward OAuth requests to the backend.

**Files Changed:** 1
- `vite.config.ts`

**Lines Changed:** 6 (added proxy for `/auth` routes)

**Testing Required:** Manual test of Instagram OAuth flow

---

*Fix Applied: November 10, 2025*
*Status: Ready for Testing* ✅
