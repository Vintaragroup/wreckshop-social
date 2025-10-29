import { ProviderAdapter, MusicIdentity, MusicTaste, Artist, Playlist } from './types'

function parseSpotifyUserId(input: string): string {
  try {
    const url = new URL(input)
    // e.g., https://open.spotify.com/user/{id}
    if (url.hostname.includes('spotify.com')) {
      const parts = url.pathname.split('/').filter(Boolean)
      const idx = parts.indexOf('user')
      if (idx !== -1 && parts[idx + 1]) return parts[idx + 1]
    }
  } catch {}
  return input
}

async function spotifyGET<T>(path: string, accessToken: string): Promise<T> {
  const res = await fetch(`https://api.spotify.com${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`spotify GET ${path} failed: ${res.status} ${text}`)
  }
  return (await res.json()) as T
}

export const spotifyProvider: ProviderAdapter = {
  async resolveIdentity(input): Promise<MusicIdentity> {
    const userId = input.providerUserId || input.handle || (input.profileUrl ? parseSpotifyUserId(input.profileUrl) : undefined)
    if (!userId) throw new Error('spotify.resolveIdentity: missing user identifier')
    return {
      provider: 'spotify',
      providerUserId: userId,
      profileUrl: input.profileUrl ?? `https://open.spotify.com/user/${userId}`,
      handle: input.handle,
    }
  },

  async fetchTaste(_identity, options?: { accessToken?: string }): Promise<MusicTaste> {
    const token = (options as any)?.accessToken
    const empty: MusicTaste = { topArtists: [], topGenres: [], topTracks: [], playlists: [] }
    if (!token) return empty

    const results: MusicTaste = { ...empty }

    // Try to fetch top artists (requires user-top-read)
    try {
      const data = await spotifyGET<{ items: Array<{ id: string; name: string; genres?: string[]; popularity?: number }> }>(
        '/v1/me/top/artists?limit=20',
        token
      )
      const artists: Array<Artist> = data.items.map((a) => ({ id: a.id, name: a.name, genres: a.genres ?? [], popularity: a.popularity }))
      results.topArtists = artists
      // Derive top genres from artists if not provided
      const genreSet = new Set<string>()
      artists.forEach((a) => a.genres.forEach((g) => genreSet.add(g)))
      results.topGenres = Array.from(genreSet)
    } catch (err) {
      // Missing scope or API error; continue gracefully
    }

    // Try to fetch playlists (requires playlist-read-private for private)
    try {
      const data = await spotifyGET<{ items: Array<{ id: string; name: string; external_urls?: { spotify?: string }; public?: boolean; tracks?: { total?: number } }> }>(
        '/v1/me/playlists?limit=20',
        token
      )
      const playlists: Array<Playlist> = data.items.map((p) => ({
        id: p.id,
        name: p.name,
        url: p.external_urls?.spotify,
        isPublic: typeof p.public === 'boolean' ? p.public : undefined,
        trackCount: p.tracks?.total,
      }))
      results.playlists = playlists
    } catch (err) {
      // Missing scope or API error; continue gracefully
    }

    return results
  },
}
