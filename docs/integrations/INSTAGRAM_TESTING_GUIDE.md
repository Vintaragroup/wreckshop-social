# Testing the Instagram Integration

## Quick Test Checklist

### ✅ Backend Setup
- [x] OAuth routes created (`backend/src/routes/auth/instagram.oauth.ts`)
- [x] Integrations API created (`backend/src/routes/integrations.routes.ts`)
- [x] Database model created (`backend/src/models/instagram-connection.ts`)
- [x] Routes registered in `backend/src/index.ts`
- [x] Environment variables in `backend/.env`

### ✅ Frontend Setup
- [x] Instagram connection component created
- [x] Callback handler component created
- [x] Integrations page updated to show real Instagram
- [x] Router configured with callback route
- [x] App.tsx cleaned up

---

## Manual Testing Steps

### Step 1: Verify Backend is Running
```bash
curl http://localhost:4002/health
# Expected: {"ok":true}
```

### Step 2: Test Instagram Login Endpoint
```bash
curl http://localhost:4002/auth/instagram/login
# Expected: {"authUrl": "https://api.instagram.com/oauth/authorize?...", "redirectTo": "..."}
```

### Step 3: Check Integrations API (Empty)
```bash
curl 'http://localhost:4002/api/integrations?userId=test-user-123'
# Expected: 
# {
#   "ok": true,
#   "integrations": {
#     "instagram": {
#       "status": "disconnected",
#       "connectedAccount": null,
#       "lastSync": null
#     }
#   }
# }
```

### Step 4: Frontend - Navigate to Integrations
1. Open browser to `http://localhost:5176`
2. Click "Integrations" in sidebar
3. **Should see Instagram card in "Social Media Platforms" section**

### Step 5: Frontend - See Disconnected State
- Instagram card should show:
  - ❌ Status: "Disconnected" badge
  - Button: "Connect Instagram"
  - Description: "Connect your business account"
  - Features list: Read insights, Access metrics, etc.

### Step 6: Click Connect (Real OAuth Flow)
1. Click "Connect Instagram" button
2. Browser redirects to Instagram login
3. Log in with your test Instagram account
4. Grant permissions (you'll see the 3 scopes)
5. Redirected back to callback page
6. Should show "Connecting Instagram..." then "Success!"
7. Auto-redirects to integrations page

### Step 7: See Connected State
- Instagram card should now show:
  - ✅ Status: "Connected" badge
  - Profile picture
  - Your actual username
  - Real follower count
  - Connection date
  - Token expiration date
  - "Disconnect Instagram" button

### Step 8: Verify Database
```bash
# Check MongoDB
db.instagramconnections.findOne()
# Should see your connection with:
# - userId
# - instagramUserId
# - profile data
# - token info
```

### Step 9: Refresh Page
1. Close and reopen integrations page
2. Should still show "Connected" (proving data persists)
3. Shows your real profile info

### Step 10: Test Disconnect
1. Click "Disconnect Instagram" button
2. Should show "Disconnecting..." 
3. Card reverts to "Disconnected" state
4. Database shows `isActive: false`

---

## API Testing with curl

### Test 1: Check Disconnected State
```bash
curl 'http://localhost:4002/api/integrations?userId=ryan' | jq .
```

Expected Response:
```json
{
  "ok": true,
  "integrations": {
    "instagram": {
      "status": "disconnected",
      "connectedAccount": null,
      "lastSync": null
    }
  }
}
```

### Test 2: Get Specific Connection
```bash
curl 'http://localhost:4002/api/integrations/instagram/ryan' 
```

Expected if not connected:
```json
{
  "ok": false,
  "error": "No active Instagram connection found"
}
```

### Test 3: Check Connection After OAuth
```bash
curl 'http://localhost:4002/api/integrations/instagram/ryan' | jq .
```

Expected if connected:
```json
{
  "ok": true,
  "connection": {
    "id": "507f...",
    "username": "wreckshoprecords",
    "name": "Wreck Shop Records",
    "followers": 15420,
    "connectedAt": "2025-11-10T15:30:00.000Z",
    "lastSync": "2025-11-10T15:30:00.000Z",
    "expiresAt": "2026-01-09T15:30:00.000Z",
    "needsRefresh": false
  }
}
```

### Test 4: Delete Connection
```bash
curl -X DELETE 'http://localhost:4002/api/integrations/instagram/ryan'
```

Expected:
```json
{
  "ok": true,
  "message": "Instagram disconnected successfully"
}
```

---

## Troubleshooting

### Issue: "Instagram OAuth not configured"
**Solution:** Check `.env` file has these three variables:
```bash
INSTAGRAM_APP_ID=1377811407203207
INSTAGRAM_APP_SECRET=6a5fb359a277be35999391a3696f53ee
INSTAGRAM_REDIRECT_URI=http://localhost:4002/auth/instagram/callback
```

Restart backend after adding:
```bash
docker restart wreckshop-backend-dev
```

### Issue: "Cannot POST /api/integrations/instagram/callback"
**Solution:** 
1. Check route is registered in `backend/src/index.ts`
2. Verify import: `import { integrations } from './routes/integrations.routes'`
3. Verify route mount: `app.use('/api', integrations)`
4. Restart backend container

### Issue: Instagram card still shows placeholder data
**Solution:**
1. Clear browser cache (Cmd+Shift+R)
2. Verify frontend compiled with no errors
3. Check browser console for API errors
4. Verify `InstagramConnectionCard` component is imported in integrations.tsx

### Issue: OAuth redirect goes to Instagram but doesn't come back
**Solution:**
1. Check `INSTAGRAM_REDIRECT_URI` matches Instagram app settings
2. Verify it's exactly: `http://localhost:4002/auth/instagram/callback`
3. Check Instagram app settings at: https://developers.facebook.com/apps/

### Issue: "No active Instagram connection found" in API
**Solution:**
1. Connection hasn't been made yet (expected)
2. After OAuth flow, make sure callback handler completed
3. Check database: `db.instagramconnections.find().pretty()`

---

## Success Indicators ✅

You'll know it's working when:

1. ✅ Instagram card appears in Integrations page
2. ✅ Shows "Disconnected" initially
3. ✅ "Connect Instagram" button is clickable
4. ✅ Clicking button opens Instagram login
5. ✅ After granting permissions, shows profile data
6. ✅ Refreshing page keeps connection (database proof)
7. ✅ API endpoints return real data
8. ✅ Database stores connection

---

## Load Testing

### Test with Different Users
```bash
# User 1
curl 'http://localhost:4002/api/integrations?userId=user-alice'

# User 2
curl 'http://localhost:4002/api/integrations?userId=user-bob'

# They should be isolated
```

### Test Token Expiration
```bash
# Check token expiry dates
db.instagramconnections.find({}, { username: 1, tokenExpiresAt: 1 })

# Should show dates 60 days from connection
```

---

## Performance Tests

### API Response Time
```bash
time curl 'http://localhost:4002/api/integrations?userId=test'
# Should be <100ms
```

### Database Query
```bash
# Test database index
db.instagramconnections.find({userId: "test"}).explain("executionStats")
# Should show index usage
```

---

## Integration with Other Systems

### Check Spotify Still Works
```bash
# Spotify component should still work on same page
curl http://localhost:4002/auth/spotify/login
```

### Multiple Integrations
- Instagram: ✅ Real OAuth
- Spotify: ✅ Real OAuth (existing)
- Other platforms: Ready to add

---

## Next Manual Tests

### After Implementation:

1. [ ] Test with real Instagram Business Account
2. [ ] Verify follower data accuracy
3. [ ] Check profile picture loads
4. [ ] Test token refresh (after 50 days)
5. [ ] Load test with multiple users
6. [ ] Test error scenarios (expired token, etc.)
7. [ ] Verify data doesn't leak between users
8. [ ] Test disconnect and reconnect flow

---

## Browser DevTools Testing

### Check Network Requests
1. Open DevTools → Network tab
2. Click "Connect Instagram"
3. Should see:
   - `GET /auth/instagram/login` (200)
   - Redirect to Instagram
   - `POST /api/integrations/instagram/callback` (200)

### Check LocalStorage
1. DevTools → Application → LocalStorage
2. Should see: `instagram_user_id` during flow

### Check Console
1. Should be no errors
2. Should see success messages

---

## Demo Flow (2 minutes)

1. (30s) Go to Integrations page
2. (30s) Show Instagram card is "Disconnected"
3. (30s) Click "Connect Instagram"
4. (30s) Log in to Instagram
5. (30s) Grant permissions
6. (30s) Show profile appears
7. (30s) Refresh page - data persists
8. (30s) Show Disconnect option

**Total:** ~5 minutes ⏱️

---

## Status

| Component | Status | Tested |
|-----------|--------|--------|
| Backend OAuth | ✅ Ready | [  ] |
| Integrations API | ✅ Ready | [  ] |
| Database Model | ✅ Ready | [  ] |
| Frontend Component | ✅ Ready | [  ] |
| Callback Handler | ✅ Ready | [  ] |
| End-to-End Flow | ✅ Ready | [  ] |

**Ready for testing!** 🚀
