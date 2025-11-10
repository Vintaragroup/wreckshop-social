# Spotify OAuth - Quick Reference

## What's Wired Up ✅

- ✅ Spotify Developer credentials configured (Client ID & Secret)
- ✅ Backend OAuth callback endpoint (`/auth/spotify/callback`)
- ✅ Frontend OAuth component with "Connect Spotify" button
- ✅ Callback handler page with token exchange
- ✅ Integration card in Integrations page
- ✅ Router configured with callback route
- ✅ Docker environment variables set
- ✅ Backend started with real credentials

## How to Use

### For End Users

1. Navigate to http://localhost:5176/integrations
2. Find the Spotify card (green Spotify logo)
3. Click "Connect with Spotify"
4. Login to Spotify
5. Grant permissions
6. Return to app - should show "Connected as [Your Name]"

### For Developers

#### Test OAuth Endpoint
```bash
# Verify endpoint is working (will reject invalid code - that's correct)
curl http://localhost:4002/auth/spotify/callback?code=test

# Response should show 'error': 'spotify token exchange failed'
# This means credentials are loaded and endpoint is ready!
```

#### Get Access Token Programmatically
```typescript
// In your code, after user connects:
const accessToken = sessionStorage.getItem('spotify_access_token')
const refreshToken = sessionStorage.getItem('spotify_refresh_token')

// Use token to fetch profile data
const response = await fetch('https://api.spotify.com/v1/me', {
  headers: { Authorization: `Bearer ${accessToken}` }
})
const profile = await response.json()
console.log(profile.display_name) // User's display name
```

#### Fetch User's Top Artists
```typescript
const token = sessionStorage.getItem('spotify_access_token')
const response = await fetch('https://api.spotify.com/v1/me/top/artists?limit=20', {
  headers: { Authorization: `Bearer ${token}` }
})
const artists = await response.json()
```

## Files Changed

### Backend
- `backend/.env` - Credentials stored locally
- `docker-compose.yml` - Credentials in backend service config

### Frontend
- `src/components/spotify-oauth.tsx` - NEW: OAuth component
- `src/pages/auth/spotify-callback.tsx` - NEW: Callback handler
- `src/router.tsx` - Added callback route
- `src/components/integrations.tsx` - Integrated OAuth component

### Configuration
- `docker-compose.yml` - Updated with real credentials
- `backend/src/env.ts` - Already had Spotify env vars
- `backend/src/providers/spotify.oauth.ts` - Already implemented
- `backend/src/providers/spotify.provider.ts` - Already implemented

## Environment Variables

**Your Real Credentials** (already configured):
```
SPOTIFY_CLIENT_ID=359d80a99deb496c989d77d8e20af741
SPOTIFY_CLIENT_SECRET=0a440f76465a4af89604cb66ae89e68e
SPOTIFY_REDIRECT_URI=http://localhost:4002/auth/spotify/callback
CORS_ORIGIN=http://localhost:5176
```

## What Happens Behind the Scenes

```
User clicks "Connect Spotify"
  ↓
Frontend redirects to Spotify authorization URL
  with: client_id, redirect_uri, scopes requested
  ↓
User logs in and grants permissions
  ↓
Spotify redirects back: localhost:5176/auth/spotify/callback?code=XXX
  ↓
Frontend callback page captures authorization code
  ↓
Frontend calls backend: localhost:4002/auth/spotify/callback?code=XXX
  ↓
Backend exchanges code + secret for access token
  Backend calls: https://accounts.spotify.com/api/token
  With basic auth using Client ID & Secret
  ↓
Backend returns: { access_token, refresh_token, expires_in }
  ↓
Frontend stores access token in sessionStorage
  ↓
Frontend fetches user profile from Spotify API
  To confirm connection worked
  ↓
Shows "Connected as [User Name]" on UI
```

## Scopes Requested

- `user-read-private` - Profile info
- `user-read-email` - Email address
- `user-top-read` - Top artists & tracks
- `playlist-read-private` - Private playlists
- `user-follow-read` - Followed artists

## Common Tasks

### Check if Connection Works
```bash
# From browser console after connecting:
const token = sessionStorage.getItem('spotify_access_token')
console.log(token) // Should show access token string

# If empty, connection failed
```

### Test with cURL
```bash
# Get a real auth code by connecting through UI first,
# then copy from browser console:
const authCode = new URLSearchParams(window.location.search).get('code')
console.log(authCode)

# Then test token exchange:
curl -X POST "https://accounts.spotify.com/api/token" \
  -H "Authorization: Basic $(echo -n 'CLIENT_ID:CLIENT_SECRET' | base64)" \
  -d "grant_type=authorization_code&code=$authCode&redirect_uri=http://localhost:4002/auth/spotify/callback"
```

### Disconnect
```typescript
// Programmatically
sessionStorage.removeItem('spotify_access_token')
sessionStorage.removeItem('spotify_refresh_token')

// Or via UI: Click "Disconnect Spotify" button
```

## Docker Commands

```bash
# Check backend credentials are loaded
docker exec wreckshop-backend-dev env | grep SPOTIFY

# Watch backend logs
docker logs -f wreckshop-backend-dev

# Restart backend if you change credentials
docker restart wreckshop-backend-dev

# Check health
curl http://localhost:4002/health
```

## Debugging Checklist

- [ ] Backend service running? `curl http://localhost:4002/health`
- [ ] Frontend service running? `curl http://localhost:5176`
- [ ] Spotify credentials in docker-compose.yml? `grep SPOTIFY docker-compose.yml`
- [ ] Backend restarted after credential update? `docker restart wreckshop-backend-dev`
- [ ] Button visible on Integrations page? Check browser console
- [ ] Spotify app configured with correct redirect URI? Check Developer Dashboard
- [ ] Using http://localhost (not 127.0.0.1)? Spotify doesn't recognize IP

## Production Checklist

Before deploying to production:

- [ ] Move credentials to secure secrets management
- [ ] Implement token refresh logic
- [ ] Store tokens in httpOnly secure cookies
- [ ] Persist refresh tokens to database
- [ ] Implement PKCE for browser OAuth flows
- [ ] Add request rate limiting
- [ ] Monitor token exchange failures
- [ ] Implement token rotation
- [ ] Add audit logging for auth events
- [ ] Use HTTPS for all OAuth flows
