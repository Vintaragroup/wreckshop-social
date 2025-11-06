import { Router } from 'express'
import { z } from 'zod'
import ArtistModel from '../models/artist'

export const artists = Router()

const Handles = z
  .object({
    instagram: z.string().optional(),
    youtube: z.string().optional(),
    tiktok: z.string().optional(),
    twitter: z.string().optional(),
    spotify: z.string().optional(),
    apple: z.string().optional(),
    soundcloud: z.string().optional(),
    website: z.string().url().optional(),
  })
  .partial()

const Followers = z
  .object({
    total: z.number().int().nonnegative().optional(),
    instagram: z.number().int().nonnegative().optional(),
    youtube: z.number().int().nonnegative().optional(),
    tiktok: z.number().int().nonnegative().optional(),
    spotify: z.number().int().nonnegative().optional(),
    apple: z.number().int().nonnegative().optional(),
    soundcloud: z.number().int().nonnegative().optional(),
  })
  .partial()

const ArtistBody = z.object({
  name: z.string().min(1),
  stageName: z.string().optional(),
  bio: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  genres: z.array(z.string()).optional(),
  status: z.enum(['active', 'inactive']).optional(),
  handles: Handles.optional(),
  followers: Followers.optional(),
  lastRelease: z.string().optional(),
  nextEvent: z.string().optional(),
  upcomingDate: z.string().optional(),
})

// Create artist
artists.post('/artists', async (req, res) => {
  const parsed = ArtistBody.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ ok: false, error: parsed.error.flatten() })
  const doc = await ArtistModel.create(parsed.data)
  res.json({ ok: true, data: doc })
})

// List artists (basic search and status filter)
artists.get('/artists', async (req, res) => {
  const q = String(req.query.q || '').trim()
  const status = String(req.query.status || '').trim()
  const filter: any = {}
  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { stageName: { $regex: q, $options: 'i' } },
      { bio: { $regex: q, $options: 'i' } },
      { genres: { $elemMatch: { $regex: q, $options: 'i' } } },
    ]
  }
  if (status === 'active' || status === 'inactive') filter.status = status
  const docs = await ArtistModel.find(filter).sort({ createdAt: -1 }).limit(500)
  res.json({ ok: true, data: docs })
})

// Get one artist
artists.get('/artists/:id', async (req, res) => {
  const doc = await ArtistModel.findById(req.params.id)
  if (!doc) return res.status(404).json({ ok: false, error: 'not found' })
  res.json({ ok: true, data: doc })
})

// Update artist
artists.patch('/artists/:id', async (req, res) => {
  const parsed = ArtistBody.partial().safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ ok: false, error: parsed.error.flatten() })
  const doc = await ArtistModel.findByIdAndUpdate(req.params.id, parsed.data, { new: true })
  if (!doc) return res.status(404).json({ ok: false, error: 'not found' })
  res.json({ ok: true, data: doc })
})

// Delete artist
artists.delete('/artists/:id', async (req, res) => {
  const doc = await ArtistModel.findByIdAndDelete(req.params.id)
  if (!doc) return res.status(404).json({ ok: false, error: 'not found' })
  res.json({ ok: true })
})
