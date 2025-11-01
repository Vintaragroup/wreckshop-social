import { Router } from 'express'
import mongoose from 'mongoose'
import { z } from 'zod'
import Profile from '../models/profile'
import { enqueueIngest } from '../services/ingest/ingest.queue'
import { discover } from '../services/discovery/discovery.service'
import { getProvider, ProviderName } from '../providers'

export const profiles = Router()

// NOTE: Define specific routes BEFORE parameterized routes like ':id' to avoid
// accidental matches (e.g., '/profiles/discover' being treated as an id).

// GET /profiles?q=&provider=&tag=
profiles.get('/profiles', async (req, res) => {
  const q = (req.query.q as string | undefined)?.trim()
  const provider = (req.query.provider as string | undefined)?.trim()
  const tag = (req.query.tag as string | undefined)?.trim()?.toLowerCase()
  const filter: Record<string, unknown> = {}
  if (q && q.length > 0) {
    filter.displayName = { $regex: q, $options: 'i' }
  }
  if (provider && provider.length > 0) {
    filter['identities.provider'] = provider
  }
  if (tag && tag.length > 0) {
    filter['interestTags'] = tag
  }
  const docs = await (Profile as any)
    .find(filter)
    .sort({ updatedAt: -1 })
    .limit(50)
    .lean()
    .exec()

  res.json({ ok: true, data: docs })
})

// GET /profiles/count?provider=lastfm
profiles.get('/profiles/count', async (req, res) => {
  try {
    const provider = (req.query.provider as string | undefined)?.trim()
    const filter: Record<string, unknown> = {}
    if (provider && provider.length > 0) {
      filter['identities.provider'] = provider
    }
    const count = await (Profile as any).countDocuments(filter).exec()
    return res.json({ ok: true, count })
  } catch (err) {
    return res.status(500).json({ ok: false, error: (err as Error).message })
  }
})

// GET /profiles/counts -> { ok: true, data: { total: number, byProvider: Record<string, number> } }
profiles.get('/profiles/counts', async (_req, res) => {
  try {
    const providers = ['spotify','amazon','lastfm','soundcloud','deezer','youtube','audius'] as const
    const counts = await Promise.all(
      providers.map((p) => (Profile as any).countDocuments({ 'identities.provider': p }).exec()),
    )
    const byProvider: Record<string, number> = {}
    providers.forEach((p, i) => (byProvider[p] = counts[i] || 0))
    const total = await (Profile as any).countDocuments({}).exec()
    return res.json({ ok: true, data: { total, byProvider } })
  } catch (err) {
    return res.status(500).json({ ok: false, error: (err as Error).message })
  }
})

// GET /profiles/discover?provider=&q=&limit=
profiles.get('/profiles/discover', async (req, res) => {
  const provider = String(req.query.provider || '') as any
  const q = String(req.query.q || '')
  const limit = Math.min(50, Math.max(1, Number(req.query.limit || 20)))
  const genre = (req.query.genre as string | undefined)?.trim()

  const allowed = ['soundcloud', 'deezer', 'youtube', 'audius', 'lastfm']
  if (!allowed.includes(provider)) {
    return res.status(400).json({ ok: false, error: 'unsupported provider' })
  }
  const items = await discover(provider as any, q, {
    SOUNDCLOUD_CLIENT_ID: process.env.SOUNDCLOUD_CLIENT_ID,
    YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
    LASTFM_API_KEY: process.env.LASTFM_API_KEY,
  }, genre)
  return res.json({ ok: true, data: items.slice(0, limit) })
})

// GET /profiles/:id (keep after '/profiles/discover')
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
  provider: z.enum(['spotify', 'amazon', 'lastfm', 'soundcloud', 'deezer', 'youtube', 'audius', 'instagram', 'facebook', 'tiktok']),
  handleOrUrl: z.string().min(1),
  accessToken: z.string().min(1).optional(),
})

profiles.post('/profiles/ingest', async (req, res) => {
  const parsed = IngestBody.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ ok: false, error: parsed.error.flatten() })

  const job = await enqueueIngest(parsed.data)
  return res.json({ ok: true, jobId: job.id })
})

// POST /profiles/enrich { provider?: 'lastfm'|'audius'|..., limit?: number, missingOnly?: boolean }
profiles.post('/profiles/enrich', async (req, res) => {
  const Body = z.object({
    provider: z.enum(['spotify','amazon','lastfm','soundcloud','deezer','youtube','audius','instagram','facebook','tiktok']).optional(),
    limit: z.number().int().positive().max(500).optional().default(100),
    missingOnly: z.boolean().optional().default(true),
  })
  const parsed = Body.safeParse(req.body ?? {})
  if (!parsed.success) return res.status(400).json({ ok: false, error: parsed.error.flatten() })
  const { provider, limit, missingOnly } = parsed.data

  const providerFilter = provider ? { 'identities.provider': provider } : {}
  const missingFilter = missingOnly ? { $or: [{ avatarUrl: { $in: [null, ''] } }, { bio: { $in: [null, ''] } }] } : {}
  const filter: any = { ...providerFilter, ...missingFilter }

  const docs: any[] = await (Profile as any)
    .find(filter)
    .sort({ updatedAt: 1 })
    .limit(limit)
    .lean()
    .exec()

  let updated = 0
  for (const doc of docs) {
    try {
      const identities: any[] = Array.isArray(doc.identities) ? doc.identities : []
      const target = provider ? identities.find((i) => i.provider === provider) : identities[0]
      if (!target) continue
      const adapter = getProvider((target.provider || 'lastfm') as ProviderName)
      if (typeof adapter.fetchProfileDetails !== 'function') continue
      const details = await adapter.fetchProfileDetails(target)
      if (!details || (Object.keys(details).length === 0)) continue
      const set: any = {}
      if (details.avatarUrl) set.avatarUrl = details.avatarUrl
      if (details.displayName) set.displayName = details.displayName
      if (typeof details.bio === 'string' && details.bio.length > 0) set.bio = details.bio
      // Update identity-level counts if provided
      const idSet: any = {}
      if (typeof (details as any).friendsCount === 'number') idSet['identities.$.friendsCount'] = (details as any).friendsCount
      if (typeof (details as any).neighboursCount === 'number') idSet['identities.$.neighboursCount'] = (details as any).neighboursCount
      if (typeof (details as any).followersCount === 'number') idSet['identities.$.followersCount'] = (details as any).followersCount
      if (typeof (details as any).followingCount === 'number') idSet['identities.$.followingCount'] = (details as any).followingCount
      if (Object.keys(set).length === 0) continue
      // Recompute interestTags and artistAffinity from existing taste
      try {
        const taste = doc.taste || {}
        const norm = (s: string) => s.toLowerCase().trim().replace(/&/g, 'and').replace(/r\s*&\s*b/g, 'rnb').replace(/\s+/g, ' ')
        const unique = (arr: string[]) => Array.from(new Set(arr))
        const interestTags = Array.isArray(taste.topGenres) ? unique(taste.topGenres.map((g: string) => norm(g))) : []
        const artists: any[] = Array.isArray(taste.topArtists) ? taste.topArtists : []
        const n = artists.length
        const artistAffinity = artists.map((a: any, idx: number) => ({ id: a.id, name: a.name, score: n > 0 ? (n - idx) / n : 0 }))
        set.interestTags = interestTags
        set.artistAffinity = artistAffinity
      } catch {}

      await (Profile as any).updateOne({ _id: doc._id }, { $set: set }).exec()
      if (Object.keys(idSet).length > 0) {
        await (Profile as any).updateOne({ _id: doc._id, 'identities.provider': target.provider, 'identities.providerUserId': target.providerUserId }, { $set: idSet }).exec()
      }
      updated++
    } catch {}
  }

  return res.json({ ok: true, matched: docs.length, updated })
})
 
