import { Router } from 'express'

export const health = Router()

// Standard health endpoint under the API prefix
health.get('/health', (_req, res) => {
  res.json({ ok: true })
})

// Simple liveness check
health.get('/ping', (_req, res) => {
  res.json({ ok: true })
})
