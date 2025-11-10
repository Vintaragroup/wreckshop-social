# 🚀 Instagram Integration - Quick Reference

## Your Credentials

```
App Name:    WreckShop-IG
App ID:      1377811407203207
App Secret:  6a5fb359a277be35999391a3696f53ee
Redirect:    http://localhost:4002/auth/instagram/callback
```

## Immediate Setup (5 minutes)

### 1. Copy Credentials to .env
```bash
# backend/.env
INSTAGRAM_APP_ID=1377811407203207
INSTAGRAM_APP_SECRET=6a5fb359a277be35999391a3696f53ee
INSTAGRAM_REDIRECT_URI=http://localhost:4002/auth/instagram/callback
```

### 2. Start Backend
```bash
cd backend
npm run dev
# Listen for http://localhost:4002
```

### 3. Test Connection
```bash
curl http://localhost:4002/auth/instagram/login
```

## Key Files

| File | Purpose |
|------|---------|
| `backend/src/routes/auth/instagram.oauth.ts` | OAuth endpoints |
| `backend/src/env.ts` | Configuration |
| `backend/.env` | Your credentials |
| `INSTAGRAM_OAUTH_SETUP.md` | Full documentation |

## API Endpoints

```
GET  /auth/instagram/login          → Start OAuth
GET  /auth/instagram/callback       → Receive code (automatic)
POST /auth/instagram/refresh        → Refresh token
POST /auth/instagram/validate       → Check token validity
```

## Scopes Granted

✅ `instagram_business_basic` - Read profile info  
✅ `instagram_business_content_publish` - Post content  
✅ `instagram_business_manage_messages` - Message management

## Token Info

- **Valid for**: 60 days
- **Refresh before**: Day 50 (auto-renewal)
- **Endpoint**: `POST /auth/instagram/refresh`

## Testing Checklist

- [ ] Backend running on 4002
- [ ] OAuth login endpoint responds
- [ ] Can reach Instagram authorization URL
- [ ] Token received after OAuth
- [ ] Token validation works
- [ ] User data captured

## Production Checklist

- [ ] Update `INSTAGRAM_REDIRECT_URI` to production domain
- [ ] Store tokens in secure database
- [ ] Add token refresh automation (cron job)
- [ ] Enable HTTPS
- [ ] Set up monitoring/alerts
- [ ] Document user setup flow

## Common Issues

| Issue | Fix |
|-------|-----|
| "App not configured" | Check .env has all 3 vars |
| "Redirect URI mismatch" | Match exactly in .env |
| "Invalid scope" | Check comma-separated scopes |
| "Token expired" | Call `/refresh` endpoint |

## Next: What To Build

1. **Dashboard Integration**
   - Store Instagram tokens in database
   - Display connected accounts
   - Show follower metrics

2. **Content Publishing**
   - Use `/me/media` endpoint
   - Schedule posts
   - Track performance

3. **Audience Insights**
   - Fetch follower demographics
   - Track engagement
   - Identify trends

4. **Campaign Integration**
   - Target Instagram audiences
   - Cross-promote content
   - Measure ROI

## Need Help?

📖 **Full Docs**: See `INSTAGRAM_OAUTH_SETUP.md`  
🔗 **Instagram API**: https://developers.facebook.com/docs/instagram-api/  
🐛 **Issues**: Check backend logs with `npm run backend:dev`

---

**Setup Time**: ~5 minutes  
**Status**: ✅ Ready to use  
**Last Updated**: November 10, 2025
