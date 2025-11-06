import { Router } from 'express'
import { z } from 'zod'
import EventModel from '../models/event'

export const events = Router()

const Venue = z.object({
  name: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
})

const Tickets = z.object({
  price: z.coerce.number().nonnegative().optional(),
  vipPrice: z.coerce.number().nonnegative().optional(),
  url: z.string().url().optional(),
})

const Presale = z.object({
  date: z.string().datetime().optional(),
  code: z.string().optional(),
  enabled: z.boolean().optional(),
})

const EventBody = z.object({
  title: z.string().min(1),
  type: z.string().optional(),
  artistId: z.string().optional(),
  artistName: z.string().optional(),
  description: z.string().optional(),
  date: z.string().datetime().optional(),
  time: z.string().optional(),
  doorsOpen: z.string().optional(),
  venue: Venue.optional(),
  capacity: z.coerce.number().int().nonnegative().optional(),
  tickets: Tickets.optional(),
  presale: Presale.optional(),
  ageRestriction: z.enum(['all', '18+', '21+']).optional(),
  status: z.enum(['announced', 'on_sale', 'live', 'sold_out', 'cancelled']).optional(),
})

// Create event
events.post('/events', async (req, res) => {
  const parsed = EventBody.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ ok: false, error: parsed.error.flatten() })
  const input = parsed.data
  const doc = await EventModel.create({
    ...input,
    date: input.date ? new Date(input.date) : undefined,
    presale: input.presale?.date ? { ...input.presale, date: new Date(input.presale.date) } : input.presale,
  })
  res.json({ ok: true, data: doc })
})

// List events
events.get('/events', async (req, res) => {
  const q = String(req.query.q || '').trim()
  const status = String(req.query.status || '').trim()
  const filter: any = {}
  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { artistName: { $regex: q, $options: 'i' } },
      { 'venue.name': { $regex: q, $options: 'i' } },
      { 'venue.city': { $regex: q, $options: 'i' } },
    ]
  }
  if (['announced', 'on_sale', 'live', 'sold_out', 'cancelled'].includes(status)) {
    filter.status = status
  }
  const docs = await EventModel.find(filter).sort({ date: 1, createdAt: -1 }).limit(500)
  res.json({ ok: true, data: docs })
})

// Get one event
events.get('/events/:id', async (req, res) => {
  const doc = await EventModel.findById(req.params.id)
  if (!doc) return res.status(404).json({ ok: false, error: 'not found' })
  res.json({ ok: true, data: doc })
})

// Update event
events.patch('/events/:id', async (req, res) => {
  const parsed = EventBody.partial().safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ ok: false, error: parsed.error.flatten() })
  const input = parsed.data
  const update: any = { ...input }
  if (input.date) update.date = new Date(input.date)
  if (input.presale?.date) update.presale = { ...(input.presale as any), date: new Date(input.presale.date) }
  const doc = await EventModel.findByIdAndUpdate(req.params.id, update, { new: true })
  if (!doc) return res.status(404).json({ ok: false, error: 'not found' })
  res.json({ ok: true, data: doc })
})

// Delete event
events.delete('/events/:id', async (req, res) => {
  const doc = await EventModel.findByIdAndDelete(req.params.id)
  if (!doc) return res.status(404).json({ ok: false, error: 'not found' })
  res.json({ ok: true })
})
