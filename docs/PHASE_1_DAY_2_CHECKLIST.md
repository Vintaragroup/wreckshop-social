# Phase 1 - Day 2 Checklist: Database Schema & Prisma

**Duration**: 6 hours  
**Prerequisites**: Day 1 complete, Stack Auth configured  
**Goal**: Set up PostgreSQL, Prisma, and create Artist/Manager models

---

## Checklist

### 1. Set Up PostgreSQL Database ⏱️ 30 min

**Option A: Use Docker (Recommended for local dev)**

```bash
# Create docker-compose.yml in project root if not exists
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: wreckshop-postgres
    environment:
      POSTGRES_USER: wreckshop_user
      POSTGRES_PASSWORD: wreckshop_password
      POSTGRES_DB: wreckshop_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U wreckshop_user"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
EOF

# Start PostgreSQL container
docker-compose up -d postgres

# Verify it's running
docker-compose ps
```

**Option B: Use local PostgreSQL**

```bash
# macOS (Homebrew)
brew install postgresql@16
brew services start postgresql@16

# Create database and user
psql -U postgres
CREATE USER wreckshop_user WITH PASSWORD 'wreckshop_password';
CREATE DATABASE wreckshop_dev OWNER wreckshop_user;
```

### 2. Update .env.local with Database URL ⏱️ 5 min

```bash
# backend/.env.local

# Add/Update:
DATABASE_URL="postgresql://wreckshop_user:wreckshop_password@localhost:5432/wreckshop_dev"

# Verify connection:
psql postgresql://wreckshop_user:wreckshop_password@localhost:5432/wreckshop_dev -c "\dt"
```

### 3. Install Prisma ⏱️ 10 min

```bash
cd backend

# Install Prisma CLI and client
npm install @prisma/client
npm install -D prisma

# Verify installation
npx prisma --version
```

### 4. Initialize Prisma ⏱️ 10 min

```bash
cd backend

# Initialize Prisma (creates prisma/ directory and schema.prisma)
npx prisma init

# This creates:
# - prisma/schema.prisma (database schema)
# - prisma/.env (for DATABASE_URL)

# Verify schema was created
ls -la prisma/
```

### 5. Create Prisma Schema ⏱️ 60 min

**Replace `backend/prisma/schema.prisma` with:**

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// ARTIST & MANAGER MODELS
// ============================================

model Artist {
  id String @id @default(cuid())

  // Stack Auth integration
  stackAuthUserId String @unique
  email String @unique
  profilePictureUrl String?

  // Profile info
  stageName String
  fullName String?
  bio String?

  // Music metadata
  genres String[] // ["Hip-Hop", "Trap"]
  niches String[] // ["West Coast", "Underground"]

  // Location
  countryCode String?
  region String?

  // Account settings
  accountType String @default("ARTIST") // "ARTIST" or "ARTIST_AND_MANAGER"
  isVerified Boolean @default(false)
  verificationDate DateTime?

  // Gamification
  publicMetricsOptIn Boolean @default(false)
  leaderboardRank Int?
  leaderboardScore Int @default(0)

  // Relationships - Artists managed by this user
  managedArtists ManagerArtist[] @relation("ManagerArtists")
  
  // Relationships - Managers managing this artist
  managers ManagerArtist[] @relation("ManagedByManagers")

  // Integrations
  spotifyIntegration SpotifyIntegration?
  instagramIntegration InstagramIntegration?
  youtubeIntegration YoutubeIntegration?
  tikTokIntegration TikTokIntegration?

  // Audit log
  auditLogs AuditLog[] @relation("UserAuditLogs")

  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([stackAuthUserId])
  @@index([email])
}

model ManagerArtist {
  id String @id @default(cuid())

  // Relationships
  managerId String
  manager Artist @relation("ManagerArtists", fields: [managerId], references: [id], onDelete: Cascade)

  artistId String
  artist Artist @relation("ManagedByManagers", fields: [artistId], references: [id], onDelete: Cascade)

  // Status
  status String @default("PENDING") // "PENDING" | "ACTIVE" | "INACTIVE" | "REJECTED"

  // Permissions (granular control per artist)
  viewAnalytics Boolean @default(false)
  createCampaign Boolean @default(false)
  editCampaign Boolean @default(false)
  deleteCampaign Boolean @default(false)
  postSocial Boolean @default(false)
  editProfile Boolean @default(false)
  configureIntegrations Boolean @default(false)
  inviteCollaborator Boolean @default(false)
  manageTeam Boolean @default(false)

  // Metadata
  invitedAt DateTime @default(now())
  approvedAt DateTime?
  rejectedAt DateTime?

  // Unique: one manager per artist (but multiple managers can manage different artists)
  @@unique([managerId, artistId])
  @@index([status])
}

// ============================================
// PLATFORM INTEGRATIONS
// ============================================

model SpotifyIntegration {
  id String @id @default(cuid())

  artistId String @unique
  artist Artist @relation(fields: [artistId], references: [id], onDelete: Cascade)

  // OAuth info
  spotifyAccountId String @unique
  displayName String?
  profileUrl String?
  profileImageUrl String?

  // Metadata
  followers Int @default(0)
  isArtistAccount Boolean @default(false)
  genres String[]
  
  // Token info (stored securely via Stack Auth)
  // Stack Auth manages the actual OAuth token
  tokenStoredAt DateTime @default(now())

  // Stats cache
  monthlyListeners Int @default(0)
  dailyStreams Int @default(0)
  totalStreams Int @default(0)
  lastSyncedAt DateTime @default(now())

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([artistId])
}

model InstagramIntegration {
  id String @id @default(cuid())

  artistId String @unique
  artist Artist @relation(fields: [artistId], references: [id], onDelete: Cascade)

  // OAuth info
  instagramAccountId String @unique
  username String @unique
  profileUrl String?
  profileImageUrl String?

  // Metadata
  followers Int @default(0)
  isBusinessAccount Boolean @default(false)

  // Stats cache
  monthlyReach Int @default(0)
  monthlyImpressions Int @default(0)
  engagementRate Float @default(0)
  lastSyncedAt DateTime @default(now())

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([artistId])
}

model YoutubeIntegration {
  id String @id @default(cuid())

  artistId String @unique
  artist Artist @relation(fields: [artistId], references: [id], onDelete: Cascade)

  // OAuth info
  youtubeChannelId String @unique
  channelTitle String?
  channelUrl String?
  channelImageUrl String?

  // Metadata
  subscribers Int @default(0)
  totalViews Int @default(0)

  // Stats cache
  monthlyViews Int @default(0)
  monthlySubscribers Int @default(0)
  lastSyncedAt DateTime @default(now())

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([artistId])
}

model TikTokIntegration {
  id String @id @default(cuid())

  artistId String @unique
  artist Artist @relation(fields: [artistId], references: [id], onDelete: Cascade)

  // OAuth info
  tiktokUserId String @unique
  username String @unique
  profileUrl String?
  profileImageUrl String?

  // Metadata
  followers Int @default(0)
  totalLikes Int @default(0)
  videoCount Int @default(0)

  // Stats cache
  monthlyViews Int @default(0)
  monthlyEngagement Int @default(0)
  lastSyncedAt DateTime @default(now())

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([artistId])
}

// ============================================
// AUDIT TRAIL
// ============================================

model AuditLog {
  id String @id @default(cuid())

  userId String
  user Artist @relation("UserAuditLogs", fields: [userId], references: [id], onDelete: Cascade)

  action String // "CREATE_MANAGER", "UPDATE_PERMISSIONS", etc.
  resourceType String // "ARTIST", "MANAGER_ARTIST", etc.
  resourceId String
  
  changes Json? // What changed

  createdAt DateTime @default(now())

  @@index([userId])
  @@index([createdAt])
}
```

### 6. Run Database Migrations ⏱️ 20 min

```bash
cd backend

# Create initial migration
npx prisma migrate dev --name init

# This will:
# 1. Create database tables based on schema
# 2. Generate Prisma Client
# 3. Create prisma/migrations/xxx_init/ directory

# Verify tables were created
psql postgresql://wreckshop_user:wreckshop_password@localhost:5432/wreckshop_dev -c "\dt"

# Expected output should show:
# - Artist
# - ManagerArtist
# - SpotifyIntegration
# - InstagramIntegration
# - YoutubeIntegration
# - TikTokIntegration
# - AuditLog
```

### 7. Generate Prisma Client ⏱️ 10 min

```bash
cd backend

# Generate Prisma Client (should already be done, but verify)
npx prisma generate

# This creates node_modules/.prisma/client
# Now you can use Prisma in your code
```

### 8. Create Prisma Service File ⏱️ 15 min

**Create `backend/src/lib/prisma.ts`:**

```typescript
import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client Instance
 * 
 * Use this to access the database from your routes and services.
 * 
 * Example:
 * const artist = await prisma.artist.create({...})
 */
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'warn', 'error']
    : ['error'],
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default prisma;
```

### 9. Verify Prisma Setup ⏱️ 15 min

**Create `backend/src/routes/test-prisma.routes.ts`:**

```typescript
import express, { Request, Response } from 'express';
import prisma from '../lib/prisma.js';

const router = express.Router();

/**
 * GET /api/test/prisma-health
 * 
 * Verify Prisma can connect to database
 */
router.get('/prisma-health', async (req: Request, res: Response) => {
  try {
    // Try to query a simple count
    const artistCount = await prisma.artist.count();

    res.json({
      success: true,
      message: 'Prisma connected to database',
      artistCount,
      tables: [
        'Artist',
        'ManagerArtist',
        'SpotifyIntegration',
        'InstagramIntegration',
        'YoutubeIntegration',
        'TikTokIntegration',
        'AuditLog',
      ],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
```

**Update `backend/src/index.ts` to include test routes:**

```typescript
import testRoutes from './routes/test-prisma.routes.js'

// ... in the app routes section:
app.use('/api/test', testRoutes)
```

### 10. Test Database Connection ⏱️ 15 min

```bash
# Start backend
cd backend && npm run dev

# In another terminal, test Prisma health
curl http://localhost:4002/api/test/prisma-health

# Expected response:
# {
#   "success": true,
#   "message": "Prisma connected to database",
#   "artistCount": 0,
#   "tables": [...]
# }
```

### 11. View Database with Prisma Studio ⏱️ 10 min

```bash
cd backend

# Open Prisma Studio (visual database explorer)
npx prisma studio

# This opens browser at http://localhost:5555
# You can view/edit all tables visually
```

---

## Verification Checklist ✅

- [ ] PostgreSQL running (docker or local)
- [ ] `DATABASE_URL` in `.env.local`
- [ ] `@prisma/client` installed
- [ ] `prisma/schema.prisma` created
- [ ] Migrations ran successfully
- [ ] Prisma Client generated
- [ ] `backend/src/lib/prisma.ts` created
- [ ] Test route created
- [ ] `/api/test/prisma-health` returns success
- [ ] `npx prisma studio` opens database viewer
- [ ] All 7 tables visible in studio
- [ ] No TypeScript errors

---

## Common Issues

### Issue: "Can't reach database server"

```bash
# Check PostgreSQL is running
docker-compose ps

# Or check local PostgreSQL:
brew services list | grep postgres

# Test connection directly:
psql postgresql://wreckshop_user:wreckshop_password@localhost:5432/wreckshop_dev -c "SELECT 1"
```

### Issue: "DATABASE_URL not found"

```bash
# Make sure .env.local exists with DATABASE_URL
cat backend/.env.local | grep DATABASE_URL

# If missing, add:
DATABASE_URL="postgresql://wreckshop_user:wreckshop_password@localhost:5432/wreckshop_dev"
```

### Issue: "Migration failed - table already exists"

```bash
# Reset the database (careful - deletes all data)
npx prisma migrate reset

# Or manually drop schema:
psql postgresql://wreckshop_user:wreckshop_password@localhost:5432/wreckshop_dev -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
```

---

## Next Steps (Day 3)

When Day 2 is complete:
1. Verify database is populated with tables
2. Test Prisma can create/read records
3. Move to Day 3: Webhook handlers

See `PHASE_1_DAY_3_CHECKLIST.md` for Day 3 tasks.

---

**Database & Prisma Status**: ✅ Setup Ready  
**Time Estimate**: 6 hours  
**Difficulty**: Moderate

## Database Design Overview

```
Artist (base user)
├─ Profile: stageName, fullName, bio, genres, location
├─ Account: accountType, isVerified, publicMetricsOptIn
├─ Relationships:
│  ├─ managedArtists: ManagerArtist[] (artists I manage)
│  └─ managers: ManagerArtist[] (managers managing me)
└─ Integrations:
   ├─ Spotify
   ├─ Instagram
   ├─ YouTube
   └─ TikTok

ManagerArtist (relationship table with permissions)
├─ status: PENDING | ACTIVE | INACTIVE | REJECTED
├─ Granular permissions (8 boolean fields):
│  ├─ viewAnalytics
│  ├─ createCampaign
│  ├─ editCampaign
│  ├─ deleteCampaign
│  ├─ postSocial
│  ├─ editProfile
│  ├─ configureIntegrations
│  └─ inviteCollaborator
└─ Timeline: invitedAt, approvedAt, rejectedAt
```
