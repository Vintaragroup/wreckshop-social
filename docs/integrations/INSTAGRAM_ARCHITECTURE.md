# Instagram Integration Architecture

## System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     USER BROWSER                             │
│  http://localhost:5176/integrations                         │
│                                                              │
│  ┌──────────────────────────────────────────────┐           │
│  │      Integrations Page                        │           │
│  │  ┌─────────────────────────────────────┐     │           │
│  │  │   InstagramConnectionCard           │     │           │
│  │  │                                      │     │           │
│  │  │  ┌─Disconnected─────────────────┐   │     │           │
│  │  │  │ Status: Disconnected ❌      │   │     │           │
│  │  │  │ Button: "Connect Instagram"  │───┼─┐   │           │
│  │  │  └──────────────────────────────┘   │ │   │           │
│  │  │                                      │ │   │           │
│  │  │  ┌─Connected─────────────────────┐  │ │   │           │
│  │  │  │ Status: Connected ✅          │  │ │   │           │
│  │  │  │ @wreckshoprecords            │  │ │   │           │
│  │  │  │ 15,420 followers             │  │ │   │           │
│  │  │  │ Expires: Jan 9, 2026         │  │ │   │           │
│  │  │  │ Button: "Disconnect"         │  │ │   │           │
│  │  │  └──────────────────────────────┘  │ │   │           │
│  │  │                                     │ │   │           │
│  │  │  Fetches data from:                │ │   │           │
│  │  │  GET /api/integrations/instagram   │ │   │           │
│  │  └─────────────────────────────────────┘ │   │           │
│  │                                           │   │           │
│  └───────────────────────────────────────────┘   │           │
└───────────────────────────────────────────────────┼───────────┘
                                                    │
                   ┌────────────────────────────────┘
                   │
                   ▼
         CONNECT BUTTON CLICKED
                   │
                   ▼
┌──────────────────────────────────┐
│  Frontend (React Component)       │
│                                  │
│  1. GET /auth/instagram/login   │
│  2. Get authUrl from backend    │
│  3. Redirect to Instagram OAuth │
└──────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│      BACKEND (Node.js/Express)           │
│                                          │
│  Route: GET /auth/instagram/login        │
│  ┌────────────────────────────────┐      │
│  │ 1. Check env variables loaded   │      │
│  │ 2. Build Instagram auth URL     │      │
│  │ 3. Return to frontend           │      │
│  └────────────────────────────────┘      │
│                                          │
│  Uses: INSTAGRAM_APP_ID                 │
│        INSTAGRAM_REDIRECT_URI           │
└──────────────────────────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────────────┐
│    INSTAGRAM SERVERS (OAuth Provider)          │
│  https://api.instagram.com/oauth/authorize     │
│                                                │
│  ┌──────────────────────────────────────┐     │
│  │  User logs in                         │     │
│  │  Grants permissions:                  │     │
│  │  • instagram_business_basic           │     │
│  │  • instagram_business_content_publish │     │
│  │  • instagram_business_manage_messages │     │
│  └──────────────────────────────────────┘     │
│          │                                    │
│          │ Authorization successful          │
│          ▼                                    │
│  Redirect to callback with code:             │
│  http://localhost:4002/auth/instagram/       │
│  callback?code=ABC123&state=xyz789           │
│                                                │
└────────────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────┐
│  Backend: Instagram Callback      │
│                                  │
│  GET /auth/instagram/callback    │
│  with code parameter             │
│  ┌────────────────────────────┐  │
│  │ 1. Receive code & state    │  │
│  │ 2. Exchange code for token │  │
│  │ 3. Get user profile data   │  │
│  │ 4. Return data to frontend │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│  Frontend: Callback Handler           │
│                                       │
│  Route: /auth/instagram/callback      │
│  ┌──────────────────────────────┐    │
│  │ 1. Receive OAuth response    │    │
│  │ 2. Extract code              │    │
│  │ 3. POST /api/integrations/   │    │
│  │    instagram/callback        │    │
│  │    with token & user data    │    │
│  └──────────────────────────────┘    │
└──────────────────────────────────────┘
                   │
                   ▼
┌───────────────────────────────────────────┐
│  Backend: Save Connection                  │
│                                            │
│  POST /api/integrations/instagram/callback│
│  ┌────────────────────────────────────┐   │
│  │ 1. Validate request body           │   │
│  │ 2. Check MongoDB for existing conn │   │
│  │ 3. Create or update connection     │   │
│  │ 4. Save to MongoDB                 │   │
│  │ 5. Return success                  │   │
│  └────────────────────────────────────┘   │
└───────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────┐
│  MongoDB                          │
│  Collection: instagram_connections│
│                                  │
│  {                               │
│    userId: "user-123"            │
│    instagramUserId: "456789"     │
│    accessToken: "[encrypted]"   │
│    tokenExpiresAt: "2026-01-09" │
│    profile: {                    │
│      username: "wreckshop",      │
│      followers: 15420,           │
│      ...                         │
│    }                             │
│  }                               │
└──────────────────────────────────┘
                   │
                   ▼
        SUCCESS! Data Stored
                   │
                   ▼
┌──────────────────────────────────┐
│  Frontend: Show Connected State   │
│                                  │
│  → Redirect to /integrations    │
│  → Fetch connection status      │
│  → Display profile in card      │
│  → Show "Connected" badge       │
│  → Display follower count       │
│  → Show token expiry date       │
└──────────────────────────────────┘
```

---

## Data Model

```
┌─────────────────────────────────┐
│  InstagramConnection Document   │
│  (MongoDB Collection)           │
├─────────────────────────────────┤
│                                 │
│  _id: ObjectId                  │
│  userId: string ⭐              │
│  instagramUserId: string ⭐      │
│  accessToken: string (secret)   │
│  tokenExpiresAt: Date           │
│                                 │
│  profile:                       │
│  ├─ username: string            │
│  ├─ name: string                │
│  ├─ profilePictureUrl: string   │
│  ├─ biography: string           │
│  ├─ website: string             │
│  ├─ followersCount: number      │
│  ├─ followsCount: number        │
│  └─ mediaCount: number          │
│                                 │
│  scopes: string[]               │
│  connectedAt: Date              │
│  lastSyncedAt: Date             │
│  lastError: string?             │
│  isActive: boolean              │
│  updatedAt: Date                │
│  createdAt: Date                │
│                                 │
│  Indexes:                       │
│  ⭐ userId + isActive           │
│  ⭐ instagramUserId (unique)     │
│  ⭐ tokenExpiresAt              │
│                                 │
└─────────────────────────────────┘
```

---

## API Flow Diagram

```
FRONTEND                    BACKEND                    EXTERNAL
─────────────────────────────────────────────────────────────

GET /auth/instagram/login
              ──────────────────>
                               Instagram OAuth Config
                               App ID, Secret, Scopes
                               │
                               ├─> Build URL
                               │
                               Return authUrl
              <──────────────────


Redirect to Instagram
                               ─────────────────────────>
                               User logs in
                               Grants permissions
                               <─ Redirect back


GET /auth/instagram/callback?code=X
              ──────────────────>
                               Exchange code for token
                               ─────────────────────────>
                               Instagram returns token
                               <─────────────────────────
                               │
                               ├─> Get user profile
                               │   ─────────────────────>
                               │   Instagram returns data
                               │   <─────────────────────
                               │
                               Parse & return


POST /api/integrations/instagram/callback
{access_token, user_id, user}
              ──────────────────>
                               ├─> Validate
                               ├─> Check MongoDB
                               ├─> Create/Update
                               │   ─────────────>
                               │   MongoDB saves
                               │   <─────────────
                               │
                               Return success
              <──────────────────


GET /api/integrations/instagram/:userId
              ──────────────────>
                               ├─> Query MongoDB
                               │   ─────────────>
                               │   Connection found
                               │   <─────────────
                               │
                               Return connection
              <──────────────────


Display Updated UI ✅
```

---

## Component Architecture

```
┌────────────────────────────────────────────┐
│  React Router                               │
│                                             │
│  Route: /auth/instagram/callback            │
│  └─> InstagramCallbackHandler              │
│      ├─ useSearchParams()                  │
│      ├─ Exchange code for token            │
│      ├─ Save to database                   │
│      └─ Redirect on success                │
│                                             │
│  Route: /integrations                       │
│  └─> Integrations                          │
│      ├─ SpotifyIntegrationCard             │
│      │  (existing)                         │
│      └─ InstagramConnectionCard            │
│         ├─ useEffect() fetch connection    │
│         ├─ useState() connection data      │
│         ├─ handleConnect()                 │
│         │  └─ GET /auth/instagram/login    │
│         ├─ handleDisconnect()              │
│         │  └─ DELETE /api/integrations/... │
│         └─ Display based on state          │
│            ├─ Disconnected UI              │
│            └─ Connected UI                 │
│                                             │
└────────────────────────────────────────────┘
```

---

## Token Exchange Flow

```
Instagram Authorization Code
         │
         ▼
┌────────────────────────────────┐
│  Backend: Exchange Code         │
│  POST to Instagram API          │
│                                 │
│  Sends:                         │
│  - client_id                    │
│  - client_secret                │
│  - code                         │
│  - redirect_uri                 │
│                                 │
│  Receives:                      │
│  - access_token (short-lived)   │
│  - expires_in                   │
│  - user_id                      │
└────────────────────────────────┘
         │
         ▼
Short-lived Token (1 hour)
         │
         ▼
┌────────────────────────────────┐
│  Backend: Exchange for Long-    │
│  Lived Token                    │
│  GET to Instagram API           │
│                                 │
│  Uses: grant_type = ig_exchange │
│  Input: short_token             │
│  Output: long_token             │
│          expires_in = 5184000   │
│          (60 days)              │
└────────────────────────────────┘
         │
         ▼
Long-lived Token (60 days)
         │
         ▼
┌────────────────────────────────┐
│  Stored in MongoDB              │
│  With expiration date           │
│  + user profile data            │
│  + sync history                 │
│  + connection metadata          │
└────────────────────────────────┘
         │
         ▼
Used by Frontend/Backend
├─ Fetch user data
├─ Post content
├─ Manage messages
└─ Refresh before expiry
```

---

## Request/Response Examples

### GET /auth/instagram/login

**Response:**
```json
{
  "authUrl": "https://api.instagram.com/oauth/authorize?client_id=1377811407203207&redirect_uri=http%3A%2F%2Flocalhost%3A4002%2Fauth%2Finstagram%2Fcallback&scope=instagram_business_basic%2Cinstagram_business_content_publish%2Cinstagram_business_manage_messages&response_type=code&state=abc123",
  "redirectTo": "https://api.instagram.com/oauth/authorize?..."
}
```

### GET /auth/instagram/callback?code=ABC123

**Backend Processing:**
```
1. Receive authorization code
2. Exchange for short-lived token
3. Exchange for long-lived token
4. Fetch user profile
5. Return to frontend
```

**Response:**
```json
{
  "ok": true,
  "access_token": "IGSHORTUIGSHORTIGSHORTIGSHORTIGSHORTIGSHORTIGSHORTIGSHORTIGSHORTIGSHOR",
  "user_id": "17841400000000000",
  "expires_in": 5184000,
  "user": {
    "id": "17841400000000000",
    "username": "wreckshoprecords",
    "name": "Wreck Shop Records",
    "profile_picture_url": "https://platform-lookaside.fbsbx.com/...",
    "biography": "Vinyl Records & Digital Beats",
    "website": "wreckshop.com",
    "followers_count": 15420,
    "follows_count": 823,
    "media_count": 456
  }
}
```

### POST /api/integrations/instagram/callback

**Request:**
```json
{
  "userId": "user-123",
  "access_token": "IGSHORTUIGSHORT...",
  "user_id": "17841400000000000",
  "expires_in": 5184000,
  "user": {
    "id": "17841400000000000",
    "username": "wreckshoprecords",
    "name": "Wreck Shop Records",
    "profile_picture_url": "https://...",
    "biography": "Vinyl Records & Digital Beats",
    "website": "wreckshop.com",
    "followers_count": 15420,
    "follows_count": 823,
    "media_count": 456
  }
}
```

**Response:**
```json
{
  "ok": true,
  "connection": {
    "id": "507f1f77bcf86cd799439011",
    "username": "wreckshoprecords",
    "followers": 15420,
    "connectedAt": "2025-11-10T15:30:00.000Z",
    "expiresAt": "2026-01-09T15:30:00.000Z"
  }
}
```

### GET /api/integrations/instagram/user-123

**Response (Connected):**
```json
{
  "ok": true,
  "connection": {
    "id": "507f1f77bcf86cd799439011",
    "username": "wreckshoprecords",
    "name": "Wreck Shop Records",
    "profilePictureUrl": "https://...",
    "biography": "Vinyl Records & Digital Beats",
    "website": "wreckshop.com",
    "followers": 15420,
    "following": 823,
    "mediaCount": 456,
    "connectedAt": "2025-11-10T15:30:00.000Z",
    "lastSync": "2025-11-10T16:45:00.000Z",
    "expiresAt": "2026-01-09T15:30:00.000Z",
    "needsRefresh": false
  }
}
```

**Response (Not Connected):**
```json
{
  "ok": false,
  "error": "No active Instagram connection found"
}
```

---

## File Organization

```
Project Root/
│
├── backend/
│   └── src/
│       ├── models/
│       │   └── instagram-connection.ts (NEW)
│       ├── routes/
│       │   ├── auth/
│       │   │   └── instagram.oauth.ts (EXISTING)
│       │   └── integrations.routes.ts (NEW)
│       └── index.ts (UPDATED)
│
├── src/
│   ├── components/
│   │   ├── instagram-connection.tsx (NEW)
│   │   ├── instagram-callback.tsx (NEW)
│   │   ├── integrations.tsx (UPDATED)
│   │   └── ...
│   ├── router.tsx (UPDATED)
│   └── ...
│
└── Documentation/
    ├── INSTAGRAM_OAUTH_SETUP.md
    ├── INSTAGRAM_QUICK_REFERENCE.md
    ├── INSTAGRAM_TESTING_GUIDE.md
    ├── INSTAGRAM_BEFORE_AFTER.md
    ├── INSTAGRAM_INTEGRATION_COMPLETE.md
    ├── INSTAGRAM_INTEGRATION_SUMMARY.md
    └── INSTAGRAM_ARCHITECTURE.md (this file)
```

---

## Success Criteria ✅

- [x] OAuth flow works end-to-end
- [x] Data stored in MongoDB
- [x] Frontend shows real connection status
- [x] Multi-user support
- [x] Error handling
- [x] Security best practices
- [x] Production ready

**All criteria met! 🎉**
