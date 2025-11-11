# Auth Fix: Docker API Resolution (November 11, 2025)

## Problem

When testing signup/login on the Docker frontend (`http://localhost:5176`), both failed with:
```
Failed to fetch
POST http://backend:4002/api/auth/login net::ERR_NAME_NOT_RESOLVED
POST http://backend:4002/api/auth/signup net::ERR_NAME_NOT_RESOLVED
```

## Root Cause

The frontend was trying to reach `http://backend:4002` (Docker internal service name), which cannot be resolved by the browser on localhost. The issue occurred because:

1. Frontend was built with `VITE_API_BASE_URL=http://backend:4002` env variable
2. This env var only works during Vite dev server (with proxy), not in production builds
3. The built version made direct fetch() calls trying to reach `backend:4002`
4. Since the browser is on your local machine (not in Docker), it can't resolve the Docker service name

## Solution

Implemented a three-part fix:

### 1. Updated API URLs in Auth Context (`src/lib/auth/context.tsx`)

Changed from hardcoded full URLs:
```typescript
// ❌ Before - Tried to use Docker service name
const response = await fetch(
  `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4002'}/api/auth/login`,
  ...
);
```

To relative paths:
```typescript
// ✅ After - Uses relative path, lets browser/proxy handle routing
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
const response = await fetch(
  `${apiBaseUrl}/auth/login`,
  ...
);
```

**Changes made:**
- `login()` - Line ~80
- `signup()` - Line ~110  
- `logout()` - Line ~140
- `refreshToken()` - Line ~165

### 2. Created Nginx Proxy Configuration (`nginx.conf`)

Added a reverse proxy that:
- Serves the React static app on `/`
- Proxies all `/api/*` requests to `http://backend:4002`
- Handles proper headers for cross-service communication

```nginx
server {
    listen 5176;
    location / {
        root /app/build;
        try_files $uri /index.html;
    }
    location /api/ {
        proxy_pass http://backend:4002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 3. Updated Frontend Dockerfile

Changed from Node dev server to Nginx production server with two-stage build:

```dockerfile
# Stage 1: Build React app
FROM node:20-alpine as builder
COPY . .
RUN npm install && npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /app/build
EXPOSE 5176
CMD ["nginx", "-g", "daemon off;"]
```

## Flow After Fix

```
Browser (localhost:5176)
    ↓
Request to /api/auth/login
    ↓
Nginx (port 5176)
    ↓
Reverse proxy to http://backend:4002/api/auth/login
    ↓
Backend container (internal Docker network)
    ↓
Responds with token + user data
```

## Testing

After the fix, API calls work correctly:

✅ Health check: `curl http://localhost:5176/api/auth/health`
```json
{
  "success": true,
  "message": "Stack Auth configured and ready"
}
```

✅ Frontend accessible: `http://localhost:5176` → Shows login page
✅ Signup works: Form submits successfully, user created in DB
✅ Login works: Credentials validated, token received, redirects to dashboard

## Key Learnings

1. **Environment variables in Vite**: Only work during build for inlining, not runtime
2. **Docker networking**: Internal service names (`backend:4002`) work inside containers, not from outside
3. **SPA deployment**: Production SPAs need a reverse proxy for API routing
4. **Relative URLs**: Using relative paths (`/api/*`) lets the proxy handle routing correctly

## Files Modified

- ✅ `src/lib/auth/context.tsx` - Updated 4 API endpoints to use relative paths
- ✅ `Dockerfile` - Switched to Nginx-based production build
- ✅ `nginx.conf` - Created new proxy configuration

## Deployment Notes

For production:
- Ensure Nginx reverse proxy is configured for all environments
- Use environment-specific configs if needed (staging, production, etc.)
- The relative `/api` path works for any deployment scenario
- No hardcoded URLs means easier multi-environment support

## Commit

All changes committed with message:
```
fix: Resolve Docker API connectivity issue with Nginx reverse proxy

- Updated auth context to use relative API paths (/api/*)
- Implemented Nginx reverse proxy for API routing
- Switched frontend Dockerfile to production build with Nginx
- Fixes ERR_NAME_NOT_RESOLVED when accessing backend from browser
```
