# Stack Auth Blank Page Resolution

Date: 2025-11-11
Status: Fix applied – awaiting verification

## Root Cause
The login and signup routes rendered a completely blank page because the Stack Auth client initialization (`src/stack/client.ts`) threw an error at import time when required environment variables were missing. In the repository there was only an example file `.env.local.example`; no actual `.env.local` existed. The thrown error prevented React from mounting and resulted in a blank UI with no in-app fallback.

Additional mismatches vs. official docs:
- `baseUrl` pointed to the frontend origin (`http://localhost:5176`) instead of the Stack Auth API host (should be `https://api.stack-auth.com` unless self-hosting).
- Missing `VITE_STACK_API_URL` environment variable.
- Not specifying `tokenStore: 'cookie'` (the docs example uses cookie storage for browser apps).
- Missing `urls.oauthCallback` configuration required for OAuth flows.

## Changes Implemented
1. Updated `src/stack/client.ts`:
   - Added safe initialization that no longer throws on missing env vars; logs a console error instead (`STACK_ENV_OK` flag exported).
   - Uses `VITE_STACK_API_URL` (defaults to `https://api.stack-auth.com`).
   - Added `tokenStore: 'cookie'` and `urls.oauthCallback` per example pages doc.
   - Removed non-existent properties (`createdAt`, `lastSignInAt`) from returned user object to satisfy TypeScript.
2. Added `.env.local` (root) with placeholder variables the app needs.
3. Added visible fallback UI to `login-stack.tsx` and `signup-stack.tsx` when `STACK_ENV_OK` is false so users see configuration instructions instead of a white screen.

## Required Follow-Up (You)
Edit the new `.env.local` file and replace placeholders:
```
VITE_STACK_PROJECT_ID=<your_project_id>
VITE_STACK_CLIENT_KEY=pck_<your_publishable_client_key>
VITE_STACK_API_URL=https://api.stack-auth.com
```
Then restart the frontend:
```
docker restart wreckshop-frontend
# or if running locally:
npm run dev
```
After restart visit:
- http://localhost:5176/login
- http://localhost:5176/signup
You should now see the full Stack Auth pages (or the fallback disappears if vars are correct).

## Verification Steps
1. Open browser devtools console – ensure no import-time fatal errors from `stack/client.ts`.
2. Confirm network calls go to `https://api.stack-auth.com` instead of the frontend origin for auth endpoints.
3. Attempt a signup; observe webhook triggered on backend (see logs) and Artist record creation.
4. Test OAuth (Google/Spotify) – verify redirect path lands on `/oauth`.

## Rollback Instructions
If needed, you can revert to previous behavior by:
- Removing the fallback UI blocks in `login-stack.tsx` and `signup-stack.tsx`.
- Restoring the previous throw in `stack/client.ts` (not recommended – causes blank page again if misconfigured).

## Next Considerations
- Add runtime health check component that surfaces Stack connectivity status.
- Implement a custom sign-in page layout using primitives (`CredentialSignIn`, `OAuthGroup`) after baseline verification.
- Document backend/server key usage in a parallel server-side file (`stack/server.ts`) if adopting server helpers.

---
Context references used: Stackauth Example Pages, Sign-In Page Examples, Sign-Up Page Examples.
