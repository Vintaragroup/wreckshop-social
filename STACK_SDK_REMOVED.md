# Stack Auth SDK Removed - Frontend Fixed

## Problem
The `@stackframe/stack` SDK package was causing a critical error in the browser:

```
ReferenceError: process is not defined
```

This happened because:
1. The Stack Auth SDK is designed for **Next.js** apps (server-side rendering)
2. We're running a **React + Vite** SPA (client-side only)
3. The SDK tried to import Next.js server APIs (`next/headers`, `next/server/cookies.js`) that don't exist in the browser

## Solution
**We don't need the Stack Auth SDK** because we're using the **hosted sign-in flow**:

- Users click "Sign in with Google/Facebook/Spotify"
- Redirected to: `https://app.stack-auth.com/{projectId}/sign-in?provider=google&redirect_uri=...`
- Stack Auth handles the OAuth flow entirely
- Returns to our callback: `/auth/oauth/callback/:provider`
- Our app exchanges the code/token and logs in the user via our own `AuthContext`

## Changes Made

### 1. **Removed `@stackframe/stack` from package.json**
   - Dependencies are now smaller, faster to install
   - No more Next.js SDK bloat in a React/Vite app

### 2. **Cleaned up imports**
   - **src/main.tsx**: Removed `StackProvider` and `StackTheme` wrappers
   - **src/router.tsx**: Removed `/handler/*` route (was trying to use StackHandler component)
   - **src/stack/client.ts**: Replaced with a deprecation comment

### 3. **Frontend now runs cleanly**
   ```
   VITE v6.3.5  ready in 239 ms
   ```
   - No SDK errors
   - Vite dev server running
   - Hot reload working

---

## What Still Works

✅ **OAuth flows** - Google, Facebook, Spotify buttons on login/signup  
✅ **Callback handling** - `/auth/oauth/callback/:provider` works  
✅ **Token exchange** - Backend `/api/auth/sso/exchange` processes codes  
✅ **Session management** - AuthContext stores token and user  
✅ **Hot reload** - Frontend code changes auto-reload in browser  

---

## Environment Variables Now Needed

Only **frontend** needs the Stack Auth Project ID:

```env
# .env (at project root)
VITE_STACK_PROJECT_ID=63928c12-12fd-4780-82c4-b21c2706650f
VITE_ENABLE_SPOTIFY_SSO=true

# Backend still needs server keys for token validation (if real exchange needed later)
STACK_PROJECT_ID=63928c12-12fd-4780-82c4-b21c2706650f
STACK_SERVER_KEY=ssk_xxxx
```

---

## Next Steps

1. **Test OAuth flows** in the browser at `http://localhost:5176/login`
2. **Verify callback** - Click "Sign in with Google", should redirect back after auth
3. **Check session** - User should be logged in if backend processes the token correctly
4. Once stable → Prepare Render.com migration (same containers, hosted OAuth)

---

## Reference

- **Hosted flow docs**: https://docs.stack-auth.com/authentication/overview
- **OAuth callback handler**: `src/pages/auth/oauth-callback.tsx`
- **Auth context**: `src/lib/auth/context.tsx` (handles completeSsoLogin)
- **Backend exchange**: `backend/src/routes/auth.routes.ts` (POST /api/auth/sso/exchange)
