# Wreckshop Permission Model

## Overview

The Wreckshop platform uses a **three-tier permission hierarchy** to manage access levels across different user types: Super Admin, Producer/Manager, and Artist.

## Tier 1: Super Admin

**User:** Ryan Morrow (ryan@vintaragroup.com)

### Capabilities:
- ✅ Grant/revoke super admin status to other users
- ✅ View admin user list
- ✅ All producer/manager capabilities
- ✅ All artist capabilities

### Access Control:
- Database: `Artist.isAdmin = true`
- Routes: Check `req.user.isAdmin === true`
- API Endpoints:
  - `PATCH /api/admin/set-admin` - Grant admin access (admin-only)
  - `PATCH /api/admin/remove-admin` - Revoke admin access (admin-only)
  - `GET /api/admin/list` - List all admins (admin-only)

### Use Cases:
- Platform administration
- User account management
- System configuration
- Debugging and audits

---

## Tier 2: Producer/Manager

**Account Type:** `ARTIST_AND_MANAGER`

### Capabilities:
- ✅ View and manage their own artist profile
- ✅ Grant deeper access levels to artist accounts
- ✅ Create and manage campaigns
- ✅ View audience insights and analytics
- ✅ Configure integrations (Spotify, Instagram, YouTube, TikTok)
- ✅ Create content (artists, releases, events, assets)
- ✅ Manage team collaborations
- ✅ Create segments and manage audience

### Cannot Do:
- ❌ Grant admin access
- ❌ View/manage other managers' artist accounts
- ❌ System-level admin operations

### Access Control:
- Database: `Artist.accountType = 'ARTIST_AND_MANAGER'`
- Routes: Check `isManager(user)` function
- Permission Checks: `canManageTeam()`, `canCreateCampaigns()`, etc.

### Use Cases:
- Music promoters
- Artist managers
- Production companies
- Team leaders

---

## Tier 3: Artist

**Account Type:** `ARTIST`

### Capabilities:
- ✅ View and manage their own artist profile
- ✅ Configure integrations for their accounts (Spotify, Instagram, YouTube, TikTok)
- ✅ Access social media tools for posting and scheduling
- ✅ Manage their music accounts and releases
- ✅ Collaborate with other artists (if granted permission by manager)
- ✅ View their own analytics and performance metrics

### Cannot Do:
- ❌ Create campaigns (unless granted by manager)
- ❌ Manage other artist accounts
- ❌ Access team management features
- ❌ View other artists' data

### Access Control:
- Database: `Artist.accountType = 'ARTIST'`
- Routes: Check `isArtistOnly(user)` function
- Permission Checks: `canConfigureIntegrations()` (always true for own account)

### Use Cases:
- Solo artists
- Music creators
- Content creators
- Collaborators

---

## Permission Hierarchy

```
Super Admin (isAdmin = true)
    ↓
Producer/Manager (accountType = ARTIST_AND_MANAGER)
    ↓
Artist (accountType = ARTIST)
```

Each tier **inherits** all capabilities of lower tiers plus their own specific permissions.

---

## Manager-to-Artist Access Control

**Current Implementation:** Via `ManagerArtist` table

### Granular Permissions:
- `viewAnalytics` - See artist's analytics
- `createCampaign` - Create campaigns on behalf of artist
- `editCampaign` - Edit artist's campaigns
- `deleteCampaign` - Delete artist's campaigns
- `postSocial` - Post to artist's social media
- `editProfile` - Edit artist profile details
- `configureIntegrations` - Connect/manage integrations
- `inviteCollaborator` - Invite other artists to collaborate
- `manageTeam` - Add/remove team members

### Routes:
- `GET /api/permissions/:artistId` - Get permissions for artist
- `POST /api/permissions/:artistId` - Grant permission
- `DELETE /api/permissions/:artistId/:permission` - Revoke permission
- `GET /api/permissions/manager/:managerId` - Get all artist relationships

---

## API Endpoints by Permission Level

### Super Admin Only
```
PATCH /api/admin/set-admin
PATCH /api/admin/remove-admin
GET /api/admin/list
```

### Manager/Admin
```
POST /api/manager/grant-permission/:artistId
DELETE /api/manager/revoke-permission/:artistId/:permission
GET /api/manager/artist/:artistId
POST /api/campaigns (own campaigns)
GET /api/analytics (own data)
```

### All Authenticated Users
```
GET /api/auth/me
PATCH /api/settings/profile
POST /api/integrations/connect
GET /api/integrations/status
```

---

## Security Notes

### Admin Protection
- All admin routes check `req.user.isAdmin === true`
- Only admins can grant/revoke admin status
- Admin list is admin-only
- Admin operations are logged

### Manager Protection
- Managers can only modify artists they manage
- Granular permissions prevent privilege escalation
- Artist data is isolated per account

### Artist Protection
- Artists can only access their own data
- Integration credentials are encrypted
- Social media posting requires proper authentication
- Collaboration requires mutual consent

---

## Database Schema

### Artist Table
```prisma
model Artist {
  id                    String    @id @default(cuid())
  stackAuthUserId       String    @unique
  email                 String    @unique
  stageName             String
  fullName              String?
  accountType           String    @default("ARTIST")  // ARTIST | ARTIST_AND_MANAGER
  isAdmin               Boolean   @default(false)     // Super admin flag
  isVerified            Boolean   @default(false)
  // ... other fields
}
```

### ManagerArtist Table (Many-to-Many)
```prisma
model ManagerArtist {
  id           String   @id @default(cuid())
  managerId    String
  artistId     String
  permissions  Json     // { viewAnalytics, createCampaign, ... }
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

---

## Implementation Guide

### Adding a New Admin
```bash
# Using CLI script
npx tsx scripts/set-admin.ts <email>

# Or via API (admin-only)
PATCH /api/admin/set-admin
{ "email": "user@example.com" }
```

### Granting Manager Permission to Artist
```bash
# Via API
POST /api/permissions/:artistId
{
  "managerId": "manager_id",
  "permission": "viewAnalytics"
}
```

### Checking User Permissions
```typescript
import { isAdmin, isManager, canCreateCampaigns } from '@/lib/auth/roles'

if (isAdmin(user)) {
  // Show admin panel
}

if (isManager(user)) {
  // Show manager dashboard
}

if (canCreateCampaigns(user)) {
  // Show campaign creation
}
```

---

## Audit Trail

All admin and permission changes should be logged in `AuditLog` table:
- Who made the change
- What was changed
- When it happened
- From which IP/session

---

## Future Enhancements

1. **Role-Based Access Control (RBAC)** - Define custom roles
2. **Time-Limited Permissions** - Permissions that expire
3. **Approval Workflows** - Multi-step permission granting
4. **Two-Factor Auth** - Required for admin operations
5. **Permission Templates** - Pre-configured permission sets

