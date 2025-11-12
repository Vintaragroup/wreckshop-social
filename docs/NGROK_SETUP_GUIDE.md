# Development & Testing Setup Guide

**Goal:** Easy switching between local development and artist testing via ngrok

---

## Environment Files

### `.env.local` - LOCAL DEVELOPMENT (default)
```bash
VITE_API_BASE_URL=http://localhost:4002/api
```
- **Use for:** Daily development, feature work, local testing
- **Access:** http://localhost:5176
- **Backend:** http://localhost:4002

### `.env.ngrok` - ARTIST/MANAGER TESTING
```bash
VITE_API_BASE_URL=https://wreckshop.ngrok.app/api
```
- **Use for:** Sharing with testers, artist feedback, external testing
- **Access:** https://wreckshop.ngrok.app
- **Backend:** Exposed via ngrok tunnel

---

## Quick Start

### Step 1: Ensure Local Environment
```bash
# Current default - good for local development
git checkout .env.local
npm run dev
# Access: http://localhost:5176
```

### Step 2: Switch to ngrok for Artist Testing
```bash
# Copy ngrok environment
cp .env.ngrok .env.local

# Restart frontend (hot reload might work, or refresh browser)
npm run dev

# In another terminal, expose backend
ngrok http --url=wreckshop.ngrok.app 4002
```

### Step 3: Share with Artists/Managers
Send them: **https://wreckshop.ngrok.app**

They can:
- Create accounts
- Test the platform
- Provide feedback
- Work with campaigns

### Step 4: Return to Local Development
```bash
# Reset to localhost
git checkout .env.local

# Restart frontend
npm run dev
```

---

## Workflow Scenarios

### Scenario 1: Daily Development
```bash
# Morning start
git checkout .env.local
npm run dev
# Access: localhost:5176
# Work on features...
```

### Scenario 2: Artist Feedback Session
```bash
# Switch to ngrok
cp .env.ngrok .env.local

# Restart frontend
npm run dev

# In separate terminal
ngrok http --url=wreckshop.ngrok.app 4002

# Send URL to artists: https://wreckshop.ngrok.app
# They test and provide feedback
```

### Scenario 3: Deploy Updates
```bash
# Make code changes
git add -A
git commit -m "feat: New feature"

# Test locally
git checkout .env.local
npm run dev
# Verify it works

# Then switch to ngrok for artist testing
cp .env.ngrok .env.local
npm run dev
# Artists test new feature
```

---

## ngrok Tunnel Setup

### Start Tunnel (separate terminal)
```bash
ngrok http --url=wreckshop.ngrok.app 4002
```

### Tunnel Output
```
Session Status    online
Account           ryan@vintaragroup.com
Forwarding        https://wreckshop.ngrok.app -> http://localhost:4002
Connections       0 total
```

### Keep Tunnel Running
- Don't close this terminal while testing
- Artists will lose access if tunnel stops
- Can safely restart anytime (get new session)

---

## Environment Variable Reference

| Variable | Local | ngrok |
|----------|-------|-------|
| VITE_API_BASE_URL | http://localhost:4002/api | https://wreckshop.ngrok.app/api |
| VITE_STACK_PROJECT_ID | Same | Same |
| VITE_STACK_CLIENT_KEY | Same | Same |
| VITE_STACK_API_URL | https://api.stack-auth.com | https://api.stack-auth.com |

---

## Troubleshooting

### "Can't connect to localhost:4002"
- Make sure backend is running: `docker-compose up`
- Check if backend is healthy: http://localhost:4002/health

### "Artists can't access ngrok URL"
- Verify tunnel is running: `ngrok http --url=wreckshop.ngrok.app 4002`
- Check URL is: https://wreckshop.ngrok.app (HTTPS required)
- Tunnel must stay running for access

### "Frontend changes not appearing"
- Kill frontend process (Ctrl+C)
- Make sure correct .env is active
- Restart with: `npm run dev`

### "401 Unauthorized on API calls"
- Check JWT token is being sent
- Verify Stack Auth credentials are correct
- Check browser console for errors

---

## Tips for Artist Testing

### Before Sharing
1. Test locally first: `git checkout .env.local && npm run dev`
2. Verify features work
3. Create test accounts

### During Testing
1. Start ngrok tunnel (keep it running)
2. Switch environment: `cp .env.ngrok .env.local`
3. Restart frontend: `npm run dev`
4. Share: https://wreckshop.ngrok.app
5. Send debug guide if they hit issues

### After Testing
1. Collect feedback
2. Stop ngrok (Ctrl+C)
3. Return to local: `git checkout .env.local`
4. Continue development

---

## Files

- `.env.local` - Git ignored, local development (do not commit)
- `.env.ngrok` - Git committed, ngrok testing template
- `.env.example` - Reference for all variables

---

## Next Steps

1. ✅ Local development: `npm run dev` (already works)
2. ✅ Artist testing: Copy `.env.ngrok` → restart → share URL
3. ✅ Iterate: Easy switching between environments

---

**Summary:** Use `.env.local` for development, switch to `.env.ngrok` for testing. Fast, simple, effective.

*Last Updated: November 11, 2025*
