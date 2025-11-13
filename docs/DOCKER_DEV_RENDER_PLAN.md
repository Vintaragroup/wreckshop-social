# Docker Dev & Render Deployment Plan

## Goals
- Migrate daily development away from ad-hoc ngrok tunnels to a single Docker Compose stack (`docker-compose.yml`) that contains frontend, backend, Postgres, Mongo, and Redis.
- Keep the repo “Render-ready” so once Stack Auth issues are resolved we can deploy the same containers to Render.com (one service per app).

## Current Status
- **Active stack:** `docker compose -f docker-compose.yml up --build -d`
  - Container names no longer carry the `-ngrok` suffix (`wreckshop-frontend`, `wreckshop-backend`, etc.).
  - `.env.docker` now exposes Stack Auth (`STACK_PROJECT_ID`, `STACK_CLIENT_KEY`, `STACK_SERVER_KEY`, `STACK_WEBHOOK_SECRET`, `STACK_API_URL`, `STACK_APP_BASE_URL`) to both frontend and backend.
- **Ngrok usage:** optional. Start ngrok manually if you need an external URL, but the Docker stack stays the same.

## Local Docker Workflow
```bash
# Start / rebuild everything
docker compose -f docker-compose.yml up --build -d

# View logs
docker compose -f docker-compose.yml logs -f backend

# Stop and clean up
docker compose -f docker-compose.yml down
```

### Environment checklist
| File | Purpose | Required keys |
|------|---------|---------------|
| `.env.docker` | feeds Docker dev stack | Stack Auth keys, Spotify, Last.fm, Admin, etc. |
| `.env.local` (optional) | direct `npm run dev` | same Stack Auth keys if you run outside Docker |

## Render.com Deployment Prep (after Stack Auth bugs fixed)
1. **Frontend service**
   - Dockerfile: root `Dockerfile` (current Vite build/serve script).
   - Env vars: `VITE_STACK_PROJECT_ID`, `VITE_STACK_CLIENT_KEY`, `VITE_STACK_API_URL`, `VITE_STACK_APP_BASE_URL`, `VITE_API_BASE_URL` (point to backend Render URL).
2. **Backend service**
   - Dockerfile: `backend/Dockerfile`.
   - Env vars: same Stack Auth keys, database credentials (Render Postgres), Redis/Mongo endpoints (Render managed add-ons or Atlas URI), `CORS_ORIGIN` set to frontend Render domain.
3. **Data services**
   - Use Render managed Postgres + Redis, or external Mongo/Atlas as documented in `docker-compose.cloud.yml`.
4. **CI/CD trigger**
   - `git push` → Render builds Docker images automatically once services are configured.

## Next Steps
1. Finish Stack Auth integration testing inside Docker stack (login, signup, OAuth, webhooks).
2. Once stable, add a `render.yaml` or per-service docs with exact env mappings and deploy commands.
3. Remove any remaining documentation that suggests everyday work requires ngrok-specific compose files (those were deleted).
