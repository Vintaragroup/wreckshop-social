import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { env } from './env'
import { connectMongo } from './lib/db'
import { createQueue } from './lib/queue'
import { health } from './routes/health'
import { z } from 'zod'

async function main() {
  await connectMongo(env.MONGODB_URI)
  const queue = createQueue(env.REDIS_URL)
  // Enqueue a sample job at boot (non-blocking)
  queue.add('boot', { startedAt: Date.now() }).catch(() => {})

  const app = express()
  app.use(cors({ origin: env.CORS_ORIGIN }))
  app.use(morgan('dev'))
  app.use(express.json())

  app.use('/api', health)

  // Example zod-validated echo route
  app.post('/api/echo', (req, res) => {
    const Body = z.object({ message: z.string().min(1) })
    const parsed = Body.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() })
    }
    return res.json({ echo: parsed.data.message })
  })

  app.listen(env.PORT, () => {
    console.log(`[server] listening on http://localhost:${env.PORT}`)
  })
}

main().catch((err) => {
  console.error('[fatal]', err)
  process.exit(1)
})
