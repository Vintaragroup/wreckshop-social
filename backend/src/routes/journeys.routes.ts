import { Router } from 'express'
import { z } from 'zod'
import JourneyModel from '../models/journey'

export const journeys = Router()

// Zod schemas
const Edge = z.object({ to: z.string(), label: z.string().optional(), condition: z.string().optional() })
const Position = z.object({ x: z.number().optional(), y: z.number().optional() }).optional()
const Step = z.object({
  id: z.string(),
  type: z.enum(['trigger', 'delay', 'condition', 'email', 'sms', 'branch', 'exit', 'webhook']),
  name: z.string().optional(),
  config: z.any().optional(),
  next: z.array(Edge).optional(),
  position: Position,
})

const JourneyBody = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(['draft', 'active', 'paused']).optional(),
  ownerProfileId: z.string().optional(),
  segmentId: z.string().optional(),
  triggerKey: z.string().optional(),
  steps: z.array(Step).default([]),
  tags: z.array(z.string()).optional(),
})

// Helpers
function requireDraft(status: string) {
  if (status !== 'draft') {
    const err: any = new Error('Only draft journeys can be edited')
    err.status = 409
    throw err
  }
}

// Create (defaults to draft)
journeys.post('/journeys', async (req, res) => {
  const parsed = JourneyBody.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ ok: false, error: parsed.error.flatten() })
  const input = parsed.data
  const doc = await JourneyModel.create({
    ...input,
    status: input.status ?? 'draft',
  })
  res.json({ ok: true, data: doc })
})

// List journeys with simple filters
journeys.get('/journeys', async (req, res) => {
  const q = String(req.query.q || '').trim().toLowerCase()
  const status = String(req.query.status || '')
  const filter: any = {}
  if (status) filter.status = status
  if (q) filter.name = { $regex: q, $options: 'i' }
  const docs = await JourneyModel.find(filter).sort({ updatedAt: -1 }).limit(200)
  res.json({ ok: true, data: docs })
})

// Get one
journeys.get('/journeys/:id', async (req, res) => {
  const doc = await JourneyModel.findById(req.params.id)
  if (!doc) return res.status(404).json({ ok: false, error: 'not found' })
  res.json({ ok: true, data: doc })
})

// Update (draft-only)
journeys.patch('/journeys/:id', async (req, res) => {
  const doc = await JourneyModel.findById(req.params.id)
  if (!doc) return res.status(404).json({ ok: false, error: 'not found' })
  requireDraft(doc.status)
  const parsed = JourneyBody.partial().safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ ok: false, error: parsed.error.flatten() })
  const update = parsed.data
  const updated = await JourneyModel.findByIdAndUpdate(doc._id, update, { new: true })
  res.json({ ok: true, data: updated })
})

// Publish
journeys.post('/journeys/:id/publish', async (req, res) => {
  const doc = await JourneyModel.findById(req.params.id)
  if (!doc) return res.status(404).json({ ok: false, error: 'not found' })
  requireDraft(doc.status)
  // Minimal validation: at least one trigger step
  const hasTrigger = (doc.steps || []).some((s: any) => s.type === 'trigger')
  if (!hasTrigger) return res.status(400).json({ ok: false, error: 'Journey must include a trigger step' })
  if (!doc.segmentId) return res.status(400).json({ ok: false, error: 'Journey must have a target segment before publishing' })
  doc.status = 'active'
  await doc.save()
  res.json({ ok: true, data: doc })
})

// Pause
journeys.post('/journeys/:id/pause', async (req, res) => {
  const doc = await JourneyModel.findById(req.params.id)
  if (!doc) return res.status(404).json({ ok: false, error: 'not found' })
  if (doc.status !== 'active') return res.status(409).json({ ok: false, error: 'Only active journeys can be paused' })
  doc.status = 'paused'
  await doc.save()
  res.json({ ok: true, data: doc })
})

// Resume
journeys.post('/journeys/:id/resume', async (req, res) => {
  const doc = await JourneyModel.findById(req.params.id)
  if (!doc) return res.status(404).json({ ok: false, error: 'not found' })
  if (doc.status !== 'paused') return res.status(409).json({ ok: false, error: 'Only paused journeys can be resumed' })
  doc.status = 'active'
  await doc.save()
  res.json({ ok: true, data: doc })
})

// Duplicate
journeys.post('/journeys/:id/duplicate', async (req, res) => {
  const doc = await JourneyModel.findById(req.params.id)
  if (!doc) return res.status(404).json({ ok: false, error: 'not found' })
  const copy = await JourneyModel.create({
    name: `${doc.name} (Copy)`,
    description: doc.description,
    status: 'draft',
    ownerProfileId: doc.ownerProfileId,
    segmentId: doc.segmentId,
    triggerKey: doc.triggerKey,
    steps: doc.steps,
    metrics: [],
    tags: doc.tags,
  })
  res.json({ ok: true, data: copy })
})

// Delete
journeys.delete('/journeys/:id', async (req, res) => {
  const doc = await JourneyModel.findByIdAndDelete(req.params.id)
  if (!doc) return res.status(404).json({ ok: false, error: 'not found' })
  res.json({ ok: true })
})
