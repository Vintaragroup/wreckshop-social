# Spotify OAuth Integration Setup Guide

## Overview

Your Spotify OAuth integration is now fully wired up! This guide explains how the system works and how users can connect their Spotify accounts to enrich audience profiles with real-time data.

## Architecture

### Components

1. **Backend** (`backend/src/`)
   - `env.ts` - Environment variable validation with Zod
   - `providers/spotify.oauth.ts` - Handles OAuth code-to-token exchange
   - `providers/spotify.provider.ts` - Spotify API provider for fetching user data
   - `routes/auth/spotify.routes.ts` - OAuth callback endpoint

2. **Frontend** (`src/`)
   - `components/spotify-oauth.tsx` - React OAuth component with Connect button
   - `pages/auth/spotify-callback.tsx` - OAuth callback handler page
   - `router.tsx` - Route registration for callback page
   - `components/integrations.tsx` - Integration card display

3. **Docker** (`docker-compose.yml`)
   - Backend environment configured with real Spotify credentials
   - Frontend environment includes `VITE_BACKEND_URL` for callback handling

## How It Works

### User Flow

```
1. User clicks "Connect Spotify" button on Integrations page
   ↓
2. Browser redirects to Spotify login: https://accounts.spotify.com/authorize?...
   ↓
3. User logs in and grants permissions
   ↓
4. Spotify redirects back to: http://localhost:5176/auth/spotify/callback?code=XXX&state=YYY
   ↓
5. Frontend callback page exchanges code with backend for access token
   ↓
6. Backend calls Spotify API to get user profile
   ↓
7. Token stored securely in session storage
   ↓
8. User returned to Integrations page with "Connected" status
```

### Requested Scopes

The integration requests these Spotify scopes:

- `user-read-private` - Read user's profile info
- `user-read-email` - Read user's email address
- `user-top-read` - Read user's top artists and tracks
- `playlist-read-private` - Read user's private playlists
- `user-follow-read` - Read user's followed artists

These scopes allow the system to:
- Display user profile data (name, email, avatar)
- Fetch top artists and tracks for taste analysis
- Access private playlists
- See followed artists

## Configuration

### Environment Variables

**Backend** (set in `docker-compose.yml`):
```env
SPOTIFY_CLIENT_ID=359d80a99deb496c989d77d8e20af741
SPOTIFY_CLIENT_SECRET=0a440f76465a4af89604cb66ae89e68e
SPOTIFY_REDIRECT_URI=http://localhost:4002/auth/spotify/callback
```

**Frontend** (set in `docker-compose.yml`):
```env
VITE_BACKEND_URL=http://localhost:4002
```

### Registering Your App with Spotify

To use this integration, your Spotify API credentials must be registered:

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new application
3. Accept the terms and create the app
4. Copy your **Client ID** and **Client Secret**
5. Add Redirect URI: `http://localhost:4002/auth/spotify/callback`
6. Update `docker-compose.yml` with your credentials
7. Restart the backend container

## API Endpoints

### OAuth Callback
```
GET /auth/spotify/callback?code=XXX&state=YYY
Response: { ok: true, tokens: { access_token, refresh_token, expires_in } }
```

Handles the OAuth code exchange for an access token.

## Security Notes

- ✅ Credentials stored as environment variables (not hardcoded)
- ✅ Access tokens stored in session storage (cleared on browser close)
- ✅ Refresh tokens available but not persisted by default
- ✅ Backend validates all incoming requests
- ✅ CORS properly configured for frontend origin
- ⚠️ For production: Store tokens in secure httpOnly cookies
- ⚠️ For production: Implement token refresh logic before expiration

## Testing the Integration

### Test via UI

1. Open http://localhost:5176/integrations
2. Scroll to Spotify card
3. Click "Connect Spotify"
4. You'll be redirected to Spotify login
5. Authorize the app
6. Return to app (should show "Connected as [Your Name]")

### Test via API

```bash
# Test the callback endpoint (with invalid code - will fail gracefully)
curl http://localhost:4002/auth/spotify/callback?code=invalid_code

# Response:
# {"ok":false,"error":"spotify token exchange failed: 400 Bad Request ..."}

# This confirms the endpoint is working and your credentials are loaded!
```

### Fetch Spotify Profile Data

Once connected, the backend can fetch user data:

```typescript
import { spotifyProvider } from './providers/spotify.provider'

// Fetch user's top artists and tracks
const taste = await spotifyProvider.fetchTaste(identity, { 
  accessToken: userToken 
})

// Fetch user profile details (name, avatar, followers, following)
const profile = await spotifyProvider.fetchProfileDetails(identity, { 
  accessToken: userToken 
})
```

## Next Steps

1. **Store Refresh Tokens** - Persist refresh tokens to maintain long-term access
2. **Token Refresh Logic** - Automatically refresh tokens before expiration
3. **Automatic Profile Enrichment** - Run enrichment job when user connects
4. **Additional Scopes** - Request more scopes if needed (e.g., playback control)
5. **Error Handling UI** - Show user-friendly error messages during OAuth flow

## Troubleshooting

### "Invalid redirect_uri" error
- Verify `SPOTIFY_REDIRECT_URI` matches your registered app exactly
- Redirect URI must be exactly: `http://localhost:4002/auth/spotify/callback`

### Token exchange fails with 400 Bad Request
- Check that `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` are correct
- Verify the authorization code hasn't expired (codes expire after ~10 minutes)

### "Access token invalid" error when fetching profile
- Token may have expired - implement token refresh logic
- Or user may have revoked access - ask them to reconnect

### Button not appearing on Integrations page
- Check browser console for errors
- Verify `spotify-oauth.tsx` component is imported in `integrations.tsx`
- Ensure frontend rebuilt after code changes

## File Structure

```
backend/
├── .env                                  # Environment variables (local dev)
├── src/
│   ├── env.ts                           # Zod schema for env vars
│   ├── providers/
│   │   ├── spotify.oauth.ts             # OAuth code exchange
│   │   └── spotify.provider.ts          # Profile/taste fetcher
│   └── routes/auth/
│       └── spotify.routes.ts            # Callback endpoint

src/
├── components/
│   ├── spotify-oauth.tsx                # OAuth component & integration card
│   └── integrations.tsx                 # Integrations page
├── pages/auth/
│   └── spotify-callback.tsx             # Callback handler page
└── router.tsx                           # Route registration

docker-compose.yml                       # Environment configuration
```

## Production Deployment

For production, consider:

1. Use secure token storage (httpOnly cookies, localStorage with encryption)
2. Implement token refresh before expiration
3. Store refresh tokens in database, linked to user accounts
4. Add request signing/verification to prevent tampering
5. Implement rate limiting on auth endpoints
6. Monitor token usage and implement alerts
7. Regularly rotate Client Secret
8. Use HTTPS for all OAuth flows
9. Implement PKCE (Proof Key for Code Exchange) for additional security

## Support

- [Spotify Web API Documentation](https://developer.spotify.com/documentation/web-api)
- [Spotify OAuth Authorization Guide](https://developer.spotify.com/documentation/general/guides/authorization/)
- [React Router Documentation](https://reactrouter.com)
