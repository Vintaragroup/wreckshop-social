# Admin System - Quick Reference

## Current Setup

### Your Account
- **Email:** ryan@vintaragroup.com
- **Status:** Super Admin (isAdmin: true)
- **ID:** cmhvcp9y50004rzfopo5majmz

### What You Can Do
✅ Grant/revoke super admin access
✅ View all admin users
✅ Manage campaigns, audience, integrations
✅ Create content and manage team collaborations

### What Non-Admins Cannot Do
❌ Cannot call `/api/admin/*` endpoints (403 Forbidden)
❌ Cannot grant admin access to themselves or others
❌ Cannot view the admin user list

---

## API Endpoints (Admin-Only)

### Grant Admin Status
```bash
curl -X PATCH http://localhost:4002/api/admin/set-admin \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

### Revoke Admin Status
```bash
curl -X PATCH http://localhost:4002/api/admin/remove-admin \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

### List All Admins
```bash
curl -X GET http://localhost:4002/api/admin/list \
  -H "Authorization: Bearer <token>"
```

---

## Three-Tier Permission Structure

### Tier 1: Super Admin
- Only you (ryan@vintaragroup.com)
- Can grant/revoke admin access
- Full platform access

### Tier 2: Producer/Manager
- Account type: `ARTIST_AND_MANAGER`
- Can grant deeper access to artist accounts
- Can create campaigns, manage audiences, configure integrations
- Cannot grant admin access

### Tier 3: Artist
- Account type: `ARTIST`
- Can manage own artist profile
- Can configure own integrations
- Can collaborate with other artists
- Can access social and music tools
- Cannot create campaigns unless granted by manager

---

## Database Fields

### Artist Table
```sql
isAdmin          BOOLEAN DEFAULT false   -- Super admin flag
accountType      TEXT DEFAULT 'ARTIST'   -- ARTIST | ARTIST_AND_MANAGER
```

### ManagerArtist Table
```sql
permissions      JSONB -- { viewAnalytics, createCampaign, etc. }
```

---

## Frontend Components

### Auth Context (`src/lib/auth/context.tsx`)
- Includes `isAdmin` in AuthUser interface
- Has `refreshUser()` method to sync with backend
- Stores user in localStorage

### Role Checker (`src/lib/auth/roles.ts`)
- `isAdmin(user)` - Returns true if user.isAdmin === true
- `isManager(user)` - Returns true if accountType === 'ARTIST_AND_MANAGER'
- `canCreateCampaigns(user)` - Checks admin, manager, or permission
- `canManageAudience(user)` - Similar permission checks
- `canConfigureIntegrations(user)` - Always true for own account

### AppShell Display (`src/components/app-shell.tsx`)
- Shows "⭐ Super Admin" badge if isAdmin
- Shows "Admin" menu item only for admins
- Auto-refreshes user profile on mount

---

## Testing the System

### Test 1: Check Admin Status
1. Log in as ryan@vintaragroup.com
2. Look for "⭐ Super Admin" badge in user dropdown
3. Check sidebar for "Admin" menu item

### Test 2: Try Admin Endpoint (as Admin)
```bash
curl -X GET http://localhost:4002/api/admin/list \
  -H "Authorization: Bearer <your-token>"
# Should return list of admins
```

### Test 3: Try Admin Endpoint (as Non-Admin)
1. Log in as a different user (e.g., regular artist)
2. Try the same curl command
3. Should get 403 Forbidden error

### Test 4: Grant Admin Status
```bash
# Only works if you're admin
curl -X PATCH http://localhost:4002/api/admin/set-admin \
  -H "Authorization: Bearer <your-admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

---

## Security Implementation

All three admin routes check:
```typescript
if (!req.user?.isAdmin) {
  return res.status(403).json({
    error: 'Forbidden',
    message: 'Only admins can access this',
  })
}
```

This prevents:
- ✅ Unauthorized users calling admin endpoints
- ✅ Permission escalation
- ✅ Accidental admin grants
- ✅ Data leaks through admin list

---

## Common Tasks

### Make Someone an Admin
```bash
npx tsx scripts/set-admin.ts user@example.com
```

### Remove Admin Status
```bash
npx tsx scripts/delete-artist.ts user@example.com  # Delete account
# Or use API endpoint (admin-only)
PATCH /api/admin/remove-admin with {"email": "user@example.com"}
```

### List All Users
```bash
npx tsx scripts/list-artists.ts
```

### List All Admins (via API)
```bash
curl -X GET http://localhost:4002/api/admin/list \
  -H "Authorization: Bearer <token>"
```

---

## Notes

- Admin status is stored in PostgreSQL `Artist.isAdmin` field
- Admin checks happen on every protected route
- Frontend syncs with backend on app load via `refreshUser()`
- All admin operations are logged in console for debugging

