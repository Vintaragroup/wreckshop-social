import { Router } from 'express'
import { z } from 'zod'
import AudienceContactModel from '../models/audience-contact'

export const audience = Router()

const ContactBody = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  displayName: z.string().optional(),
  consent: z.object({ email: z.boolean().optional(), sms: z.boolean().optional() }).partial().optional(),
  tags: z.array(z.string()).optional(),
  ownerProfileId: z.string().optional(),
  source: z.string().optional(),
})

// Create contact (e.g., from landing page)
audience.post('/audience/contacts', async (req, res) => {
  const parsed = ContactBody.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ ok: false, error: parsed.error.flatten() })
  const contact = await AudienceContactModel.create(parsed.data)
  res.json({ ok: true, data: contact })
})

// List contacts (basic)
audience.get('/audience/contacts', async (_req, res) => {
  const contacts = await AudienceContactModel.find().sort({ createdAt: -1 }).limit(200)
  res.json({ ok: true, data: contacts })
})
