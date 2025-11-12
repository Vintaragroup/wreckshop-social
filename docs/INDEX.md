# Wreckshop Documentation Index

**Project:** Wreckshop Social (Music Industry Marketing & Artist Discovery)  
**Status:** Phase 1 Complete - Authentication & Admin System  
**Last Updated:** November 11, 2025  
**Git Tag:** phase-1-complete-auth-admin

---

## Quick Navigation

### 📋 Getting Started
- **PHASE_1_COMPLETE.md** - Phase 1 summary and status (start here!)
- **STACK_AUTH_INTEGRATION_GUIDE.md** - Step-by-step guide for replicating on new projects
- **SYSTEM_ARCHITECTURE.md** - Complete system design and security architecture

### 👤 User & Permission Management
- **PERMISSION_MODEL.md** - Three-tier hierarchy explained
- **ADMIN_QUICK_REFERENCE.md** - Quick reference for common admin tasks

### 🛠️ Development Guides
- **FRONTEND_STACK_AUTH_SETUP.md** - Frontend Stack Auth configuration
- **Database schema** - See `backend/prisma/schema.prisma`

### 🚀 Moving Forward
See **Next Phase** section below

---

## What We Built (Phase 1)

### Authentication System
✅ Stack Auth integration for secure user authentication
✅ JWT token management and validation
✅ Protected routes that require authentication
✅ Auto-profile creation on first login

### Permission Hierarchy
✅ **Super Admin** - Only you (ryan@vintaragroup.com)
  - Grant/revoke admin access
  - View admin user list
  - Full platform access

✅ **Manager/Producer** - Account type: ARTIST_AND_MANAGER
  - Grant permissions to artist accounts
  - Create campaigns and manage audiences
  - Configure integrations

✅ **Artist** - Account type: ARTIST
  - Manage own profile and integrations
  - Access social media and music tools
  - Collaborate with other artists

### Security Features
✅ Admin-only endpoint protection (403 Forbidden for non-admins)
✅ JWT token validation on all protected routes
✅ Secure password handling via Stack Auth
✅ CORS configuration with Authorization support
✅ Admin status badge in UI
✅ Auto-refresh user profile on app load

---

## Key Technologies

### Backend
- Node.js / Express
- PostgreSQL with Prisma ORM
- Stack Auth for authentication
- Docker containerization

### Frontend
- React 18.3.1 with TypeScript
- Vite build tool
- React Router for navigation
- TailwindCSS + shadcn/ui

### Infrastructure
- Docker Compose for local development
- ngrok for external webhook access
- PostgreSQL in Docker container

---

## Important Directories

```
backend/
├── src/
│   ├── lib/
│   │   ├── stack-auth.ts           ← Stack Auth utilities
│   │   ├── middleware/
│   │   │   └── auth.middleware.ts  ← JWT validation
│   │   └── prisma.ts               ← Database client
│   ├── routes/
│   │   ├── auth.routes.ts          ← Login/signup endpoints
│   │   └── admin/
│   │       └── admin.routes.ts     ← Admin endpoints (protected)
│   └── index.ts                    ← Express app setup
├── prisma/
│   ├── schema.prisma               ← Database schema
│   └── migrations/                 ← Database migrations
└── scripts/
    ├── set-admin.ts                ← Grant admin status
    ├── delete-artist.ts            ← Delete user account
    └── list-artists.ts             ← List all users

src/ (frontend)
├── lib/
│   ├── auth/
│   │   ├── context.tsx             ← Auth state management
│   │   └── roles.ts                ← Permission checking
│   └── api/                        ← API client
├── components/
│   ├── app-shell.tsx               ← Main layout with admin badge
│   ├── protected-route.tsx         ← Route protection
│   └── ui/                         ← shadcn/ui components
├── pages/
│   ├── auth/
│   │   ├── login.tsx               ← Login page
│   │   └── signup.tsx              ← Signup page
│   └── dashboard.tsx               ← Main dashboard
└── router.tsx                      ← Route configuration

docs/
├── PHASE_1_COMPLETE.md             ← Phase 1 summary (start here!)
├── STACK_AUTH_INTEGRATION_GUIDE.md ← Replication guide (1,140 lines)
├── PERMISSION_MODEL.md             ← Permission system detailed
├── ADMIN_QUICK_REFERENCE.md        ← Quick reference
├── SYSTEM_ARCHITECTURE.md          ← Security architecture
└── ... (other documentation)
```

---

## How to Use This Documentation

### If You're New to the Project
1. Read: **PHASE_1_COMPLETE.md**
2. Understand: **SYSTEM_ARCHITECTURE.md**
3. Reference: **PERMISSION_MODEL.md**

### If You Need to Replicate This on a New Project
1. Read: **STACK_AUTH_INTEGRATION_GUIDE.md** (complete step-by-step)
2. Follow: Backend Setup (steps 1-7)
3. Follow: Frontend Setup (steps 1-6)
4. Follow: Database Integration
5. Test: Using provided test examples

### If You Need to Debug Something
1. Check: **ADMIN_QUICK_REFERENCE.md** - Debugging section
2. Run: Debug commands provided
3. Check: Backend logs with `docker-compose logs backend -f`

### If You Need to Add New Admin Features
1. Reference: **PERMISSION_MODEL.md** - Understanding current system
2. Modify: Backend routes in `src/routes/admin/admin.routes.ts`
3. Add protection: Check `if (!req.user?.isAdmin)` on route
4. Update frontend: Edit role checking in `src/lib/auth/roles.ts`

---

## API Quick Reference

### Authentication Endpoints (Public)
```
POST /api/auth/login          - Login
POST /api/auth/signup         - Create account
GET  /api/auth/status         - Check status
```

### User Endpoints (Protected)
```
GET  /api/auth/me             - Get current user
POST /api/auth/logout         - Logout
```

### Admin Endpoints (Protected + Admin Only)
```
PATCH /api/admin/set-admin    - Grant admin access
PATCH /api/admin/remove-admin - Revoke admin access
GET   /api/admin/list         - List all admins
```

---

## Current User Accounts

### Your Account (Super Admin)
- **Email:** ryan@vintaragroup.com
- **Status:** Super Admin (isAdmin: true)
- **Access:** All features + admin operations
- **Database ID:** cmhvcp9y50004rzfopo5majmz

### Creating Test Accounts

**Artist Account:**
```bash
# Signup via UI or API
POST /api/auth/signup
{ "email": "artist@example.com", "password": "password", "name": "Test Artist" }
# Result: accountType = 'ARTIST'
```

**Manager Account:**
```bash
# Signup as above, then update database
UPDATE Artist SET accountType = 'ARTIST_AND_MANAGER' WHERE email = 'manager@example.com'
```

**Admin Account:**
```bash
# Signup as above, then grant admin
docker-compose exec backend npx tsx scripts/set-admin.ts admin@example.com
```

---

## Development Workflow

### Start Development Environment
```bash
# Terminal 1: Start Docker containers
docker-compose -f tools/docker/docker-compose.yml up

# Terminal 2: Frontend development (if not running in container)
cd src && npm run dev

# Terminal 3: Backend logs
docker-compose logs backend -f
```

### Make Changes
```bash
# Backend changes auto-reload via nodemon
# Frontend changes auto-reload via Vite dev server

# If backend doesn't reload, manually restart:
docker-compose restart backend

# If database schema changes, run migration:
docker-compose exec backend npx prisma migrate dev
```

### Test Changes
```bash
# Manual testing
# 1. Login via browser at http://localhost:5176/login
# 2. Check admin badge appears for your account
# 3. Test protected routes require auth

# Automated testing (curl examples in guides)
curl -X GET http://localhost:4002/api/admin/list \
  -H "Authorization: Bearer $TOKEN"
```

---

## Key Decisions Made

### Why Stack Auth?
- Secure password handling
- Built-in session management
- Easy to extend with custom data
- No need to build auth from scratch

### Why Separate User Profile Table?
- Separation of concerns (auth vs business logic)
- Can access user data without calling Stack Auth
- Faster queries for business logic
- Can add custom fields specific to our app

### Why Three-Tier Permission System?
- Clear roles and responsibilities
- Prevents privilege escalation
- Scales to larger teams
- Easy to add new permission types

### Why JWT Tokens Instead of Sessions?
- Stateless authentication (good for APIs)
- Works with microservices
- Can be used for mobile apps
- Easier to debug and test

---

## Next Phase: Program Refinements & Tool Additions

After Phase 1 (Authentication & Admin), Phase 2 will focus on:

### High Priority
- [ ] Manager-to-artist permission grants UI
- [ ] Campaign creation and management
- [ ] Audience segment builder
- [ ] Integration configuration dashboard
- [ ] Error handling improvements

### Medium Priority
- [ ] Analytics and reporting dashboard
- [ ] Social media posting tools
- [ ] Email campaign builder
- [ ] User collaboration features
- [ ] Mobile responsive improvements

### Low Priority
- [ ] Dark mode refinements
- [ ] Performance optimizations
- [ ] Advanced filtering
- [ ] Bulk operations
- [ ] Export/import features

---

## Restoration Points (Git Tags)

```
phase-1-complete-auth-admin  ← You are here
  └── Previous: phase-0-setup (if exists)
```

To restore to a previous point:
```bash
git checkout phase-1-complete-auth-admin
```

---

## Common Tasks

### View Logs
```bash
docker-compose logs backend -f
docker-compose logs frontend -f
docker-compose logs postgres -f
```

### Access Database
```bash
docker-compose exec backend npx prisma studio
```

### List All Users
```bash
docker-compose exec backend npx tsx scripts/list-artists.ts
```

### Make Someone Admin
```bash
docker-compose exec backend npx tsx scripts/set-admin.ts user@example.com
```

### Rebuild Backend
```bash
docker-compose exec backend npm run build
docker-compose restart backend
```

### Reset Database
```bash
docker-compose exec backend npx prisma migrate reset --force
```

---

## Troubleshooting Quick Links

### Backend Issues
→ See **STACK_AUTH_INTEGRATION_GUIDE.md** section "Debugging & Troubleshooting"

### Permission Issues  
→ See **ADMIN_QUICK_REFERENCE.md** section "Testing the System"

### Database Issues
→ See **STACK_AUTH_INTEGRATION_GUIDE.md** section "Database Integration"

### CORS Issues
→ See **ADMIN_QUICK_REFERENCE.md** or check `backend/src/index.ts` CORS config

---

## Files Summary

| File | Lines | Purpose |
|------|-------|---------|
| PHASE_1_COMPLETE.md | 397 | Phase 1 status and summary |
| STACK_AUTH_INTEGRATION_GUIDE.md | 1,140 | Complete replication guide |
| PERMISSION_MODEL.md | 297 | Three-tier permission system |
| ADMIN_QUICK_REFERENCE.md | 289 | Quick reference for tasks |
| SYSTEM_ARCHITECTURE.md | 331 | Security architecture |

**Total Documentation:** ~2,500 lines

---

## Contact & Support

### Documentation Questions
→ Check the specific guide listed in this index

### Code Questions
→ Check relevant source files (paths listed above)

### Debugging Help
→ Run debug commands in "Troubleshooting Quick Links"

---

## Useful Links

### Backend Setup
- `backend/src/lib/stack-auth.ts` - Stack Auth utilities
- `backend/src/lib/middleware/auth.middleware.ts` - JWT middleware
- `backend/src/routes/auth.routes.ts` - Auth endpoints

### Frontend Setup
- `src/lib/auth/context.tsx` - Auth context
- `src/components/protected-route.tsx` - Route protection
- `src/pages/auth/login.tsx` - Login page

### Documentation
- `/docs/PHASE_1_COMPLETE.md` - Start here!
- `/docs/STACK_AUTH_INTEGRATION_GUIDE.md` - For replication

---

## Summary

**You have successfully completed Phase 1 of Wreckshop:**

✅ Secure authentication via Stack Auth
✅ Three-tier permission hierarchy
✅ Admin access control system
✅ Complete documentation for replication
✅ Ready for Phase 2 features

**Next:** Program refinements and tool additions

---

*Last Updated: November 11, 2025*  
*Current Phase: 1 Complete, Ready for Phase 2*  
*Git Tag: phase-1-complete-auth-admin*

