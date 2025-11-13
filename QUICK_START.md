# 🚀 Quick Start - Artist Testing Environment

## ✅ Status: READY TO TEST

### Public Testing URL
```
https://wreckshop.ngrok.app
```

---

## What's Running Right Now

| Component | Status | Details |
|-----------|--------|---------|
| 🌐 Frontend | ✅ Running | Vite dev server on 5176 |
| 🔧 Backend | ✅ Running | Express on 4002 |
| 🐘 PostgreSQL | ✅ Running | Migrations applied ✅ |
| 🔄 MongoDB | ✅ Running | Ready for data |
| 💾 Redis | ✅ Running | Queue/cache ready |
| 🔗 ngrok Tunnel | ✅ Running | wreckshop.ngrok.app active |

---

## Test Sign Up

### Browser
1. Go to: https://wreckshop.ngrok.app
2. Click "Sign Up"
3. Enter test credentials

### Command Line
```bash
curl -X POST https://wreckshop.ngrok.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"password123",
    "name":"Test Artist",
    "accountType":"ARTIST"
  }'
```

**Expected Response**: 200 OK with user data and auth token

---

## If Something Stops

### Restart Docker
```bash
cd /Users/ryanmorrow/Documents/Projects2025/Wreckshop-social
docker compose -f docker-compose.yml up -d
```

### Restart ngrok (in separate terminal)
```bash
ngrok http --domain=wreckshop.ngrok.app 5176
```

### Check Status
```bash
docker ps -f 'name=wreckshop'
```

---

## Development Notes

- **Frontend changes**: Hot reload active (Vite)
- **Backend changes**: Auto-restart active (nodemon)
- **Database**: PostgreSQL with migrations ✅
- **Environment**: Docker isolated, no conflicts

---

## Share with Testers

✅ Ready to give this URL to artists and managers:
```
https://wreckshop.ngrok.app
```

**Note**: ngrok tunnel is temporary (expires if process stops). Keep the terminal running!

---

**Setup Complete**: November 12, 2025
