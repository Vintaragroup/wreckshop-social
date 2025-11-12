import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { env } from './env'
import { connectMongo } from './lib/db'
import { createQueue } from './lib/queue'
import { startIngestWorker } from './services/ingest/ingest.worker'
import { health } from './routes/health'
import { z } from 'zod'
import { spotifyAuth } from './routes/auth/spotify.routes'
import instagramAuth from './routes/auth/instagram.oauth'
import authRoutes from './routes/auth.routes'
import testDbRoutes from './routes/test-db.routes'
import webhooks from './routes/webhooks.routes'
import stackAuthWebhooks from './routes/webhooks/stack-auth.routes'
import { spotifyDiscoveryRouter } from './routes/spotify/discovery.routes'
import { profiles } from './routes/profiles.routes'
import { adminDiscoveryRouter } from './routes/admin/discovery.routes'
import { releases } from './routes/releases.routes'
import { events } from './routes/events.routes'
import { campaigns } from './routes/campaigns.routes'
import { audience } from './routes/audience.routes'
import { capture } from './routes/capture.routes'
import { artists } from './routes/artists.routes'
import { journeys } from './routes/journeys.routes'
import { segments } from './routes/segments.routes'
import { templates } from './routes/email-templates.routes'
import { abTests } from './routes/ab-tests.routes'
import { integrations } from './routes/integrations.routes'
import { spotifyIntegrationRouter } from './routes/integrations/spotify.integration'
import { instagramIntegrationRouter } from './routes/integrations/instagram.integration'
import { permissionsRouter } from './routes/manager/permissions.routes'
import { adminRouter } from './routes/admin/admin.routes'
import { authenticateJWT, optionalAuth } from './lib/middleware/auth.middleware'
import { validateStackAuthToken, optionalStackAuthToken } from './middleware/stack-auth.middleware'
import managerRoutes from './routes/manager/manager.routes'
import campaignManagerRoutes from './routes/manager/campaigns.manager.routes'
import integrationManagerRoutes from './routes/manager/integrations.manager.routes'
import contentManagerRoutes from './routes/manager/content.manager.routes'
import analyticsManagerRoutes from './routes/manager/analytics.manager.routes'
import dashboardRoutes from './routes/dashboard.routes'

async function main() {
  await connectMongo(env.MONGODB_URI)
  
  // Try to initialize queue, but don't block startup if Redis is unavailable
  try {
    const queue = createQueue(env.REDIS_URL)
    // Enqueue a sample job at boot (non-blocking)
    queue.add('boot', { startedAt: Date.now() }).catch(() => {})
    // Start ingest worker
    startIngestWorker()
  } catch (err) {
    console.warn('[warning] Redis connection failed, queue features disabled:', err)
  }

  const app = express()
  // Enable CORS for the frontend, including credentials because the web app uses
  // fetch with `credentials: 'include'`. Without this, the browser will block
  // cross-origin responses even if no cookies are used.
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-key'],
    })
  )
  // Handle preflight quickly
  app.options('*', cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-key'],
  }))
  app.use(morgan('dev'))
  app.use(express.json())

  // Root-level health route as per acceptance criteria
  app.get('/health', (_req, res) => {
    res.json({ ok: true })
  })

  // Public routes (no authentication required)
  app.use('/api', health)
  app.use('/api/test', testDbRoutes)
  app.use('/api/webhooks', webhooks)
  app.use('/api/webhooks', stackAuthWebhooks)
  app.use('/auth', spotifyAuth)
  app.use('/auth', instagramAuth)
  app.use('/api', spotifyDiscoveryRouter)
  app.use('/api', adminDiscoveryRouter)
  app.use('/api', capture) // Events tracking - often public or anonymous
  app.use('/api', optionalAuth, dashboardRoutes) // Dashboard with optional auth

  // Authentication routes (public but handles JWT)
  app.use('/api/auth', authRoutes)

  // Protected routes - require authentication
  // Apply authenticateJWT middleware to all artist/manager endpoints
  app.use('/api', authenticateJWT, profiles)
  app.use('/api', authenticateJWT, releases)
  app.use('/api', authenticateJWT, events)
  app.use('/api', authenticateJWT, campaigns)
  app.use('/api', authenticateJWT, audience)
  app.use('/api', authenticateJWT, artists)
  app.use('/api', authenticateJWT, journeys)
  app.use('/api', authenticateJWT, segments)
  app.use('/api', authenticateJWT, templates)
  app.use('/api', authenticateJWT, abTests)
  app.use('/api', authenticateJWT, integrations)
  app.use('/api/integrations', authenticateJWT, spotifyIntegrationRouter)
  app.use('/api/integrations', authenticateJWT, instagramIntegrationRouter)

  // Permission management routes (all require authentication)
  app.use('/api/manager', authenticateJWT, permissionsRouter)

  // Manager-specific routes (all require authentication)
  app.use('/api', authenticateJWT, managerRoutes)
  app.use('/api', authenticateJWT, campaignManagerRoutes)
  app.use('/api', authenticateJWT, integrationManagerRoutes)
  app.use('/api', authenticateJWT, contentManagerRoutes)
  app.use('/api', authenticateJWT, analyticsManagerRoutes)

  // Admin management routes (all require authentication)
  app.use('/api/admin', authenticateJWT, adminRouter)

  // Example zod-validated echo route
  app.post('/api/echo', (req, res) => {
    const Body = z.object({ message: z.string().min(1) })
    const parsed = Body.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() })
    }
    return res.json({ echo: parsed.data.message })
  })

  // Centralized error handler
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const status = typeof err?.status === 'number' ? err.status : 500
    const message = err?.message || 'Internal Server Error'
    console.error('[error]', { status, message, stack: err?.stack })
    res.status(status).json({ error: message })
  })

  app.listen(env.PORT, () => {
    console.log(`[server] listening on http://localhost:${env.PORT}`)
  })
}

main().catch((err) => {
  console.error('[fatal]', err)
  process.exit(1)
})

// touch 1762396737
