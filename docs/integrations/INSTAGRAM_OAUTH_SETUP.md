# 📱 Instagram OAuth Integration Setup

**Status**: ✅ CONFIGURED & READY  
**App Name**: WreckShop-IG  
**App ID**: 1377811407203207  
**Redirect URI**: `http://localhost:4002/auth/instagram/callback`

---

## 🎯 Overview

This guide covers the complete Instagram OAuth 2.0 integration for WreckShop using the Instagram Graph API. The system enables:

- ✅ Business/Creator account connection
- ✅ Audience insights & analytics
- ✅ Content publishing capabilities
- ✅ Message management
- ✅ Token refresh for 60-day validity

---

## 📋 Quick Setup

### 1. Environment Configuration

Add these credentials to your `.env` file:

```bash
# Instagram OAuth Configuration
INSTAGRAM_APP_ID=1377811407203207
INSTAGRAM_APP_SECRET=6a5fb359a277be35999391a3696f53ee
INSTAGRAM_REDIRECT_URI=http://localhost:4002/auth/instagram/callback
```

### 2. Start Backend

```bash
npm run backend:dev
# Backend running on http://localhost:4002
```

### 3. Test OAuth Flow

```bash
# Initiate login
curl http://localhost:4002/auth/instagram/login

# You'll get back an authUrl that looks like:
# https://api.instagram.com/oauth/authorize?client_id=...&redirect_uri=...&scope=...&response_type=code&state=...
```

---

## 🔐 Environment Setup (Detailed)

### What Each Variable Does

| Variable | Value | Purpose |
|----------|-------|---------|
| `INSTAGRAM_APP_ID` | `1377811407203207` | Identifies your app to Instagram |
| `INSTAGRAM_APP_SECRET` | `6a5fb359a277be35...` | Authenticates token exchanges (KEEP SECRET!) |
| `INSTAGRAM_REDIRECT_URI` | `http://localhost:4002/auth/instagram/callback` | Where Instagram redirects after user approves |

### Production Configuration

For production, change redirect URI to your domain:

```bash
# Production example
INSTAGRAM_REDIRECT_URI=https://api.wreckshop.com/auth/instagram/callback
```

---

## 🚀 API Endpoints

### 1. Initiate Login
```
GET /auth/instagram/login

Response:
{
  "authUrl": "https://api.instagram.com/oauth/authorize?...",
  "redirectTo": "https://api.instagram.com/oauth/authorize?..."
}

Usage:
1. Get authUrl from endpoint
2. Redirect user to authUrl
3. User grants permissions
4. Instagram redirects to /auth/instagram/callback
```

### 2. OAuth Callback (Automatic)
```
GET /auth/instagram/callback?code=...&state=...

Response:
{
  "ok": true,
  "access_token": "IGABCDEFGHIJKLMNOPQRSTUVWXYZabcdef...",
  "user_id": "1234567890",
  "expires_in": 5183944,
  "user": {
    "id": "1234567890",
    "username": "wreckshop_official",
    "name": "WreckShop Records",
    "profile_picture_url": "https://...",
    "biography": "...",
    "website": "https://...",
    "followers_count": 50000,
    "follows_count": 1500,
    "media_count": 350
  }
}
```

### 3. Refresh Token (Every 60 days)
```
POST /auth/instagram/refresh
Content-Type: application/json

Request Body:
{
  "access_token": "IGABCDEFGHIJKLMNOPQRSTUVWXYZabcdef..."
}

Response:
{
  "ok": true,
  "access_token": "IGABCDEFGHIJKLMNOPQRSTUVWXYZabcdef...",
  "expires_in": 5183944
}
```

### 4. Validate Token
```
POST /auth/instagram/validate
Content-Type: application/json

Request Body:
{
  "access_token": "IGABCDEFGHIJKLMNOPQRSTUVWXYZabcdef..."
}

Response:
{
  "ok": true,
  "valid": true,
  "app_id": "1377811407203207",
  "user_id": "1234567890",
  "issued_at": "2025-11-10T12:00:00.000Z",
  "expires_at": "2025-12-25T12:00:00.000Z",
  "scopes": [
    "instagram_business_basic",
    "instagram_business_content_publish",
    "instagram_business_manage_messages"
  ]
}
```

---

## 🔌 Integration Points

### Frontend Component Location
```
src/components/add-integration-modal.tsx
└─ Instagram tile in social platforms list
└─ Connection flow UI
└─ Status display
```

### Backend Route Location
```
backend/src/routes/auth/instagram.oauth.ts
└─ GET /login - Start OAuth flow
└─ GET /callback - Handle redirect
└─ POST /refresh - Refresh tokens
└─ POST /validate - Check token validity
```

### Environment Configuration
```
backend/src/env.ts
└─ INSTAGRAM_APP_ID
└─ INSTAGRAM_APP_SECRET
└─ INSTAGRAM_REDIRECT_URI
```

---

## 📊 OAuth Scope Permissions

Your app has access to these scopes:

| Scope | Allows |
|-------|--------|
| `instagram_business_basic` | Read basic profile info (username, followers, media count) |
| `instagram_business_content_publish` | Publish content (posts, stories, reels) |
| `instagram_business_manage_messages` | Reply to messages and manage conversations |

### Scopes Requested
```
instagram_business_basic
instagram_business_content_publish
instagram_business_manage_messages
```

---

## 🔄 Token Lifecycle

### Initial OAuth Flow
```
1. User clicks "Connect Instagram"
2. GET /auth/instagram/login
3. Redirect to Instagram authorization page
4. User grants permissions
5. Instagram redirects to /auth/instagram/callback
6. Exchange code for short-lived token (1 hour)
7. Exchange short-lived for long-lived token (60 days)
8. Return long-lived token to frontend
9. Frontend stores token securely
```

### Token Validity
- **Short-lived**: 1 hour (used during exchange only)
- **Long-lived**: 60 days (what we store and use)
- **Refresh**: Call `/auth/instagram/refresh` before expiration

### Token Refresh Strategy
```
Before day 60:
1. POST /auth/instagram/refresh with current token
2. Get new token valid for another 60 days
3. Update stored token
4. Continue using new token

Recommended: Refresh every 50 days to maintain continuous access
```

---

## 🛠️ Testing the Integration

### Step 1: Start Backend
```bash
cd /Users/ryanmorrow/Documents/Projects2025/Wreckshop-social/backend
npm run dev
# Backend running on http://localhost:4002
```

### Step 2: Test Login Endpoint
```bash
curl -X GET http://localhost:4002/auth/instagram/login
```

Expected Response:
```json
{
  "authUrl": "https://api.instagram.com/oauth/authorize?client_id=1377811407203207&redirect_uri=http%3A%2F%2Flocalhost%3A4002%2Fauth%2Finstagram%2Fcallback&scope=instagram_business_basic%2Cinstagram_business_content_publish%2Cinstagram_business_manage_messages&response_type=code&state=abc123"
}
```

### Step 3: Visit Authorization URL
1. Copy the `authUrl` from response
2. Paste into browser
3. Log in with your Instagram business account
4. Grant permissions
5. You'll be redirected to callback URL with user data

### Step 4: Test Token Validation
```bash
curl -X POST http://localhost:4002/auth/instagram/validate \
  -H "Content-Type: application/json" \
  -d '{"access_token":"YOUR_TOKEN_HERE"}'
```

---

## 🎨 Frontend Integration

### Add Instagram to Integration Modal

The Instagram integration is already available in the integrations modal. Users can:

1. Navigate to **Settings** → **Integrations**
2. Click **Instagram** in social platforms
3. Click **"Connect"**
4. Follow OAuth flow
5. Token automatically saved

---

## 📚 Instagram Graph API Resources

### Official Documentation
- **Main Docs**: https://developers.facebook.com/docs/instagram-graph-api
- **API Reference**: https://developers.facebook.com/docs/instagram-api/reference
- **OAuth Guide**: https://developers.facebook.com/docs/instagram-api/instagram-app-roles/instagram-business-account

### Useful Endpoints (After Connection)
```
GET /me
  → Get authenticated business account info

GET /me/ig_user/{user_id}
  → Get specific business account profile

GET /me/media
  → Get business account media (posts, stories, reels)

POST /me/media
  → Publish content (images, videos, carousels)

GET /me/conversations
  → Get direct message conversations

POST /me/messages
  → Send replies to messages
```

---

## 🔒 Security Best Practices

### ✅ DO
- ✅ Store `access_token` securely (database, encrypted)
- ✅ Never expose `INSTAGRAM_APP_SECRET` in frontend code
- ✅ Use HTTPS for production redirect URI
- ✅ Validate `state` parameter to prevent CSRF attacks
- ✅ Refresh tokens before expiration
- ✅ Revoke tokens when user disconnects

### ❌ DON'T
- ❌ Store tokens in localStorage (use secure cookies)
- ❌ Commit `.env` with credentials to git
- ❌ Use HTTP in production
- ❌ Ignore token expiration
- ❌ Share API secret with frontend
- ❌ Use test tokens in production

---

## 🐛 Troubleshooting

### "Invalid OAuth Scope"
**Problem**: Scope not recognized  
**Solution**: Ensure scopes are comma-separated and match Instagram's valid scopes

### "Redirect URI Mismatch"
**Problem**: Redirect URI in request doesn't match configured URI  
**Solution**: Check that `INSTAGRAM_REDIRECT_URI` matches exactly in app settings

### "App Not Set Up"
**Problem**: App ID or Secret invalid  
**Solution**: Verify `INSTAGRAM_APP_ID` and `INSTAGRAM_APP_SECRET` in `.env`

### "Invalid Authorization Code"
**Problem**: Code already used or expired  
**Solution**: Authorization codes expire after 10 minutes, get a fresh one

### "Access Token Expired"
**Problem**: Token stopped working  
**Solution**: Call `/auth/instagram/refresh` to get new token

### "Business Account Required"
**Problem**: User connected personal account instead of business  
**Solution**: Advise user to convert to business account or create business account

---

## 📊 What Data We Capture

After OAuth connection, we capture:

```javascript
{
  user_id: "1234567890",              // Instagram business account ID
  access_token: "IGABCD...",          // API access token
  expires_in: 5183944,                // Seconds until expiration (~60 days)
  user: {
    id: "1234567890",
    username: "wreckshop_official",
    name: "WreckShop Records",
    profile_picture_url: "https://...",
    biography: "Music marketing platform...",
    website: "https://wreckshop.com",
    followers_count: 50000,
    follows_count: 1500,
    media_count: 350
  }
}
```

---

## 🎯 Next Steps

### Immediate (Week 1)
- [ ] Test OAuth flow locally
- [ ] Verify token acquisition
- [ ] Test token validation
- [ ] Document in team wiki

### Short Term (Week 2-3)
- [ ] Build audience insights dashboard
- [ ] Implement content publish endpoint
- [ ] Add media analytics
- [ ] Create channel-switching UI

### Medium Term (Week 4+)
- [ ] Automated content distribution
- [ ] Campaign scheduling
- [ ] Analytics sync to dashboard
- [ ] Influencer discovery

---

## 📞 Support

### API Issues
- Check https://developers.facebook.com/community/
- Review API response error messages
- Check rate limiting (200 calls/hour limit)

### Integration Issues
- Verify `.env` configuration
- Check backend logs for errors
- Ensure MongoDB connection for token storage
- Verify CORS settings

### User Issues
- Guide through Instagram business account setup
- Explain permission requirements
- Help with account verification

---

## ✅ Checklist

- [x] Instagram app created (WreckShop-IG)
- [x] OAuth routes implemented
- [x] Environment configuration setup
- [x] Token refresh mechanism
- [x] Error handling
- [x] Frontend integration ready
- [ ] Production redirect URI configured
- [ ] Team trained on flow
- [ ] Monitoring alerts set up
- [ ] Documentation complete

---

**Last Updated**: November 10, 2025  
**Version**: 1.0  
**Status**: ✅ Ready for Testing

