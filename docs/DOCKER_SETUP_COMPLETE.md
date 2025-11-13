# Wreckshop Social - Containerized Setup Complete ✅

## Overview
All services are now running in Docker containers with proper port mappings and data persistence.

## Services Running

| Service | Port | Status | Container |
|---------|------|--------|-----------|
| **Frontend** | 5176 | ✅ Running | wreckshop-frontend |
| **Backend** | 4002 | ✅ Running | wreckshop-backend |
| **PostgreSQL** | 5432 | ✅ Healthy | wreckshop-postgres |
| **Redis** | 6380 | ✅ Healthy | wreckshop-redis |
| **MongoDB** | 27020 | ✅ Healthy | wreckshop-mongo |

## URLs

- **Frontend**: http://localhost:5176
- **Backend Health**: http://localhost:4002/health
- **Backend API**: http://localhost:4002/api/*

## Database Configuration

**PostgreSQL** (for Prisma/Day 2 schema):
- Host: postgres:5432 (internal), localhost:5432 (external)
- Database: wreckshop_dev
- User: wreckshop_user
- Password: wreckshop_password

**MongoDB** (for existing app):
- Host: mongo:27017 (internal), localhost:27020 (external)
- Database: admin
- User: wreckshop_admin
- Password: wreckshop_password

**Redis**:
- Host: redis:6379 (internal), localhost:6380 (external)

## Docker Compose Configuration

All services are defined in `/docker-compose.yml`:
- All services use `wreckshop-network` bridge network
- All services have persistent volumes
- Health checks configured for PostgreSQL, Redis, and MongoDB
- Backend depends on all services being healthy before starting
- Frontend depends on backend being started before starting

## Key Files Modified/Created

1. **docker-compose.yml** - Complete containerized setup with all 5 services
2. **backend/Dockerfile** - Updated to generate Prisma client for Linux platform
3. **backend/.env** - Updated with Docker internal hostnames
4. **backend/prisma/schema.prisma** - Updated with `linux-musl-arm64-openssl-3.0.x` binary target
5. **Dockerfile** (root) - Created frontend Dockerfile
6. **backend/package.json** - Added `prisma:generate` script

## Quick Start

```bash
# Start all services
docker-compose up -d

# View logs
docker logs wreckshop-backend
docker logs wreckshop-frontend

# Stop all services
docker-compose down
```

## Verification

✅ Frontend accessible at http://localhost:5176  
✅ Backend responding to http://localhost:4002/health  
✅ PostgreSQL migrated and ready (Prisma schema applied)  
✅ All services running and healthy  
✅ Data persistence enabled with Docker volumes  

## Stack Auth Env Requirements

Add the Stack Auth credentials to `.env.docker` (placeholders are provided—replace them with your real project keys):

```
STACK_PROJECT_ID=...
STACK_CLIENT_KEY=pck_...
STACK_SERVER_KEY=ssk_...
STACK_WEBHOOK_SECRET=whsec_...
STACK_API_URL=https://api.stack-auth.com
STACK_APP_BASE_URL=https://app.stack-auth.com
```

Without these values the backend containers cannot validate Stack Auth JWTs and the frontend cannot render the hosted social-login flow.

## Consolidated vs Old Setup

**Old setup** (removed):
- wreckshop_social_cloud-frontend
- wreckshop_social_cloud-backend
- wreckshop-frontend-dev
- wreckshop-backend-dev
- wreckshop-mongo
- wreckshop-scripts
- Old individual containers

**New consolidated setup** (current):
- Single docker-compose.yml managing all 5 services
- Unified network (wreckshop-network)
- Proper port mappings (5176 frontend, 4002 backend)
- Health checks for reliability
- Volume persistence for databases

## Next Steps (Phase 1 - Day 2)

- Run Prisma migrations for PostgreSQL
- Test database connectivity with `/api/test/db-health` endpoint
- Complete Day 2 verification and commit

## Notes

- Redis runs on port 6380 (port 6379 was in use by another service)
- MongoDB exposed on port 27020 (internal 27017) for external access
- Prisma Client properly configured for Alpine Linux (linux-musl-arm64-openssl-3.0.x)
- All environment variables properly configured for Docker network communication
