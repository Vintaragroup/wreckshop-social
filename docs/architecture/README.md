# User Architecture & Authentication - Complete Foundation

**Document Version**: 1.0  
**Date**: November 11, 2025  
**Status**: READY FOR IMPLEMENTATION  
**Created by**: AI Architecture Assistant  
**Based on**: Business requirements from Ryan Morrow

---

## Overview

This folder contains the complete **user management, authentication, and authorization architecture** for Wreckshop Social. All major business decisions have been documented before any code implementation.

### What's Documented
✅ Role definitions (Artist, Producer/Manager, Admin)  
✅ Authentication methods (Email, Google, Phone, OAuth integrations)  
✅ Signup and onboarding flows  
✅ Permission model and delegation  
✅ Data ownership and isolation rules  
✅ API access control matrix  
✅ Dashboard customization by role  
✅ Security policies and 2FA  

### What's NOT Documented (Future)
- Billing and subscription models
- Influencer/brand partnership features
- Advanced analytics and AI recommendations
- Mobile app specific features

---

## Document Guide

### 1. **USER_ROLES_AND_PERMISSIONS.md** 👥
**What it contains:**
- Artist role definition and capabilities
- Producer/Manager role definition and capabilities
- Admin role definition and selective capabilities
- Permission matrix for each role
- How artists manage multiple accounts
- How managers can be granted specific artists
- Manager permission levels (View-Only, Collaborate, Editor, Full Control, Custom)

**Key decisions locked in:**
- ✅ Each artist has ONE primary manager (no multi-manager)
- ✅ Artist must APPROVE manager (not the reverse)
- ✅ Artists can manage multiple accounts they own
- ✅ Managers can manage 15-25 artists initially
- ✅ Admin role is separate from Producer role
- ✅ Selective admin capabilities can be granted to producers

**Use this when:** Building user models, defining permission logic, setting up roles in database

---

### 2. **USER_AUTHENTICATION.md** 🔐
**What it contains:**
- Primary auth methods (Email + Password, Google OAuth, Phone/SMS)
- Secondary integration methods (Spotify, Instagram - NOT for login)
- Complete artist signup flow (7 steps including platform connections)
- Producer/Manager signup flow (email request → admin verification)
- Artist approval of manager workflow
- 2FA setup (SMS or Authenticator app)
- Login flow with 2FA
- Session management (JWT tokens, refresh tokens)
- Account recovery procedures
- Security requirements (password rules, rate limiting)

**Key decisions locked in:**
- ✅ Artists sign up via website (email, Google, or phone)
- ✅ Producers apply via email and are verified by admin
- ✅ Platform integrations (Spotify, Instagram, etc.) are MANDATORY during artist onboarding
- ✅ 2FA is required (SMS or Authenticator)
- ✅ No password-only login (must have 2FA)
- ✅ Email verification required for new accounts
- ✅ Multi-method authentication supported

**Use this when:** Building login/signup pages, setting up auth middleware, configuring OAuth flows

---

### 3. **DATA_OWNERSHIP_AND_ISOLATION.md** 🔒
**What it contains:**
- Core principle: All data belongs to the artist
- Artist-owned data categories (profile, content, analytics, integrations)
- Manager-owned data categories (roster, management settings)
- Shared/collaborative data (projects, gamified leaderboards)
- Data access rules for each role
- How managers view managed artists' data
- Cross-artist data leakage prevention
- Database query patterns for secure access
- Gamified competition (opt-in leaderboards)
- Data sharing scenarios (campaign approval, collaboration)
- Data deletion and retention policies
- Audit trails and compliance

**Key decisions locked in:**
- ✅ Artist owns all their data, can revoke manager access anytime
- ✅ Managers see only artists they manage + what permissions allow
- ✅ No data leakage between artists (even managed artists)
- ✅ Gamified metrics are OPT-IN (artists can hide)
- ✅ Managers cannot delete artist accounts
- ✅ Artists can share campaign metrics with managers
- ✅ All data modifications are audited
- ✅ Deleted accounts have 30-day grace period

**Use this when:** Writing database queries, building data access layer, implementing permission checks

---

### 4. **ROLE_BASED_API_ACCESS.md** 📡
**What it contains:**
- API endpoint permission matrix
- Examples for each major endpoint (campaigns, artist profiles, analytics, integrations)
- Authorization middleware implementation
- Permission checking patterns
- Query filtering examples (Artist-only, Manager-only)
- Data redaction for API responses (hiding sensitive tokens)
- Audit logging patterns
- Permission validation for each role

**Key decisions locked in:**
- ✅ All endpoints require authentication (JWT token)
- ✅ Permissions checked per-endpoint + per-resource
- ✅ Sensitive data (tokens, passwords) never returned in API
- ✅ All API requests logged for audit trail
- ✅ Rate limiting enforced (1000 req/hour per user)
- ✅ Artists can only access own data
- ✅ Managers can only access managed artist data
- ✅ Admins have full access with audit trail

**Use this when:** Building backend routes, implementing middleware, securing endpoints

---

### 5. **DASHBOARD_METRICS_BY_ROLE.md** 📊
**What it contains:**
- Artist dashboard specification (10 card types with mockups)
- Producer/Manager dashboard specification (9 card types with mockups)
- Admin dashboard reference
- Each card shows: purpose, data source, update frequency, actions available
- Real-time vs aggregated metrics
- Data sources and refresh rates
- Dashboard configuration JSON format
- Gamified leaderboard integration

**Key decisions locked in:**
- ✅ Artist dashboard focused on personal performance
- ✅ Producer dashboard focused on roster management
- ✅ Each role sees only their relevant metrics
- ✅ Real-time updates for streams, followers, engagement
- ✅ Aggregated daily updates for leaderboards, revenue
- ✅ Gamified elements opt-in only
- ✅ Producers see aggregated metrics across managed artists
- ✅ Artists can see competing artists' metrics (opt-in)

**Use this when:** Building dashboard components, designing API endpoints for dashboard, creating data aggregation queries

---

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
1. Create User model in database
2. Create ManagerArtist model (relationship table)
3. Implement JWT authentication
4. Build auth middleware
5. Create signup/login endpoints

### Phase 2: Role Management (Weeks 2-3)
1. Implement role-based authorization
2. Create permission checking middleware
3. Build permission assignment endpoints
4. Test cross-role data isolation

### Phase 3: API Endpoints (Weeks 3-4)
1. Build campaign endpoints with permission checks
2. Build artist profile endpoints
3. Build analytics endpoints
4. Build manager roster endpoints
5. Build integration management endpoints

### Phase 4: Frontend (Weeks 4-6)
1. Build login/signup pages
2. Build artist dashboard
3. Build producer dashboard
4. Build permission management UI
5. Build manager invitation system

### Phase 5: Testing & Security (Weeks 6-7)
1. Security penetration testing
2. Data isolation testing
3. Permission matrix testing
4. Performance testing

---

## Critical Implementation Notes

### Security
- **Always validate permissions on backend** (never trust client)
- **Use prepared statements** (prevent SQL injection)
- **Encrypt sensitive data** (OAuth tokens, payment info)
- **Use HTTPS everywhere** (no HTTP)
- **Implement rate limiting** on all endpoints
- **Log all admin actions** (separate audit table)

### Database
- Create indexes on: `artist_id`, `manager_id`, `user_id`, `role`
- Use soft deletes for artists/campaigns (don't permanently delete)
- Store permissions as JSON (flexible permission model)
- Create audit table for compliance

### API Design
- Prefix all protected endpoints with `/api`
- Include JWT in `Authorization: Bearer <token>` header
- Return 401 for auth failures, 403 for permission failures
- Include permission scope in JWT claims

### Frontend
- Store JWT in secure HTTP-only cookie (not localStorage)
- Clear cookies on logout
- Check user role before showing components
- Show appropriate error messages for permission denials

---

## Quick Reference Tables

### Roles & Capabilities

| Capability | Artist | Manager | Admin |
|-----------|--------|---------|-------|
| Manage own profile | ✅ | ✅ | ✅ |
| Create campaigns | ✅ | ✅* | ✅ |
| View own analytics | ✅ | ✅* | ✅ |
| Manage other artists | ⚠️** | ✅ | ✅ |
| Connect integrations | ✅ | ✅* | ✅ |
| Accept manager | ✅ | N/A | N/A |
| Verify artists | ❌ | ❌ | ✅ |
| View platform metrics | ❌ | ❌ | ✅ |

*Only if artist grants permission  
**Only if they own the account

### Authentication Methods

| Method | Artist | Producer | Notes |
|--------|--------|----------|-------|
| Email + Password | ✅ | ✅ | Primary method |
| Google OAuth | ✅ | ✅ | Optional signup |
| Phone/SMS | ✅ | ✅ | Optional signup |
| Spotify OAuth | ✅* | N/A | Integration only |
| Instagram OAuth | ✅* | N/A | Integration only |

*Mandatory during onboarding, not for login

### Permission Levels (Manager → Artist)

| Level | View | Create | Edit | Post Social | Delete |
|-------|------|--------|------|-------------|--------|
| View-Only | ✅ | ❌ | ❌ | ❌ | ❌ |
| Collaborate | ✅ | ✅ | ⚠️† | ❌ | ❌ |
| Editor | ✅ | ✅ | ✅ | ✅ | ❌ |
| Full Control | ✅ | ✅ | ✅ | ✅ | ✅ |
| Custom | ✅ | Any combination | ✅ | Any combination | Any combination |

†Suggest changes, artist approves

---

## Next Steps

1. **Review these documents** with your team
2. **Create database schema** based on User/ManagerArtist models
3. **Start with Phase 1** (Foundation)
4. **Test permission matrix** before moving to frontend
5. **Implement audit logging** from day one

---

## Questions Answered by This Documentation

✅ Who can sign up? (Artists only, producers by email request)  
✅ How do managers manage artists? (Invitation → Artist approval → Permission levels)  
✅ Can artists manage multiple accounts? (Yes, if they own them)  
✅ Can managers see artist data? (Yes, based on permissions set by artist)  
✅ What's the auth method? (JWT-based, multi-method signup)  
✅ How is data isolated? (By artist_id, checked in every query)  
✅ What's the dashboard? (Role-specific metrics and cards)  
✅ How are permissions managed? (Per-artist, granular, artist-controlled)  
✅ Is 2FA required? (Yes, SMS or Authenticator)  
✅ Can artists delete their account? (Yes, 30-day grace period)  
✅ What about data deletion? (Soft delete, audit trail retained)  
✅ Can managers collaborate? (Yes, without creating hierarchy)  

---

## Document Maintenance

- **Last Updated**: November 11, 2025
- **Next Review**: Before implementing Phase 2
- **Approval Status**: Ready for development
- **Approved by**: Business requirements confirmed

---

## Related Documentation (Outside This Folder)

- `/docs/features/` - Feature implementations
- `/docs/integrations/` - Platform integrations (Spotify, Instagram, etc.)
- `/docs/security/` - Security policies and compliance
- `/tools/` - Development tools and scripts
- `/backend/src/models/` - Database models (will be created)

---

**Status**: ✅ COMPLETE - Ready for implementation  
**Next Action**: Begin Phase 1 implementation
