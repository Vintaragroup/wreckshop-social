import { Router } from 'express'
import mongoose from 'mongoose'
import { z } from 'zod'
import Profile from '../models/profile'
import { enqueueIngest } from '../services/ingest/ingest.queue'

export const profiles = Router()

// GET /profiles?q=
profiles.get('/profiles', async (req, res) => {
  const q = (req.query.q as string | undefined)?.trim()
  const filter: Record<string, unknown> = {}
  if (q && q.length > 0) {
    filter.displayName = { $regex: q, $options: 'i' }
  }
  const docs = await (Profile as any)
    .find(filter)
    .sort({ updatedAt: -1 })
    .limit(50)
    .lean()
    .exec()

  res.json({ ok: true, data: docs })
})

// GET /profiles/:id
profiles.get('/profiles/:id', async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ ok: false, error: 'invalid id' })
  }
  const doc = await (Profile as any).findById(id).lean().exec()
  if (!doc) return res.status(404).json({ ok: false, error: 'not found' })
  return res.json({ ok: true, data: doc })
})

// POST /profiles/ingest
const IngestBody = z.object({
  provider: z.enum(['spotify', 'amazon']),
  handleOrUrl: z.string().min(1),
  accessToken: z.string().min(1).optional(),
})

profiles.post('/profiles/ingest', async (req, res) => {
  const parsed = IngestBody.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ ok: false, error: parsed.error.flatten() })

  const job = await enqueueIngest(parsed.data)
  return res.json({ ok: true, jobId: job.id })
})
