import { ProviderAdapter, MusicIdentity, MusicTaste, Playlist, Artist } from './types'

// Audius API helpers
async function getAudiusApiHost(): Promise<string> {
  try {
    const res = await fetch('https://api.audius.co')
    if (!res.ok) return 'https://discoveryprovider.audius.co'
    const data: any = await res.json().catch(() => ({}))
    // data.data is an array of discovery nodes, choose first
    const host = data?.data?.[0]
    if (typeof host === 'string' && host.startsWith('http')) return host
  } catch {}
  return 'https://discoveryprovider.audius.co'
}

function parseAudiusHandleOrUrl(input?: { handle?: string; profileUrl?: string }) {
  let handle = input?.handle?.trim()
  let profileUrl = input?.profileUrl
  let userId: string | undefined
  if (!handle && profileUrl) {
    try {
      const url = new URL(profileUrl)
      // Expected: https://audius.co/{handle}
      if (url.hostname.includes('audius.co')) {
        const parts = url.pathname.split('/').filter(Boolean)
        if (parts[0]) handle = decodeURIComponent(parts[0])
      }
    } catch {}
  }
  return { handle, profileUrl, userId }
}

export const audiusProvider: ProviderAdapter = {
  async resolveIdentity(input) {
    const { handle, profileUrl } = parseAudiusHandleOrUrl({ handle: input.handle, profileUrl: input.profileUrl })
    const api = await getAudiusApiHost()
    // Try resolve by handle
    if (handle) {
      try {
        const u = new URL(`${api}/v1/users`) // GET /v1/users?handle=...
        u.searchParams.set('handle', handle)
        const res = await fetch(u.toString())
        if (res.ok) {
          const data: any = await res.json().catch(() => ({}))
          const users = data?.data ?? []
          const user = users[0]
          if (user?.id) {
            const id: MusicIdentity = {
              provider: 'audius' as any,
              providerUserId: String(user.id),
              profileUrl: user?.profile_picture ? user?.profile_picture?.['150x150'] ?? profileUrl : profileUrl ?? `https://audius.co/${encodeURIComponent(handle)}`,
              handle: user.handle || handle,
            }
            return id
          }
        }
      } catch {}
    }

    // Fallback: unknown id, keep handle
    const id: MusicIdentity = {
      provider: 'audius' as any,
      providerUserId: handle || input.providerUserId || 'unknown',
      profileUrl: profileUrl ?? (handle ? `https://audius.co/${encodeURIComponent(handle)}` : undefined),
      handle: handle ?? input.handle,
    }
    return id
  },

  async fetchTaste(identity) {
    const api = await getAudiusApiHost()
    const empty: MusicTaste = { topArtists: [], topGenres: [], topTracks: [], playlists: [] }

    // Ensure we have user id; if not, try to resolve by handle again
    let userId = identity.providerUserId
    if (!/^[0-9]+$/.test(userId) && identity.handle) {
      try {
        const u = new URL(`${api}/v1/users`)
        u.searchParams.set('handle', identity.handle)
        const res = await fetch(u.toString())
        if (res.ok) {
          const data: any = await res.json().catch(() => ({}))
          const users = data?.data ?? []
          const user = users[0]
          if (user?.id) userId = String(user.id)
        }
      } catch {}
    }
    if (!/^[0-9]+$/.test(userId)) return empty

    async function getJson<T = any>(u: string): Promise<T | null> {
      try {
        const res = await fetch(u)
        if (!res.ok) return null
        return (await res.json()) as T
      } catch {
        return null
      }
    }

    const tracksUrl = `${api}/v1/users/${userId}/tracks?limit=50`
    const favoritesUrl = `${api}/v1/users/${userId}/favorites/tracks?limit=50`
    const playlistsUrl = `${api}/v1/users/${userId}/playlists?limit=50`

    const [tracks, favorites, playlists] = await Promise.all([
      getJson<{ data?: any[] }>(tracksUrl),
      getJson<{ data?: any[] }>(favoritesUrl),
      getJson<{ data?: any[] }>(playlistsUrl),
    ])

    const taste: MusicTaste = { topArtists: [], topGenres: [], topTracks: [], playlists: [] }

    // Own uploads
    const ownTracks = tracks?.data ?? []
    if (Array.isArray(ownTracks)) {
      taste.topTracks = ownTracks.slice(0, 20).map((t) => String(t?.title || '')).filter(Boolean)
    }

    // Favorites: derive artists
    const favTracks = favorites?.data ?? []
    const artistCounts = new Map<string, number>()
    const artistIdNames = new Map<string, string>()
    for (const t of favTracks) {
      const a = t?.user
      const id = a?.id ? String(a.id) : a?.handle || a?.name
      const name = a?.name || a?.handle || id
      if (id && name) {
        artistCounts.set(id, (artistCounts.get(id) ?? 0) + 1)
        if (!artistIdNames.has(id)) artistIdNames.set(id, name)
      }
    }
    const topArtists: Artist[] = Array.from(artistCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([id]) => ({ id, name: artistIdNames.get(id) || id, genres: [], popularity: undefined }))
    taste.topArtists = topArtists

    // Playlists (includes albums/collections the user created)
    const pls = playlists?.data ?? []
    if (Array.isArray(pls)) {
      taste.playlists = pls
        .map((pl): Playlist | null => {
          if (!pl) return null
          return {
            id: String(pl.id ?? pl.playlist_id ?? ''),
            name: String(pl.playlist_name || pl?.title || ''),
            url: pl?.permalink ? `https://audius.co${pl.permalink}` : undefined,
            trackCount: typeof pl.track_count === 'number' ? pl.track_count : undefined,
            isPublic: true,
          }
        })
        .filter((x): x is Playlist => Boolean(x && x.id && x.name))
    }

    return taste
  },

  async fetchProfileDetails(identity) {
    const api = await getAudiusApiHost()
    // Ensure we have user id or handle
    let handle = identity.handle
    let userId = identity.providerUserId
    if (!/^[0-9]+$/.test(userId) && handle) {
      try {
        const u = new URL(`${api}/v1/users`)
        u.searchParams.set('handle', handle)
        const res = await fetch(u.toString())
        if (res.ok) {
          const data: any = await res.json().catch(() => ({}))
          const user = (data?.data ?? [])[0]
          if (user?.id) userId = String(user.id)
        }
      } catch {}
    }

    // If we have numeric id, fetch full user
    if (/^[0-9]+$/.test(userId)) {
      try {
        const res = await fetch(`${api}/v1/users/${userId}`)
        if (!res.ok) return {}
        const data: any = await res.json().catch(() => ({}))
        const user = data?.data
        if (!user) return {}
        const displayName: string | undefined = user?.name || user?.handle
        const avatarUrl: string | undefined = user?.profile_picture?.['480x480'] || user?.profile_picture?.['150x150']
        const bio: string | undefined = user?.bio
        const profileUrl: string | undefined = user?.permalink ? `https://audius.co${user.permalink}` : (identity.profileUrl || undefined)
        return { displayName, avatarUrl, bio, profileUrl }
      } catch {
        return {}
      }
    }

    return {}
  },
}
