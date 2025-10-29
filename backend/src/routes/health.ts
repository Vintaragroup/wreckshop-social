import { Router } from 'express'

export const health = Router()

health.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

health.get('/ping', (_req, res) => {
  res.json({ ok: true })
})
