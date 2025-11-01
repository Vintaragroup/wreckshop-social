import { ProviderAdapter, MusicIdentity, MusicTaste, Playlist, Artist } from './types'

function parseDeezerHandleOrUrl(input?: { handle?: string; profileUrl?: string }) {
  let handle = input?.handle?.trim()
  let profileUrl = input?.profileUrl
  let userId: string | undefined
  if (!handle && profileUrl) {
    try {
      const url = new URL(profileUrl)
      // Expected: https://www.deezer.com/profile/{id} or /{locale}/profile/{id}
      if (url.hostname.includes('deezer.com')) {
        const parts = url.pathname.split('/').filter(Boolean)
        const idx = parts.findIndex((p) => p.toLowerCase() === 'profile')
        if (idx >= 0 && parts[idx + 1]) {
          userId = decodeURIComponent(parts[idx + 1])
        }
      }
    } catch {}
  }
  // If handle provided and numeric, treat as userId; otherwise keep as handle
  if (!userId && handle && /^[0-9]+$/.test(handle)) userId = handle
  return { handle, profileUrl, userId }
}

export const deezerProvider: ProviderAdapter = {
  async resolveIdentity(input) {
    const { handle, profileUrl, userId } = parseDeezerHandleOrUrl({ handle: input.handle, profileUrl: input.profileUrl })
    const resolvedId = userId || handle || input.providerUserId || 'unknown'
    const identity: MusicIdentity = {
      provider: 'deezer' as any,
      providerUserId: String(resolvedId),
      profileUrl: profileUrl ?? (userId ? `https://www.deezer.com/profile/${encodeURIComponent(userId)}` : undefined),
      handle: handle ?? input.handle,
    }
    return identity
  },

  async fetchTaste(identity) {
    const empty: MusicTaste = { topArtists: [], topGenres: [], topTracks: [], playlists: [] }
    const uid = identity.providerUserId
    if (!uid || uid === 'unknown') return empty

    async function getJson<T = any>(u: string): Promise<T | null> {
      try {
        const res = await fetch(u)
        if (!res.ok) return null
        return (await res.json()) as T
      } catch {
        return null
      }
    }

    // Public user playlists
    const playlistsRes = await getJson<{ data?: any[] }>(`https://api.deezer.com/user/${encodeURIComponent(uid)}/playlists`)
    const taste: MusicTaste = { topArtists: [], topGenres: [], topTracks: [], playlists: [] }
    const playlists = playlistsRes?.data ?? []
    if (Array.isArray(playlists)) {
      taste.playlists = playlists
        .map((pl): Playlist | null => {
          if (!pl) return null
          return {
            id: String(pl.id ?? ''),
            name: String(pl.title || ''),
            url: pl.link || pl.share || undefined,
            trackCount: typeof pl.nb_tracks === 'number' ? pl.nb_tracks : undefined,
            isPublic: typeof pl.public === 'boolean' ? pl.public : undefined,
          }
        })
        .filter((x): x is Playlist => Boolean(x && x.id && x.name))
    }

    // Favorites (tracks) if publicly accessible
    const favRes = await getJson<{ data?: any[] }>(`https://api.deezer.com/user/${encodeURIComponent(uid)}/tracks?limit=50`)
    const favTracks = favRes?.data ?? []
    if (Array.isArray(favTracks) && favTracks.length > 0) {
      taste.topTracks = favTracks
        .map((t: any) => String(t?.title || ''))
        .filter((s: string) => s.length > 0)

      // Derive simple top artists from favorites
      const artistCounts = new Map<string, number>()
      const artistIdNames = new Map<string, string>()
      for (const t of favTracks) {
        const a = t?.artist
        const id = a?.id ? String(a.id) : a?.name
        const name = a?.name || id
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
    }

    return taste
  },
}
