# Stack Auth Integration - Quick Reference Card

## 🎯 What You Need to Do Right Now

### 1. Add Environment Variables (5 min)

**Frontend**: `src/.env.local`
```env
VITE_STACK_PROJECT_ID=<your_project_id>
VITE_STACK_CLIENT_KEY=pck_<your_key>
VITE_API_BASE_URL=http://localhost:4002/api
VITE_USE_MSW=false
```

**Backend**: `backend/.env.local`
```env
STACK_PROJECT_ID=<your_project_id>
STACK_SERVER_KEY=ssk_<your_secret_key>
STACK_CLIENT_KEY=pck_<your_key>
STACK_WEBHOOK_SECRET=whsec_<your_webhook_secret>
STACK_API_URL=https://api.stack-auth.com
```

### 2. Configure Stack Auth Dashboard (10 min)

Go to https://app.stack-auth.com/projects

**OAuth Providers:**
- Spotify: `https://api.stack-auth.com/api/v1/auth/oauth/callback/spotify`
- Instagram: `https://api.stack-auth.com/api/v1/auth/oauth/callback/instagram`

**Webhooks:**
- Endpoint: `http://localhost:4002/api/webhooks/stack-auth`
- Events: `user.created`, `user.updated`, `user.deleted`, `oauth_connection.created`, `oauth_connection.deleted`
- Copy webhook secret to backend `.env.local`

### 3. Verify Database (5 min)

```bash
cd backend
npx prisma migrate deploy
npx prisma studio

# Should show: Artist, ManagerArtist, SpotifyIntegration, InstagramIntegration tables
```

### 4. Start Services (2 min)

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd backend && npm run dev

# Terminal 3: Verify
docker-compose ps
```

### 5. Test (10 min)

1. Go to http://localhost:5176/signup
2. Sign up with email + password
3. Check database: `npx prisma studio`
4. Verify Artist record created
5. Go to integrations, connect Spotify
6. Verify SpotifyIntegration record created
7. Logout and login again

---

## 🔧 Key File Changes

### Frontend
- ✅ `src/stack/client.ts` - NEW (Stack Auth client)
- ✅ `src/pages/auth/login-stack.tsx` - NEW (Stack Auth signin)
- ✅ `src/pages/auth/signup-stack.tsx` - NEW (Stack Auth signup)
- ✅ `src/main.tsx` - UPDATED (added StackProvider wrapper)
- ✅ `src/router.tsx` - UPDATED (using Stack Auth auth)

### Backend
- ✅ `backend/src/middleware/stack-auth.middleware.ts` - NEW (JWT validation)
- ✅ `backend/src/routes/webhooks/stack-auth.routes.ts` - NEW (event handlers)
- ✅ `backend/src/index.ts` - UPDATED (registered webhooks)

### Database
- ✅ Already in Prisma schema (stackAuthUserId foreign key)

---

## 📊 What Happens When User Signs Up

```
User clicks "Sign Up" 
    ↓
Stack Auth signup form (email + password + 2FA)
    ↓
Stack Auth validates & creates user
    ↓
WEBHOOK: user.created
    ↓
Backend creates Artist in PostgreSQL
    ↓
Frontend redirects to /onboarding/profile
    ↓
User sees dashboard
```

---

## 🔐 What Happens When User Connects Spotify

```
User clicks "Connect Spotify"
    ↓
Stack Auth redirects to Spotify OAuth
    ↓
User approves on Spotify
    ↓
Stack Auth stores token (encrypted)
    ↓
WEBHOOK: oauth_connection.created
    ↓
Backend stores metadata in PostgreSQL
    ↓
Frontend shows "Spotify connected ✅"
```

---

## 🆘 Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| "Cannot find module @stackframe/stack" | Missing npm install | `npm install @stackframe/stack` |
| "Stack Auth env vars not configured" | Missing .env.local | Add VITE_STACK_PROJECT_ID & VITE_STACK_CLIENT_KEY |
| Webhook not firing | Wrong URL or not public | Check endpoint is accessible from internet |
| Artist not created | Webhook secret wrong | Verify STACK_WEBHOOK_SECRET matches dashboard |
| Spotify connection fails | Wrong callback URL | Check redirect URI in Stack Auth & Spotify |
| 401 Unauthorized on API | Invalid token | Token expired, try logging in again |

---

## 📞 Testing Checklist

- [ ] Signup works
- [ ] Email verification works
- [ ] 2FA setup works
- [ ] Artist record created in database
- [ ] Login works
- [ ] Logout works
- [ ] Spotify connection works
- [ ] Spotify integration in database
- [ ] API calls authenticated
- [ ] Dashboard loads for authenticated user
- [ ] Password reset works

---

## 📚 Full Documentation

See `docs/STACK_AUTH_INTEGRATION_COMPLETE.md` for complete guide

See `docs/STACK_AUTH_PORTAL_SETUP_GUIDE.md` for detailed portal setup
