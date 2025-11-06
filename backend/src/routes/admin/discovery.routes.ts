import { Router } from 'express'
import { env } from '../../env'
import { getClientCredentialsToken } from '../../providers/spotify.oauth'
import { discoverUsersByMusicAndArtist, DiscoveryFilters } from '../../services/spotify/discovery.service'
import { saveDiscoveredUsers } from '../../services/spotify/discovered-user.service'
import { getDiscoverySettings, upsertDiscoverySettings } from '../../models/discovery-settings'
import { DiscoverySettingsModel } from '../../models/discovery-settings'
import DiscoveredUserModel from '../../models/discovered-user'
import { expandFromSavedUserPlaylists } from '../../services/spotify/playlist-expansion.service'

export const adminDiscoveryRouter = Router()

function requireAdmin(req: any, res: any, next: any) {
  const key = req.header('x-admin-key') || ''
  if (!env.ADMIN_API_KEY || key !== env.ADMIN_API_KEY) {
    return res.status(401).json({ ok: false, error: 'unauthorized' })
  }
  next()
}

// Get current settings
adminDiscoveryRouter.get('/admin/discovery/settings', requireAdmin, async (_req, res) => {
  const settings = await getDiscoverySettings()
  res.json({ ok: true, data: settings })
})

// Refresh follower counts for saved discovered users (Spotify)
adminDiscoveryRouter.post('/admin/discovery/refresh-followers', requireAdmin, async (req, res) => {
  try {
    const { limit, onlyMissing } = (req.body || {}) as { limit?: number; onlyMissing?: boolean }
    const max = Math.min(typeof limit === 'number' && limit > 0 ? limit : 200, 1000)
    const filter: any = { spotifyId: { $exists: true, $nin: [null, ''] } }
    if (onlyMissing !== false) {
      // default: only when followersCount is 0 or not set
      filter.$or = [{ followersCount: { $exists: false } }, { followersCount: { $lte: 0 } }]
    }

    // Skip virtual artist_* entries
    filter.spotifyId.$not = /^artist_/i

    const users = await DiscoveredUserModel.find(filter)
      .sort({ updatedAt: 1 })
      .limit(max)
      .lean()

    if (users.length === 0) return res.json({ ok: true, data: { scanned: 0, updated: 0 } })

    const { access_token } = await getClientCredentialsToken()

    let updated = 0
    for (const u of users) {
      try {
        const r = await fetch(`https://api.spotify.com/v1/users/${encodeURIComponent(u.spotifyId)}`,
          { headers: { Authorization: `Bearer ${access_token}` } })
        if (!r.ok) continue
        const info = (await r.json()) as any
        const patch: any = { updatedAt: new Date() }
        if (typeof info?.followers?.total === 'number') patch.followersCount = info.followers.total
        const imageUrl = Array.isArray(info?.images) && info.images.length > 0 ? info.images[0]?.url : undefined
        if (imageUrl) patch.avatarUrl = imageUrl
        if (info?.display_name) patch.displayName = info.display_name
        if (info?.external_urls?.spotify) patch.profileUrl = info.external_urls.spotify
        // Also refresh public playlists count via a lightweight request (limit=1 to read total)
        try {
          const pr = await fetch(`https://api.spotify.com/v1/users/${encodeURIComponent(u.spotifyId)}/playlists?limit=1`,
            { headers: { Authorization: `Bearer ${access_token}` } })
          if (pr.ok) {
            const pjson: any = await pr.json()
            if (typeof pjson?.total === 'number') {
              patch.publicPlaylistsCount = pjson.total
            }
          }
        } catch {}
        await DiscoveredUserModel.updateOne({ _id: u._id }, { $set: patch })
        updated += 1
      } catch {}
      // small delay to be polite
      await new Promise((r) => setTimeout(r, 150))
    }

    res.json({ ok: true, data: { scanned: users.length, updated } })
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err?.message || 'refresh failed' })
  }
})

// Update settings
adminDiscoveryRouter.post('/admin/discovery/settings', requireAdmin, async (req, res) => {
  const input = req.body || {}
  const updated = await upsertDiscoverySettings(input)
  res.json({ ok: true, data: updated })
})

// Run discovery now (optionally override settings for this run)
adminDiscoveryRouter.post('/admin/discovery/run', requireAdmin, async (req, res) => {
  try {
    const startedAt = Date.now()
    const overrides = (req.body || {}) as Partial<{
      genres: string[]
      artistTypes: string[]
      maxResults: number
      maxCombosPerRun: number
    }>
    const base = await getDiscoverySettings()

    const genres = (overrides.genres && overrides.genres.length > 0 ? overrides.genres : base.genres)
    const types = (overrides.artistTypes && overrides.artistTypes.length > 0 ? overrides.artistTypes : base.artistTypes)
    const maxResults = Math.min(overrides.maxResults ?? base.maxResults ?? 100, 200)
    const maxCombosPerRun = Math.max(overrides.maxCombosPerRun ?? base.maxCombosPerRun ?? 6, 1)

    const combos: Array<{ musicGenre: string; artistType: string }> = []
    for (const g of genres) for (const t of types) combos.push({ musicGenre: g, artistType: t })

    const { access_token } = await getClientCredentialsToken()

    const results: Array<{ genre: string; artistType: string; found: number; saved: number }> = []

    for (const { musicGenre, artistType } of combos.slice(0, maxCombosPerRun)) {
      const filters: DiscoveryFilters = { musicGenre, artistType, maxResults }
      try {
        const r = await discoverUsersByMusicAndArtist(filters, access_token)
        const saved = await saveDiscoveredUsers(r)
        results.push({ genre: musicGenre, artistType, found: r.usersFound, saved: saved.length })
      } catch (err: any) {
        results.push({ genre: musicGenre, artistType, found: 0, saved: 0 })
      }
    }
    const durationMs = Date.now() - startedAt
    const totals = {
      found: results.reduce((a, b) => a + (b.found || 0), 0),
      saved: results.reduce((a, b) => a + (b.saved || 0), 0),
      combos: results.length,
    }
    const entry = { at: new Date(), durationMs, totals, results }

    await DiscoverySettingsModel.findOneAndUpdate(
      { key: 'global' },
      {
        $set: { lastRunAt: entry.at, lastRunSummary: entry },
        $push: { runHistory: { $each: [entry], $slice: -20 } },
      },
      { upsert: true }
    )

    res.json({ ok: true, data: { results, ran: results.length, totals, durationMs } })
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err?.message || 'run failed' })
  }
})

// --- Spotify action endpoints (authorized user actions) ---

// Follow Spotify users as the authorized account
adminDiscoveryRouter.post('/admin/spotify/follow-users', requireAdmin, async (req, res) => {
  const { accessToken, userIds } = (req.body || {}) as { accessToken?: string; userIds?: string[] }
  if (!accessToken) return res.status(400).json({ ok: false, error: 'accessToken is required' })
  const ids = Array.isArray(userIds) ? userIds.filter(Boolean).slice(0, 50) : []
  if (ids.length === 0) return res.status(400).json({ ok: false, error: 'userIds must be a non-empty array (max 50)' })
  try {
    const url = `https://api.spotify.com/v1/me/following?type=user&ids=${encodeURIComponent(ids.join(','))}`
    const r = await fetch(url, { method: 'PUT', headers: { Authorization: `Bearer ${accessToken}` } })
    if (!r.ok) {
      const t = await r.text().catch(() => '')
      return res.status(r.status).json({ ok: false, error: t || `spotify error ${r.status}` })
    }
    res.json({ ok: true, data: { followed: ids.length } })
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err?.message || 'follow-users failed' })
  }
})

// Follow a playlist as the authorized account
adminDiscoveryRouter.post('/admin/spotify/follow-playlist', requireAdmin, async (req, res) => {
  const { accessToken, playlistId, public: isPublic } = (req.body || {}) as { accessToken?: string; playlistId?: string; public?: boolean }
  if (!accessToken) return res.status(400).json({ ok: false, error: 'accessToken is required' })
  if (!playlistId) return res.status(400).json({ ok: false, error: 'playlistId is required' })
  try {
    const url = `https://api.spotify.com/v1/playlists/${encodeURIComponent(playlistId)}/followers`
    const r = await fetch(url, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ public: isPublic !== false }),
    })
    if (!r.ok) {
      const t = await r.text().catch(() => '')
      return res.status(r.status).json({ ok: false, error: t || `spotify error ${r.status}` })
    }
    res.json({ ok: true, data: { followed: true } })
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err?.message || 'follow-playlist failed' })
  }
})

// Create a collaborative playlist and optionally seed with tracks
adminDiscoveryRouter.post('/admin/spotify/create-collab-playlist', requireAdmin, async (req, res) => {
  const { accessToken, name, description, public: isPublic, collaborative, trackUris } = (req.body || {}) as {
    accessToken?: string
    name?: string
    description?: string
    public?: boolean
    collaborative?: boolean
    trackUris?: string[]
  }
  if (!accessToken) return res.status(400).json({ ok: false, error: 'accessToken is required' })
  if (!name) return res.status(400).json({ ok: false, error: 'name is required' })
  try {
    // Create playlist for current user
    const create = await fetch('https://api.spotify.com/v1/me/playlists', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description: description || '', public: isPublic === true, collaborative: collaborative === true }),
    })
    if (!create.ok) {
      const t = await create.text().catch(() => '')
      return res.status(create.status).json({ ok: false, error: t || `spotify error ${create.status}` })
    }
    const playlist = (await create.json()) as any
    const playlistId = playlist?.id
    if (!playlistId) return res.status(500).json({ ok: false, error: 'failed to create playlist' })

    // Seed tracks if provided
    if (Array.isArray(trackUris) && trackUris.length > 0) {
      const chunk = (arr: string[], size: number) => arr.reduce((acc: string[][], _, i) => (i % size ? acc : [...acc, arr.slice(i, i + size)]), [])
      for (const group of chunk(trackUris, 100)) {
        const add = await fetch(`https://api.spotify.com/v1/playlists/${encodeURIComponent(playlistId)}/tracks`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ uris: group }),
        })
        if (!add.ok) {
          const t = await add.text().catch(() => '')
          return res.status(add.status).json({ ok: false, error: t || `spotify add tracks error ${add.status}` })
        }
      }
    }

    res.json({ ok: true, data: { id: playlistId, url: playlist?.external_urls?.spotify, collaborative: collaborative === true } })
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err?.message || 'create-collab-playlist failed' })
  }
})

// Expand via playlists: crawl public playlists of saved users and discover contributors
adminDiscoveryRouter.post('/admin/discovery/expand-playlists', requireAdmin, async (req, res) => {
  try {
    const { seedLimit, perUserPlaylistLimit, perPlaylistTrackLimit, maxNewUsers } = (req.body || {}) as Partial<{
      seedLimit: number
      perUserPlaylistLimit: number
      perPlaylistTrackLimit: number
      maxNewUsers: number
    }>

    const { access_token } = await getClientCredentialsToken()

    const startedAt = Date.now()
    const result = await expandFromSavedUserPlaylists(access_token, {
      seedLimit,
      perUserPlaylistLimit,
      perPlaylistTrackLimit,
      maxNewUsers,
    })
    const saved = await saveDiscoveredUsers(result as any)
    // Attach provenance sources to DB records
    try {
      for (const u of result.users) {
        const sources = result.sourcesByUser[u.spotifyId] || []
        if (sources.length > 0) {
          await DiscoveredUserModel.updateOne(
            { spotifyId: u.spotifyId },
            { $addToSet: { sources: { $each: sources.map((s) => ({ ...s, discoveredAt: new Date() })) } } }
          )
        }
      }
    } catch {}
    const durationMs = Date.now() - startedAt

    // Log into runHistory for visibility (reusing schema)
    const entry = {
      at: new Date(),
      durationMs,
      totals: { found: result.usersFound, saved: saved.length, combos: 1 },
      results: [
        { genre: result.query.musicGenre, artistType: result.query.artistType, found: result.usersFound, saved: saved.length },
      ],
    }
    await DiscoverySettingsModel.findOneAndUpdate(
      { key: 'global' },
      { $set: { lastRunAt: entry.at, lastRunSummary: entry }, $push: { runHistory: { $each: [entry], $slice: -20 } } },
      { upsert: true }
    )

    res.json({ ok: true, data: { found: result.usersFound, saved: saved.length, durationMs } })
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err?.message || 'playlist expansion failed' })
  }
})
