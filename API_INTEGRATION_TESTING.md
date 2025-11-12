# API Integration Testing Guide

## Overview

This guide shows how to test the Spotify and Instagram API integrations with real credentials.

## Spotify API Integration

### ✅ Current Status
- **Backend**: Spotify client credentials flow implemented
- **Service**: `/backend/src/services/spotify/analytics.service.ts` - Real API calls using `getClientCredentialsToken()`
- **Routes**: `/backend/src/routes/integrations/spotify-analytics.routes.ts` - Analytics endpoints
- **Frontend**: `/src/pages/integrations/spotify.tsx` - Charts and metrics display

### 🔑 Credentials Configured
```
SPOTIFY_CLIENT_ID=359d80a99deb496c989d77d8e20af741
SPOTIFY_CLIENT_SECRET=0a440f76465a4af89604cb66ae89e68e
SPOTIFY_REDIRECT_URI=https://wreckshop-webhooks.ngrok.io/auth/spotify/callback
```

### 🧪 Test the Spotify API Endpoint

**1. Test with Drake (Real Artist)**
```bash
TOKEN=$(echo '{"userId":"user_demo_1762958414662","email":"ryan@vintaragroup.com","displayName":"Ryan"}' | base64)

curl -s -H "Authorization: Bearer $TOKEN" \
  'http://localhost:4002/api/integrations/spotify/analytics?artistId=6l3HvQ5sFLRc6mFBixwBKt' \
  | jq '.analytics.profile'
```

**Expected Response:**
```json
{
  "artistId": "6l3HvQ5sFLRc6mFBixwBKt",
  "artistName": "Drake",
  "profileImageUrl": "https://platform.spotify.com/...",
  "isVerified": true,
  "followerCount": 72500000,
  "monthlyListeners": 0,
  "externalUrl": "https://open.spotify.com/artist/6l3HvQ5sFLRc6mFBixwBKt"
}
```

**2. Test with The Weeknd**
```bash
TOKEN=$(echo '{"userId":"user_demo_1762958414662","email":"ryan@vintaragroup.com","displayName":"Ryan"}' | base64)

curl -s -H "Authorization: Bearer $TOKEN" \
  'http://localhost:4002/api/integrations/spotify/analytics?artistId=1Xyo4u8uILmnnqZLUs1Khb' \
  | jq '.analytics.profile'
```

**3. Test with Charts Data**
```bash
TOKEN=$(echo '{"userId":"user_demo_1762958414662","email":"ryan@vintaragroup.com","displayName":"Ryan"}' | base64)

curl -s -H "Authorization: Bearer $TOKEN" \
  'http://localhost:4002/api/integrations/spotify/analytics?artistId=6l3HvQ5sFLRc6mFBixwBKt&includeCharts=true' \
  | jq '.charts'
```

### 📱 Real Data Available from Spotify
- ✅ Artist Name
- ✅ Follower Count
- ✅ Profile Image
- ✅ External URL
- ✅ Genres
- ✅ Popularity Score

### ❌ Data NOT Available via Public API
- ❌ Monthly Listeners (Private API only)
- ❌ Monthly Streams (Private API only)
- ❌ Save/Skip Rates (Private API only)
- ❌ Playlist Placements (Private API only)

These would require:
- Spotify for Artists Dashboard access
- Private API endpoints (not publicly documented)
- User authentication + permission scopes

---

## Instagram API Integration

### ✅ Current Status
- **Backend**: Instagram Graph API infrastructure ready
- **Service**: `/backend/src/services/instagram/analytics.service.ts` - Currently using mock data
- **Routes**: `/backend/src/routes/integrations/instagram-analytics.routes.ts` - 8 analytics endpoints
- **Frontend**: `/src/pages/integrations/instagram.tsx` - Charts and metrics display

### 🔑 Credentials Configured
```
INSTAGRAM_APP_ID=1377811407203207
INSTAGRAM_APP_SECRET=6a5fb359a277be35999391a3696f53ee
INSTAGRAM_REDIRECT_URI=http://localhost:4002/auth/instagram/callback
```

### 🧪 Testing Instagram Integration

**Step 1: User Authentication Flow**
```bash
# 1. User clicks "Connect Instagram"
# 2. Redirected to Instagram OAuth:
https://api.instagram.com/oauth/authorize?client_id=1377811407203207&redirect_uri=http://localhost:4002/auth/instagram/callback&scope=user_profile,user_media&response_type=code

# 3. User authorizes app
# 4. Instagram redirects with code: http://localhost:4002/auth/instagram/callback?code=...&user_id=...

# 5. Backend exchanges code for token
# 6. Token stored in database (SpotifyIntegration table)
```

**Step 2: Fetch Analytics**
```bash
TOKEN=$(echo '{"userId":"user_demo_1762958414662","email":"ryan@vintaragroup.com","displayName":"Ryan"}' | base64)

curl -s -H "Authorization: Bearer $TOKEN" \
  'http://localhost:4002/api/integrations/instagram/analytics' \
  | jq '.analytics.profile'
```

### 📱 Real Data Available from Instagram Graph API
With proper user token:
- ✅ User Profile Data
- ✅ Account Followers
- ✅ Media List
- ✅ Media Insights (likes, comments, shares)
- ✅ Hashtag Search
- ✅ Audience Demographics (Business Accounts)

### ⚠️ Limitations
- Business Account required for detailed metrics
- Requires user's explicit permission
- Data is limited by Instagram's Graph API access levels

---

## Implementation Roadmap

### Phase 1: Real Token Storage ✅ READY
- [ ] Create migration to add `accessToken`, `refreshToken` to SpotifyIntegration & InstagramIntegration tables
- [ ] Encrypt tokens before storing in database
- [ ] Add token refresh logic for expired tokens

### Phase 2: User Authentication Flow ✅ READY  
- [ ] Update frontend to handle OAuth redirects
- [ ] Save received tokens to database after user auth
- [ ] Implement token validation and refresh

### Phase 3: Real API Data ⏳ IN PROGRESS
- [x] Spotify: Client credentials flow implemented
- [ ] Spotify: User authentication flow (for detailed metrics)
- [ ] Instagram: User authentication flow
- [ ] Instagram: Real data fetching

### Phase 4: Advanced Analytics 📅 FUTURE
- [ ] Historical data tracking
- [ ] Trend analysis
- [ ] Anomaly detection
- [ ] Predictive insights

---

## Testing Checklist

### Spotify Tests
- [ ] Fetch profile data for well-known artists
- [ ] Verify follower counts update correctly
- [ ] Test error handling for invalid artist IDs
- [ ] Confirm charts display generated data
- [ ] Test with ngrok frontend access

### Instagram Tests
- [ ] Test Instagram OAuth redirect
- [ ] Verify token storage in database
- [ ] Fetch real profile data
- [ ] Display media insights
- [ ] Test account disconnection

### Integration Tests
- [ ] Multiple platform connections per user
- [ ] Token refresh on expiration
- [ ] Error recovery and fallbacks
- [ ] Rate limit handling
- [ ] Database transaction integrity

---

## Common Issues & Solutions

### Issue: "No token provided" from Spotify
**Solution**: Ensure `getClientCredentialsToken()` is being called and returns valid token.

```bash
# Test client credentials directly
curl -X POST https://accounts.spotify.com/api/token \
  -H "Authorization: Basic $(echo -n 'CLIENT_ID:CLIENT_SECRET' | base64)" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials"
```

### Issue: Instagram returns "Invalid OAuth code"
**Solution**: Ensure redirect URI exactly matches configured URI in Instagram App Settings.

### Issue: 401 Unauthorized from frontend
**Solution**: JWT token format should be:
```json
{
  "userId": "user_demo_1762958414662",
  "email": "user@example.com",
  "displayName": "User Name"
}
```

Then base64 encode it:
```bash
TOKEN=$(echo '{"userId":"...","email":"...","displayName":"..."}' | base64)
curl -H "Authorization: Bearer $TOKEN" http://localhost:4002/api/...
```

---

## API Endpoints Reference

### Spotify Analytics
```
GET  /api/integrations/spotify/analytics              - Main profile & metrics
GET  /api/integrations/spotify/analytics/trends       - Streaming trends
GET  /api/integrations/spotify/analytics/monthly-listeners - Monthly listener progression
GET  /api/integrations/spotify/analytics/top-tracks   - Top tracks by streams
GET  /api/integrations/spotify/analytics/demographics - Listener demographics
```

### Instagram Analytics
```
GET  /api/integrations/instagram/analytics            - Main profile & metrics
GET  /api/integrations/instagram/analytics/follower-growth  - Follower trends
GET  /api/integrations/instagram/analytics/engagement  - Engagement metrics
GET  /api/integrations/instagram/analytics/top-posts  - Top performing posts
GET  /api/integrations/instagram/analytics/hashtags   - Hashtag performance
GET  /api/integrations/instagram/analytics/reach      - Reach & impressions
GET  /api/integrations/instagram/analytics/stories    - Story performance
GET  /api/integrations/instagram/analytics/demographics - Audience demographics
```

### Account Management
```
POST   /api/integrations/spotify           - Save Spotify credentials
GET    /api/integrations/spotify/:artistId - Get Spotify connection status
DELETE /api/integrations/spotify/:artistId - Disconnect Spotify
POST   /api/integrations/instagram         - Save Instagram credentials
GET    /api/integrations/instagram/:artistId - Get Instagram connection status
DELETE /api/integrations/instagram/:artistId - Disconnect Instagram
```

---

## Next Steps

1. **Test Spotify API** with the provided endpoints
2. **Implement Instagram OAuth** flow in frontend
3. **Add token encryption** for secure storage
4. **Set up token refresh** logic
5. **Test with real user accounts**
6. **Deploy to production** with proper secret management

---

## Resources

- [Spotify Web API Docs](https://developer.spotify.com/documentation/web-api)
- [Instagram Graph API Docs](https://developers.facebook.com/docs/instagram-api)
- [OAuth 2.0 Flow](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2)
- [JWT Token Format](https://jwt.io/)
