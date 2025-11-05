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
import { spotifyDiscoveryRouter } from './routes/spotify/discovery.routes'
import { profiles } from './routes/profiles.routes'

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
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }))
  app.use(morgan('dev'))
  app.use(express.json())

  // Root-level health route as per acceptance criteria
  app.get('/health', (_req, res) => {
    res.json({ ok: true })
  })

  app.use('/api', health)
  app.use('/api', profiles)
  app.use('/auth', spotifyAuth)
  app.use('/api', spotifyDiscoveryRouter)

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
