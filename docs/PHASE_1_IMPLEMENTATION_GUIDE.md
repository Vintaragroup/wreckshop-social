# Phase 1 Implementation Guide - Complete Overview

**Phase 1 Duration**: 8-10 days  
**Start Date**: November 11, 2025  
**Status**: ✅ STARTED (Day 1 setup files created)

---

## 📋 Overview

Phase 1 is the **foundation** that makes everything else possible:

1. **Stack Auth Integration** (Day 1) - Authentication & 2FA
2. **Database & Prisma** (Day 2) - Data models for Artist, Manager, Integrations
3. **Webhook Handlers** (Day 3) - Sync Stack Auth events to your database
4. **Auth Middleware** (Day 4) - JWT validation & permission checking
5. **Manager API Routes** (Days 5-6) - Invitation, approval, roster management
6. **Dashboard API** (Days 6-7) - Role-specific data endpoints
7. **Frontend Integration** (Days 7-8) - React components with auth

### Success Criteria (Phase 1 Complete)
- ✅ User can sign up with email/Google/phone
- ✅ 2FA required and working
- ✅ Artist profile created after signup
- ✅ Spotify/Instagram can be connected
- ✅ Manager can invite artist
- ✅ Artist can approve manager
- ✅ Dashboard shows correct data based on role
- ✅ Permission checks working on all APIs

---

## 📅 Week-by-Week Breakdown

### Week 1: Foundation (Days 1-4)

```
Day 1 (4h)  → Stack Auth Setup
Day 2 (6h)  → Database & Prisma
Day 3 (6h)  → Webhook Handlers
Day 4 (4h)  → Auth Middleware
              Total: 20 hours
```

### Week 2: APIs & Frontend (Days 5-8)

```
Day 5-6 (8h)  → Manager API Routes
Day 6-7 (6h)  → Dashboard API
Day 7-8 (6h)  → Frontend Integration
               Total: 20 hours (overlapping, ~12 actual hours)
```

---

## 🎯 Quick Start

### Prerequisites
- Node.js 18+
- npm/yarn
- PostgreSQL or Docker
- Stack Auth account (free at https://app.stack-auth.com)

### Getting Started

#### Step 1: Day 1 - Stack Auth Setup

**Files Created:**
- `docs/PHASE_1_DAY_1_CHECKLIST.md` ← **Start here**
- `backend/src/lib/stack-auth.ts` - Stack Auth client
- `backend/src/routes/auth.routes.ts` - Auth endpoints
- `backend/.env.example` - Updated with Stack Auth vars

**Frontend Setup:**
- `docs/FRONTEND_STACK_AUTH_SETUP.md` ← Create auth context

**Action:**
1. Read `docs/PHASE_1_DAY_1_CHECKLIST.md`
2. Sign up at https://app.stack-auth.com
3. Get API keys and add to `.env.local`
4. Run: `npm install @stackframe/stack` in backend
5. Test: `curl http://localhost:4002/api/auth/health`

#### Step 2: Day 2 - Database Setup

**Files to Create:**
- See `docs/PHASE_1_DAY_2_CHECKLIST.md` ← **Read next**

**Action:**
1. Start PostgreSQL (Docker or local)
2. Install Prisma: `npm install @prisma/client`
3. Create `prisma/schema.prisma` (provided in checklist)
4. Run migrations: `npx prisma migrate dev --name init`
5. Test: `curl http://localhost:4002/api/test/prisma-health`

#### Step 3: Days 3-4 - Webhooks & Auth Middleware

**Files to Create:**
- `backend/src/routes/webhooks.routes.ts` - Webhook handlers
- `backend/src/middleware/auth.middleware.ts` - JWT validation
- `backend/src/middleware/permissions.middleware.ts` - Permission checks

**See:** `PHASE_1_IMPLEMENTATION_PLAN.md` Days 3-4 sections

#### Step 4: Days 5-6 - Manager API Routes

**Create API endpoints:**
- `POST /api/artists/:id/managers/invite` - Send invitation
- `POST /api/artists/:id/managers/approve` - Approve manager
- `GET /api/managers/roster` - Get managed artists
- `PUT /api/managers/:id/permissions` - Update permissions

**See:** `PHASE_1_IMPLEMENTATION_PLAN.md` Days 5-6 sections

#### Step 5: Days 6-7 - Dashboard API

**Create dashboard endpoint:**
- `GET /api/dashboard` - Role-specific dashboard data

**Returns different data based on user role:**
- Artist: personal metrics, releases, campaigns
- Producer: roster, team metrics, revenue

**See:** `PHASE_1_IMPLEMENTATION_PLAN.md` Days 6-7 sections

#### Step 6: Days 7-8 - Frontend Integration

**Update frontend:**
1. Wrap app with `<AuthProvider>`
2. Create `ProtectedRoute` component
3. Update router with auth checks
4. Load role-specific dashboards
5. Fetch data from new endpoints

**See:** `docs/FRONTEND_STACK_AUTH_SETUP.md`

---

## 📂 File Structure After Phase 1

```
backend/
├── src/
│   ├── lib/
│   │   ├── stack-auth.ts          ✅ Created Day 1
│   │   ├── prisma.ts              ✅ Created Day 2
│   ├── middleware/
│   │   ├── auth.middleware.ts      📝 Day 4
│   │   ├── permissions.middleware.ts 📝 Day 4
│   ├── routes/
│   │   ├── auth.routes.ts         ✅ Created Day 1
│   │   ├── webhooks.routes.ts      📝 Day 3
│   │   ├── managers.routes.ts      📝 Days 5-6
│   │   ├── dashboard.routes.ts     📝 Days 6-7
│   │   └── test-prisma.routes.ts   📝 Day 2
│   ├── services/
│   │   ├── artist.service.ts       📝 Day 3
│   │   ├── manager.service.ts      📝 Days 5-6
│   │   └── webhook.service.ts      📝 Day 3
│   └── index.ts                    ✅ Updated Day 1
│
├── prisma/
│   ├── schema.prisma               📝 Day 2 (provided)
│   └── migrations/
│       └── xxx_init/               📝 Day 2
│
├── .env.example                    ✅ Updated Day 1
└── package.json                    📝 Day 1 update needed

src/ (frontend)
├── contexts/
│   └── AuthContext.tsx             📝 Day 1 frontend
├── components/
│   ├── ProtectedRoute.tsx          📝 Day 1 frontend
│   └── ...
├── pages/
│   ├── LoginPage.tsx               📝 Days 7-8
│   ├── dashboards/
│   │   ├── ArtistDashboard.tsx     📝 Days 7-8
│   │   └── ProducerDashboard.tsx   📝 Days 7-8

docs/
├── PHASE_1_DAY_1_CHECKLIST.md      ✅ Created
├── PHASE_1_DAY_2_CHECKLIST.md      ✅ Created
├── PHASE_1_DAY_3_CHECKLIST.md      📝 Soon
├── PHASE_1_DAY_4_CHECKLIST.md      📝 Soon
├── PHASE_1_IMPLEMENTATION_PLAN.md  ✅ From architecture
├── FRONTEND_STACK_AUTH_SETUP.md    ✅ Created
├── STACK_AUTH_INTEGRATION.md       ✅ From architecture
└── PHASE_1_IMPLEMENTATION_GUIDE.md ← You are here
```

**Legend:**
- ✅ = Created today
- 📝 = To be created in next days
- 👉 = Action items

---

## 🔍 Reference Documents

### Architecture Foundation (Already Complete)
- `docs/architecture/USER_ROLES_AND_PERMISSIONS.md` - Role definitions
- `docs/architecture/USER_AUTHENTICATION.md` - Auth flows
- `docs/architecture/DATA_OWNERSHIP_AND_ISOLATION.md` - Data access rules
- `docs/architecture/ROLE_BASED_API_ACCESS.md` - API permission matrix
- `docs/architecture/DASHBOARD_METRICS_BY_ROLE.md` - Dashboard specs
- `docs/architecture/STACK_AUTH_INTEGRATION.md` - Integration strategy

### Phase 1 Checklists (In Progress)
- `docs/PHASE_1_DAY_1_CHECKLIST.md` - **START HERE** ← You are here
- `docs/PHASE_1_DAY_2_CHECKLIST.md` - Database setup
- `docs/FRONTEND_STACK_AUTH_SETUP.md` - Frontend auth context
- `docs/PHASE_1_IMPLEMENTATION_PLAN.md` - Detailed code examples (from architecture)

---

## 🚀 Day-by-Day Detailed Guide

### Day 1: Stack Auth Setup (4 hours)

**🎯 Goal**: Get Stack Auth configured and API health check working

**📋 Tasks**:
```
1. Sign up for Stack Auth (15 min)
2. Create project & get API keys (15 min)
3. Add keys to .env.local (20 min)
4. Install SDK: npm install @stackframe/stack (20 min)
5. Create stack-auth.ts config file (15 min)
6. Create auth.routes.ts with /health endpoint (15 min)
7. Update index.ts to include auth routes (15 min)
8. Create AuthContext.tsx for frontend (30 min)
9. Test: curl http://localhost:4002/api/auth/health (15 min)
```

**📁 Files to Create/Edit**:
- ✅ `backend/.env.example` - Updated
- ✅ `backend/src/lib/stack-auth.ts` - New
- ✅ `backend/src/routes/auth.routes.ts` - New
- ✅ `backend/src/index.ts` - Updated
- 📝 `src/contexts/AuthContext.tsx` - New (frontend)
- ✅ `docs/PHASE_1_DAY_1_CHECKLIST.md` - Reference guide

**✅ Success Criteria**:
- Stack Auth account created
- API keys obtained and in .env.local
- `/api/auth/health` returns success
- No TypeScript errors
- Backend starts: `npm run dev`

**🔗 Reference**: `docs/PHASE_1_DAY_1_CHECKLIST.md`

---

### Day 2: Database & Prisma (6 hours)

**🎯 Goal**: PostgreSQL + Prisma models for Artist, Manager, Integrations

**📋 Tasks**:
```
1. Set up PostgreSQL (Docker) (30 min)
2. Install Prisma (10 min)
3. Create prisma/schema.prisma (60 min)
4. Run migrations (20 min)
5. Generate Prisma Client (10 min)
6. Create prisma.ts service file (15 min)
7. Create test-prisma.routes.ts (15 min)
8. Test: curl http://localhost:4002/api/test/prisma-health (15 min)
9. View database with: npx prisma studio (10 min)
```

**📁 Files to Create/Edit**:
- 📝 `docker-compose.yml` - Add PostgreSQL service
- 📝 `backend/prisma/schema.prisma` - Full schema (provided)
- 📝 `backend/src/lib/prisma.ts` - New
- 📝 `backend/src/routes/test-prisma.routes.ts` - New
- 📝 `backend/src/index.ts` - Add test routes
- ✅ `docs/PHASE_1_DAY_2_CHECKLIST.md` - Reference guide

**✅ Success Criteria**:
- PostgreSQL running
- All 7 tables created (Artist, ManagerArtist, Integrations, AuditLog)
- Prisma Client generated
- `/api/test/prisma-health` returns success
- `npx prisma studio` opens database viewer

**🔗 Reference**: `docs/PHASE_1_DAY_2_CHECKLIST.md`

---

### Days 3-4: Webhooks & Auth Middleware

**Day 3 (6h)**: Webhook handlers for Stack Auth events
- user.created → Create artist profile
- oauth.connected → Store integration metadata
- user.deleted → Cleanup

**Day 4 (4h)**: Auth middleware
- JWT verification
- Permission checking
- Role validation

**See**: `PHASE_1_IMPLEMENTATION_PLAN.md` for detailed code examples

---

### Days 5-6: Manager API Routes (8h)

**Create REST endpoints:**
- Invite manager to artist account
- Approve/reject manager invitation
- Get manager's roster
- Update manager permissions
- Remove manager

**See**: `ROLE_BASED_API_ACCESS.md` for endpoint specifications

---

### Days 6-7: Dashboard API (6h)

**Create unified dashboard endpoint:**
- Query user role
- Return role-specific data
- Calculate metrics
- Apply caching

**Responses**:
- Artist: Personal metrics, releases, campaigns, leaderboard
- Producer: Roster, aggregated metrics, team metrics

**See**: `DASHBOARD_METRICS_BY_ROLE.md` for specs

---

### Days 7-8: Frontend Integration (6h)

**Update React app:**
1. Wrap with `<AuthProvider>`
2. Create `<ProtectedRoute>` wrapper
3. Update router with auth checks
4. Create artist/producer dashboard components
5. Fetch from new endpoints
6. Test complete signup → dashboard flow

**See**: `docs/FRONTEND_STACK_AUTH_SETUP.md`

---

## 💻 Key Commands Reference

```bash
# Backend setup
cd backend
npm install @stackframe/stack @prisma/client
npm run dev

# Database
docker-compose up -d postgres
npx prisma migrate dev --name init
npx prisma studio

# Testing
curl http://localhost:4002/api/auth/health
curl http://localhost:4002/api/test/prisma-health

# Frontend
cd src
npm install @stackframe/stack
npm run dev
```

---

## 🛠️ Troubleshooting Quick Links

### Stack Auth Issues
- **Keys not working**: Check project ID and secret key match
- **CORS errors**: Verify CORS_ORIGIN in .env
- **SDK not found**: Run `npm install @stackframe/stack`

### Database Issues
- **Can't connect**: Verify PostgreSQL is running
- **Tables not created**: Run `npx prisma migrate reset`
- **Schema syntax error**: Check prisma.schema for typos

### Frontend Issues
- **Auth context errors**: Ensure AuthProvider wraps app
- **CORS blocking requests**: Update backend CORS_ORIGIN
- **JWT token invalid**: Verify backend token verification logic

---

## 📊 Progress Tracking

Use this to track Phase 1 completion:

```markdown
## Phase 1 Completion Status

- [x] Day 1: Stack Auth Setup
  - [x] Stack Auth account created
  - [x] API keys obtained
  - [ ] Backend auth routes working
  - [ ] Frontend AuthContext created

- [ ] Day 2: Database & Prisma
  - [ ] PostgreSQL running
  - [ ] Prisma initialized
  - [ ] Migrations complete
  - [ ] Prisma studio accessible

- [ ] Day 3: Webhook Handlers
  - [ ] Webhooks configured
  - [ ] user.created handler working
  - [ ] oauth.connected handler working

- [ ] Day 4: Auth Middleware
  - [ ] JWT verification working
  - [ ] Permission checks in place
  - [ ] Middleware integrated

- [ ] Days 5-6: Manager API Routes
  - [ ] All manager endpoints created
  - [ ] Permission matrix tested
  - [ ] Permission checks enforced

- [ ] Days 6-7: Dashboard API
  - [ ] Dashboard endpoint created
  - [ ] Artist data loading
  - [ ] Producer data loading
  - [ ] Caching in place

- [ ] Days 7-8: Frontend Integration
  - [ ] ProtectedRoute component created
  - [ ] Login/signup pages updated
  - [ ] Dashboards load with real data
  - [ ] End-to-end flow working

Phase 1 Completion: [████████░░░░░░░░░░░░░░] 25%
```

---

## 🎓 Learning Resources

- [Stack Auth Docs](https://docs.stack-auth.com)
- [Prisma ORM](https://www.prisma.io/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [React Security](https://react.dev/learn)

---

## 📞 Support

If stuck:
1. Check the relevant day's checklist
2. Review `PHASE_1_IMPLEMENTATION_PLAN.md` for code examples
3. Consult architecture docs for data model questions
4. Verify all `.env.local` variables are set

---

**Next Action**: Start with Day 1 checklist → `docs/PHASE_1_DAY_1_CHECKLIST.md`

**Estimated Completion**: November 18-20, 2025 (8-10 days)  
**Status**: 🚀 READY TO BUILD
