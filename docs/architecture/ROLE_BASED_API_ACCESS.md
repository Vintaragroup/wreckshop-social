# Role-Based API Access Control

**Document Version**: 1.0  
**Date**: November 11, 2025  
**Status**: FOUNDATION DEFINITION

---

## API Access Control Strategy

All API endpoints follow this pattern:
1. **Authentication**: Verify JWT token is valid
2. **Authorization**: Check user role and permissions
3. **Data Filtering**: Return only data user has access to
4. **Audit**: Log the request

---

## Endpoint Permission Matrix

### CAMPAIGNS ENDPOINTS

#### `GET /api/campaigns` - List Campaigns
| Role | Access | Notes |
|------|--------|-------|
| Artist | ✅ | Own campaigns only |
| Manager | ✅ | Campaigns of managed artists (if VIEW_ANALYTICS permission) |
| Admin | ✅ | All campaigns |
| Unauthenticated | ❌ | 401 Unauthorized |

**Backend Query**:
```typescript
// Artist
campaigns = await Campaign.find({ artist_id: req.user.artist_id });

// Manager
campaigns = await Campaign.find({
  artist_id: { $in: req.user.managed_artist_ids },
  'manager_permissions.VIEW_ANALYTICS': true
});

// Admin
campaigns = await Campaign.find({});
```

#### `POST /api/campaigns` - Create Campaign
| Role | Access | Notes |
|------|--------|-------|
| Artist | ✅ | For own account |
| Manager | ✅ | If "CREATE_CAMPAIGN" permission for artist |
| Admin | ✅ | For any artist |
| Unauthenticated | ❌ | 401 Unauthorized |

**Validation**:
```typescript
if (req.user.role === 'ARTIST') {
  // Creating for own account
  campaign.artist_id = req.user.artist_id;
} else if (req.user.role === 'MANAGER') {
  // Must specify artist_id and have permission
  const hasPermission = await CheckManagerPermission(
    req.user.id,
    campaign.artist_id,
    'CREATE_CAMPAIGN'
  );
  if (!hasPermission) throw 403 Forbidden;
} else if (req.user.role === 'ADMIN') {
  // Can create for any artist (requires artist_id)
  if (!campaign.artist_id) throw 400 Bad Request;
}
```

#### `GET /api/campaigns/:id` - Get Campaign
| Role | Access | Notes |
|------|--------|-------|
| Artist | ✅ | If owns campaign |
| Manager | ✅ | If manages artist + has VIEW_ANALYTICS |
| Admin | ✅ | All campaigns |
| Unauthenticated | ❌ | 401 Unauthorized |

**Validation**:
```typescript
campaign = await Campaign.findById(id);

if (!campaign) throw 404 Not Found;

// Check access rights
if (req.user.role === 'ARTIST') {
  if (campaign.artist_id !== req.user.artist_id) throw 403 Forbidden;
} else if (req.user.role === 'MANAGER') {
  const isManaging = await IsManagerFor(req.user.id, campaign.artist_id);
  const hasViewPermission = await CheckManagerPermission(
    req.user.id,
    campaign.artist_id,
    'VIEW_ANALYTICS'
  );
  if (!isManaging || !hasViewPermission) throw 403 Forbidden;
} else if (req.user.role !== 'ADMIN') {
  throw 403 Forbidden;
}

return campaign;
```

#### `PUT /api/campaigns/:id` - Update Campaign
| Role | Access | Notes |
|------|--------|-------|
| Artist | ✅ | If owns campaign |
| Manager | ✅ | If "EDIT_CAMPAIGN" permission |
| Admin | ✅ | All campaigns |
| Unauthenticated | ❌ | 401 Unauthorized |

**Validation**: Same as GET, but check "EDIT_CAMPAIGN" permission for managers

#### `DELETE /api/campaigns/:id` - Delete Campaign
| Role | Access | Notes |
|------|--------|-------|
| Artist | ✅ | If owns campaign |
| Manager | ✅ | If "DELETE_CAMPAIGN" permission |
| Admin | ✅ | All campaigns (soft delete) |
| Unauthenticated | ❌ | 401 Unauthorized |

**Note**: Artists delete immediately, campaigns soft-deleted after 30-day hold

---

### ARTIST PROFILE ENDPOINTS

#### `GET /api/artists/:id` - Get Artist Profile
| Role | Access | Notes |
|------|--------|-------|
| Artist | ✅ | Own profile (full) |
| Artist | ⚠️ | Other artists (public fields only) |
| Manager | ✅ | If manages artist |
| Admin | ✅ | All profiles (full) |
| Unauthenticated | ✅ | Public artists (public fields only) |

**Backend Query**:
```typescript
artist = await Artist.findById(id);

if (req.user?.role === 'ARTIST' && artist.id === req.user.artist_id) {
  // Full profile (including private fields)
  return artist;
} else if (req.user?.role === 'MANAGER') {
  const isManaging = await IsManagerFor(req.user.id, id);
  if (!isManaging) throw 403 Forbidden;
  return artist; // Full profile
} else if (req.user?.role === 'ADMIN') {
  return artist; // Full profile
} else {
  // Public fields only (leaderboard opt-in considered)
  return {
    id: artist.id,
    stage_name: artist.stage_name,
    profile_picture: artist.profile_picture,
    bio: artist.bio,
    genres: artist.genres,
    followers: artist.public_metrics_opt_in ? artist.followers : null,
    ranking: artist.public_metrics_opt_in ? artist.ranking : null
  };
}
```

#### `PUT /api/artists/:id` - Update Artist Profile
| Role | Access | Notes |
|------|--------|-------|
| Artist | ✅ | Own profile |
| Manager | ✅ | If "EDIT_PROFILE" permission |
| Admin | ✅ | All profiles |
| Unauthenticated | ❌ | 401 Unauthorized |

**Validation**:
```typescript
if (req.user.role === 'ARTIST') {
  if (id !== req.user.artist_id) throw 403 Forbidden;
} else if (req.user.role === 'MANAGER') {
  const hasPermission = await CheckManagerPermission(
    req.user.id,
    id,
    'EDIT_PROFILE'
  );
  if (!hasPermission) throw 403 Forbidden;
} else if (req.user.role !== 'ADMIN') {
  throw 403 Forbidden;
}

// Certain fields artists only (managers cannot change):
if (req.user.role === 'MANAGER') {
  delete req.body.email;
  delete req.body.phone;
  delete req.body.payment_info;
}

return await Artist.update(id, req.body);
```

---

### ANALYTICS ENDPOINTS

#### `GET /api/analytics/summary` - Dashboard Summary
| Role | Access | Notes |
|------|--------|-------|
| Artist | ✅ | Own metrics |
| Manager | ✅ | If "VIEW_ANALYTICS" permission, aggregated |
| Admin | ✅ | Platform-wide metrics |
| Unauthenticated | ❌ | 401 Unauthorized |

**Backend Query**:
```typescript
if (req.user.role === 'ARTIST') {
  return await Analytics.getSummary(req.user.artist_id);
} else if (req.user.role === 'MANAGER') {
  const managed_artists = await GetManagedArtists(
    req.user.id,
    'VIEW_ANALYTICS'
  );
  return await Analytics.getAggregated(managed_artists);
} else if (req.user.role === 'ADMIN') {
  return await Analytics.getPlatformSummary();
}
```

#### `GET /api/analytics/leaderboard` - Public Leaderboard
| Role | Access | Notes |
|------|--------|-------|
| Artist | ✅ | Genre leaderboards (opt-in artists) |
| Manager | ✅ | Genre leaderboards (opt-in artists) |
| Admin | ✅ | All leaderboards |
| Unauthenticated | ✅ | Genre leaderboards (opt-in artists) |

**Backend Query**:
```typescript
leaderboard = await Analytics.getLeaderboard(
  genre: req.query.genre,
  period: req.query.period, // '7d', '30d', '90d'
  opt_in_only: true  // Only artists who opted in
);

return leaderboard;
```

---

### INTEGRATIONS ENDPOINTS

#### `GET /api/integrations` - List Integrations
| Role | Access | Notes |
|------|--------|-------|
| Artist | ✅ | Own integrations (full) |
| Manager | ✅ | If "CONFIGURE_INTEGRATIONS" permission |
| Admin | ✅ | All integrations (tokens hidden) |
| Unauthenticated | ❌ | 401 Unauthorized |

**Backend Query**:
```typescript
if (req.user.role === 'ARTIST') {
  integrations = await Integration.find({ artist_id: req.user.artist_id });
} else if (req.user.role === 'MANAGER') {
  const hasPermission = await CheckManagerPermission(
    req.user.id,
    req.query.artist_id,
    'CONFIGURE_INTEGRATIONS'
  );
  if (!hasPermission) throw 403 Forbidden;
  integrations = await Integration.find({ artist_id: req.query.artist_id });
} else if (req.user.role === 'ADMIN') {
  integrations = await Integration.find({});
  // Hide sensitive tokens
  integrations = integrations.map(i => ({
    ...i,
    oauth_token: '[REDACTED]',
    refresh_token: '[REDACTED]'
  }));
}

return integrations;
```

#### `DELETE /api/integrations/:id` - Disconnect Integration
| Role | Access | Notes |
|------|--------|-------|
| Artist | ✅ | Own integrations |
| Manager | ✅ | If "CONFIGURE_INTEGRATIONS" permission |
| Admin | ✅ | All integrations |
| Unauthenticated | ❌ | 401 Unauthorized |

---

### COLLABORATION ENDPOINTS

#### `POST /api/collaborations/invite` - Invite Collaborator
| Role | Access | Notes |
|------|--------|-------|
| Artist | ✅ | For own projects |
| Manager | ✅ | If "INVITE_COLLABORATOR" permission |
| Admin | ✅ | Any project |
| Unauthenticated | ❌ | 401 Unauthorized |

**Validation**:
```typescript
// Only the owner of a project can invite collaborators
project = await Project.findById(req.body.project_id);

if (req.user.role === 'ARTIST') {
  if (project.created_by !== req.user.artist_id) throw 403 Forbidden;
} else if (req.user.role === 'MANAGER') {
  if (!IsManagerFor(req.user.id, project.artist_id)) throw 403 Forbidden;
  if (!HasPermission(req.user.id, project.artist_id, 'INVITE_COLLABORATOR'))
    throw 403 Forbidden;
}
```

#### `GET /api/artists/discover` - Discover Similar Artists
| Role | Access | Notes |
|------|--------|-------|
| Artist | ✅ | Find similar artists for collab |
| Manager | ✅ | Find similar artists |
| Admin | ✅ | All artists |
| Unauthenticated | ✅ | Public artists only |

**Backend Query**:
```typescript
// Find artists with similar genres, opt-in only
similar_artists = await Artist.find({
  genre: { $in: req.user.genres },
  public_metrics_opt_in: true,
  id: { $ne: req.user.artist_id }
}).limit(20);

return similar_artists;
```

---

### MANAGER ENDPOINTS

#### `GET /api/managers/roster` - View Managed Artists
| Role | Access | Notes |
|------|--------|-------|
| Manager | ✅ | Own roster |
| Admin | ✅ | Any manager's roster |
| Unauthenticated | ❌ | 401 Unauthorized |

**Backend Query**:
```typescript
if (req.user.role === 'MANAGER') {
  roster = await ManagerArtist.find({
    manager_id: req.user.id,
    status: 'ACTIVE'
  });
} else if (req.user.role === 'ADMIN') {
  manager_id = req.query.manager_id;
  roster = await ManagerArtist.find({
    manager_id,
    status: 'ACTIVE'
  });
}

return roster;
```

#### `POST /api/managers/invite-artist` - Invite Artist
| Role | Access | Notes |
|------|--------|-------|
| Manager | ✅ | Invite to own roster |
| Admin | ✅ | Invite to any manager |
| Unauthenticated | ❌ | 401 Unauthorized |

**Validation**:
```typescript
if (req.user.role === 'MANAGER') {
  // Can only invite for themselves
  if (req.body.manager_id !== req.user.id) throw 403 Forbidden;
} else if (req.user.role !== 'ADMIN') {
  throw 403 Forbidden;
}

// Check roster limit (15-25 artists max)
current_roster_size = await ManagerArtist.countDocuments({
  manager_id: req.body.manager_id,
  status: 'ACTIVE'
});

if (current_roster_size >= 25) throw 400 Roster full;

// Send invitation
await ManagerArtist.create({
  manager_id: req.body.manager_id,
  artist_id: req.body.artist_id,
  status: 'PENDING',
  permissions: req.body.permissions || {}
});
```

#### `PUT /api/managers/permissions` - Update Artist Permissions
| Role | Access | Notes |
|------|--------|-------|
| Artist | ✅ | Own manager permissions |
| Manager | ❌ | Cannot change own permissions |
| Admin | ✅ | Any manager-artist permissions |
| Unauthenticated | ❌ | 401 Unauthorized |

**Validation**:
```typescript
manager_artist = await ManagerArtist.findById(req.body.id);

if (req.user.role === 'ARTIST') {
  // Artist is changing permissions for their manager
  if (manager_artist.artist_id !== req.user.artist_id) throw 403 Forbidden;
  // Artist can only restrict permissions (not expand)
  ValidatePermissionRestriction(req.body.permissions);
} else if (req.user.role === 'ADMIN') {
  // Admin can change permissions freely
} else {
  throw 403 Forbidden;
}

manager_artist.permissions = req.body.permissions;
await manager_artist.save();
```

---

## Global Authorization Middleware

```typescript
// middleware/authorize.ts

export function authorize(...requiredRoles: string[]) {
  return async (req, res, next) => {
    // 1. Check authentication
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // 2. Check role
    if (!requiredRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // 3. Audit log
    await AuditLog.create({
      user_id: req.user.id,
      action: req.method + ' ' + req.originalUrl,
      timestamp: new Date(),
      ip_address: req.ip
    });

    next();
  };
}

// Usage:
router.get('/api/campaigns', authorize('ARTIST', 'MANAGER', 'ADMIN'), getCampaigns);
router.post('/api/campaigns', authorize('ARTIST', 'MANAGER', 'ADMIN'), createCampaign);
router.delete('/api/admin/reset-password', authorize('ADMIN'), resetPassword);
```

---

## Related Documentation
- See `USER_ROLES_AND_PERMISSIONS.md` for role definitions
- See `DATA_OWNERSHIP_AND_ISOLATION.md` for data access rules
- See `USER_AUTHENTICATION.md` for auth implementation

---

**Next Step**: Create DASHBOARD_METRICS_BY_ROLE.md for dashboard data
