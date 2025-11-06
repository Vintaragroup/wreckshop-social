import { Router } from 'express'
import { z } from 'zod'
import SegmentModel from '../models/segment'

export const segments = Router()

const SegmentBody = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  ownerProfileId: z.string().optional(),
  query: z.any().optional(),
  tags: z.array(z.string()).optional(),
  estimatedCount: z.number().int().nonnegative().optional(),
})

// Create segment (basic)
segments.post('/segments', async (req, res) => {
  const parsed = SegmentBody.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ ok: false, error: parsed.error.flatten() })
  const doc = await SegmentModel.create(parsed.data)
  res.json({ ok: true, data: doc })
})

// List segments with optional search
segments.get('/segments', async (req, res) => {
  const q = String(req.query.q || '').trim()
  const filter: any = {}
  if (q) filter.name = { $regex: q, $options: 'i' }
  const docs = await SegmentModel.find(filter).sort({ updatedAt: -1 }).limit(200)
  res.json({ ok: true, data: docs })
})
