import 'dotenv/config'
import { env } from '../../env'
import { connectMongo } from '../../lib/db'
import { getClientCredentialsToken } from '../../providers/spotify.oauth'
import { discoverUsersByMusicAndArtist, DiscoveryFilters } from './discovery.service'
import { saveDiscoveredUsers } from './discovered-user.service'
import { getDiscoverySettings, DiscoverySettingsModel } from '../../models/discovery-settings'
import { expandFromSavedUserPlaylists } from './playlist-expansion.service'

// Default discovery parameters
const DEFAULT_GENRES = ['indie', 'hip-hop', 'pop', 'electronic', 'rock', 'r&b', 'country', 'jazz', 'metal', 'latino']
const DEFAULT_ARTIST_TYPES = ['mainstream', 'underground', 'indie', 'emerging']

// Configuration via environment variables (all optional)
const GENRES = (process.env.DISCOVERY_GENRES || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)
  .map((s) => s.toLowerCase())
  || []
const ARTIST_TYPES = (process.env.DISCOVERY_ARTIST_TYPES || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)
  .map((s) => s.toLowerCase())
  || []

const MAX_RESULTS = Math.min(parseInt(process.env.DISCOVERY_MAX_RESULTS || '100', 10), 200)
const INTERVAL_MS = Math.max(parseInt(process.env.DISCOVERY_INTERVAL_MS || String(15 * 60 * 1000), 10), 60_000)
const MAX_COMBOS_PER_RUN = Math.max(parseInt(process.env.DISCOVERY_MAX_COMBOS_PER_RUN || '6', 10), 1)

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getCombos(): Array<{ musicGenre: string; artistType: string }> {
  const genres = GENRES.length > 0 ? GENRES : DEFAULT_GENRES
  const types = ARTIST_TYPES.length > 0 ? ARTIST_TYPES : DEFAULT_ARTIST_TYPES
  const combos: Array<{ musicGenre: string; artistType: string }> = []
  for (const g of genres) {
    for (const t of types) {
      combos.push({ musicGenre: g, artistType: t })
    }
  }
  return combos
}

async function runOnce() {
  const settings = await getDiscoverySettings()
  if (settings && settings.enabled === false) {
    console.log('[discovery-runner] disabled by settings; skipping run')
    return
  }
  const { access_token } = await getClientCredentialsToken()

  // Prefer DB settings if present
  const genres = (settings?.genres && settings.genres.length > 0) ? settings.genres : getCombos().map(c => c.musicGenre)
  const types = (settings?.artistTypes && settings.artistTypes.length > 0) ? settings.artistTypes : DEFAULT_ARTIST_TYPES
  const maxResults = Math.min(settings?.maxResults ?? MAX_RESULTS, 200)
  const maxCombosPerRun = Math.max(settings?.maxCombosPerRun ?? MAX_COMBOS_PER_RUN, 1)

  const combos: Array<{ musicGenre: string; artistType: string }> = []
  for (const g of genres) for (const t of types) combos.push({ musicGenre: g, artistType: t })

  console.log(`[discovery-runner] starting cycle with ${combos.length} combos, maxResults=${maxResults}`)

  // Limit per run to avoid rate limits
  const slice = combos.slice(0, maxCombosPerRun)
  const startedAt = Date.now()
  const perCombo: Array<{ genre: string; artistType: string; found: number; saved: number }> = []
  for (const { musicGenre, artistType } of slice) {
    const filters: DiscoveryFilters = { musicGenre, artistType, maxResults }
    console.log(`[discovery-runner] discovering: genre=${musicGenre}, artistType=${artistType}`)
    try {
      const result = await discoverUsersByMusicAndArtist(filters, access_token)
      console.log(
        `[discovery-runner] discovered ${result.usersFound} users for ${musicGenre}/${artistType}`
      )
      const saved = await saveDiscoveredUsers(result)
      console.log(
        `[discovery-runner] saved ${saved.length} users for ${musicGenre}/${artistType}`
      )
      perCombo.push({ genre: musicGenre, artistType, found: result.usersFound, saved: saved.length })
    } catch (err: any) {
      console.error(
        `[discovery-runner] error for ${musicGenre}/${artistType}:`,
        err?.message || err
      )
      perCombo.push({ genre: musicGenre, artistType, found: 0, saved: 0 })
    }
    // Small delay between calls to be kinder to Spotify rate limits
    await sleep(2000)
  }
  // Optional: playlist expansion step
  if (settings?.includePlaylistExpansion) {
    try {
      console.log('[discovery-runner] playlist expansion enabled; running...')
      const exp = await expandFromSavedUserPlaylists(access_token, {
        seedLimit: settings.expansionSeedLimit,
        perUserPlaylistLimit: settings.expansionPerUserPlaylistLimit,
        perPlaylistTrackLimit: settings.expansionPerPlaylistTrackLimit,
        maxNewUsers: settings.expansionMaxNewUsers,
      })
      // Save and record
      const saved = await saveDiscoveredUsers(exp as any)
      perCombo.push({ genre: exp.query.musicGenre, artistType: exp.query.artistType, found: exp.usersFound, saved: saved.length })
    } catch (err) {
      console.warn('[discovery-runner] playlist expansion failed:', (err as any)?.message || err)
      perCombo.push({ genre: 'playlist', artistType: 'contributors', found: 0, saved: 0 })
    }
  }
  // Save last run summary + append to history
  try {
    const durationMs = Date.now() - startedAt
    const totals = {
      found: perCombo.reduce((a, b) => a + (b.found || 0), 0),
      saved: perCombo.reduce((a, b) => a + (b.saved || 0), 0),
      combos: perCombo.length,
    }
    const entry = { at: new Date(), durationMs, totals, results: perCombo }
    await DiscoverySettingsModel.findOneAndUpdate(
      { key: 'global' },
      { $set: { lastRunAt: entry.at, lastRunSummary: entry }, $push: { runHistory: { $each: [entry], $slice: -20 } } },
      { upsert: true }
    )
  } catch (err) {
    console.warn('[discovery-runner] failed to update run summary:', (err as any)?.message || err)
  }
}

async function main() {
  console.log('[discovery-runner] connecting to Mongo...')
  await connectMongo(env.MONGODB_URI)

  // initial run
  try {
    await runOnce()
  } catch (err) {
    console.error('[discovery-runner] initial run failed:', err)
  }

  // interval runs
  console.log(`[discovery-runner] scheduling every ${Math.round(INTERVAL_MS / 1000)}s`)
  setInterval(() => {
    runOnce().catch((err) => console.error('[discovery-runner] cycle failed:', err))
  }, INTERVAL_MS)
}

main().catch((err) => {
  console.error('[discovery-runner] fatal error:', err)
  process.exit(1)
})
