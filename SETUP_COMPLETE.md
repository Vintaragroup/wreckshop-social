# ✅ Setup Complete - Artist Testing Environment Ready

## Current Status: **LIVE AND OPERATIONAL**

### Public Access URL
🌐 **https://wreckshop.ngrok.app** - Share this with artists and managers for testing

---

## What's Running

### Docker Containers (Isolated for ngrok testing)
- ✅ **Frontend**: Vite dev server on port 5176
- ✅ **Backend**: Express server on port 4002
- ✅ **PostgreSQL**: Database service (migrations applied ✅)
- ✅ **MongoDB**: Document store
- ✅ **Redis**: Cache/queue service

### ngrok Tunnel
- ✅ **Status**: Online
- ✅ **Domain**: wreckshop.ngrok.app
- ✅ **Forwarding**: https://wreckshop.ngrok.app → http://localhost:5176
- ✅ **Region**: United States

### Backend Status
- ✅ **Server**: Listening on http://localhost:4002
- ✅ **Database**: PostgreSQL connected and migrated
- ✅ **Auth Routes**: Signup endpoint working
- ✅ **API Paths**: /api/auth/signup accessible

---

## Recent Fixes Applied

### 1. Vite Configuration (Fixed)
**Problem**: Host blocking ngrok.app domain
**Solution**: Added `allowedHosts` configuration in vite.config.ts
```typescript
allowedHosts: [
  'localhost',
  '127.0.0.1',
  'wreckshop.ngrok.app',
  '*.ngrok.app',
  '*.ngrok.io',
]
```

### 2. Database Migrations (Fixed)
**Problem**: Signup endpoint returned 404 - database tables missing
**Solution**: Ran Prisma migrations in Docker container
```bash
docker exec wreckshop-backend-ngrok npx prisma migrate deploy
```
**Result**: All tables created, signup working ✅

### 3. Frontend Docker Image (Fixed)
**Problem**: npm not found in frontend container
**Solution**: Updated Dockerfile to properly install npm dependencies

### 4. API Proxy Configuration (Fixed)
**Problem**: Double /api/api routing issue
**Solution**: Configured Vite proxy to handle ngrok external URLs correctly

---

## Testing the Application

### Via Browser
1. Open **https://wreckshop.ngrok.app**
2. Click "Sign Up"
3. Enter test credentials:
   - Email: artist@example.com
   - Password: password123
   - Name: Test Artist

### Via API (curl)
```bash
curl -X POST https://wreckshop.ngrok.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"artist@test.com",
    "password":"password123",
    "name":"Test Artist",
    "accountType":"ARTIST"
  }'
```

---

## Development Workflow

### Keep Docker Running (Background)
```bash
cd /Users/ryanmorrow/Documents/Projects2025/Wreckshop-social
docker compose -f docker-compose.yml up -d
```

### Keep ngrok Tunnel Running (Separate Terminal)
Open a **new terminal window** (not VS Code integrated terminal) and run:
```bash
ngrok http --domain=wreckshop.ngrok.app 5176
```

**Why separate terminal?** ngrok logs high-frequency HTTP requests that can crash VS Code's integrated terminal.

### Local Development (Optional)
To use local npm instead of Docker:
```bash
cd /path/to/Wreckshop-social
npm install
npm run dev
# Access at http://localhost:5176
```

---

## Infrastructure Details

### Port Configuration
| Service | Container Port | Host Port | Ngrok |
|---------|---|---|---|
| Frontend | 5176 | 5176 | ✅ Yes (wreckshop.ngrok.app) |
| Backend | 4002 | 4002 | Via Docker network |
| PostgreSQL | 5432 | 5432 | Internal |
| MongoDB | 27017 | - | Internal |
| Redis | 6379 | - | Internal |

### Environment Variables
**Frontend (.env.ngrok)**:
- `VITE_API_BASE_URL=https://wreckshop.ngrok.app/api`

**Backend (.env)**:
- `DATABASE_URL=postgresql://wreckshop:wreckshop_dev_password@postgres:5432/wreckshop`
- `MONGODB_URI=mongodb://mongo:27017/wreckshop`
- `REDIS_URL=redis://redis:6379`
- `CORS_ORIGIN=https://wreckshop.ngrok.app`
- `SPOTIFY_REDIRECT_URI=https://wreckshop.ngrok.app/auth/spotify/callback`

---

## Key Features Ready for Testing

✅ User signup with local authentication  
✅ Artist profile creation  
✅ Spotify OAuth integration (configured)  
✅ Dashboard access  
✅ Campaign management  
✅ Audience insights  
✅ Analytics dashboard  
✅ Integration settings  
✅ Compliance tools  

---

## Next Steps

### For Artist Testing
1. Share **https://wreckshop.ngrok.app** with testers
2. Create test accounts with different roles (Artist, Manager)
3. Gather feedback on UX, performance, and functionality

### For Development
1. Make code changes locally in VS Code
2. Frontend hot-reloads automatically (Vite)
3. Backend watches for changes and restarts (nodemon)
4. Changes visible at both:
   - http://localhost:5176 (local)
   - https://wreckshop.ngrok.app (public)

### For Production
When ready to deploy:
1. Replace ngrok with permanent domain
2. Update environment variables
3. Configure SSL/TLS certificates
4. Scale Docker deployment

---

## Troubleshooting

### If ngrok crashes
→ Restart in separate terminal (not VS Code integrated terminal)

### If signup returns 404
→ Verify migrations ran: `docker exec wreckshop-backend-ngrok npx prisma migrate deploy`

### If "host not allowed" error
→ Check `allowedHosts` in vite.config.ts includes your domain

### If Docker containers stop
→ Restart: `docker compose -f docker-compose.yml up -d`

### To check all services
```bash
docker ps --filter 'name=wreckshop'
```

---

**Last Updated**: November 12, 2025  
**Status**: Production-Ready for Artist Testing  
**Deployed By**: GitHub Copilot
