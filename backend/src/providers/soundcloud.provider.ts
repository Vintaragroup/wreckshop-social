import { ProviderAdapter, MusicIdentity, MusicTaste, Playlist, Artist } from './types'

function parseSoundcloudHandleOrUrl(input?: { handle?: string; profileUrl?: string }) {
  let handle = input?.handle
  let profileUrl = input?.profileUrl
  if (!handle && profileUrl) {
    try {
      const url = new URL(profileUrl)
      // Expected: https://soundcloud.com/{username}
      if (url.hostname.includes('soundcloud.com')) {
        const parts = url.pathname.split('/').filter(Boolean)
        if (parts[0]) handle = decodeURIComponent(parts[0])
      }
    } catch {}
  }
  return { handle, profileUrl }
}

export const soundcloudProvider: ProviderAdapter = {
  async resolveIdentity(input) {
    const { handle, profileUrl } = parseSoundcloudHandleOrUrl({ handle: input.handle, profileUrl: input.profileUrl })
    const clientId = process.env.SOUNDCLOUD_CLIENT_ID

    // Attempt to resolve to numeric user id when client id is available
    if (clientId && (handle || profileUrl)) {
      try {
        const targetUrl = profileUrl ?? `https://soundcloud.com/${encodeURIComponent(handle!)}`
        const url = new URL('https://api-v2.soundcloud.com/resolve')
        url.searchParams.set('url', targetUrl)
        url.searchParams.set('client_id', clientId)
        const res = await fetch(url.toString())
        if (res.ok) {
          const data: any = await res.json().catch(() => ({}))
          if (data && (data.id || data.user?.id)) {
            const sc = data.user ?? data
            const identity: MusicIdentity = {
              provider: 'soundcloud',
              providerUserId: String(sc.id),
              profileUrl: sc.permalink_url || targetUrl,
              handle: sc.permalink || sc.username || handle || input.handle,
            }
            return identity
          }
        }
      } catch {}
    }

    // Fallback: use handle as identifier when we can't resolve numeric ID
    const id: MusicIdentity = {
      provider: 'soundcloud',
      providerUserId: handle || input.providerUserId || 'unknown',
      profileUrl: profileUrl ?? (handle ? `https://soundcloud.com/${encodeURIComponent(handle)}` : undefined),
      handle: handle ?? input.handle,
    }
    return id
  },

  async fetchTaste(identity) {
    const clientId = process.env.SOUNDCLOUD_CLIENT_ID
    const empty: MusicTaste = { topArtists: [], topGenres: [], topTracks: [], playlists: [] }
    if (!clientId) return empty

    // Ensure we have a numeric id; if not, try to resolve again with handle/url
    let userId = identity.providerUserId
    if (!/^[0-9]+$/.test(userId)) {
      try {
        const targetUrl = identity.profileUrl || (identity.handle ? `https://soundcloud.com/${encodeURIComponent(identity.handle)}` : undefined)
        if (targetUrl) {
          const url = new URL('https://api-v2.soundcloud.com/resolve')
          url.searchParams.set('url', targetUrl)
          url.searchParams.set('client_id', clientId)
          const res = await fetch(url.toString())
          if (res.ok) {
            const data: any = await res.json().catch(() => ({}))
            const sc = data.user ?? data
            if (sc?.id) userId = String(sc.id)
          }
        }
      } catch {}
    }

    if (!/^[0-9]+$/.test(userId)) return empty

    // Helper to fetch paged endpoints with a simple limit
    async function getJson<T = any>(u: string): Promise<T | null> {
      try {
        const res = await fetch(u)
        if (!res.ok) return null
        const json = (await res.json()) as T
        return json
      } catch {
        return null
      }
    }

    const base = `https://api-v2.soundcloud.com/users/${userId}`
    const tracksUrl = new URL(`${base}/tracks`)
    tracksUrl.searchParams.set('client_id', clientId)
    tracksUrl.searchParams.set('limit', '50')

    const playlistsUrl = new URL(`${base}/playlists`)
    playlistsUrl.searchParams.set('client_id', clientId)
    playlistsUrl.searchParams.set('limit', '50')

    const likesUrl = new URL(`${base}/likes`)
    likesUrl.searchParams.set('client_id', clientId)
    likesUrl.searchParams.set('limit', '50')

    const [tracks, playlists, likes] = await Promise.all([
      getJson<any[]>(tracksUrl.toString()),
      getJson<any[]>(playlistsUrl.toString()),
      getJson<{ collection?: any[] }>(likesUrl.toString()),
    ])

    const taste: MusicTaste = { topArtists: [], topGenres: [], topTracks: [], playlists: [] }

    // Map top tracks by title (own uploads)
    if (Array.isArray(tracks)) {
      taste.topTracks = tracks.slice(0, 20).map((t) => String(t?.title || '')).filter(Boolean)
    }

    // Map playlists
    if (Array.isArray(playlists)) {
      taste.playlists = playlists
        .map((pl): Playlist | null => {
          if (!pl) return null
          return {
            id: String(pl.id ?? pl.urn ?? ''),
            name: String(pl.title || pl.permalink || ''),
            url: pl.permalink_url,
            trackCount: typeof pl.track_count === 'number' ? pl.track_count : Array.isArray(pl.tracks) ? pl.tracks.length : undefined,
            isPublic: typeof pl.public === 'boolean' ? pl.public : undefined,
          }
        })
        .filter((x): x is Playlist => Boolean(x && x.id && x.name))
    }

    // Derive top artists from liked tracks' creators
    const artistCounts = new Map<string, number>()
    const artistIdNames = new Map<string, string>()
    const likeItems = likes?.collection ?? []
    for (const item of likeItems) {
      const track = item?.track || (item?.type === 'track' ? item : null)
      const user = track?.user
      const artistId = user?.id ? String(user.id) : user?.username || user?.permalink
      const artistName = user?.username || user?.permalink || ''
      if (artistId && artistName) {
        artistCounts.set(artistId, (artistCounts.get(artistId) ?? 0) + 1)
        if (!artistIdNames.has(artistId)) artistIdNames.set(artistId, artistName)
      }
    }

    const topArtistsArr: Artist[] = Array.from(artistCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([id]) => ({ id, name: artistIdNames.get(id) || id, genres: [], popularity: undefined }))

    taste.topArtists = topArtistsArr

    return taste
  },
}
