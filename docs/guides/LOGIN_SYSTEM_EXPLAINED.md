# 🔐 Login System - Complete Architecture

## Quick Summary

Your Wreckshop social platform uses a **local authentication system** (not Stack Auth) with JWT tokens and a PostgreSQL database. When you submit login credentials, the system checks the database for a user and returns a token to authenticate future requests.

---

## How Your Login Works (Step by Step)

### 1️⃣ **User Opens Login Page**
- URL: `http://localhost:5176/login`
- Frontend component: `src/pages/auth/login.tsx`
- You see a simple form with email and password fields

### 2️⃣ **User Enters Credentials & Submits**
- Email: `ryan@vintaragroup.com`
- Password: `Burnside171!#$`
- Clicks "Sign in" button

### 3️⃣ **Frontend Makes API Call**
The login page calls the `login()` function from `AuthContext`:

```typescript
// From src/lib/auth/context.tsx
const login = useCallback(async (email: string, password: string) => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
  const response = await fetch(
    `${apiBaseUrl}/auth/login`,  // Makes POST request to /api/auth/login
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }
  );
  // ... process response
}, []);
```

**Request Details:**
```
POST http://localhost:5176/api/auth/login
Content-Type: application/json

{
  "email": "ryan@vintaragroup.com",
  "password": "Burnside171!#$"
}
```

### 4️⃣ **Nginx Proxy Forwards Request to Backend**
The Docker Nginx container (running on port 5176) intercepts the `/api` request and proxies it to the backend:

```
Browser Request
    ↓
http://localhost:5176/api/auth/login
    ↓
Nginx (port 5176)
    ↓
proxy_pass http://backend:4002
    ↓
http://backend:4002/api/auth/login
```

### 5️⃣ **Backend Processes Login**
Backend route handler: `backend/src/routes/auth.routes.ts` → `POST /api/auth/login`

```typescript
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Look up user in PostgreSQL by email
  const artist = await prisma.artist.findUnique({
    where: { email },
  });

  if (!artist) {
    // NEW USER: Create account automatically (demo mode)
    const newArtist = await prisma.artist.create({
      data: {
        stackAuthUserId: `user_demo_${Date.now()}`,
        email,
        stageName: email.split('@')[0],
        fullName: email.split('@')[0],
        accountType: 'ARTIST',
        isVerified: false,
      },
    });
    
    // Generate token and return
    return res.json({
      ok: true,
      data: {
        accessToken: mockToken,
        user: { id, email, name, role: 'ARTIST' }
      }
    });
  }

  // EXISTING USER: Return token
  const mockToken = Buffer.from(JSON.stringify({
    userId: artist.stackAuthUserId,
    email: artist.email,
    displayName: artist.stageName,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400, // 24 hours
  })).toString('base64');

  res.json({
    ok: true,
    data: {
      accessToken: mockToken,
      user: { id: artist.id, email: artist.email, name: artist.stageName, role: 'ARTIST' }
    }
  });
});
```

### 6️⃣ **Backend Response**
The backend returns:

```json
{
  "ok": true,
  "data": {
    "accessToken": "eyJhbGc...(base64 encoded JWT)",
    "user": {
      "id": "123abc",
      "email": "ryan@vintaragroup.com",
      "name": "ryan",
      "role": "ARTIST"
    }
  }
}
```

### 7️⃣ **Frontend Stores Token & User Info**
The auth context saves this data:

```typescript
setToken(accessToken);  // Store token
setUser(userData);      // Store user data
localStorage.setItem('auth_token', accessToken);
localStorage.setItem('auth_user', JSON.stringify(userData));
```

### 8️⃣ **Frontend Redirects to Dashboard**
After successful login:

```typescript
navigate('/dashboard');
```

The app redirects you to `http://localhost:5176/` (the dashboard).

---

## Why You're Seeing a Blank Screen

Based on the error you reported ("message port closed"), here are the likely causes:

### **Issue 1: Login Endpoint Failing Silently**
If `POST /api/auth/login` returns an error, the frontend might not display it properly.

**Test the endpoint directly:**
```bash
curl -X POST http://localhost:5176/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ryan@vintaragroup.com","password":"Burnside171!#$"}'
```

### **Issue 2: Token Storage/Navigation Problem**
The login might succeed, but the redirect fails.

**Check the browser console for:**
- Network errors in the login request
- Errors during `navigate('/dashboard')`
- Storage errors

### **Issue 3: Protected Route Not Recognizing Auth**
The Layout component checks `isAuthenticated` and redirects to login if false.

**From src/router.tsx:**
```typescript
function Layout() {
  const { isAuthenticated, loading } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />  // Would redirect back to login
  }
  
  return <AppShell>...</AppShell>
}
```

---

## Data Flow Diagram

```
┌─────────────────┐
│  Login Page     │
│  Email + Pass   │
└────────┬────────┘
         │
         │ POST /api/auth/login
         ↓
┌─────────────────────────┐
│  Browser (Localhost:5176)│
└────────┬────────────────┘
         │
         │ (Nginx intercepts)
         ↓
┌─────────────────────────┐
│  Docker Nginx           │
│  (Port 5176)            │
└────────┬────────────────┘
         │
         │ proxy_pass
         ↓
┌──────────────────────────┐
│  Backend (Port 4002)     │
│  /api/auth/login         │
└────────┬─────────────────┘
         │
         │ Database Lookup
         ↓
┌──────────────────────────┐
│  PostgreSQL              │
│  artist table            │
└────────┬─────────────────┘
         │
         │ Generate JWT Token
         ↓
┌──────────────────────────┐
│  Response                │
│  - accessToken           │
│  - user data             │
└────────┬─────────────────┘
         │
         │ JSON response
         ↓
┌──────────────────────────┐
│  Browser receives token  │
│  - localStorage save     │
│  - AuthContext update    │
│  - Navigate to /         │
└──────────────────────────┘
         │
         ↓
    Dashboard (protected)
```

---

## Database Schema (PostgreSQL)

Your user data is stored in the `artist` table:

```sql
CREATE TABLE "Artist" (
  id                  SERIAL PRIMARY KEY,
  stackAuthUserId     VARCHAR,
  email               VARCHAR UNIQUE NOT NULL,
  stageName           VARCHAR,
  fullName            VARCHAR,
  accountType         VARCHAR,  -- "ARTIST", "MANAGER", "ADMIN"
  isVerified          BOOLEAN DEFAULT false,
  createdAt           TIMESTAMP DEFAULT NOW(),
  updatedAt           TIMESTAMP DEFAULT NOW()
);
```

**Your user record (after login):**
```
id: 1
email: ryan@vintaragroup.com
stageName: ryan
fullName: ryan
accountType: ARTIST
isVerified: false
```

---

## Security Notes

### ⚠️ Important: This is NOT Production-Ready

The current system has these limitations:

1. **No Password Validation**
   - The backend accepts ANY password
   - Users are auto-created on first login with any password
   - `if (!artist) { ... create new user ... }`

2. **Mock JWT Tokens**
   - Tokens are base64-encoded JSON, not cryptographically signed
   - Anyone can forge a token by modifying the base64 data
   - Real tokens use `HS256` or `RS256` signatures

3. **No Rate Limiting**
   - Anyone can brute force login attempts
   - No failed attempt tracking

4. **No Password Hashing**
   - Passwords are never hashed or validated
   - If you ever store passwords, they must be hashed with bcrypt/argon2

### 🔒 For Production, You Would:
- Use a real JWT library (`jsonwebtoken`)
- Hash passwords with `bcrypt`
- Implement rate limiting
- Add email verification
- Use OAuth providers (Google, GitHub, etc.)
- Add 2FA/MFA

---

## Testing the Login System

### Test 1: Direct API Call
```bash
curl -X POST http://localhost:5176/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ryan@vintaragroup.com",
    "password": "Burnside171!#$"
  }'
```

Expected response:
```json
{
  "ok": true,
  "data": {
    "accessToken": "...",
    "user": {
      "id": 1,
      "email": "ryan@vintaragroup.com",
      "name": "ryan",
      "role": "ARTIST"
    }
  }
}
```

### Test 2: Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Check network requests during login
4. Look for `/api/auth/login` request
5. Verify response status is 200

### Test 3: Check Token Storage
```javascript
// In browser console:
localStorage.getItem('auth_token')  // Should show base64 token
localStorage.getItem('auth_user')   // Should show user JSON
```

---

## Why the "Blank Screen" After Login

The **most likely cause** based on your error message:

```
Unchecked runtime.lastError: The message port closed before a response was received.
```

This suggests a **communication issue between browser extensions** (not your code). However, if the login seems to succeed but shows a blank screen:

### Check These:

1. **Is the backend running?**
   ```bash
   docker ps | grep backend
   ```

2. **Is the database connected?**
   ```bash
   curl http://localhost:5176/api/test/db-health
   ```

3. **Check frontend console for errors**
   - Network errors
   - Navigation errors
   - React errors

4. **Verify the token was saved**
   ```bash
   # In browser console
   localStorage.getItem('auth_token')
   ```

---

## Next Steps

1. **Try logging in again** while watching DevTools Network tab
2. **Check the `/api/auth/login` response** - is it 200 OK?
3. **Check localStorage** - is the token actually saved?
4. **Check the console** for any JavaScript errors
5. **Test the endpoint directly** with curl

If you get a 200 response but still see a blank page, the issue is in the frontend navigation logic, not the backend auth system.

---

*Context improved by Giga AI - Used architecture documentation and authentication flow analysis*
