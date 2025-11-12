# 🔍 Login Issue Debugging Guide

## What I Found

✅ **Backend is working perfectly**
- `POST /api/auth/login` returns HTTP 200
- Credentials accepted: `ryan@vintaragroup.com`
- User created in database successfully
- Token generated and returned correctly

❌ **Frontend issue after successful login**
- Login appears to succeed on backend
- But UI shows blank screen instead of dashboard
- You're still on `/login` route

---

## Root Cause Analysis

The blank screen is likely one of these:

1. **Route guard not recognizing auth state**
   - `Layout()` component checks `isAuthenticated`
   - If false, redirects back to login
   - This creates the blank screen scenario

2. **Token not being saved to localStorage**
   - `localStorage.setItem()` might be failing silently
   - Auth context doesn't update `user` state
   - `isAuthenticated` stays false

3. **Navigation not executing**
   - `navigate('/')` might not complete
   - Component unmounts before redirect happens

---

## How to Debug (Step-by-Step)

### Step 1: Open DevTools Console
1. Press **F12** in your browser
2. Click the **Console** tab
3. Clear any existing messages

### Step 2: Attempt Login Again
1. Go to `http://localhost:5176/login`
2. Enter:
   - Email: `ryan@vintaragroup.com`
   - Password: `Burnside171!#$`
3. Click "Sign in"
4. **DO NOT NAVIGATE AWAY** - watch the console

### Step 3: Look for These Log Messages

You should see console output like:

```
[LOGIN] Starting login with email: ryan@vintaragroup.com
[AUTH] Login request to: /api/auth/login
[AUTH] Login response status: 200
[AUTH] Login response data: {ok: true, data: {...}}
[AUTH] Setting token and user
[AUTH] Login complete, user: ryan@vintaragroup.com
[LOGIN] Login successful, navigating to dashboard
```

### Step 4: Check for Errors

Look for any **red error messages** like:
- `Uncaught TypeError: Cannot read property...`
- `Failed to fetch...`
- `CORS error...`

### Step 5: Check LocalStorage

In the browser console, run:

```javascript
// Check if token was saved
console.log('Token:', localStorage.getItem('auth_token'));
console.log('User:', localStorage.getItem('auth_user'));
```

**Expected output:**
```
Token: eyJ1c2VySWQi... (long string)
User: {"id":"...", "email":"ryan@vintaragroup.com", ...}
```

**If empty:**
- Token is not being saved
- The `setItem()` might be failing
- Browser storage might be disabled

---

## Network Tab Debugging

### Step 1: Open Network Tab
1. Press **F12**
2. Click **Network** tab
3. Clear existing requests

### Step 2: Attempt Login
1. Fill in credentials
2. Click "Sign in"
3. Watch network requests

### Step 3: Look for `/api/auth/login` Request

**Expected:**
```
POST /api/auth/login
Status: 200 OK
Response: {
  "ok": true,
  "data": {
    "accessToken": "eyJ1c2VySWQi...",
    "user": {
      "id": "...",
      "email": "ryan@vintaragroup.com",
      "name": "ryan",
      "role": "ARTIST"
    }
  }
}
```

**If you see:**
- ❌ Status 400 or 500 → Backend error
- ❌ Status 0 or cancelled → Network error
- ❌ CORS error → Proxy misconfigured
- ✅ Status 200 with data → Backend OK, frontend issue

---

## Quick Test: Direct API Call

If the login form isn't working, test the backend directly:

```bash
# In your terminal
curl -X POST http://localhost:5176/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ryan@vintaragroup.com",
    "password": "Burnside171!#$"
  }' | jq .
```

**If this works (returns JSON with token):**
- Backend is fine
- Issue is in frontend handling

---

## Common Issues & Solutions

### Issue 1: "Cannot read property 'data' of undefined"

**Cause:** Backend response format is wrong

**Solution:**
```typescript
// Check response format
const data = await response.json();
console.log('Full response:', data);

// Verify structure exists
if (data.data) {
  const { accessToken, user } = data.data;
} else if (data.accessToken) {
  const { accessToken, user } = data;
}
```

### Issue 2: "CORS error" or "Failed to fetch"

**Cause:** Proxy not configured correctly

**Solution:**
```bash
# Test that nginx proxy is working
curl http://localhost:5176/api/health

# Should return: {"success":true,...}
# If fails: Nginx proxy is broken
```

### Issue 3: Login succeeds but shows blank page

**Cause:** Route guard not recognizing `isAuthenticated`

**Solution:**
Check `useAuth()` hook returns:
```javascript
// In browser console
// Create a test (this might not work directly, but shows what to verify)
// Instead, look for these in console logs:
// [AUTH] Login complete, user: ryan@vintaragroup.com
// [LOGIN] Login successful, navigating to dashboard

// If those appear but page is blank, check:
// 1. Browser console for JavaScript errors
// 2. Network tab for failed requests after redirect
// 3. localStorage has auth_token and auth_user
```

### Issue 4: "blank white screen" or 404

**Cause:** Dashboard route not loading or authentication check failing

**Solution:**
1. Check URL - should be `http://localhost:5176/` (not `/login`)
2. Check browser console for errors
3. Check that `isAuthenticated` becomes true after login

---

## What The Updated Code Does

I added logging to help diagnose:

### In `src/lib/auth/context.tsx`:
```typescript
console.log('[AUTH] Login request to:', url);
console.log('[AUTH] Login response status:', response.status);
console.log('[AUTH] Login response data:', data);
console.log('[AUTH] Setting token and user');
console.log('[AUTH] Login complete, user:', userData.email);
```

### In `src/pages/auth/login.tsx`:
```typescript
console.log('[LOGIN] Starting login with email:', email);
console.log('[LOGIN] Login successful, navigating to dashboard');
console.error('[LOGIN] Login error:', errorMsg, err);
```

---

## Deployment Checklist

After making these changes, you need to:

1. **Rebuild Frontend**
   ```bash
   docker-compose down
   docker-compose up --build -d
   ```

2. **Wait for Container to Start**
   ```bash
   docker-compose ps
   # Wait for wreckshop-frontend to show "Up"
   ```

3. **Clear Browser Cache**
   - Press **Ctrl+Shift+Delete** (Windows) or **Cmd+Shift+Delete** (Mac)
   - Select "Cached images and files"
   - Click "Clear"

4. **Test Login Again**
   - Go to `http://localhost:5176/login`
   - Open DevTools (F12)
   - Attempt login
   - Check console for `[LOGIN]` and `[AUTH]` logs

---

## If All Else Fails

Try this complete reset:

```bash
# Stop everything
docker-compose down

# Remove old data if needed
# docker volume prune

# Rebuild everything
docker-compose up --build -d

# Wait 30 seconds
sleep 30

# Check health
curl http://localhost:5176/api/test/db-health
```

---

## Expected Success Sequence

1. ✅ See login form
2. ✅ Enter credentials and click submit
3. ✅ See console logs: `[LOGIN] Starting login...`
4. ✅ See console logs: `[AUTH] Login response status: 200`
5. ✅ See console logs: `[LOGIN] Login successful, navigating...`
6. ✅ URL changes from `/login` to `/`
7. ✅ Dashboard loads with app shell
8. ✅ All sidebar menus visible
9. ✅ Can navigate between pages

If you stop at any step, check console for errors and refer to the "Common Issues" section above.

---

## Questions This Debugging Answers

- ✅ Is the backend API working? → Check status 200 in Network tab
- ✅ Is the response data valid? → Check console for `[AUTH] Login response data`
- ✅ Is the token being saved? → Check `localStorage.getItem('auth_token')`
- ✅ Is navigation working? → Check URL changes from `/login` to `/`
- ✅ Is the route guard working? → Check if Layout redirects back to login
- ✅ Is React state updating? → Check console for `[AUTH] Login complete`

---

## Next Steps

1. Rebuild the frontend container with new logging
2. Test login with DevTools open
3. Report which console messages you see (and which are missing)
4. This will pinpoint exactly where the issue is

The system is working on the backend - we just need to find where the frontend is getting stuck!
