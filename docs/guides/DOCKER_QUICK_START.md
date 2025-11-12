# Quick Start Guide - Wreckshop Social Docker

## 🎯 Quick Access

**Application**: http://localhost:5176

## 🐳 Docker Commands

### Start Everything
```bash
docker-compose up -d
```

### Stop Everything
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f frontend   # Frontend logs
docker-compose logs -f backend    # Backend logs
docker-compose logs -f            # All logs
```

### Rebuild Frontend
```bash
docker-compose up -d --build frontend
```

### Check Status
```bash
docker ps | grep wreckshop
```

## 🔍 API Testing

### Database Health
```bash
curl http://localhost:5176/api/test/db-health | jq .
```

### Discover Artists
```bash
curl 'http://localhost:5176/api/dashboard/discover?genre=hip-hop' | jq .
```

## 📊 Services

| Service | URL | Port | Status |
|---------|-----|------|--------|
| Frontend | http://localhost:5176 | 5176 | ✅ Running |
| Backend | http://localhost:4002 | 4002 | ✅ Running |
| PostgreSQL | localhost | 5432 | ✅ Running |
| MongoDB | localhost | 27020 | ✅ Running |
| Redis | localhost | 6380 | ✅ Running |

## 🔧 Configuration

### API Base URL
- **Frontend**: Uses relative paths `/api/*`
- **Nginx**: Proxies `/api/*` to `http://backend:4002`
- **Build Arg**: `VITE_API_BASE_URL=""` (empty for relative paths)

### Why This Works
✅ Browser makes requests to same origin (`localhost:5176`)  
✅ Nginx intercepts and routes internally  
✅ Docker DNS resolves `backend` service  
✅ No hardcoded IPs or service names exposed to browser

## 🐛 Troubleshooting

### Site Not Reachable
```bash
# Check if containers are running
docker ps | grep wreckshop

# Start them
docker-compose up -d
```

### API Not Working
```bash
# Check nginx proxy
docker-compose exec frontend nginx -t

# View nginx logs
docker-compose exec frontend tail -f /var/log/nginx/access.log
```

### Database Connection Error
```bash
# Check backend logs
docker-compose logs backend

# Test DB health
curl http://localhost:5176/api/test/db-health | jq .
```

## 📝 Important Files

- `Dockerfile` - Frontend build (with VITE_API_BASE_URL argument)
- `docker-compose.yml` - Service orchestration
- `nginx.conf` - API proxy configuration
- `src/lib/api/client.ts` - API client (uses relative paths)

## ✅ All Systems Operational

The application is fully functional with:
- ✅ Frontend serving via Nginx
- ✅ API proxy working correctly
- ✅ All services connected
- ✅ Database populated
- ✅ Authentication system ready

**Ready to use!** 🚀
