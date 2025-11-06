import { Router } from 'express'
import { z } from 'zod'
import ReleaseModel from '../models/release'

export const releases = Router()

const ReleaseBody = z.object({
  title: z.string().min(1),
  isrc: z.string().optional(),
  upc: z.string().optional(),
  releaseDate: z.string().datetime().optional(),
  coverUrl: z.string().url().optional(),
  links: z
    .object({
      spotify: z.string().url().optional(),
      apple: z.string().url().optional(),
      youtube: z.string().url().optional(),
      soundcloud: z.string().url().optional(),
      audius: z.string().url().optional(),
    })
    .partial()
    .optional(),
  ownerProfileId: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

// Create release
releases.post('/releases', async (req, res) => {
  const parsed = ReleaseBody.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ ok: false, error: parsed.error.flatten() })
  const input = parsed.data
  const doc = await ReleaseModel.create({
    ...input,
    releaseDate: input.releaseDate ? new Date(input.releaseDate) : undefined,
  })
  res.json({ ok: true, data: doc })
})

// List releases
releases.get('/releases', async (_req, res) => {
  const docs = await ReleaseModel.find().sort({ createdAt: -1 }).limit(200)
  res.json({ ok: true, data: docs })
})

// Get one
releases.get('/releases/:id', async (req, res) => {
  const doc = await ReleaseModel.findById(req.params.id)
  if (!doc) return res.status(404).json({ ok: false, error: 'not found' })
  res.json({ ok: true, data: doc })
})

// Update
releases.patch('/releases/:id', async (req, res) => {
  const parsed = ReleaseBody.partial().safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ ok: false, error: parsed.error.flatten() })
  const input = parsed.data
  const update: any = { ...input }
  if (input.releaseDate) update.releaseDate = new Date(input.releaseDate)
  const doc = await ReleaseModel.findByIdAndUpdate(req.params.id, update, { new: true })
  if (!doc) return res.status(404).json({ ok: false, error: 'not found' })
  res.json({ ok: true, data: doc })
})
