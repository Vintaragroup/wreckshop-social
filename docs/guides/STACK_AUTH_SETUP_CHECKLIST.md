# Stack Auth Setup - Your Action Items Checklist

Print this out and check off as you complete each step.

---

## 📋 Getting Started (Right Now)

- [ ] **Read**: `STACK_AUTH_IMPLEMENTATION_SUMMARY.md` (5 min)
- [ ] **Read**: `docs/STACK_AUTH_QUICK_START.md` (5 min)
- [ ] **Run**: `bash verify-stack-auth.sh` to check everything is in place

---

## 🔑 Step 1: Gather API Keys (15 min)

### From Stack Auth Dashboard (https://app.stack-auth.com/projects)

- [ ] Copy **Project ID** → paste into both `.env.local` files
- [ ] Copy **Publishable Client Key** (pck_...) → paste into both `.env.local` files
- [ ] Copy **Secret Server Key** (ssk_...) → paste into `backend/.env.local` only
- [ ] Navigate to **Webhooks** section
- [ ] Copy **Webhook Secret** (whsec_...) → paste into `backend/.env.local` only

---

## 🌍 Step 2: Configure Environment Variables (10 min)

### Frontend: `src/.env.local`
- [✅] File created
- [✅] `VITE_STACK_PROJECT_ID=63928c12-12fd-4780-82c4-b21c2706650f`
- [✅] `VITE_STACK_CLIENT_KEY=pck_wrbbeff0g73d6ftj44rfn6cnb4wrq8hv2bxcztxdzf4p8`
- [✅] `VITE_API_BASE_URL=http://localhost:4002/api`
- [✅] `VITE_USE_MSW=false`
- [✅] **File saved**

### Backend: `backend/.env.local`
- [✅] File created
- [✅] `STACK_PROJECT_ID=63928c12-12fd-4780-82c4-b21c2706650f`
- [✅] `STACK_SERVER_KEY=ssk_w5m39c14vct8b774e38sdcfcw7hpmmt4ykpbk44s3kj98`
- [✅] `STACK_CLIENT_KEY=pck_wrbbeff0g73d6ftj44rfn6cnb4wrq8hv2bxcztxdzf4p8`
- [ ] `STACK_WEBHOOK_SECRET=whsec_...` (copy from Stack Auth dashboard)
- [✅] `STACK_API_URL=https://api.stack-auth.com`
- [✅] `STACK_WEBHOOK_URL=https://wreckshop-webhooks.ngrok.io/api/webhooks/stack-auth`
- [✅] **File saved** (webhook secret placeholder added, update with actual value)

---

## 🔗 Step 3: Configure Stack Auth Dashboard (15 min)

### Webhooks Configuration

1. [✅] Go to Stack Auth Dashboard → Your Project
2. [✅] Click **Webhooks** section
3. [✅] Click **Add Webhook** button
4. [✅] **Endpoint**: `https://wreckshop-webhooks.ngrok.io/api/webhooks/stack-auth`
5. [✅] **Select events to send**:
   - [✅] `user.created`
   - [✅] `user.updated`
   - [✅] `user.deleted`
   - [✅] `oauth_connection.created`
   - [✅] `oauth_connection.deleted`
6. [ ] **Copy webhook secret** from Stack Auth dashboard
7. [ ] Paste secret into `backend/.env.local` as `STACK_WEBHOOK_SECRET=whsec_...`

### OAuth Providers (Optional for Testing, Required for Production)

#### If testing Spotify:
1. [ ] Go to **Auth Methods** → **Spotify**
2. [ ] Paste **Client ID** from Spotify Developer Dashboard
3. [ ] Paste **Client Secret** from Spotify Developer Dashboard
4. [ ] Verify callback URL: `https://api.stack-auth.com/api/v1/auth/oauth/callback/spotify`
5. [ ] **Enable**

#### If testing Instagram:
1. [ ] Go to **Auth Methods** → **Instagram**
2. [ ] Paste **App ID** from Meta Developers
3. [ ] Paste **App Secret** from Meta Developers
4. [ ] Verify callback URL: `https://api.stack-auth.com/api/v1/auth/oauth/callback/instagram`
5. [ ] **Enable**

---

## 🗄️ Step 4: Verify Database (5 min)

- [ ] Open terminal
- [ ] Run: `cd backend`
- [ ] Run: `npx prisma migrate deploy`
- [ ] **Expected**: "Migrations applied successfully"
- [ ] Run: `npx prisma studio`
- [ ] **Expected**: Browser opens to http://localhost:5555
- [ ] Verify tables exist: Artist, ManagerArtist, SpotifyIntegration, InstagramIntegration
- [ ] Close Prisma Studio (Ctrl+C)

---

## 🚀 Step 5: Start Services (3 min)

### Terminal 1: Frontend
- [ ] Open terminal in project root
- [ ] Run: `npm run dev`
- [ ] **Expected**: "VITE v5.0.0 ready in XXms"
- [ ] **URL**: http://localhost:5176

### Terminal 2: Backend
- [ ] Open new terminal
- [ ] Run: `cd backend && npm run dev`
- [ ] **Expected**: "[server] listening on http://localhost:4002"

### Terminal 3: Verify Containers
- [ ] Open new terminal
- [ ] Run: `docker-compose ps`
- [ ] **Expected**: All containers running (frontend, backend, postgres, redis, mongodb)

---

## 🧪 Step 6: Test Signup (10 min)

1. [ ] Open browser: http://localhost:5176
2. [ ] Click **"Sign Up"**
3. [ ] **Email**: `test@example.com`
4. [ ] **Password**: `TestPassword123`
5. [ ] Click **"Sign Up"** button
6. [ ] **Expected**: Redirected to email verification page
7. [ ] Verify email (look for confirmation link in console or logs)
8. [ ] **Setup 2FA**:
   - [ ] Choose SMS or Authenticator
   - [ ] If SMS: Enter phone number
   - [ ] If Authenticator: Scan QR code with Google Authenticator
9. [ ] Complete signup
10. [ ] **Expected**: Redirected to dashboard
11. [ ] **Verify artist created**:
    - [ ] Open `npx prisma studio` in terminal 3
    - [ ] Click **Artist** table
    - [ ] **Expected**: See new record with email: test@example.com
    - [ ] **Verify**: stackAuthUserId is populated

---

## 🔑 Step 7: Test Login (5 min)

1. [ ] Click account menu (top right)
2. [ ] Click **"Logout"**
3. [ ] **Expected**: Redirected to login page
4. [ ] **Email**: `test@example.com`
5. [ ] **Password**: `TestPassword123`
6. [ ] Click **"Sign In"**
7. [ ] **Expected**: Dashboard loads
8. [ ] **Verify**: Your email shown in account menu

---

## 🎵 Step 8: Test Spotify Connection (10 min - Optional)

1. [ ] Click **Integrations** in sidebar
2. [ ] Click **"Connect Spotify"** button
3. [ ] **Expected**: Redirected to Spotify login
4. [ ] Login with your Spotify account
5. [ ] Click **Approve** on permissions page
6. [ ] **Expected**: Redirected back to integrations
7. [ ] **Expected**: "Spotify connected ✅" message
8. [ ] **Verify in database**:
   - [ ] In `npx prisma studio`, click **SpotifyIntegration**
   - [ ] **Expected**: New record with your Spotify account info

---

## ✅ Step 9: Final Verification

- [ ] Signup works
- [ ] Email verification works
- [ ] 2FA works
- [ ] Artist created in database
- [ ] Login works
- [ ] Logout works
- [ ] Spotify connects (if configured)
- [ ] Spotify data in database
- [ ] Dashboard loads
- [ ] Account menu shows email

---

## 📝 Common Errors & Fixes

### Error: "Cannot find module @stackframe/stack"
- [ ] Run: `npm install @stackframe/stack`

### Error: "VITE_STACK_PROJECT_ID not configured"
- [ ] Check `src/.env.local` exists
- [ ] Check it has `VITE_STACK_PROJECT_ID` and `VITE_STACK_CLIENT_KEY`

### Error: "Artist not created after signup"
- [ ] Check backend logs for webhook errors
- [ ] Verify `STACK_WEBHOOK_SECRET` matches Stack Auth dashboard
- [ ] Check webhook endpoint is correct: `http://localhost:4002/api/webhooks/stack-auth`

### Error: "Signup page shows blank"
- [ ] Check browser console for JavaScript errors
- [ ] Check that Stack Auth is loading (check Network tab)
- [ ] Verify API keys are correct (no extra spaces)

### Error: "Spotify connection fails"
- [ ] Verify Spotify Client ID/Secret in Stack Auth dashboard
- [ ] Check callback URL in Stack Auth
- [ ] Verify Spotify app not in Development mode

---

## 🎯 When You're Done

- [ ] All steps completed
- [ ] All verifications passed
- [ ] No errors in console
- [ ] Ready to continue with next phase

**Next Steps**:
1. Create manager invitation flow
2. Build artist profile onboarding
3. Build dashboard screens
4. Implement permission checks

---

## 📞 Need Help?

1. Check logs:
   - Frontend: Browser console (F12)
   - Backend: Terminal output
   - Database: `npx prisma studio`

2. Review documentation:
   - `STACK_AUTH_IMPLEMENTATION_SUMMARY.md` - Overview
   - `docs/STACK_AUTH_QUICK_START.md` - Quick reference
   - `docs/STACK_AUTH_INTEGRATION_COMPLETE.md` - Full details

3. Run verification:
   ```bash
   bash verify-stack-auth.sh
   ```

---

## ⏱️ Time Estimates

- Gather API keys: 5 min
- Configure environment: 5 min
- Configure Stack Auth: 10 min
- Verify database: 5 min
- Start services: 3 min
- Test signup: 10 min
- Test login: 5 min
- Test Spotify: 10 min

**Total**: ~50 minutes

---

**Date Started**: ___________  
**Date Completed**: ___________  
**Issues Encountered**: ___________

