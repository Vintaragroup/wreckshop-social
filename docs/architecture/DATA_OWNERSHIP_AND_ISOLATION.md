# Data Ownership & Isolation Strategy

**Document Version**: 1.0  
**Date**: November 11, 2025  
**Status**: FOUNDATION DEFINITION

---

## Data Ownership Model

### Core Principle
**All data belongs to the Artist who created it.** Managers/Producers have **delegated access** based on permission grants, but the artist always maintains ownership and can revoke access.

---

## Data Categories

### 1. ARTIST-OWNED DATA

#### Personal Data
```
- Artist Profile (name, bio, profile picture, etc.)
- Contact Information (email, phone)
- Account Settings
- Genre, niche, similar artists
- Social media accounts

Ownership: Artist
Manager Access: Based on "EDIT_PROFILE" permission
Visibility: Private (only artist + authorized manager + admin)
```

#### Content Data
```
- Campaigns (email, SMS, social)
- Releases (albums, singles, EPs)
- Events (concerts, appearances)
- Assets (images, videos, audio, links)

Ownership: Artist
Manager Access: Based on specific permissions
  - VIEW: Can view all campaigns
  - CREATE: Can create on behalf of artist
  - EDIT: Can modify before publishing
  - APPROVE: Can approve before publishing
  - DELETE: Can remove campaigns
  - POST_SOCIAL: Can post to social media

Visibility: Private to artist + authorized manager + admin
```

#### Analytics & Metrics
```
- Stream counts
- Follower growth
- Engagement rates
- Revenue data
- Fan demographics
- Geographic data
- Playlist placements
- Download data

Ownership: Artist (data producer)
Manager Access: Based on "VIEW_ANALYTICS" permission
Visibility: Private to artist + authorized manager + admin

SPECIAL: Gamified public leaderboard
  - Artist A can see Artist B's ranking (with permission)
  - Artist A can see competing on same genre leaderboard
  - Artist A can see similar artists' metrics
  - BUT: Artist can OPT-OUT of public metrics
```

#### Integration Data
```
- OAuth tokens (Spotify, Instagram, etc.)
- Sync history
- Last sync timestamp
- Integration settings

Ownership: Artist
Manager Access: Based on "CONFIGURE_INTEGRATIONS" permission
Visibility: Private to artist + authorized manager (if allowed) + admin
Encryption: All tokens encrypted at rest
```

---

### 2. MANAGER-OWNED DATA

#### Roster Data
```
- List of managed artists
- Relationship status (ACTIVE, PENDING, INACTIVE)
- Date relationship started
- Collaboration type

Ownership: Manager + Artist (shared)
Artist Visibility: Can see manager is listed, can revoke
Manager Visibility: Can see all managed artists
Visibility: Private (artist can see only themselves)
```

#### Management Settings
```
- Permission levels per artist
- Collaboration preferences
- Communication history

Ownership: Manager + Artist (shared)
Management Decision: Artist sets, manager respects
Visibility: Private between manager and artist
```

#### Manager Analytics
```
- Performance across roster
- Aggregate metrics for all managed artists
- ROI by artist
- Campaign effectiveness

Ownership: Manager
Artist Visibility: Artist CANNOT see other artists' data (unless opt-in collaboration)
Manager Visibility: Can see all managed artists aggregated
Visibility: Private to manager + admin
```

---

### 3. SHARED/COLLABORATIVE DATA

#### Collaboration Projects
```
- Project metadata (name, members, dates)
- Contribution logs
- Shared files/assets
- Comments/feedback

Ownership: Shared by participants
Access: All collaborators can view/edit/delete
Visibility: Private to collaborators + admin

Decision Rights:
  - Owner artist controls project
  - Collaborators can suggest changes
  - Owner artist has final approval
```

#### Artist-to-Artist Gamified Data
```
- Leaderboard rankings (opt-in)
- Public metrics for similar artists
- Competition metrics
- Collaboration suggestions

Ownership: Aggregated/anonymized
Visibility: Public (by artist choice, opt-in)
Control: Artist can hide metrics anytime
```

---

## Data Access Rules by Role

### Artist Accessing Own Data
```
Artist A logs in
↓
Can access:
  ✅ Own profile, settings, preferences
  ✅ All own campaigns, releases, events
  ✅ Own analytics and metrics
  ✅ Own integration tokens
  ✅ Collaborations involving them
  ✅ Manager relationships (with permission levels they set)

Cannot access:
  ❌ Other artists' data (even if they manage them)
  ❌ Other artists' metrics (unless collaboration or leaderboard opt-in)
  ❌ Other artists' integrations
```

### Artist Accessing Managed Artist Account
```
Artist A (who also manages Artist B's account)

Scenario: Artist A created Artist B's account (owns it)
Access:
  ✅ Can access Artist B profile as if logged in
  ✅ Can edit Artist B campaigns (if owned account)
  ✅ Can view Artist B analytics
  ✅ Can configure Artist B integrations
  ✅ Can manage Artist B integrations
  ✅ Can invite managers for Artist B

Scenario: Artist A is manager of Artist B (delegated)
Access: Based on permission levels set by Artist B
  - VIEW_ANALYTICS: Can see metrics
  - CREATE_CAMPAIGN: Can create campaigns
  - EDIT_PROFILE: Can modify bio, profile
  - etc.

Cannot access:
  ❌ Artist B's integrations (unless CONFIGURE_INTEGRATIONS permission)
  ❌ Artist B's account settings
  ❌ Artist B's collaboration history (unless collaboration involved Artist A)
```

### Producer/Manager Accessing Managed Artists
```
Manager M manages artists [A, B, C]

For Artist A (permission: VIEW_ANALYTICS, CREATE_CAMPAIGN, POST_SOCIAL):
Access:
  ✅ View Artist A's analytics
  ✅ Create campaigns on behalf of Artist A
  ✅ Post to Artist A's social media
  ✅ View Artist A's metrics

Cannot access:
  ❌ Artist A's personal settings
  ❌ Artist A's integration tokens
  ❌ Artist A's password/security
  ❌ Artist A's financial settings

For Artist B (permission: VIEW_ANALYTICS, VIEW_ONLY):
Access:
  ✅ View Artist B's analytics

Cannot access:
  ❌ Anything else (VIEW_ONLY is limited)

For Artist C (no permission):
Access:
  ❌ No access (relationship not yet approved)

Cannot access:
  ❌ Artist D's data (only manages A, B, C)
  ❌ Other managers' data
```

### Admin Accessing All Data
```
Admin user logs in
↓
Can access:
  ✅ All user accounts
  ✅ All artist data
  ✅ All analytics and metrics
  ✅ All integration tokens
  ✅ System logs
  ✅ Billing data
  ✅ Compliance reports

Limitations (for privacy):
  ⚠️ Cannot modify artist account without audit trail
  ⚠️ Cannot delete artist data (soft delete only)
  ⚠️ Cannot reset passwords without email verification
  ⚠️ All admin actions logged
```

---

## Data Isolation at Database Level

### Query Examples

#### Artist Viewing Own Data
```sql
-- Artist viewing their campaigns
SELECT * FROM campaigns 
WHERE artist_id = :current_user_artist_id 
AND deleted_at IS NULL;
```

#### Manager Viewing Managed Artist Data
```sql
-- Manager viewing managed artist's campaigns
SELECT c.* FROM campaigns c
INNER JOIN artist_managers am ON c.artist_id = am.artist_id
WHERE am.manager_id = :current_user_manager_id
AND am.permission_json ->> 'CREATE_CAMPAIGN' = 'true'
AND c.deleted_at IS NULL;
```

#### Preventing Cross-Artist Access
```sql
-- INCORRECT - would allow artist A to see artist B's data
SELECT * FROM campaigns WHERE artist_id IN (
  SELECT artist_id FROM users WHERE role = 'ARTIST'
);
-- DON'T DO THIS

-- CORRECT - only current artist's data
SELECT * FROM campaigns 
WHERE artist_id = :current_user_artist_id;
```

#### Gamified Leaderboard (Opt-In)
```sql
-- Show leaderboards for artists who opted in
SELECT 
  a.artist_id,
  a.artist_name,
  COUNT(s.stream_id) as total_streams,
  RANK() OVER (ORDER BY COUNT(s.stream_id) DESC) as rank
FROM artists a
INNER JOIN streams s ON a.artist_id = s.artist_id
WHERE a.public_metrics_opt_in = true
AND a.genre = :genre
AND s.date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY a.artist_id
ORDER BY total_streams DESC;
```

---

## Data Sharing Scenarios

### Scenario 1: Artist Shares Campaign with Manager
```
Artist A creates campaign
↓
Artist A sets Manager M to have:
  - VIEW_ANALYTICS
  - EDIT_CAMPAIGN
  - POST_SOCIAL
↓
Manager M can:
  - View campaign metrics
  - Suggest edits (if collaboration mode)
  - Post campaign to social media
  
Artist A can:
  - See all manager edits
  - Approve before publishing
  - Revert changes
```

### Scenario 2: Manager Suggests Campaign to Artist
```
Manager M has Artist A's permission to: CREATE_CAMPAIGN

Manager M creates campaign draft
↓
Campaign status: "PENDING_APPROVAL"
↓
Artist A gets notification: "Manager M created campaign: [name]"
↓
Artist A can:
  - Review campaign
  - Approve (publishes)
  - Request changes
  - Reject (deletes draft)
```

### Scenario 3: Two Artists Collaborate
```
Artist A + Artist B create collaborative project
↓
Project created by Artist A
↓
Artist B invited to collaborate
↓
Both artists can:
  - View project
  - Edit project
  - Comment/suggest
  - View each other's contribution

Cannot see:
  - Each other's other campaigns
  - Each other's private integrations
  - Each other's financial data
```

### Scenario 4: Gamified Competition
```
Artist A sees leaderboard
↓
Artists B, C, D are on same genre leaderboard
↓
Artist A can see:
  - Their rankings
  - Their stream counts (if opted-in)
  - Their follower growth (if opted-in)
  
Artist A can:
  - Message Artist B: "Hey, want to collab?"
  - See Artist C is trending up
  - See similar artists recommendations
```

---

## Data Deletion & Retention

### Artist Deletes Account
```
Artist requests account deletion
↓
30-day grace period
  - User can cancel deletion
  - Data preserved
↓
After 30 days:
  - Account deleted
  - Personal data removed (email, password, etc.)
  - Campaigns marked as "deleted by user"
  - Analytics archived (for compliance)
  - Integration tokens destroyed
  - User cannot recover data
```

### Manager Relationship Ended
```
Artist revokes manager access
↓
Manager loses:
  - View access to artist data
  - Edit/create/post permissions
  - Access to artist dashboard
  
Manager keeps:
  - Historical data (for accounting)
  - Aggregate metrics (for their records)
  - Collaboration data (for their records)
  
Artist sees:
  - Manager no longer listed in team
  - All manager edits are marked "by Manager M"
  - Can re-accept manager later
```

### Campaign Deleted
```
Artist or manager deletes campaign
↓
Campaign soft-deleted (marked deleted_at)
↓
Campaign not visible in UI
↓
Campaign data still in database (for audit trail)
↓
After 90 days:
  - Campaign permanently deleted (if no compliance holds)
```

---

## Audit & Compliance

### Audit Trail
```
Every data modification logs:
  - Who modified it (user_id)
  - What changed (old_value → new_value)
  - When (timestamp)
  - From where (IP address)
  
Example:
  Artist ID: artist_001
  Event: CAMPAIGN_UPDATED
  Changed_by: manager_005 (Manager M)
  Change: title: "Summer Tour" → "Summer 2025 Tour"
  Timestamp: 2025-11-11 14:32:00
  IP: 192.168.1.100
```

### Compliance Reports
```
Artists can download:
  - All their data (GDPR Data Export)
  - All manager relationships
  - All integrations
  - All campaigns
  - All analytics
```

### Data Retention Policies
```
Active account:
  - All data retained indefinitely

Deleted account:
  - Personal data: deleted after 30 days
  - Analytics: archived for 1 year (for compliance)
  - Audit trail: retained for 7 years (legal requirement)
  - Integrations: destroyed immediately
```

---

## Related Documentation
- See `USER_ROLES_AND_PERMISSIONS.md` for permission details
- See `USER_AUTHENTICATION.md` for auth security
- See `ROLE_BASED_API_ACCESS.md` for API query rules
- See `DASHBOARD_METRICS_BY_ROLE.md` for dashboard data access

---

**Next Step**: Create ROLE_BASED_API_ACCESS.md with API permission matrix
