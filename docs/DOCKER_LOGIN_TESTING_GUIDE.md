# Docker Frontend Login Testing Guide

**Status**: ✅ Docker frontend now redirects to login screen on startup

## Quick Start

### 1. Access the Frontend
Open your browser and go to:
```
http://localhost:5176
```

**Expected Result**: You should see the **Login Page** with:
- Email input field
- Password input field
- "Sign in" button
- "Don't have an account? Sign up" link

### 2. Create a New Account (Signup)

Click on **"Sign up"** link to go to the signup page.

**Signup Page Fields**:
- Full Name
- Email
- Password (must be 8+ characters)
- Confirm Password

**Example Credentials**:
```
Full Name: John Artist
Email: john@example.com
Password: TestPassword123
Confirm Password: TestPassword123
```

Click **"Create account"** button.

**Expected Result**:
- User account created in PostgreSQL database
- Automatically logged in
- Redirected to dashboard
- Session token stored in browser localStorage

### 3. Login with Credentials

Go back to login page (or if logged out):
```
http://localhost:5176/login
```

**Login Credentials** (use same as signup):
```
Email: john@example.com
Password: TestPassword123
```

Click **"Sign in"** button.

**Expected Result**:
- User authenticated
- Token retrieved from backend
- Redirected to dashboard
- All app pages accessible

### 4. Verify Session Persistence

1. Log in with test credentials
2. Refresh the page (Cmd+R or Ctrl+R)
3. You should **remain logged in** - dashboard still visible

**Why?** Token is stored in `localStorage`, so the session persists.

### 5. Logout

Click the **Settings** button (gear icon) and select **"Logout"**

**Expected Result**:
- Token cleared from localStorage
- Redirected to login page
- Cannot access dashboard without logging in again

---

## Architecture Flow

```
User Opens http://localhost:5176
                ↓
        Router checks auth state
                ↓
    Is user authenticated? (token in localStorage?)
        ↙                           ↘
      NO                           YES
      ↓                            ↓
  Show Login Page          Show Protected App (Dashboard)
      ↓                            ↓
  User enters credentials    User sees all features
      ↓                            ↓
  Frontend calls             Frontend can access:
  POST /api/auth/login       - /dashboard
      ↓                      - /campaigns
  Backend creates/finds      - /integrations
  user in PostgreSQL         - /analytics
      ↓                      - etc.
  Returns JWT token
      ↓
  Frontend stores in localStorage
      ↓
  Frontend redirects to /dashboard
```

---

## API Endpoints (Used by Frontend)

The frontend Docker container calls these backend endpoints:

### Signup
```bash
POST http://backend:4002/api/auth/signup
Content-Type: application/json

{
  "name": "John Artist",
  "email": "john@example.com",
  "password": "TestPassword123"
}
```

Response:
```json
{
  "ok": true,
  "data": {
    "accessToken": "eyJ1c2VySWQiOiJ1c2VyX2RlbW9f...",
    "user": {
      "id": "cmhuwz2se0000mr6ta8899h7e",
      "email": "john@example.com",
      "name": "John Artist",
      "role": "ARTIST"
    }
  }
}
```

### Login
```bash
POST http://backend:4002/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "TestPassword123"
}
```

Response:
```json
{
  "ok": true,
  "data": {
    "accessToken": "eyJ1c2VySWQiOiJ1c2VyX2RlbW9f...",
    "user": {
      "id": "cmhuwz2se0000mr6ta8899h7e",
      "email": "john@example.com",
      "name": "John Artist",
      "role": "ARTIST"
    }
  }
}
```

### Protected Routes (Require Bearer Token)

All dashboard and app endpoints require the Authorization header:

```bash
GET http://backend:4002/api/auth/me
Authorization: Bearer <accessToken>
```

---

## Docker Container Details

### Frontend Container
- **Port**: 5176 (mapped from 5176 in container)
- **URL**: http://localhost:5176
- **Environment**: `VITE_API_BASE_URL=http://backend:4002`
- **Status**: Running ✓

### Backend Container
- **Port**: 4002 (mapped from 4002 in container)
- **URL**: http://localhost:4002
- **Database**: PostgreSQL (internal networking via docker-compose)
- **Status**: Running ✓

### Network Communication
- Frontend calls `http://backend:4002` (internal Docker network)
- From your browser: `http://localhost:4002` (localhost binding)
- From frontend container: `http://backend:4002` (Docker DNS)

---

## Browser Developer Tools

### Check LocalStorage (Token Storage)

1. Open Browser DevTools (F12 or Cmd+Option+I)
2. Go to **Application** tab → **Local Storage** → `http://localhost:5176`
3. You should see:
   - `auth_token`: JWT token (base64)
   - `auth_user`: User object as JSON

### Check Network Requests

1. Open Browser DevTools → **Network** tab
2. Perform login
3. You should see requests to:
   - `POST /api/auth/login` (Response: 200, includes token)
   - `GET /api/auth/me` (Response: 200, user data)

### Check Console

If there are any errors:
1. Open Browser DevTools → **Console** tab
2. Look for error messages
3. Common issues:
   - CORS errors (backend not allowing frontend origin)
   - Network errors (backend not running)
   - Auth errors (invalid credentials)

---

## Testing Checklist

- [ ] Access http://localhost:5176 → See login page
- [ ] Click "Sign up" → See signup form
- [ ] Fill signup form → Create account
- [ ] See dashboard after signup → Auto-login works
- [ ] Click Settings → See logout button
- [ ] Click logout → Redirected to login
- [ ] Login again with same credentials → Works
- [ ] Refresh page → Still logged in (localStorage works)
- [ ] Check localStorage → See auth_token and auth_user
- [ ] Check Network tab → See API calls to backend

---

## Common Issues & Solutions

### Issue: See dashboard but can't access features
**Cause**: Authentication token not being sent with requests
**Solution**: Check browser console for errors, verify localStorage has token

### Issue: Login works but redirects back to login
**Cause**: Token validation failing on protected routes
**Solution**: 
- Check backend logs: `docker logs wreckshop-backend`
- Verify backend database has user record
- Ensure auth middleware is correctly checking tokens

### Issue: Can't sign up - getting error
**Cause**: Backend auth endpoints not responding
**Solution**:
- Check backend status: `docker logs wreckshop-backend`
- Verify backend container is running: `docker ps | grep backend`
- Check if email already exists (get "Email already registered" error)

### Issue: Can't access http://localhost:5176
**Cause**: Frontend container not running or port not mapped
**Solution**:
- Check container status: `docker ps | grep frontend`
- If not running: `docker-compose up -d`
- If port issue: Check docker-compose.yml port mapping

---

## Database Verification

Once you've created users via the frontend, verify they were saved:

### Connect to PostgreSQL container:
```bash
docker exec -it wreckshop-postgres psql -U wreckshop_user -d wreckshop_dev
```

### List all users:
```sql
SELECT id, email, stageName, accountType, isVerified, createdAt 
FROM "Artist" 
ORDER BY createdAt DESC;
```

You should see your test users with account type "ARTIST" and isVerified = false.

---

## Next Steps

Once login is working:
1. Test other dashboard features
2. Navigate to different pages (Campaigns, Analytics, etc.)
3. Verify all features load correctly when authenticated
4. Test logout and re-login
5. Test with multiple user accounts

---

## Summary

✅ **Frontend now shows login page on startup**
✅ **Users can create accounts via signup form**
✅ **Users can login with email/password**
✅ **Tokens stored in localStorage for session persistence**
✅ **Protected routes require authentication**
✅ **Users can logout and login again**

The authentication flow is **production-ready for testing**.

