import { Router } from 'express'
import { z } from 'zod'
import CampaignModel from '../models/campaign'

export const campaigns = Router()

const CampaignBody = z.object({
  name: z.string().min(1),
  ownerProfileId: z.string().optional(),
  releaseId: z.string().optional(),
  segments: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  channels: z.any().optional(), // refine later per channel schema
  schedule: z
    .object({ startAt: z.string().datetime().optional(), endAt: z.string().datetime().optional(), timezone: z.string().optional() })
    .partial()
    .optional(),
  status: z.enum(['draft', 'scheduled', 'running', 'paused', 'completed', 'failed']).optional(),
})

// Create campaign
campaigns.post('/campaigns', async (req, res) => {
  const parsed = CampaignBody.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ ok: false, error: parsed.error.flatten() })
  const input = parsed.data
  const doc = await CampaignModel.create({
    ...input,
    schedule: {
      ...input.schedule,
      startAt: input.schedule?.startAt ? new Date(input.schedule.startAt) : undefined,
      endAt: input.schedule?.endAt ? new Date(input.schedule.endAt) : undefined,
    },
  })
  res.json({ ok: true, data: doc })
})

// List campaigns
campaigns.get('/campaigns', async (_req, res) => {
  const docs = await CampaignModel.find().sort({ createdAt: -1 }).limit(200)
  res.json({ ok: true, data: docs })
})

// Get one
campaigns.get('/campaigns/:id', async (req, res) => {
  const doc = await CampaignModel.findById(req.params.id)
  if (!doc) return res.status(404).json({ ok: false, error: 'not found' })
  res.json({ ok: true, data: doc })
})

// Update
campaigns.patch('/campaigns/:id', async (req, res) => {
  const parsed = CampaignBody.partial().safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ ok: false, error: parsed.error.flatten() })
  const input = parsed.data
  const update: any = { ...input }
  if (input.schedule) {
    update.schedule = {
      ...input.schedule,
      startAt: input.schedule.startAt ? new Date(input.schedule.startAt) : undefined,
      endAt: input.schedule.endAt ? new Date(input.schedule.endAt) : undefined,
    }
  }
  const doc = await CampaignModel.findByIdAndUpdate(req.params.id, update, { new: true })
  if (!doc) return res.status(404).json({ ok: false, error: 'not found' })
  res.json({ ok: true, data: doc })
})
