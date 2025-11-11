# Stack Auth Integration & Custom Layer Architecture

**Document Version**: 1.0  
**Date**: November 11, 2025  
**Status**: IMPLEMENTATION READY  
**Decision**: Hybrid Stack Auth + Custom Artist/Manager Logic

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    WRECKSHOP SOCIAL                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         AUTHENTICATION LAYER (Stack Auth)           │   │
│  │  ✅ Login/Signup                                    │   │
│  │  ✅ 2FA (SMS/Authenticator)                         │   │
│  │  ✅ OAuth (Email, Google, Phone)                    │   │
│  │  ✅ Session Management (JWT + Refresh)             │   │
│  │  ✅ Account Settings UI                            │   │
│  │  ✅ Email Verification                             │   │
│  │  ✅ Password Reset                                 │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │    CUSTOM BUSINESS LAYER (Your App)                 │   │
│  │  ✅ Artist-to-Artist relationships                  │   │
│  │  ✅ Manager-to-Artist relationships                 │   │
│  │  ✅ Permission management per artist                │   │
│  │  ✅ Role-specific dashboards                        │   │
│  │  ✅ Gamified leaderboards                           │   │
│  │  ✅ Campaign management                             │   │
│  │  ✅ Analytics & metrics                             │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │        INTEGRATIONS LAYER                           │   │
│  │  ✅ Spotify (via Stack Auth OAuth)                  │   │
│  │  ✅ Instagram (via Stack Auth OAuth)                │   │
│  │  ✅ YouTube, TikTok, Facebook (custom)              │   │
│  │  ✅ Email (SendGrid, Mailgun)                       │   │
│  │  ✅ SMS (Twilio, etc.)                              │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Stack Auth: What It Handles

### Authentication ✅
```
User Flow:
1. User lands on /signup
2. Choose: Email + Password | Google OAuth | Phone/SMS
3. Stack Auth handles verification
4. 2FA setup (SMS or Authenticator)
5. User account created in Stack Auth database
6. JWT + Refresh token issued
```

### OAuth Token Management ✅
```
Spotify/Instagram OAuth:
1. User clicks "Connect Spotify"
2. Stack Auth redirects to Spotify auth
3. User approves
4. Stack Auth stores OAuth token (encrypted)
5. Your app can retrieve token via Stack Auth API
6. Stack Auth auto-refreshes tokens when needed
```

### User Dashboard ✅
```
Stack Auth provides:
- Profile editing (name, email, profile picture)
- Email verification
- Password change
- 2FA management
- Connected accounts (OAuth integrations)
- Sessions management
- Account deletion
```

### Webhooks ✅
```
Stack Auth sends webhooks for:
- user.created → Your app: Create artist profile
- user.updated → Your app: Update metadata
- user.deleted → Your app: Cleanup
- oauth.connected → Your app: Store integration
- oauth.disconnected → Your app: Remove integration
```

---

## Custom Layer: What You Build

### 1. Artist Profile Model

```typescript
// backend/src/models/Artist.ts

interface Artist {
  id: string; // Stack Auth user_id
  email: string; // From Stack Auth
  stageName: string;
  fullName: string;
  profilePicture: string; // From Stack Auth
  
  // Artist metadata
  genre: Genre[];
  niche: string[];
  similarArtists: Artist[]; // IDs of similar artists
  bio: string;
  location: {
    country: string;
    region?: string;
  };
  
  // Account info
  accountType: "ARTIST" | "ARTIST_AND_MANAGER";
  createdAt: Date;
  
  // Verification
  isVerified: boolean;
  verificationDate?: Date;
  
  // Settings
  publicMetricsOptIn: boolean; // For leaderboards
  
  // Integrations (references to Stack Auth OAuth tokens)
  integrations: {
    spotify?: {
      accountId: string;
      displayName: string;
      followers: number;
      isArtistAccount: boolean;
    };
    instagram?: {
      accountId: string;
      username: string;
      followers: number;
    };
    youtube?: {...};
    tiktok?: {...};
    // ... others
  };
}
```

### 2. Manager-Artist Relationship

```typescript
// backend/src/models/ManagerArtist.ts

interface ManagerArtist {
  id: string;
  managerId: string; // Stack Auth user_id
  artistId: string; // Stack Auth user_id
  
  // Relationship status
  status: "PENDING" | "ACTIVE" | "INACTIVE";
  approvedAt?: Date;
  createdAt: Date;
  
  // Permissions (granular)
  permissions: {
    VIEW_ANALYTICS: boolean;
    CREATE_CAMPAIGN: boolean;
    EDIT_CAMPAIGN: boolean;
    DELETE_CAMPAIGN: boolean;
    POST_SOCIAL: boolean;
    EDIT_PROFILE: boolean;
    CONFIGURE_INTEGRATIONS: boolean;
    INVITE_COLLABORATOR: boolean;
    FULL_CONTROL: boolean;
  };
  
  // Audit
  createdBy: string; // Manager ID
  updatedAt: Date;
  updatedBy?: string;
}
```

### 3. Permission Checking Middleware

```typescript
// backend/src/middleware/checkPermission.ts

export async function checkArtistAccess(
  req: Request,
  artistId: string
): Promise<boolean> {
  const userId = req.user.id; // From Stack Auth JWT
  
  // If user IS the artist
  if (userId === artistId) return true;
  
  // If user is a manager for this artist
  const managerArtist = await ManagerArtist.findOne({
    managerId: userId,
    artistId: artistId,
    status: "ACTIVE"
  });
  
  return !!managerArtist;
}

export async function checkPermission(
  req: Request,
  artistId: string,
  permission: string
): Promise<boolean> {
  const userId = req.user.id;
  
  // Artists have all permissions on their own account
  if (userId === artistId) return true;
  
  // Check manager permissions
  const managerArtist = await ManagerArtist.findOne({
    managerId: userId,
    artistId: artistId,
    status: "ACTIVE"
  });
  
  if (!managerArtist) return false;
  
  return managerArtist.permissions[permission] === true;
}
```

### 4. API Routes (Custom)

```typescript
// backend/src/routes/managers.ts

// Manager invites artist
POST /api/managers/invite-artist
{
  artistEmail: "artist@example.com",
  permissions: {
    VIEW_ANALYTICS: true,
    CREATE_CAMPAIGN: true,
    EDIT_CAMPAIGN: true,
    // ... other permissions
  }
}
→ Creates ManagerArtist with status: PENDING
→ Sends email to artist with acceptance link

// Artist approves manager
POST /api/artists/approve-manager/:invitationId
→ Sets ManagerArtist status: ACTIVE
→ Manager now has dashboard access

// Artist updates manager permissions
PUT /api/artists/managers/:managerId/permissions
{
  permissions: { ... }
}
→ Only artist can update their manager's permissions

// Manager views managed artists
GET /api/managers/roster
→ Returns all ManagerArtist records where managerId = user.id
→ Includes permissions for each artist

// Get artist campaigns (with permission check)
GET /api/artists/:artistId/campaigns
→ Checks: Is user the artist OR is manager with VIEW permission?
→ Returns: Artist's campaigns only
```

### 5. Dashboard Data Aggregation

```typescript
// backend/src/routes/dashboard.ts

GET /api/dashboard/summary?role=artist
→ Returns artist-specific metrics (see DASHBOARD_METRICS_BY_ROLE.md)

GET /api/dashboard/summary?role=producer
→ Returns producer/manager-specific metrics
→ Aggregates all managed artists' data

POST /api/dashboard/refresh
→ Manually trigger Spotify/Instagram sync for user's integrations
→ Updates analytics in database
```

---

## Data Flow: Stack Auth Integration Points

### Signup → Artist Creation

```
User clicks "Sign up"
↓
Stack Auth signup page (email, Google, or phone)
↓
User completes 2FA
↓
Stack Auth creates user + issues JWT
↓
Stack Auth fires webhook: user.created
↓
Your app receives webhook:
  - Extract user_id from Stack Auth
  - Ask user for: stageName, genre, similar artists
  - Create Artist record in your DB
  - Link to Stack Auth user_id
↓
Redirect to platform integration step:
  - "Connect your Spotify account"
  - Stack Auth OAuth flow for Spotify
  - Store token via Stack Auth
  - User's integrations populated
↓
Dashboard ready
```

### Login → Dashboard

```
User visits /login
↓
Stack Auth login page
↓
User completes 2FA
↓
Stack Auth issues JWT
↓
User redirected to /dashboard
↓
Frontend fetches JWT from Stack Auth
↓
Frontend calls your API:
  GET /api/dashboard/summary
  Headers: Authorization: Bearer <stack-auth-jwt>
↓
Your middleware:
  - Validates JWT with Stack Auth
  - Extracts user_id
  - Checks Artist record in your DB
  - Loads dashboard data
↓
Dashboard rendered (Artist or Producer view based on role)
```

### Manager Onboarding

```
Manager sends email request to admin@wreckshop.com:
  "I want to manage Artist A, Artist B, Artist C"
↓
Admin reviews email + artist claims
↓
Admin creates Stack Auth user manually OR
Admin sends unique signup link to manager email
↓
Manager creates account via Stack Auth (same process as artist)
↓
Admin manually creates ManagerArtist records:
  - managerId = manager's Stack Auth user_id
  - artistId = artist's Stack Auth user_id
  - status = PENDING
  - permissions = { ... }
↓
System sends emails to artists:
  "Manager X wants to manage your account. Approve?"
↓
Artist clicks approval link
↓
ManagerArtist status → ACTIVE
↓
Manager can now see artist's data + take actions
```

---

## Database Schema Overview

### Tables You Need to Create (Stack Auth handles Users)

```sql
-- Artists (extended profile)
CREATE TABLE artists (
  id UUID PRIMARY KEY,
  stack_auth_user_id VARCHAR UNIQUE NOT NULL, -- Links to Stack Auth
  stage_name VARCHAR NOT NULL,
  full_name VARCHAR NOT NULL,
  genre JSONB NOT NULL, -- ["Hip-Hop", "Trap"]
  niche JSONB NOT NULL, -- ["West Coast", "Underground"]
  similar_artists JSONB, -- [artist_ids]
  bio TEXT,
  location_country VARCHAR,
  location_region VARCHAR,
  account_type VARCHAR, -- "ARTIST" or "ARTIST_AND_MANAGER"
  public_metrics_opt_in BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  verification_date TIMESTAMP,
  integrations JSONB, -- {spotify: {...}, instagram: {...}}
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- Manager-Artist Relationships
CREATE TABLE manager_artists (
  id UUID PRIMARY KEY,
  manager_id UUID NOT NULL REFERENCES artists(id),
  artist_id UUID NOT NULL REFERENCES artists(id),
  status VARCHAR, -- "PENDING", "ACTIVE", "INACTIVE"
  approved_at TIMESTAMP,
  permissions JSONB NOT NULL, -- {VIEW_ANALYTICS: true, ...}
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  UNIQUE(manager_id, artist_id)
);

-- Campaigns, Releases, Events, etc. (already exist)
-- All reference artist_id from your artists table

-- Audit Trail
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  action VARCHAR NOT NULL,
  resource_type VARCHAR, -- "campaign", "artist", etc.
  resource_id UUID,
  changes JSONB,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

---

## JWT Flow with Stack Auth

### Backend Validation

```typescript
// backend/src/middleware/auth.ts

import { Stack } from '@stack-auth/sdk';

const stack = new Stack({
  projectId: process.env.STACK_PROJECT_ID,
  publishableClientKey: process.env.STACK_PUBLISHABLE_CLIENT_KEY,
  secretServerKey: process.env.STACK_SECRET_SERVER_KEY,
});

export async function validateStackAuthJWT(req: Request) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) throw new Error('No token');
  
  try {
    const user = await stack.getUser({ accessToken: token });
    
    // User is valid, attach to request
    req.user = {
      id: user.id,
      email: user.email,
      stackAuthId: user.id,
    };
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// Usage in routes:
router.get('/api/dashboard/summary', validateStackAuthJWT, async (req, res) => {
  const user = req.user; // Now we have verified user
  const artist = await Artist.findByStackAuthId(user.stackAuthId);
  // ... return dashboard data
});
```

---

## Integration Steps

### Step 1: Stack Auth Setup (Day 1)
- [ ] Sign up for Stack Auth (https://app.stack-auth.com)
- [ ] Create project + get API keys
- [ ] Set up Next.js integration
- [ ] Deploy Stack Auth locally
- [ ] Test signup/login flow

### Step 2: Database Models (Days 2-3)
- [ ] Create Artist model + table
- [ ] Create ManagerArtist model + table
- [ ] Create Audit Logs table
- [ ] Add migrations
- [ ] Test data creation

### Step 3: Webhook Handlers (Days 3-4)
- [ ] Create `/api/webhooks/stack-auth` endpoint
- [ ] Handle `user.created` → Create Artist record
- [ ] Handle `user.deleted` → Cleanup Artist data
- [ ] Handle `oauth.connected` → Store integration info
- [ ] Test webhooks locally

### Step 4: Permission Middleware (Days 4-5)
- [ ] Build `checkArtistAccess` middleware
- [ ] Build `checkPermission` middleware
- [ ] Test permission matrix
- [ ] Apply to all existing routes

### Step 5: Manager API Routes (Days 5-6)
- [ ] POST `/api/managers/invite-artist`
- [ ] POST `/api/artists/approve-manager`
- [ ] PUT `/api/artists/managers/:id/permissions`
- [ ] GET `/api/managers/roster`
- [ ] Test all routes

### Step 6: Dashboard API (Days 6-7)
- [ ] GET `/api/dashboard/summary` (artist)
- [ ] GET `/api/dashboard/summary` (producer)
- [ ] Connect to real analytics data
- [ ] Test both dashboards

### Step 7: Frontend Integration (Days 7-8)
- [ ] Update login page to use Stack Auth components
- [ ] Update signup page (if custom needed)
- [ ] Fetch + display JWT from Stack Auth
- [ ] Send JWT in API requests
- [ ] Update dashboard to show role-specific data

---

## Environment Variables

```bash
# Stack Auth
STACK_PROJECT_ID=<your-project-id>
STACK_PUBLISHABLE_CLIENT_KEY=<your-publishable-key>
STACK_SECRET_SERVER_KEY=<your-secret-key>

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/wreckshop

# Your app
JWT_SECRET=<your-jwt-secret> # For your own tokens, if needed
WEBHOOK_SECRET=<stack-auth-webhook-secret>

# Integrations
SPOTIFY_CLIENT_ID=<from-spotify-dashboard>
SPOTIFY_CLIENT_SECRET=<from-spotify-dashboard>
# (Stack Auth handles OAuth for Spotify, but you may need these for other flows)

# Email
SENDGRID_API_KEY=<for-transactional-emails>

# SMS (for manager invitations, etc.)
TWILIO_ACCOUNT_SID=<twilio-account>
TWILIO_AUTH_TOKEN=<twilio-token>
```

---

## Security Considerations

### Stack Auth Handles
- ✅ Password hashing + salting
- ✅ JWT generation + validation
- ✅ Session management
- ✅ OAuth token storage (encrypted)
- ✅ 2FA implementation
- ✅ Rate limiting

### You Must Handle
- ✅ Validate JWT on every API call
- ✅ Check permissions on every data access
- ✅ Validate manager-artist relationships
- ✅ Audit log all sensitive actions
- ✅ Encrypt sensitive data in your DB (payment info, etc.)
- ✅ Rate limit your API endpoints
- ✅ Validate webhook signatures from Stack Auth

### Implementation

```typescript
// ALWAYS validate JWT
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    await validateStackAuthJWT(req);
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

// ALWAYS check permissions
export async function requirePermission(permission: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const artistId = req.params.artistId;
    const hasPermission = await checkPermission(req, artistId, permission);
    
    if (!hasPermission) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    next();
  };
}

// Usage:
router.put('/api/artists/:artistId/campaigns/:campaignId',
  requireAuth,
  requirePermission('EDIT_CAMPAIGN'),
  updateCampaign
);
```

---

## Testing Strategy

### Unit Tests
- Permission checking logic
- Manager-artist relationship creation
- Permission matrix validation

### Integration Tests
- Stack Auth JWT validation
- Webhook handlers
- API routes with different permission levels

### E2E Tests
- Artist signup → create artist profile
- Manager invite → artist approve → dashboard access
- Manager edit campaign → artist sees update
- Permission denial (manager tries to exceed permissions)

---

## Deployment

### Stack Auth Options
1. **Managed** (easiest): Use Stack Auth's hosted service
2. **Self-hosted**: Deploy Stack Auth container alongside your app

**Recommendation**: Start with managed, migrate to self-hosted later if needed.

---

## Timeline

**Total Implementation: 8-10 days**
- Stack Auth setup: 1 day
- Database + models: 2 days
- Webhooks + middleware: 2 days
- API routes: 2 days
- Frontend integration: 2 days
- Testing + fixes: 1-2 days

---

## What This Gives You

✅ Production-ready authentication  
✅ 2FA out of the box  
✅ OAuth token management  
✅ User dashboard  
✅ Artist account management  
✅ Manager invitation flow  
✅ Granular permissions per artist  
✅ Complete audit trail  
✅ Zero vendor lock-in (self-hostable)  

---

## Related Documentation
- See `USER_ROLES_AND_PERMISSIONS.md` for role details (still applies)
- See `DATA_OWNERSHIP_AND_ISOLATION.md` for data access rules (still applies)
- See `ROLE_BASED_API_ACCESS.md` for API patterns (still applies, with Stack Auth validation)
- See `DASHBOARD_METRICS_BY_ROLE.md` for dashboard specs (still applies)

---

**Status**: ✅ READY FOR IMPLEMENTATION  
**Next Action**: Begin Phase 1 with Stack Auth setup
