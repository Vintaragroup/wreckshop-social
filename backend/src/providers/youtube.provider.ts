import { ProviderAdapter, MusicIdentity, MusicTaste, Playlist } from './types'

function parseYouTubeHandleOrUrl(input?: { handle?: string; profileUrl?: string }) {
  let handle = input?.handle?.trim()
  let profileUrl = input?.profileUrl
  let channelId: string | undefined
  if (profileUrl) {
    try {
      const url = new URL(profileUrl)
      if (url.hostname.includes('youtube.com') || url.hostname.includes('youtu.be')) {
        const parts = url.pathname.split('/').filter(Boolean)
        // Support /channel/UCxxxx, /@handle, /c/custom
        const idx = parts.findIndex((p) => p.toLowerCase() === 'channel')
        if (idx >= 0 && parts[idx + 1]) channelId = parts[idx + 1]
        if (!handle && parts[0]?.startsWith('@')) handle = parts[0]
        if (!handle && parts[0]?.toLowerCase() === 'c' && parts[1]) handle = parts[1]
      }
    } catch {}
  }
  if (handle?.startsWith('@')) handle = handle.slice(1)
  return { handle, profileUrl, channelId }
}

export const youtubeProvider: ProviderAdapter = {
  async resolveIdentity(input) {
    const { handle, profileUrl, channelId: parsedChannelId } = parseYouTubeHandleOrUrl({ handle: input.handle, profileUrl: input.profileUrl })
    const apiKey = process.env.YOUTUBE_API_KEY
    // If channelId in URL, prefer it
    if (parsedChannelId) {
      const id: MusicIdentity = {
        provider: 'youtube' as any,
        providerUserId: parsedChannelId,
        profileUrl: profileUrl ?? `https://www.youtube.com/channel/${parsedChannelId}`,
        handle: handle ?? input.handle,
      }
      return id
    }

    // Fallback: resolve via search API when apiKey is present
    if (apiKey && (handle || input.handle)) {
      try {
        const query = handle || input.handle!
        const u = new URL('https://www.googleapis.com/youtube/v3/search')
        u.searchParams.set('part', 'snippet')
        u.searchParams.set('type', 'channel')
        u.searchParams.set('q', query)
        u.searchParams.set('maxResults', '1')
        u.searchParams.set('key', apiKey)
        const res = await fetch(u.toString())
        if (res.ok) {
          const data: any = await res.json().catch(() => ({}))
          const item = data?.items?.[0]
          const cid = item?.id?.channelId
          if (cid) {
            const id: MusicIdentity = {
              provider: 'youtube' as any,
              providerUserId: cid,
              profileUrl: `https://www.youtube.com/channel/${cid}`,
              handle: query,
            }
            return id
          }
        }
      } catch {}
    }

    // Last resort
    const id: MusicIdentity = {
      provider: 'youtube' as any,
      providerUserId: handle || input.providerUserId || 'unknown',
      profileUrl: profileUrl ?? (handle ? `https://www.youtube.com/@${encodeURIComponent(handle)}` : undefined),
      handle: handle ?? input.handle,
    }
    return id
  },

  async fetchTaste(identity) {
    const apiKey = process.env.YOUTUBE_API_KEY
    const empty: MusicTaste = { topArtists: [], topGenres: [], topTracks: [], playlists: [] }
    if (!apiKey) return empty

    // Ensure we have channelId; if not, attempt a small resolve using handle
    let channelId = identity.providerUserId
    if (channelId && !channelId.startsWith('UC')) channelId = ''
    if (!channelId && identity.handle) {
      try {
        const u = new URL('https://www.googleapis.com/youtube/v3/search')
        u.searchParams.set('part', 'snippet')
        u.searchParams.set('type', 'channel')
        u.searchParams.set('q', identity.handle)
        u.searchParams.set('maxResults', '1')
        u.searchParams.set('key', apiKey)
        const res = await fetch(u.toString())
        if (res.ok) {
          const data: any = await res.json().catch(() => ({}))
          const item = data?.items?.[0]
          const cid = item?.id?.channelId
          if (cid) channelId = cid
        }
      } catch {}
    }
    if (!channelId) return empty

    async function getJson<T = any>(u: string): Promise<T | null> {
      try {
        const res = await fetch(u)
        if (!res.ok) return null
        return (await res.json()) as T
      } catch {
        return null
      }
    }

    // Get channel contentDetails to find uploads playlist
    const channelUrl = new URL('https://www.googleapis.com/youtube/v3/channels')
    channelUrl.searchParams.set('part', 'contentDetails')
    channelUrl.searchParams.set('id', channelId)
    channelUrl.searchParams.set('key', apiKey)
    const channelData = await getJson<{ items?: any[] }>(channelUrl.toString())
    const uploadsId = channelData?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads as string | undefined

    // Fetch channel playlists (public)
    const playlistsUrl = new URL('https://www.googleapis.com/youtube/v3/playlists')
    playlistsUrl.searchParams.set('part', 'snippet,contentDetails')
    playlistsUrl.searchParams.set('channelId', channelId)
    playlistsUrl.searchParams.set('maxResults', '50')
    playlistsUrl.searchParams.set('key', apiKey)
    const playlistsData = await getJson<{ items?: any[] }>(playlistsUrl.toString())

    const taste: MusicTaste = { topArtists: [], topGenres: [], topTracks: [], playlists: [] }

    // Map playlists
    const pls = playlistsData?.items ?? []
    taste.playlists = pls
      .map((pl): Playlist | null => {
        if (!pl) return null
        const id = pl?.id
        const title = pl?.snippet?.title
        const url = id ? `https://www.youtube.com/playlist?list=${id}` : undefined
        const count = pl?.contentDetails?.itemCount
        return id && title ? { id, name: String(title), url, trackCount: typeof count === 'number' ? count : undefined, isPublic: true } : null
      })
      .filter((x): x is Playlist => Boolean(x && x.id && x.name))

    // Fetch uploads playlist items to populate topTracks (best effort proxy for music)
    if (uploadsId) {
      const itemsUrl = new URL('https://www.googleapis.com/youtube/v3/playlistItems')
      itemsUrl.searchParams.set('part', 'snippet')
      itemsUrl.searchParams.set('playlistId', uploadsId)
      itemsUrl.searchParams.set('maxResults', '25')
      itemsUrl.searchParams.set('key', apiKey)
      const itemsData = await getJson<{ items?: any[] }>(itemsUrl.toString())
      const titles = (itemsData?.items ?? []).map((it) => String(it?.snippet?.title || '')).filter(Boolean)
      taste.topTracks = titles.slice(0, 20)
    }

    return taste
  },

  async fetchProfileDetails(identity) {
    const apiKey = process.env.YOUTUBE_API_KEY
    if (!apiKey) return {}

    // Resolve channelId from providerUserId or via search using handle
    let channelId = identity.providerUserId
    if (channelId && !channelId.startsWith('UC')) channelId = ''
    if (!channelId && identity.handle) {
      try {
        const u = new URL('https://www.googleapis.com/youtube/v3/search')
        u.searchParams.set('part', 'snippet')
        u.searchParams.set('type', 'channel')
        u.searchParams.set('q', identity.handle)
        u.searchParams.set('maxResults', '1')
        u.searchParams.set('key', apiKey)
        const res = await fetch(u.toString())
        if (res.ok) {
          const data: any = await res.json().catch(() => ({}))
          const item = data?.items?.[0]
          const cid = item?.id?.channelId
          if (cid) channelId = cid
        }
      } catch {}
    }
    if (!channelId) return {}

    try {
      const u = new URL('https://www.googleapis.com/youtube/v3/channels')
      u.searchParams.set('part', 'snippet,statistics')
      u.searchParams.set('id', channelId)
      u.searchParams.set('key', apiKey)
      const res = await fetch(u.toString())
      if (!res.ok) return {}
      const data: any = await res.json().catch(() => ({}))
      const item = data?.items?.[0]
      if (!item) return {}
      const snippet = item.snippet || {}
      const stats = item.statistics || {}
      const displayName: string | undefined = snippet.title
      let avatarUrl: string | undefined
      const thumbs = snippet.thumbnails || {}
      avatarUrl = thumbs.high?.url || thumbs.medium?.url || thumbs.default?.url
      const profileUrl = `https://www.youtube.com/channel/${channelId}`
      const subs = stats.hiddenSubscriberCount ? undefined : Number(stats.subscriberCount)
      const followersCount = typeof subs === 'number' && !Number.isNaN(subs) ? subs : undefined
      return { displayName, avatarUrl, profileUrl, followersCount }
    } catch {
      return {}
    }
  },
}
