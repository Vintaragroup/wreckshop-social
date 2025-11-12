# 🔐 URGENT: Add Your Webhook Secret

Your Stack Auth setup is **95% complete**. One final step:

## What You Need to Do (2 minutes)

1. Go to Stack Auth Dashboard: https://app.stack-auth.com/projects/63928c12-12fd-4780-82c4-b21c2706650f/webhooks

2. Find your webhook and **click to view details**

3. Copy the **Webhook Secret** (starts with `whsec_`)

4. Open `backend/.env.local` and replace:
   ```
   STACK_WEBHOOK_SECRET=whsec_PASTE_YOUR_WEBHOOK_SECRET_HERE
   ```
   with your actual secret, e.g.:
   ```
   STACK_WEBHOOK_SECRET=whsec_abc123xyz...
   ```

5. Save the file

---

## Then You're Ready to Test!

Once webhook secret is added, run:

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd backend && npm run dev

# Terminal 3: ngrok tunnel
ngrok http 4002 --domain wreckshop-webhooks.ngrok.io
```

Then visit: http://localhost:5176/signup

✅ Test signup → Artist created in database → Login works!

---

## Status Checklist

- [✅] Frontend .env.local created with all credentials
- [✅] Backend .env.local created with API keys
- [✅] ngrok static domain configured: `https://wreckshop-webhooks.ngrok.io`
- [✅] Webhook endpoint registered in Stack Auth
- [ ] **Webhook secret added to backend/.env.local** ← YOU ARE HERE
- [ ] Start services
- [ ] Test signup flow
- [ ] Verify artist created in database
- [ ] Test login flow
- [ ] Complete! 🎉

---

## Quick Reference

**Frontend Environment**: `src/.env.local`
- Project ID: `63928c12-12fd-4780-82c4-b21c2706650f`
- Client Key: `pck_wrbbeff0g73d6ftj44rfn6cnb4wrq8hv2bxcztxdzf4p8`

**Backend Environment**: `backend/.env.local`
- Project ID: `63928c12-12fd-4780-82c4-b21c2706650f`
- Server Key: `ssk_w5m39c14vct8b774e38sdcfcw7hpmmt4ykpbk44s3kj98`
- Client Key: `pck_wrbbeff0g73d6ftj44rfn6cnb4wrq8hv2bxcztxdzf4p8`
- Webhook URL: `https://wreckshop-webhooks.ngrok.io/api/webhooks/stack-auth`
- Webhook Secret: **COPY FROM DASHBOARD** ← MISSING

---

## Need Help?

Check backend logs for webhook errors:
```bash
cd backend && npm run dev
# Watch for webhook event confirmations
```

Check frontend startup:
```bash
npm run dev
# Should say "VITE v5.0.0 ready"
```

---

**Next Step**: Copy webhook secret and update `backend/.env.local`

Then run the three commands above and test signup! 🚀
