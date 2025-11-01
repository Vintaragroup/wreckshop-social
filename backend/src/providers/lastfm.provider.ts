import { ProviderAdapter, MusicIdentity, MusicTaste } from './types'

function parseLastfmHandleOrUrl(input?: { handle?: string; profileUrl?: string }) {
  let handle = input?.handle
  let profileUrl = input?.profileUrl
  if (!handle && profileUrl) {
    try {
      const url = new URL(profileUrl)
      // Expected: https://www.last.fm/user/{username}
      if (url.hostname.includes('last.fm')) {
        const parts = url.pathname.split('/').filter(Boolean)
        const idx = parts.findIndex((p) => p.toLowerCase() === 'user')
        if (idx >= 0 && parts[idx + 1]) {
          handle = decodeURIComponent(parts[idx + 1])
        }
      }
    } catch {}
  }
  return { handle, profileUrl }
}

export const lastfmProvider: ProviderAdapter = {
  async resolveIdentity(input) {
    const { handle, profileUrl } = parseLastfmHandleOrUrl({ handle: input.handle, profileUrl: input.profileUrl })
    const id: MusicIdentity = {
      provider: 'lastfm',
      providerUserId: handle || input.providerUserId || 'unknown',
      profileUrl: profileUrl ?? (handle ? `https://www.last.fm/user/${encodeURIComponent(handle)}` : undefined),
      handle: handle ?? input.handle,
    }
    return id
  },

  async fetchTaste(identity) {
    const apiKey = process.env.LASTFM_API_KEY
    const taste: MusicTaste = { topArtists: [], topGenres: [], topTracks: [], playlists: [] }
    if (!apiKey) return taste
    const user = identity.handle || identity.providerUserId
    if (!user || user === 'unknown') return taste
    try {
      const base = 'https://ws.audioscrobbler.com/2.0/'
      const makeUrl = (method: string, extra: Record<string, string> = {}) => {
        const u = new URL(base)
        u.searchParams.set('method', method)
        u.searchParams.set('user', user)
        u.searchParams.set('api_key', apiKey)
        u.searchParams.set('format', 'json')
        Object.entries(extra).forEach(([k, v]) => u.searchParams.set(k, v))
        return u.toString()
      }

      const [artistsRes, tracksRes, tagsRes] = await Promise.all([
        fetch(makeUrl('user.gettopartists', { limit: '20' })),
        fetch(makeUrl('user.gettoptracks', { limit: '20' })),
        fetch(makeUrl('user.gettoptags', { limit: '15' })),
      ])

      if (artistsRes.ok) {
        const data: any = await artistsRes.json().catch(() => ({}))
        const artists = data?.topartists?.artist ?? []
        taste.topArtists = artists
          .map((a: any) => ({
            id: a?.mbid || a?.name || '',
            name: a?.name || '',
            genres: [],
            popularity: undefined,
          }))
          .filter((a: any) => a.id && a.name)
      }

      if (tracksRes.ok) {
        const data: any = await tracksRes.json().catch(() => ({}))
        const tracks = data?.toptracks?.track ?? []
        taste.topTracks = tracks
          .map((t: any) => String(t?.name || ''))
          .filter((s: string) => s.length > 0)
      }

      if (tagsRes.ok) {
        const data: any = await tagsRes.json().catch(() => ({}))
        const tags = data?.toptags?.tag ?? []
        taste.topGenres = tags
          .map((t: any) => String(t?.name || ''))
          .filter((s: string) => s.length > 0)
      }

      return taste
    } catch {
      return taste
    }
  },

  async fetchProfileDetails(identity) {
    const apiKey = process.env.LASTFM_API_KEY
    const user = identity.handle || identity.providerUserId
    if (!apiKey || !user || user === 'unknown') return {}
    try {
      const u = new URL('https://ws.audioscrobbler.com/2.0/')
      u.searchParams.set('method', 'user.getinfo')
      u.searchParams.set('user', user)
      u.searchParams.set('api_key', apiKey)
      u.searchParams.set('format', 'json')
  const res = await fetch(u.toString())
      if (!res.ok) return {}
      const data: any = await res.json().catch(() => ({}))
      const info = data?.user
      if (!info) return {}
      const displayName: string | undefined = info?.realname || info?.name
      let avatarUrl: string | undefined
      const imgs: any[] = Array.isArray(info?.image) ? info.image : []
      // images are typically { '#text': url, size: 'small'|'medium'|'large'|'extralarge'|'mega' }
      for (const size of ['mega', 'extralarge', 'large', 'medium', 'small']) {
        const found = imgs.find((im) => (im?.size === size) && typeof im['#text'] === 'string' && im['#text'].length)
        if (found) { avatarUrl = String(found['#text']); break }
      }
      const profileUrl: string | undefined = typeof info?.url === 'string' ? info.url : undefined
      // Last.fm doesn't expose a free-form bio for users; include country in bio if present for context
      const country = typeof info?.country === 'string' && info.country.trim().length ? `Country: ${info.country}` : undefined
      const bio = country

      // Fetch friends and neighbours counts via @attr.total using minimal limit=1
      const makeUrl = (method: string, extra: Record<string, string> = {}) => {
        const base = 'https://ws.audioscrobbler.com/2.0/'
        const uu = new URL(base)
        uu.searchParams.set('method', method)
        uu.searchParams.set('user', user)
        uu.searchParams.set('api_key', apiKey)
        uu.searchParams.set('format', 'json')
        Object.entries(extra).forEach(([k, v]) => uu.searchParams.set(k, v))
        return uu.toString()
      }

      let friendsCount: number | undefined
      let neighboursCount: number | undefined
      try {
        const [friendsRes, neighboursRes] = await Promise.all([
          fetch(makeUrl('user.getfriends', { limit: '1' })),
          fetch(makeUrl('user.getneighbours', { limit: '1' })),
        ])
        if (friendsRes.ok) {
          const f: any = await friendsRes.json().catch(() => ({}))
          const totalStr = f?.friends?.['@attr']?.total
          const n = totalStr ? Number(totalStr) : undefined
          if (typeof n === 'number' && !Number.isNaN(n)) friendsCount = n
        }
        if (neighboursRes.ok) {
          const ndata: any = await neighboursRes.json().catch(() => ({}))
          const totalStr = ndata?.neighbours?.['@attr']?.total
          const n = totalStr ? Number(totalStr) : undefined
          if (typeof n === 'number' && !Number.isNaN(n)) neighboursCount = n
        }
      } catch {}

      return { displayName, avatarUrl, profileUrl, bio, friendsCount, neighboursCount }
    } catch {
      return {}
    }
  },
}
