# User Roles & Permissions Architecture

**Document Version**: 1.0  
**Date**: November 11, 2025  
**Status**: FOUNDATION DEFINITION

---

## Overview

Wreckshop Social has a hierarchical permission system with three primary roles: **Artist**, **Producer/Manager**, and **Admin**. The system emphasizes **collaborative management**, **verified relationships**, and **gamified competition** to drive healthy engagement.

---

## Role Definitions

### 1. ARTIST Role 👨‍🎤

**Who**: Musicians, producers, bands, or other content creators who sign up directly via the website.

**Account Ownership**:
- Artist can manage their own profile and content
- Artist can own/manage multiple artist accounts (if they created them or own those accounts)
- Artist can only manage accounts they own or have been granted permission to manage by another artist

**Permission Model**:
- **Full Control**: Own account (100% permissions)
- **Delegated Control**: Other artist accounts they manage (permissions set by owner artist or manager)
- **Collaborative**: Can invite collaborators to projects

**What They Can Do**:
- ✅ Create campaigns (email, SMS, social)
- ✅ Create/manage releases
- ✅ Create/manage events
- ✅ Connect platform integrations (Spotify, Instagram, YouTube, TikTok, etc.)
- ✅ View own analytics and metrics
- ✅ Invite collaborators to projects
- ✅ Message other artists (for collaboration opportunities)
- ✅ View leaderboards/competitive metrics (gamified)
- ✅ Accept manager/producer invitations
- ✅ Assign management permissions to specific producer/manager

**What They CANNOT Do** (Without Manager Approval):
- ❌ Post to social platforms (if delegated to manager)
- ❌ Edit campaigns (if manager has edit permissions)
- ❌ Modify artist profile (if manager has edit permissions)
- ❌ Access certain analytics (based on manager restrictions)

**Manager Request & Approval**:
- Artist can REQUEST a manager/producer by:
  1. Receiving a manager invitation link
  2. Approving the manager in their system
- Manager then gains DASHBOARD access to artist's account
- Artist can set PERMISSION LEVELS on manager account:
  - **View-Only**: Can see metrics/analytics only
  - **Collaborate**: Can suggest changes, comment, approve content
  - **Editor**: Can edit campaigns, releases, events
  - **Full Control**: Can do everything except delete account or change owner
  - **Posting Rights**: Can post to social media on behalf of artist
  - **Custom**: Mix and match permissions

**Permissions Matrix** (Artist Own Account):
| Permission | Description | Default |
|-----------|-------------|---------|
| CREATE_CAMPAIGN | Create campaigns | ✅ |
| EDIT_CAMPAIGN | Edit campaigns | ✅ |
| DELETE_CAMPAIGN | Delete campaigns | ✅ |
| CREATE_RELEASE | Create releases | ✅ |
| EDIT_RELEASE | Edit releases | ✅ |
| DELETE_RELEASE | Delete releases | ✅ |
| CONNECT_PLATFORM | Connect integrations | ✅ |
| VIEW_ANALYTICS | View own analytics | ✅ |
| INVITE_COLLABORATOR | Invite collaborators | ✅ |
| POST_SOCIAL | Post to social media | ✅ |
| MANAGE_ARTIST | Manage other artist account | ❌ (requires other artist approval) |
| ACCEPT_MANAGER | Accept manager/producer | ✅ |
| MESSAGE_ARTISTS | Message other artists | ✅ |
| VIEW_LEADERBOARD | View competitive metrics | ✅ |

---

### 2. PRODUCER/MANAGER Role 🎙️

**Who**: Music producers, managers, or team members who are verified through email approval and manage one or more artists.

**How They Gain Access**:
1. Existing artist/producer submits email request with artist roster
2. Admin verifies artist claims and manager credentials
3. Manager receives approval email
4. Manager creates account (or links existing artist account if they're also an artist)
5. Manager sends invitation links to each artist
6. Artist approves the manager
7. Manager gets dashboard access

**Account Ownership**:
- Can manage 15-25 artists (limit to prevent scaling issues initially)
- Each artist is a separate workspace/dashboard view
- Can only see data for artists they manage
- If also an artist, can manage own artist account + managed artists

**What They Can Do**:
- ✅ View all managed artists' data and analytics
- ✅ Create campaigns on behalf of managed artists (with artist approval)
- ✅ Edit campaigns for managed artists (if permission granted)
- ✅ Post to social media (if permission granted)
- ✅ Approve artist content before publishing (if permission granted)
- ✅ Set permission levels for each artist
- ✅ Configure artist's platform integrations
- ✅ View artist-specific leaderboards and metrics
- ✅ Collaborate with other producers/managers
- ✅ Send artist invitations
- ✅ If also an artist: manage own artist account

**What They CANNOT Do**:
- ❌ Manage other producers/managers
- ❌ Access admin settings
- ❌ Delete artist accounts
- ❌ Force permissions on artists (artists must approve)
- ❌ Manage artists they don't have approval for
- ❌ Access admin dashboard
- ❌ Grant admin permissions

**Data Access**:
- Can see ALL data for managed artists
- Artist name, metrics, campaigns, releases, events
- Social media performance and engagement
- Fan/audience data
- Revenue/streaming data

**Permissions Matrix** (For Each Managed Artist):
| Permission | Description | Configurable |
|-----------|-------------|---|
| VIEW_ANALYTICS | View artist analytics | ✅ |
| CREATE_CAMPAIGN | Create campaigns | ✅ |
| EDIT_CAMPAIGN | Edit campaigns | ✅ |
| APPROVE_CAMPAIGN | Approve before publishing | ✅ |
| DELETE_CAMPAIGN | Delete campaigns | ✅ |
| POST_SOCIAL | Post to social media | ✅ |
| EDIT_PROFILE | Edit artist profile | ✅ |
| CONFIGURE_INTEGRATIONS | Connect/disconnect platforms | ✅ |
| MANAGE_TEAM | Add other managers | ✅ |
| VIEW_REVENUE | View financial data | ✅ |
| EDIT_SETTINGS | Change artist settings | ✅ |

---

### 3. ADMIN Role 🔒

**Who**: Platform administrators with special access (super-users, limited distribution).

**Default Admin Capabilities**:
- ✅ View all user accounts
- ✅ View all artist data
- ✅ Access system logs and analytics
- ✅ Manage platform integrations
- ✅ Verify new managers
- ✅ Grant/revoke manager status
- ✅ Create test accounts
- ✅ Reset user passwords
- ✅ View billing/revenue across platform
- ✅ Access compliance reports

**Selective Admin Capabilities** (Can be granted to specific Producers):
- Manager role can be granted specific admin capabilities on-request:
  - `VERIFY_ARTISTS` - Can verify new artist accounts
  - `MANAGE_INTEGRATIONS` - Can manage platform integrations
  - `VIEW_PLATFORM_ANALYTICS` - Can see aggregate platform metrics
  - `EXPORT_DATA` - Can export artist data
  - `MANAGE_COMPLIANCE` - Can access compliance features

**Permissions Matrix**:
| Permission | Description | Who | Default |
|-----------|-------------|-----|---------|
| VIEW_ALL_USERS | View all user accounts | Admin | ✅ |
| VIEW_ALL_ARTISTS | View all artist data | Admin | ✅ |
| VERIFY_MANAGER | Verify new managers | Admin | ✅ |
| GRANT_ADMIN_CAP | Grant admin capabilities | Admin | ✅ |
| SYSTEM_LOGS | Access system logs | Admin | ✅ |
| MANAGE_INTEGRATIONS | Manage platform integrations | Admin | ✅ |
| VIEW_PLATFORM_ANALYTICS | View platform-wide metrics | Admin | ✅ |
| VERIFY_ARTISTS | Verify artist accounts | Admin + Selective | ❌ (can grant) |

---

## Role Transitions

### Artist → Artist + Manager
1. Artist creates second artist account (owns both)
2. Artist becomes a manager to their own second account
3. Can expand to manage other artists if approved

### Artist + Manager Hybrid
- Single user with artist AND manager capabilities
- Can manage own artist account + other artists
- Permissions still configured per managed artist

### Artist → Producer/Manager
1. Artist has account for 1+ years
2. Applies for manager status with artist roster
3. Admin verifies credentials and artist roster
4. Account upgraded to manager status
5. Can now manage other artists

### Collaborate (No Role Change)
- Artists can collaborate without role changes
- Producers can collaborate with each other
- Collaboration ≠ management

---

## Key Architectural Decisions

### 1. No Multi-Manager Per Artist
- Each artist has ONE primary manager/producer
- Prevents conflicting permissions and confusion
- Managers can collaborate without changing ownership

### 2. Artist-Initiated Relationships
- Artist must APPROVE manager invitations
- Artist can REVOKE manager access anytime
- Protects artist from unwanted management claims

### 3. Permission Granularity
- Permissions set PER ARTIST (not global)
- Manager A might have "edit" permissions on Artist 1
- Manager A might have "view-only" permissions on Artist 2
- Each artist-manager relationship is independent

### 4. Collaboration ≠ Management
- Artists can collaborate on projects without management relationship
- Managers can work together without hierarchy
- Prevents role confusion

### 5. Account Ownership is Sacred
- Artist always owns their own account
- Manager cannot delete artist account
- Artist can revoke manager access anytime
- Data remains with artist

---

## Related Documentation
- See `USER_AUTHENTICATION.md` for signup and login flows
- See `DATA_OWNERSHIP_AND_ISOLATION.md` for data access rules
- See `ROLE_BASED_API_ACCESS.md` for API permission matrix
- See `DASHBOARD_METRICS_BY_ROLE.md` for dashboard customization

---

**Next Step**: Create USER_AUTHENTICATION.md with signup/login flows
