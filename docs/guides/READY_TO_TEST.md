# 🚀 READY TO TEST - Stack Auth Integration Complete!

## ✅ Configuration Complete

All systems are running and configured:

```
Frontend:           ✅ http://localhost:5176
Backend:            ✅ http://localhost:4002
Database:           ✅ PostgreSQL (healthy)
ngrok tunnel:       ✅ https://wreckshop-webhooks.ngrok.io
Webhook endpoint:   ✅ Reachable and validating signatures
Webhook secret:     ✅ Loaded in backend
Stack Auth project: ✅ Configured
```

---

## 🧪 NOW TEST THE COMPLETE FLOW

### Step 1: Open Signup Page

Visit: **http://localhost:5176/signup**

You should see the Stack Auth signup form.

### Step 2: Create Test Account

Fill in:
- **Email**: `test@example.com`
- **Password**: `TestPassword123!`
- Click **"Sign Up"**

Expected: You'll see email verification page or be redirected to 2FA setup.

### Step 3: Verify Email (if needed)

Check Stack Auth logs or email for verification link. Complete email verification.

### Step 4: Set Up 2FA

Choose either:
- **Authenticator App**: Scan QR code with Google Authenticator
- **SMS**: Enter phone number (if configured)

Complete 2FA setup.

### Step 5: Complete Signup

You should be redirected to dashboard (or onboarding flow).

### Step 6: Verify Artist Created in Database

Run this command to check if the artist was created:

```bash
docker exec wreckshop-postgres psql -U postgres -d wreckshop -c \
  "SELECT id, email, stackAuthUserId, createdAt FROM Artist WHERE email='test@example.com';"
```

**Expected Output:**
```
                 id                 |      email       |                stackAuthUserId                 |         createdAt
------------------------------------+------------------+----------------------------------------------+------------------------
 [some-uuid]                        | test@example.com | [user-id-from-stack-auth]                     | 2025-11-11 21:30:45.123
```

✅ **If you see this, the webhook is working!** The artist was auto-created via webhook.

### Step 7: Check Backend Logs for Webhook Processing

```bash
docker logs wreckshop-backend | grep -i webhook
```

Expected to see:
```
[WEBHOOK] user.created event processed
[WEBHOOK] Created Artist record for user: [user-id]
```

### Step 8: Test Login

1. Click account menu (top right) or Logout
2. Go to login page: http://localhost:5176/login
3. Enter: `test@example.com` / `TestPassword123!`
4. Click "Sign In"
5. Expected: Dashboard loads, you're authenticated

---

## 📊 Verification Checklist

After completing the flow above, verify all these worked:

- [ ] Signup page loads
- [ ] Stack Auth form displays
- [ ] Email verification works (or skipped)
- [ ] 2FA setup works
- [ ] Artist created in database (run query above)
- [ ] stackAuthUserId is populated (webhook worked!)
- [ ] Backend logs show webhook processing
- [ ] Login works
- [ ] Dashboard loads after login
- [ ] Logout works

---

## 🔍 Debugging Commands

If something doesn't work, check these:

**Frontend Issues:**
```bash
# Check frontend logs
docker logs wreckshop-frontend | tail -50

# Check if Stack Auth is loading (browser DevTools → Network tab)
# Look for requests to api.stack-auth.com
```

**Backend Webhook Issues:**
```bash
# Check webhook processing
docker logs wreckshop-backend | grep -i webhook

# Check for signature errors
docker logs wreckshop-backend | grep -i signature

# Full backend logs
docker logs wreckshop-backend | tail -50
```

**Database Issues:**
```bash
# Check all artists
docker exec wreckshop-postgres psql -U postgres -d wreckshop -c "SELECT COUNT(*) FROM Artist;"

# Check specific artist
docker exec wreckshop-postgres psql -U postgres -d wreckshop -c \
  "SELECT email, stackAuthUserId FROM Artist WHERE email='test@example.com';"

# Check if tables exist
docker exec wreckshop-postgres psql -U postgres -d wreckshop -c "\dt"
```

**Webhook Secret Issue:**
```bash
# Verify secret is loaded
grep STACK_WEBHOOK_SECRET backend/.env.local

# Should output:
# STACK_WEBHOOK_SECRET=whsec_6e+wFCxoklF4qf+P7mcKtIAko7pWwfkW

# If it shows PASTE_YOUR_WEBHOOK_SECRET, restart backend:
docker restart wreckshop-backend
```

---

## 🎯 Success Indicators

### ✅ Everything Working
- Signup form loads without errors
- Email verification completes
- 2FA can be set up
- Artist appears in database after signup
- stackAuthUserId is NOT NULL
- Backend logs show successful webhook processing
- Login works
- Dashboard loads

### ⚠️ Common Issues & Fixes

**Issue**: Signup page blank or errors loading Stack Auth
- **Fix**: Check Frontend Stack Auth credentials in `src/.env.local`
- Run: `docker logs wreckshop-frontend | grep -i stack`

**Issue**: Email verification fails
- **Fix**: This is normal for development, check Stack Auth logs for test links

**Issue**: Artist not created in database after signup
- **Cause**: Webhook secret mismatch or signature verification failed
- **Fix**: 
  1. Verify secret in `backend/.env.local` matches Stack Auth dashboard exactly
  2. Restart backend: `docker restart wreckshop-backend`
  3. Try signup again
  4. Check logs: `docker logs wreckshop-backend | grep -i webhook`

**Issue**: "Missing signature" errors in backend logs
- **Cause**: Webhook secret is incorrect
- **Fix**: Check that the secret in `backend/.env.local` exactly matches Stack Auth dashboard (no spaces, no typos)

**Issue**: Artist created but stackAuthUserId is NULL
- **Cause**: Webhook processed but couldn't extract user ID
- **Fix**: Check backend logs for detailed error: `docker logs wreckshop-backend | tail -50`

---

## 🚀 Next Steps After Verification

Once you verify the complete flow works:

1. **Test with Spotify Connection** (optional)
   - Go to Integrations
   - Click "Connect Spotify"
   - Verify SpotifyIntegration created in database

2. **Create Multiple Test Accounts**
   - Test manager invitation flow
   - Test multiple user scenarios

3. **Deploy to Production**
   - Use real Stack Auth production project
   - Update webhook URL to production domain
   - Update SMTP settings for real emails
   - Test complete flow in production environment

4. **Build Next Features**
   - Manager invitation system
   - Artist profile onboarding
   - Dashboard screens
   - Permission checks on all routes

---

## 📝 Test Account Details

**For Testing:**
```
Email: test@example.com
Password: TestPassword123!
```

**For Stack Auth Dashboard Test:**
Go to: https://app.stack-auth.com/projects/63928c12-12fd-4780-82c4-b21c2706650f/users

You should see your test user created and verified.

---

## ✨ You're All Set!

The integration is **100% complete and ready for testing**.

1. Open: http://localhost:5176/signup
2. Complete the signup flow
3. Check database for artist creation
4. Celebrate! 🎉

**Questions?** Run: `bash test-webhook.sh` to verify everything is still working.

Let me know once you've tested and verified everything works! 🚀
