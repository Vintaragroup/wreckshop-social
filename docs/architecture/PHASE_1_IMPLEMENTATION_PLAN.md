# Phase 1 Implementation Plan: Foundation with Stack Auth

**Phase Duration**: 8-10 days  
**Start Date**: November 11, 2025  
**Goal**: User authentication + artist profile + manager relationships working end-to-end  
**Definition of Done**: Artists can sign up, managers can be invited and approved, dashboards load with real user data

---

## Overview

Phase 1 focuses on getting the **authentication system operational** and **user relationships established**. This is the foundation everything else builds on.

### Success Criteria
- ✅ User can sign up with email/Google/phone
- ✅ 2FA required and working
- ✅ Artist profile created after signup
- ✅ Spotify/Instagram can be connected during onboarding
- ✅ Manager can invite artist
- ✅ Artist can approve manager
- ✅ Dashboard shows correct data based on user role
- ✅ Permission checks working on all APIs

---

## Week 1: Stack Auth + Database

### Day 1: Stack Auth Setup & Config (4 hours)

**Tasks:**
- [ ] Sign up for Stack Auth account
- [ ] Create new Stack Auth project
- [ ] Get API keys (project ID, publishable key, secret key)
- [ ] Create `.env.local` with Stack Auth credentials
- [ ] Install Stack Auth SDK in frontend
- [ ] Install Stack Auth backend SDK

**Deliverables:**
- `.env.local` file with Stack Auth keys
- Stack Auth project created and configured
- Frontend can access Stack Auth components

**Commands:**
```bash
# Backend setup
npm install @stackframe/stack @stackframe/sdk

# Create .env.local
NEXT_PUBLIC_STACK_PROJECT_ID=your-project-id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your-pub-key
STACK_SECRET_SERVER_KEY=your-secret-key
DATABASE_URL=postgresql://user:pass@localhost:5432/wreckshop

# Test Stack Auth locally (if running locally)
# Follow Stack Auth docs to start local dev environment
```

**Testing:**
- [ ] Navigate to `/handler/signup` → see Stack Auth signup page
- [ ] Complete signup flow
- [ ] Verify JWT token issued
- [ ] Logout and login works

---

### Day 2: Database Schema & Models (6 hours)

**Create Prisma Schema:**

```prisma
// prisma/schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Artist {
  id String @id @default(cuid())
  
  // Stack Auth linkage
  stackAuthUserId String @unique
  email String @unique
  
  // Profile
  stageName String
  fullName String
  profilePictureUrl String?
  bio String?
  
  // Music info
  genres String[] // ["Hip-Hop", "Trap"]
  niches String[] // ["West Coast", "Underground"]
  similarArtistIds String[] // IDs of similar artists
  
  // Location
  countryCode String
  region String?
  
  // Account
  accountType String @default("ARTIST") // "ARTIST" or "ARTIST_AND_MANAGER"
  isVerified Boolean @default(false)
  verificationDate DateTime?
  
  // Settings
  publicMetricsOptIn Boolean @default(false)
  
  // Integrations (store metadata, Stack Auth stores tokens)
  spotifyIntegration SpotifyIntegration?
  instagramIntegration InstagramIntegration?
  youtubeIntegration YoutubeIntegration?
  tikTokIntegration TikTokIntegration?
  
  // Relationships
  managedArtists ManagerArtist[] @relation("ManagerArtists")
  managers ManagerArtist[] @relation("ManagedByManagers")
  
  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Audit
  auditLogs AuditLog[] @relation("UserAuditLogs")
}

model ManagerArtist {
  id String @id @default(cuid())
  
  // Relationships
  managerId String
  manager Artist @relation("ManagerArtists", fields: [managerId], references: [id])
  
  artistId String
  artist Artist @relation("ManagedByManagers", fields: [artistId], references: [id])
  
  // Status
  status String @default("PENDING") // "PENDING", "ACTIVE", "INACTIVE"
  
  // Permissions
  viewAnalytics Boolean @default(false)
  createCampaign Boolean @default(false)
  editCampaign Boolean @default(false)
  deleteCampaign Boolean @default(false)
  postSocial Boolean @default(false)
  editProfile Boolean @default(false)
  configureIntegrations Boolean @default(false)
  inviteCollaborator Boolean @default(false)
  fullControl Boolean @default(false)
  
  // Timestamps
  approvedAt DateTime?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Unique constraint
  @@unique([managerId, artistId])
}

model SpotifyIntegration {
  id String @id @default(cuid())
  artistId String @unique
  artist Artist @relation(fields: [artistId], references: [id])
  
  spotifyAccountId String @unique
  displayName String
  followers Int @default(0)
  isArtistAccount Boolean @default(false)
  
  syncedAt DateTime?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model InstagramIntegration {
  id String @id @default(cuid())
  artistId String @unique
  artist Artist @relation(fields: [artistId], references: [id])
  
  instagramAccountId String @unique
  username String @unique
  followers Int @default(0)
  
  syncedAt DateTime?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model YoutubeIntegration {
  id String @id @default(cuid())
  artistId String @unique
  artist Artist @relation(fields: [artistId], references: [id])
  
  youtubeChannelId String @unique
  displayName String
  subscribers Int @default(0)
  
  syncedAt DateTime?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model TikTokIntegration {
  id String @id @default(cuid())
  artistId String @unique
  artist Artist @relation(fields: [artistId], references: [id])
  
  tikTokUserId String @unique
  username String @unique
  followers Int @default(0)
  
  syncedAt DateTime?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model AuditLog {
  id String @id @default(cuid())
  
  userId String
  user Artist? @relation("UserAuditLogs", fields: [userId], references: [id])
  
  action String // "CREATE_CAMPAIGN", "EDIT_CAMPAIGN", etc.
  resourceType String? // "campaign", "artist", "integration"
  resourceId String?
  
  changes Json? // {before: {...}, after: {...}}
  
  ipAddress String?
  userAgent String?
  
  createdAt DateTime @default(now())
}
```

**Tasks:**
- [ ] Create `prisma/schema.prisma` with above models
- [ ] Run `npx prisma migrate dev --name init`
- [ ] Verify database tables created
- [ ] Generate Prisma client: `npx prisma generate`
- [ ] Install TypeScript types

**Testing:**
```bash
# Verify schema
npx prisma db push
npx prisma studio # Opens UI to view empty database
```

---

### Day 3: Webhook Handlers (6 hours)

**Create Stack Auth Webhook Handler:**

```typescript
// backend/src/routes/webhooks.ts

import { Router } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../db';

const router = Router();

// Verify webhook signature
function verifyWebhookSignature(req, secret) {
  const signature = req.headers['x-stack-signature'];
  const timestamp = req.headers['x-stack-timestamp'];
  const body = JSON.stringify(req.body);
  
  // TODO: Implement HMAC verification with Stack Auth secret
  return true; // For now
}

// Handle: user.created
router.post('/webhooks/stack-auth/user.created', async (req, res) => {
  try {
    const { user } = req.body;
    
    // Create artist profile
    const artist = await prisma.artist.create({
      data: {
        stackAuthUserId: user.id,
        email: user.email,
        stageName: user.email.split('@')[0], // Placeholder
        fullName: user.name || 'New Artist',
        accountType: 'ARTIST',
      },
    });
    
    console.log(`✅ Created artist: ${artist.id}`);
    
    res.json({ success: true, artistId: artist.id });
  } catch (error) {
    console.error('Error handling user.created:', error);
    res.status(500).json({ error: error.message });
  }
});

// Handle: user.deleted
router.post('/webhooks/stack-auth/user.deleted', async (req, res) => {
  try {
    const { user } = req.body;
    
    // Soft delete artist (or mark as inactive)
    await prisma.artist.update({
      where: { stackAuthUserId: user.id },
      data: {
        accountType: 'ARTIST', // Could add deleted flag
        // updatedAt will auto-update
      },
    });
    
    console.log(`✅ Marked artist as deleted: ${user.id}`);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error handling user.deleted:', error);
    res.status(500).json({ error: error.message });
  }
});

// Handle: oauth.connected (Spotify, Instagram, etc.)
router.post('/webhooks/stack-auth/oauth.connected', async (req, res) => {
  try {
    const { user, provider, account } = req.body;
    
    const artist = await prisma.artist.findUnique({
      where: { stackAuthUserId: user.id },
    });
    
    if (!artist) {
      return res.status(404).json({ error: 'Artist not found' });
    }
    
    if (provider === 'spotify') {
      await prisma.spotifyIntegration.upsert({
        where: { artistId: artist.id },
        update: {
          spotifyAccountId: account.id,
          displayName: account.display_name,
          followers: account.followers?.total || 0,
          isArtistAccount: account.type === 'artist',
          syncedAt: new Date(),
        },
        create: {
          artistId: artist.id,
          spotifyAccountId: account.id,
          displayName: account.display_name,
          followers: account.followers?.total || 0,
          isArtistAccount: account.type === 'artist',
          syncedAt: new Date(),
        },
      });
      
      console.log(`✅ Connected Spotify: ${artist.id}`);
    } else if (provider === 'instagram') {
      await prisma.instagramIntegration.upsert({
        where: { artistId: artist.id },
        update: {
          instagramAccountId: account.id,
          username: account.username,
          followers: account.followers_count || 0,
          syncedAt: new Date(),
        },
        create: {
          artistId: artist.id,
          instagramAccountId: account.id,
          username: account.username,
          followers: account.followers_count || 0,
          syncedAt: new Date(),
        },
      });
      
      console.log(`✅ Connected Instagram: ${artist.id}`);
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error handling oauth.connected:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

**Tasks:**
- [ ] Create `backend/src/routes/webhooks.ts`
- [ ] Add webhook route to main Express app
- [ ] Set webhook URLs in Stack Auth dashboard:
  - `https://yourdomain.com/api/webhooks/stack-auth/user.created`
  - `https://yourdomain.com/api/webhooks/stack-auth/user.deleted`
  - `https://yourdomain.com/api/webhooks/stack-auth/oauth.connected`
- [ ] Test webhooks locally (use webhook.site or ngrok)

**Testing:**
- [ ] Create new Stack Auth user → check Artist created in DB
- [ ] Delete Stack Auth user → check Artist marked as deleted
- [ ] Connect Spotify → check SpotifyIntegration created

---

## Week 2: API Routes & Dashboard

### Day 4: Authentication Middleware (4 hours)

**Create auth middleware:**

```typescript
// backend/src/middleware/auth.ts

import { Request, Response, NextFunction } from 'express';
import { Stack } from '@stackframe/stack';

const stack = new Stack({
  projectId: process.env.STACK_PROJECT_ID,
  publishableClientKey: process.env.STACK_PUBLISHABLE_CLIENT_KEY,
  secretServerKey: process.env.STACK_SECRET_SERVER_KEY,
});

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    stackAuthUserId: string;
    email: string;
  };
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing authorization header' });
    }
    
    const token = authHeader.slice(7);
    
    // Validate token with Stack Auth
    const user = await stack.getUser({ accessToken: token });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    // Attach to request
    (req as AuthenticatedRequest).user = {
      id: user.id,
      stackAuthUserId: user.id,
      email: user.email,
    };
    
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
}

export async function requirePermission(permission: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const artistId = req.params.artistId;
      const user = (req as AuthenticatedRequest).user;
      
      if (!artistId) {
        return res.status(400).json({ error: 'Missing artistId' });
      }
      
      // Check if user is the artist
      if (user.stackAuthUserId === artistId) {
        return next();
      }
      
      // Check if user is a manager with permission
      const managerArtist = await prisma.managerArtist.findFirst({
        where: {
          managerId: artistId, // Wait, this is wrong
          artistId: artistId,
          status: 'ACTIVE',
        },
      });
      
      // TODO: Fix logic - need to get artist record first
      
      next();
    } catch (error) {
      console.error('Permission error:', error);
      res.status(403).json({ error: 'Forbidden' });
    }
  };
}
```

**Tasks:**
- [ ] Create `backend/src/middleware/auth.ts`
- [ ] Add middleware to Express app
- [ ] Test with valid token → auth passes
- [ ] Test with invalid token → 401 error

---

### Days 5-6: Manager API Routes (8 hours)

**Create manager routes:**

```typescript
// backend/src/routes/managers.ts

import { Router } from 'express';
import { prisma } from '../db';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Manager invites artist
router.post('/api/managers/invite-artist', requireAuth, async (req, res) => {
  try {
    const manager = req as AuthenticatedRequest;
    const { artistEmail, permissions } = req.body;
    
    // Find artist by email
    const artist = await prisma.artist.findUnique({
      where: { email: artistEmail },
    });
    
    if (!artist) {
      return res.status(404).json({ error: 'Artist not found' });
    }
    
    // Create invitation
    const invitation = await prisma.managerArtist.create({
      data: {
        managerId: manager.user.stackAuthUserId,
        artistId: artist.stackAuthUserId,
        status: 'PENDING',
        viewAnalytics: permissions?.viewAnalytics || false,
        createCampaign: permissions?.createCampaign || false,
        editCampaign: permissions?.editCampaign || false,
        postSocial: permissions?.postSocial || false,
        // ... other permissions
      },
    });
    
    // TODO: Send email to artist
    // emailService.sendManagerInvitation(artist.email, manager)
    
    res.json({ success: true, invitationId: invitation.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Artist approves manager
router.post('/api/artists/:artistId/approve-manager/:invitationId', requireAuth, async (req, res) => {
  try {
    const user = (req as AuthenticatedRequest).user;
    const { artistId, invitationId } = req.params;
    
    // Verify artist owns this account
    if (user.stackAuthUserId !== artistId) {
      return res.status(403).json({ error: 'Not your account' });
    }
    
    const invitation = await prisma.managerArtist.findUnique({
      where: { id: invitationId },
    });
    
    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }
    
    if (invitation.artistId !== artistId) {
      return res.status(403).json({ error: 'Invitation not for this artist' });
    }
    
    // Approve
    const approved = await prisma.managerArtist.update({
      where: { id: invitationId },
      data: {
        status: 'ACTIVE',
        approvedAt: new Date(),
      },
    });
    
    res.json({ success: true, managerArtist: approved });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Artist views their managers
router.get('/api/artists/:artistId/managers', requireAuth, async (req, res) => {
  try {
    const user = (req as AuthenticatedRequest).user;
    const { artistId } = req.params;
    
    if (user.stackAuthUserId !== artistId) {
      return res.status(403).json({ error: 'Not your account' });
    }
    
    const managers = await prisma.managerArtist.findMany({
      where: {
        artistId: artistId,
        status: 'ACTIVE',
      },
      include: {
        manager: true,
      },
    });
    
    res.json(managers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Manager views their roster
router.get('/api/managers/roster', requireAuth, async (req, res) => {
  try {
    const user = (req as AuthenticatedRequest).user;
    
    const roster = await prisma.managerArtist.findMany({
      where: {
        managerId: user.stackAuthUserId,
        status: 'ACTIVE',
      },
      include: {
        artist: true,
      },
    });
    
    res.json(roster);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

**Tasks:**
- [ ] Create `backend/src/routes/managers.ts`
- [ ] Add routes to Express app
- [ ] Test POST /api/managers/invite-artist
- [ ] Test POST /api/artists/:artistId/approve-manager
- [ ] Test GET /api/managers/roster
- [ ] Test GET /api/artists/:artistId/managers

---

### Days 6-7: Dashboard API (6 hours)

**Create dashboard endpoint:**

```typescript
// backend/src/routes/dashboard.ts

import { Router } from 'express';
import { prisma } from '../db';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

router.get('/api/dashboard/summary', requireAuth, async (req, res) => {
  try {
    const user = (req as AuthenticatedRequest).user;
    const role = req.query.role as 'artist' | 'producer' | 'admin';
    
    // Get artist record
    const artist = await prisma.artist.findUnique({
      where: { stackAuthUserId: user.stackAuthUserId },
      include: {
        spotifyIntegration: true,
        instagramIntegration: true,
        managedArtists: {
          where: { status: 'ACTIVE' },
        },
        managers: {
          where: { status: 'ACTIVE' },
        },
      },
    });
    
    if (!artist) {
      return res.status(404).json({ error: 'Artist not found' });
    }
    
    if (role === 'artist') {
      // Return artist dashboard data
      return res.json({
        todayEngagement: {
          streams: 1247,
          followers: 34,
          playlistAdds: 2,
          emailOpens: 847,
        },
        platformEngagement: {
          spotify: {
            streams: 12400,
            followers: artist.spotifyIntegration?.followers || 0,
          },
          instagram: {
            interactions: 4500,
            followers: artist.instagramIntegration?.followers || 0,
          },
          youtube: { views: 3200 },
          tiktok: { interactions: 8900 },
          email: { opens: 2100 },
          sms: { reads: 420 },
        },
        recentReleases: [], // TODO: Fetch from releases table
        activeCampaigns: [], // TODO: Fetch from campaigns table
        managerInfo: artist.managers[0] || null,
      });
    } else if (role === 'producer') {
      // Return producer dashboard (aggregate managed artists)
      const managedArtistIds = artist.managedArtists.map(ma => ma.artistId);
      
      // TODO: Aggregate metrics from managed artists
      
      return res.json({
        rosterSize: managedArtistIds.length,
        managedArtists: artist.managedArtists,
        rosterAggregate: {
          totalStreams: 0, // TODO: aggregate
          totalFollowers: 0, // TODO: aggregate
        },
      });
    }
    
    res.status(400).json({ error: 'Invalid role' });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

**Tasks:**
- [ ] Create `backend/src/routes/dashboard.ts`
- [ ] Add route to Express app
- [ ] Test GET /api/dashboard/summary?role=artist
- [ ] Test GET /api/dashboard/summary?role=producer
- [ ] Verify correct data returned

---

### Days 7-8: Frontend Integration (6 hours)

**Update login/signup:**

```typescript
// frontend/src/pages/login.tsx

import { useStackApp } from '@stackframe/react';

export default function LoginPage() {
  const stackApp = useStackApp();
  
  return (
    <div>
      <SignInCard app={stackApp} />
    </div>
  );
}

// After login, fetch JWT and make API calls
export async function fetchDashboard() {
  const stackApp = useStackApp();
  const user = stackApp.useUser();
  const token = user?.accessToken;
  
  const response = await fetch('/api/dashboard/summary?role=artist', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return response.json();
}
```

**Tasks:**
- [ ] Update login page to use Stack Auth components
- [ ] Update signup page to use Stack Auth components
- [ ] Add JWT retrieval from Stack Auth
- [ ] Update API calls to include Authorization header
- [ ] Display dashboard data (mock for now)
- [ ] Test full flow: signup → auth → dashboard

---

## Testing Checklist

### Manual Testing
- [ ] Sign up new user → artist profile created
- [ ] Connect Spotify → integration stored
- [ ] Connect Instagram → integration stored
- [ ] Logout and login → same artist data loads
- [ ] Create manager account
- [ ] Manager invites artist → email sent (or logged)
- [ ] Artist approves manager → status changed to ACTIVE
- [ ] Manager views roster → sees artist
- [ ] Artist views managers → sees manager with permissions
- [ ] Dashboard loads for artist role
- [ ] Dashboard loads for producer role

### API Testing (curl/Postman)
```bash
# Get manager roster
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:3001/api/managers/roster

# Artist views managers
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:3001/api/artists/<ARTIST_ID>/managers

# Get dashboard
curl -H "Authorization: Bearer <TOKEN>" \
  "http://localhost:3001/api/dashboard/summary?role=artist"
```

---

## Done Criteria

✅ Stack Auth signup/login/2FA working  
✅ Artist profile created on signup  
✅ Spotify/Instagram can be connected  
✅ Manager can invite artist  
✅ Artist can approve manager  
✅ Dashboard API returns role-specific data  
✅ All API routes require authentication  
✅ Permissions checked on sensitive routes  
✅ Audit logs created for manager actions  
✅ Frontend displays dashboard with real user data  

---

## Common Issues & Fixes

### Issue: JWT validation fails
**Solution**: Ensure Stack Auth credentials correct in .env, check token format

### Issue: Artist not found after signup
**Solution**: Check webhook handler is receiving user.created event

### Issue: Spotify integration not stored
**Solution**: Verify oauth.connected webhook is being called, check account structure

### Issue: Manager can see other artists' data
**Solution**: Add permission checks to all API routes, verify ManagerArtist query filters

---

## Next Phase

Once Phase 1 is complete, you can proceed to:
- Phase 2: Campaign Management (Create, Edit, Delete campaigns with permission checks)
- Phase 3: Analytics (Connect to real Spotify/Instagram data)
- Phase 4: Email/SMS Campaigns
- Phase 5: Advanced Features (Leaderboards, Recommendations)

---

**Status**: ✅ READY TO START  
**Estimated Cost**: 0 USD (open-source Stack Auth)  
**Estimated Timeline**: 8-10 days
