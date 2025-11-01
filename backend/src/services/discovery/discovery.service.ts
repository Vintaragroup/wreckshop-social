export type Candidate = {
  provider: 'soundcloud' | 'deezer' | 'youtube' | 'audius' | 'lastfm'
  providerUserId: string
  displayName: string
  profileUrl?: string
  handle?: string
  // Optional enrichment fields used by the UI for more context
  avatarUrl?: string
  followers?: number
  tracks?: number
  playlists?: number
  location?: string
  bio?: string
}

export async function discover(
  provider: Candidate['provider'],
  q: string,
  opts: { SOUNDCLOUD_CLIENT_ID?: string; YOUTUBE_API_KEY?: string; LASTFM_API_KEY?: string } = {},
  genre?: string,
): Promise<Candidate[]> {
  const query = [q.trim(), genre?.trim()].filter(Boolean).join(' ')
  if (!query) return []

  switch (provider) {
    case 'soundcloud': {
      const client_id = opts.SOUNDCLOUD_CLIENT_ID
      if (!client_id) return []
  const url = `https://api-v2.soundcloud.com/search/users?q=${encodeURIComponent(query)}&client_id=${client_id}&limit=10`
      const res = await fetch(url)
      if (!res.ok) return []
      const json: any = await res.json()
      return (json.collection || []).map((u: any) => ({
        provider: 'soundcloud',
        providerUserId: String(u.id),
        displayName: u.username || u.permalink,
        profileUrl: u.permalink_url,
        handle: u.permalink,
      }))
    }
    case 'deezer': {
  const url = `https://api.deezer.com/search/user?q=${encodeURIComponent(query)}`
      const res = await fetch(url)
      if (!res.ok) return []
      const json: any = await res.json()
      return (json.data || []).map((u: any) => ({
        provider: 'deezer',
        providerUserId: String(u.id),
        displayName: u.name,
        // Compose a public profile link; "link" is not included in search results for users
        profileUrl: `https://www.deezer.com/profile/${u.id}`,
        avatarUrl: u.picture_medium || u.picture_small || u.picture_big || u.picture_xl || u.picture,
      }))
    }
    case 'youtube': {
      const key = opts.YOUTUBE_API_KEY
      if (!key) return []
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&maxResults=10&q=${encodeURIComponent(query)}&key=${key}`
      const res = await fetch(searchUrl)
      if (!res.ok) return []
      const json: any = await res.json()
      const ids: string[] = (json.items || [])
        .map((it: any) => it.id?.channelId)
        .filter(Boolean)
      if (ids.length === 0) return []
      // Fetch thumbnails and stats
      const channelsUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${ids.join(',')}&key=${key}`
      const res2 = await fetch(channelsUrl)
      if (!res2.ok) return []
      const json2: any = await res2.json()
      return (json2.items || []).map((ch: any) => {
        const id = ch.id
        const sn = ch.snippet || {}
        const st = ch.statistics || {}
        const thumbs = sn.thumbnails || {}
        const bestThumb = thumbs.high?.url || thumbs.medium?.url || thumbs.default?.url
        const subs = st.hiddenSubscriberCount ? undefined : Number(st.subscriberCount || 0)
        const videos = typeof st.videoCount !== 'undefined' ? Number(st.videoCount) : undefined
        return {
          provider: 'youtube',
          providerUserId: String(id),
          displayName: sn.title || String(id),
          profileUrl: id ? `https://www.youtube.com/channel/${id}` : undefined,
          avatarUrl: bestThumb,
          followers: subs,
          tracks: videos, // treat as "videos"
          bio: sn.description ? String(sn.description).slice(0, 200) : undefined,
        } as Candidate
      })
    }
    case 'lastfm': {
      const key = opts.LASTFM_API_KEY
      if (!key) return []
      // Strategy:
      // - If a genre is provided, fetch top artists for that tag, then fetch top fans for those artists.
      // - Else if a free-text query is provided, treat it as an artist name and fetch top fans.
      // - Else, as a fallback attempt direct username lookup via user.getInfo when the query looks like a handle.

      const tagFromGenre = (g?: string) => {
        if (!g) return undefined
        const t = g.trim().toLowerCase()
        if (!t) return undefined
        if (t === 'r&b' || t === 'rnb' || t === 'r&b/soul') return 'rnb'
        return t.replace(/\s+/g, '-')
      }

      async function getTopArtistsByTag(tag: string, limit = 5): Promise<string[]> {
        const url = `https://ws.audioscrobbler.com/2.0/?method=tag.gettopartists&tag=${encodeURIComponent(tag)}&api_key=${key}&format=json&limit=${limit}`
        const res = await fetch(url)
        if (!res.ok) return []
        const json: any = await res.json()
        const artists = json?.topartists?.artist || []
        return artists.map((a: any) => String(a?.name || '')).filter((s: string) => s.length > 0)
      }

      async function getTopFansForArtist(artist: string, limit = 10): Promise<Candidate[]> {
        const url = `https://ws.audioscrobbler.com/2.0/?method=artist.gettopfans&artist=${encodeURIComponent(artist)}&api_key=${key}&format=json`
        const res = await fetch(url)
        if (!res.ok) return []
        const json: any = await res.json()
        const fans = json?.topfans?.user || []
        return fans.slice(0, limit).map((u: any) => {
          const images: Array<{ size: string; '#text': string }> = u.image || []
          const pick = (size: string) => images.find((im) => im.size === size)?.['#text']
          const avatar = pick('large') || pick('medium') || pick('small') || undefined
          return {
            provider: 'lastfm',
            providerUserId: String(u.name),
            displayName: u.realname || u.name,
            profileUrl: u.url,
            handle: u.name,
            avatarUrl: avatar,
          } as Candidate
        })
      }

      const results: Candidate[] = []
      const seen = new Set<string>()
      const tag = tagFromGenre(genre)

      if (tag) {
        const artists = await getTopArtistsByTag(tag, 5)
        for (const a of artists.slice(0, 3)) {
          const fans = await getTopFansForArtist(a, 12)
          for (const f of fans) {
            if (!seen.has(f.providerUserId)) {
              seen.add(f.providerUserId)
              results.push(f)
            }
          }
        }
        return results
      }

      const qtrim = q.trim()
      if (qtrim) {
        const fans = await getTopFansForArtist(qtrim, 20)
        if (fans.length > 0) return fans
        // Fallback to direct username lookup if no fans found and q looks like a handle
        const url = `https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${encodeURIComponent(qtrim)}&api_key=${key}&format=json`
        const res = await fetch(url)
        if (!res.ok) return []
        const json: any = await res.json()
        const u = json?.user
        if (!u) return []
        const images: Array<{ size: string; '#text': string }> = u.image || []
        const pick = (size: string) => images.find((im) => im.size === size)?.['#text']
        const avatar = pick('large') || pick('medium') || pick('small') || undefined
        return [{
          provider: 'lastfm',
          providerUserId: String(u.name),
          displayName: u.realname || u.name,
          profileUrl: u.url,
          handle: u.name,
          avatarUrl: avatar,
          location: u.country || undefined,
        } as Candidate]
      }

      return []
    }
    case 'audius': {
  const url = `https://discoveryprovider.audius.co/v1/users/search?query=${encodeURIComponent(query)}&app_name=wreckshop`
      const res = await fetch(url)
      if (!res.ok) return []
      const json: any = await res.json()
      return (json.data || []).map((u: any) => ({
        provider: 'audius',
        providerUserId: u.user_id ? String(u.user_id) : u.handle,
        displayName: u.name || u.handle,
        profileUrl: u.handle ? `https://audius.co/${u.handle}` : undefined,
        handle: u.handle,
        avatarUrl: u.profile_picture?.['150x150'] || u.profile_picture?.['480x480'] || undefined,
        followers: typeof u.follower_count === 'number' ? u.follower_count : undefined,
        tracks: typeof u.track_count === 'number' ? u.track_count : undefined,
        playlists: typeof u.playlist_count === 'number' ? u.playlist_count : undefined,
        location: u.location || undefined,
        bio: u.bio ? String(u.bio).slice(0, 200) : undefined,
      }))
    }
    default:
      return []
  }
}
