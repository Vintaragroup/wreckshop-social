# 🎯 Complete Login System Architecture

## Executive Summary

Your Wreckshop social platform uses a **full-stack authentication system** with:
- **Frontend**: React + React Router with auth context
- **Backend**: Node.js/Express with PostgreSQL database
- **Container**: Docker with Nginx reverse proxy

The login flow is **working on the backend** (verified with test credentials). The blank screen issue is in the **frontend's handling of the response**.

---

## Complete Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER BROWSER (localhost:5176)                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  1. User visits: http://localhost:5176/login                            │
│     ↓                                                                    │
│  2. React Router loads: LoginPage component                             │
│     - Email input field                                                 │
│     - Password input field                                              │
│     - Submit button                                                     │
│     ↓                                                                    │
│  3. User enters credentials and clicks "Sign in"                        │
│     - Email: ryan@vintaragroup.com                                      │
│     - Password: Burnside171!#$                                          │
│     ↓                                                                    │
│  4. LoginPage.handleLogin() called                                       │
│     - Calls AuthContext.login(email, password)                          │
│     ↓                                                                    │
│  5. AuthContext.login() executes:                                        │
│     - Constructs URL: "/api/auth/login"                                 │
│     - fetch(POST, {email, password})                                    │
│     ↓                                                                    │
└─────────────────────────────────────────────────────────────────────────┘
         │
         │ HTTP Request
         │ POST /api/auth/login
         ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                       NGINX REVERSE PROXY (port 5176)                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  6. Nginx receives request: POST http://localhost:5176/api/auth/login   │
│     - Checks route matching                                             │
│     - Finds rule: /api → proxy_pass http://backend:4002                │
│     ↓                                                                    │
│  7. Nginx forwards to backend: http://backend:4002/api/auth/login       │
│     (Docker DNS resolves "backend" → 172.x.x.x)                        │
│     ↓                                                                    │
└─────────────────────────────────────────────────────────────────────────┘
         │
         │ Proxied HTTP Request
         │ POST /api/auth/login
         ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                    BACKEND EXPRESS SERVER (port 4002)                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  8. Express router receives POST /api/auth/login                         │
│     - Extracts { email, password } from body                            │
│     ↓                                                                    │
│  9. Query PostgreSQL database:                                           │
│     SELECT * FROM "Artist" WHERE email = $1                            │
│     ↓                                                                    │
│  10. User NOT found in database (first login)                           │
│      → Create new artist record:                                         │
│      INSERT INTO "Artist" (                                             │
│        stackAuthUserId,                                                 │
│        email,                                                           │
│        stageName,                                                       │
│        fullName,                                                        │
│        accountType,                                                     │
│        isVerified                                                       │
│      ) VALUES (...)                                                     │
│      ↓                                                                    │
│  11. Generate JWT-like token:                                           │
│      {                                                                  │
│        userId: "user_demo_1762890280525",                               │
│        email: "ryan@vintaragroup.com",                                  │
│        displayName: "ryan",                                             │
│        iat: 1762890645,                                                 │
│        exp: 1762977045                                                  │
│      }                                                                  │
│      → Base64 encode → eyJ1c2VySWQi...                                  │
│      ↓                                                                    │
│  12. Return JSON response:                                               │
│      {                                                                  │
│        "ok": true,                                                      │
│        "data": {                                                        │
│          "accessToken": "eyJ1c2VySWQi...",                              │
│          "user": {                                                      │
│            "id": "cmhuzcu320000...",                                    │
│            "email": "ryan@vintaragroup.com",                            │
│            "name": "ryan",                                              │
│            "role": "ARTIST"                                             │
│          }                                                              │
│        }                                                                │
│      }                                                                  │
│      ↓                                                                    │
└─────────────────────────────────────────────────────────────────────────┘
         │
         │ HTTP 200 OK
         │ JSON Response
         ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                       NGINX REVERSE PROXY (port 5176)                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  13. Nginx receives response from backend                               │
│      - Forwards to browser                                              │
│      ↓                                                                    │
└─────────────────────────────────────────────────────────────────────────┘
         │
         │ HTTP Response 200
         │ JSON with token
         ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER BROWSER (localhost:5176)                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  14. JavaScript receives response:                                       │
│      response.status = 200 ✅                                            │
│      response.json() = {...token...user...}  ✅                         │
│      ↓                                                                    │
│  15. AuthContext.login() processes response:                            │
│      - Extract: accessToken, user data                                  │
│      - setToken(accessToken)                                            │
│      - setUser(userData)                                                │
│      - localStorage.setItem('auth_token', ...)                          │
│      - localStorage.setItem('auth_user', ...)                           │
│      ↓                                                                    │
│  16. LoginPage.handleLogin() receives success:                          │
│      - Sets loading = false                                             │
│      - navigate('/') → redirect to dashboard                            │
│      ↓                                                                    │
│  17. Router navigates to '/' (Dashboard route)                          │
│      - Layout component renders                                         │
│      - Checks: useAuth() → isAuthenticated = true ✅                    │
│      - Renders: <AppShell><Dashboard /></AppShell>                     │
│      ↓                                                                    │
│  ✅ 18. USER SEES DASHBOARD                                              │
│      - Sidebar with navigation                                          │
│      - Main content area                                                │
│      - All app features available                                       │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Component Interaction Diagram

```
LoginPage (React Component)
├─ imports: useAuth, useNavigate
├─ state: email, password, loading, error
│
├─ handleLogin(e)
│  ├─ calls: login(email, password)  ← from AuthContext
│  ├─ if success:
│  │  └─ navigate('/') ← from react-router
│  └─ if error:
│     └─ display error message
│
└─ renders:
   ├─ Email input
   ├─ Password input
   ├─ Submit button
   └─ Error alert (if error exists)

AuthContext (React Context Provider)
├─ exports: useAuth() hook
├─ manages state:
│  ├─ user: AuthUser | null
│  ├─ token: string | null
│  ├─ loading: boolean
│  ├─ isAuthenticated: boolean
│  └─ error: Error | null
│
├─ exports function: login(email, password)
│  ├─ fetch POST /api/auth/login
│  ├─ process response
│  ├─ update state: setUser, setToken
│  └─ save to localStorage
│
├─ wraps: <RouterProvider>
└─ available to: all components via useAuth() hook

Router Configuration
├─ Route: /login → LoginPage
│  └─ Public (always accessible)
│
├─ Route: / → Layout
│  ├─ checks: isAuthenticated
│  ├─ if false → redirect to /login
│  └─ if true → render protected routes:
│     ├─ / → Dashboard
│     ├─ /audience → AudienceDashboard
│     ├─ /campaigns → CampaignsEmail, etc.
│     └─ ... more protected routes
│
└─ Route: /auth/*/callback → OAuth callback handlers
   └─ Public (OAuth redirects from external services)
```

---

## Database Schema

```
PostgreSQL Database: wreckshop_social

Table: "Artist"
├─ id (INTEGER PRIMARY KEY)
├─ stackAuthUserId (VARCHAR)
├─ email (VARCHAR UNIQUE NOT NULL)
├─ stageName (VARCHAR)
├─ fullName (VARCHAR)
├─ profilePictureUrl (VARCHAR)
├─ bio (TEXT)
├─ genres (JSONB)
├─ accountType (VARCHAR) → "ARTIST", "MANAGER", "ADMIN"
├─ isVerified (BOOLEAN DEFAULT false)
├─ countryCode (VARCHAR)
├─ leaderboardScore (INTEGER)
├─ createdAt (TIMESTAMP DEFAULT NOW())
└─ updatedAt (TIMESTAMP DEFAULT NOW())

Example Row (Your Account):
┌──────────────────────────────────────────────────┐
│ id: cmhuzcu320000mt15m73unuaj                    │
│ stackAuthUserId: user_demo_1762890280525        │
│ email: ryan@vintaragroup.com                    │
│ stageName: ryan                                 │
│ fullName: ryan                                  │
│ accountType: ARTIST                             │
│ isVerified: false                               │
│ createdAt: 2025-11-11 19:44:40.525 UTC         │
│ updatedAt: 2025-11-11 19:44:40.525 UTC         │
└──────────────────────────────────────────────────┘
```

---

## API Endpoint Specifications

### POST /api/auth/login

**Request:**
```http
POST /api/auth/login HTTP/1.1
Host: localhost:5176
Content-Type: application/json

{
  "email": "ryan@vintaragroup.com",
  "password": "Burnside171!#$"
}
```

**Response (Success - 200 OK):**
```json
{
  "ok": true,
  "data": {
    "accessToken": "eyJ1c2VySWQiOiJ1c2VyX2RlbW9fMTc2Mjg5MDI4MDUyNSIsImVtYWlsIjoicnlhbkB2aW50YXJhZ3JvdXAuY29tIiwiZGlzcGxheU5hbWUiOiJyeWFuIiwiaWF0IjoxNzYyODkwNjQ1LCJleHAiOjE3NjI5NzcwNDV9",
    "user": {
      "id": "cmhuzcu320000mt15m73unuaj",
      "email": "ryan@vintaragroup.com",
      "name": "ryan",
      "role": "ARTIST"
    }
  }
}
```

**Response (Error - 400 Bad Request):**
```json
{
  "error": "Email and password required"
}
```

**Response (Error - 500 Server Error):**
```json
{
  "ok": false,
  "error": "Database connection failed"
}
```

---

## State Management Flow

```
Initial State (LoginPage mounts)
├─ email: ""
├─ password: ""
├─ loading: false
├─ error: null
├─ isAuthenticated: false (from AuthContext)
└─ user: null (from AuthContext)

After User Submits Form
├─ loading: true (from LoginPage)
├─ error: null (cleared)
└─ [Network request in progress]

After Successful Response (200)
├─ loading: false
├─ token: "eyJ1c2VySWQi..." (in AuthContext)
├─ user: {id, email, name, role} (in AuthContext)
├─ isAuthenticated: true (computed from AuthContext)
├─ localStorage.auth_token = token ✅
├─ localStorage.auth_user = user ✅
└─ navigate('/') executed
   └─ Router switches to Dashboard

After Navigation to Dashboard
├─ Layout component mounts
├─ Checks: isAuthenticated = true ✅
├─ Renders: <AppShell><Dashboard /></AppShell>
└─ USER SEES: Dashboard with sidebar + content

If Network Error or 500
├─ loading: false
├─ error: "Error message" (set in LoginPage)
├─ isAuthenticated: stays false
└─ USER SEES: Error message on login form (can retry)
```

---

## Token Structure

### Token Payload (Base64 Decoded)
```json
{
  "userId": "user_demo_1762890280525",
  "email": "ryan@vintaragroup.com",
  "displayName": "ryan",
  "iat": 1762890645,
  "exp": 1762977045
}
```

### Token Fields
- `userId`: Unique identifier for the user session
- `email`: User's email address
- `displayName`: User's display name (stageName for artists)
- `iat`: Issued At (Unix timestamp when token was created)
- `exp`: Expiration (Unix timestamp, 24 hours after iat)

### How to Decode Token (in browser console)
```javascript
const token = localStorage.getItem('auth_token');
const payload = JSON.parse(atob(token));
console.log(payload);
// Output:
// {
//   userId: "user_demo_1762890280525",
//   email: "ryan@vintaragroup.com",
//   displayName: "ryan",
//   iat: 1762890645,
//   exp: 1762977045
// }
```

---

## Security Considerations

### Current Implementation (Demo/Testing)
⚠️ **NOT PRODUCTION-READY**

1. **Passwords**: Not validated or hashed
   - Any password is accepted
   - Users auto-created on first login
   - No password storage/retrieval

2. **Token**: Base64-encoded JSON, not cryptographically signed
   - Anyone can forge a token
   - Real implementation would use HS256/RS256

3. **Storage**: Tokens stored in localStorage
   - Vulnerable to XSS attacks
   - Real implementation would use httpOnly cookies

4. **No validation of**:
   - Email format
   - Password strength
   - Rate limiting
   - Failed attempts

### Production Considerations
For production, implement:
- bcrypt password hashing
- Real JWT signing with `jsonwebtoken` library
- httpOnly secure cookies instead of localStorage
- Email verification
- Rate limiting on login attempts
- 2FA/MFA support
- OAuth providers (Google, GitHub)
- Session expiration and refresh tokens

---

## Troubleshooting Decision Tree

```
Login shows blank screen after submission
│
├─ Check: Browser console (F12)
│  ├─ See "[LOGIN] Starting login..." logs?
│  │  └─ YES → Frontend code executed
│  │         │
│  │         └─ See "[AUTH] Login response status: 200"?
│  │            ├─ YES → Backend responded
│  │            │       │
│  │            │       └─ See "[LOGIN] Login successful, navigating..."?
│  │            │          ├─ YES → Navigation executed
│  │            │          │       └─ URL changed to / ?
│  │            │          │          ├─ YES → Route guard issue
│  │            │          │          │       (Layout not rendering)
│  │            │          │          └─ NO → Navigation failed
│  │            │          │              (Check JavaScript errors)
│  │            │          └─ NO → Error in login() function
│  │            │              (Check console for exception)
│  │            └─ NO → Network request failed
│  │                └─ Check Network tab for /api/auth/login status
│  └─ NO → Login form not submitting
│          └─ Check JavaScript errors above console
│
└─ If unsure:
   ├─ Run: localStorage.getItem('auth_token')
   │  ├─ Returns token string? → Token saved ✅
   │  └─ null or undefined? → Token not saved ❌
   │
   ├─ Check: Current URL
   │  ├─ Is /login? → Navigation didn't happen
   │  └─ Is /? → Navigation happened, Layout issue
   │
   └─ Rebuild frontend:
      docker-compose down
      docker-compose up --build -d frontend
      (Wait 30 seconds)
      Clear browser cache (Ctrl+Shift+Delete)
      Try login again
```

---

## Summary Table

| Component | Status | Purpose |
|-----------|--------|---------|
| Backend API | ✅ Working | Handles login, checks DB, returns token |
| Frontend Login Page | ✅ Loads | Form displays, captures input |
| Login API Call | ✅ Succeeds | HTTP 200, receives valid token |
| Auth Context | ⚠️ Verify | Stores token/user, updates isAuthenticated |
| Route Protection | ⚠️ Verify | Layout redirects if not authenticated |
| Navigation | ⚠️ Verify | navigate('/') works after login |
| Dashboard | ⚠️ Verify | Renders if isAuthenticated=true |

---

## Files Involved

### Frontend
- `src/pages/auth/login.tsx` - Login form and submission logic
- `src/lib/auth/context.tsx` - Authentication state management
- `src/router.tsx` - Route configuration and protection
- `src/components/app-shell.tsx` - Main app layout

### Backend
- `backend/src/routes/auth.routes.ts` - Auth endpoints (login, signup, etc.)
- `backend/src/lib/prisma.js` - Database ORM
- `backend/package.json` - Dependencies

### Infrastructure
- `docker-compose.yml` - Container orchestration
- `Dockerfile` - Frontend image definition
- `nginx.conf` - Reverse proxy configuration
- `.env` - Environment variables

---

*Understanding this architecture will help you debug any authentication issues and extend the system for production.*
