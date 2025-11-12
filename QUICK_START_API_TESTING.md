# 🚀 Quick Start - Test Spotify & Instagram APIs

## ⚡ TL;DR - Get Real Data Working in 3 Steps

### Step 1: Restart Backend
```bash
# Kill current backend process
pkill -f "node.*dist/index.js"

# Restart it
cd /Users/ryanmorrow/Documents/Projects2025/Wreckshop-social/backend
npm run dev
```

### Step 2: Test Spotify API
```bash
# Create JWT token
TOKEN=$(echo '{"userId":"user_demo_1762958414662","email":"ryan@vintaragroup.com","displayName":"Ryan"}' | base64)

# Test Spotify endpoint
curl -s -H "Authorization: Bearer $TOKEN" \
  'http://localhost:4002/api/integrations/spotify/analytics?artistId=6l3HvQ5sFLRc6mFBixwBKt' \
  | jq '.analytics.profile'
```

**Expected:** 
```json
{
  "artistId": "6l3HvQ5sFLRc6mFBixwBKt",
  "artistName": "Drake",
  "followerCount": 72500000,
  ...
}
```

### Step 3: View in Browser
```
https://wreckshop.ngrok.app/integrations/spotify
```

---

## 🎯 Artist IDs to Test

| Artist | ID |
|--------|----| 
| Drake | `6l3HvQ5sFLRc6mFBixwBKt` |
| The Weeknd | `1Xyo4u8uILmnnqZLUs1Khb` |
| Taylor Swift | `06HL4z0CvFAxyc27GXpf94` |
| Beyoncé | `4VI4S3zbubLrDA6ZiUDALQ` |
| Jay-Z | `3qm84nBvXcahRjJq5b85O2` |

---

## 📊 What's Real vs Mock

### ✅ Real Data (From Spotify API)
- Artist Name
- Follower Count
- Profile Image
- Popularity
- Genres

### 🟡 Mock Data (Generated)
- Streaming Trends
- Monthly Listeners
- Top Tracks
- Playlist Placements
- Demographics

---

## 🔗 API Endpoints

```
Spotify:
GET /api/integrations/spotify/analytics?artistId=6l3HvQ5sFLRc6mFBixwBKt

Instagram (Coming Soon):
GET /api/integrations/instagram/analytics?userId=...

Charts:
?includeCharts=true (adds mock chart data)
```

---

## ⚙️ Credentials Configured

```
Spotify:
  CLIENT_ID: 359d80a99deb496c989d77d8e20af741
  CLIENT_SECRET: (stored in .env)
  
Instagram:
  APP_ID: 1377811407203207
  APP_SECRET: (stored in .env)
```

Both configured in `/backend/.env` ✅

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Still see mock data | Restart backend (see Step 1) |
| 401 Unauthorized | Check JWT token format |
| Spotify API error | Ensure backend has internet access |
| Frontend shows nothing | Check browser console for errors |

---

## 📚 Full Documentation

- **Testing Guide**: `API_INTEGRATION_TESTING.md`
- **Status Report**: `SPOTIFY_INSTAGRAM_STATUS.md`
- **Code**: `/backend/src/services/spotify/analytics.service.ts`

---

## ✨ What Happens Next

1. ✅ Real Spotify data loads in browser
2. ⏳ Implement Instagram OAuth (in progress)
3. 📊 Add historical tracking
4. 🎯 Implement predictive analytics

---

**Last Updated**: November 12, 2025  
**Frontend URL**: https://wreckshop.ngrok.app  
**Backend URL**: http://localhost:4002
