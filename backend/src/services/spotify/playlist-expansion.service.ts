import DiscoveredUserModel from '../../models/discovered-user'

export interface PlaylistExpansionOptions {
  seedLimit?: number
  perUserPlaylistLimit?: number
  perPlaylistTrackLimit?: number
  maxNewUsers?: number
}

export interface ExpansionResultUser {
  spotifyId: string
  displayName: string
  profileUrl: string
  avatarUrl?: string
  followersCount: number
  followingCount: number
  matchScore: number
  discoveryMethod: 'playlist_contributor' | 'playlist_listener' | 'artist_follower'
  matchDetails: { genreMatch: string[]; artistMatches: string[] }
}

export interface ExpansionResult {
  query: { musicGenre: string; artistType: string; maxResults?: number }
  usersFound: number
  users: ExpansionResultUser[]
  executedAt: string
  sourcesByUser: Record<string, Array<{ type: 'playlist'; playlistId: string; playlistName?: string; ownerId?: string; trackId?: string; addedById?: string }>>
}

async function spotifyGET<T>(url: string, accessToken: string): Promise<T> {
  let attempt = 0
  const maxRetries = 3
  while (true) {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } })
    if (res.ok) return (await res.json()) as T
    // Handle rate limiting with basic backoff
    if (res.status === 429 && attempt < maxRetries) {
      const retryAfter = Number(res.headers.get('retry-after') || '0')
      const delay = retryAfter > 0 ? retryAfter * 1000 : 500 * Math.pow(2, attempt)
      await new Promise((r) => setTimeout(r, delay))
      attempt += 1
      continue
    }
    const text = await res.text().catch(() => '')
    throw new Error(`${url} failed: ${res.status} ${text}`)
  }
}

async function enrichUsersBasic(users: ExpansionResultUser[], accessToken: string) {
  const targets = users.filter((u) => !u.spotifyId.startsWith('artist_'))
  for (const u of targets) {
    try {
      const info = await spotifyGET<any>(
        `https://api.spotify.com/v1/users/${encodeURIComponent(u.spotifyId)}`,
        accessToken
      )
      if (typeof info?.followers?.total === 'number') u.followersCount = info.followers.total
      const imageUrl = Array.isArray(info?.images) && info.images.length > 0 ? info.images[0]?.url : undefined
      if (imageUrl && !u.avatarUrl) u.avatarUrl = imageUrl
      if (info?.display_name && !u.displayName) u.displayName = info.display_name
      if (info?.external_urls?.spotify && !u.profileUrl) u.profileUrl = info.external_urls.spotify
    } catch {
      // Skip individual enrichment errors
    }
    // be polite
    await new Promise((r) => setTimeout(r, 120))
  }
}

/**
 * Expand from existing discovered users by crawling their public playlists.
 * For each seed user: fetch public playlists, then collect the playlist owner and any added_by contributors from tracks.
 * Uses client credentials token – only public data is accessible.
 */
export async function expandFromSavedUserPlaylists(
  accessToken: string,
  options: PlaylistExpansionOptions = {}
): Promise<ExpansionResult> {
  const seedLimit = Math.max(1, Math.min(options.seedLimit ?? 50, 500))
  const perUserPlaylistLimit = Math.max(1, Math.min(options.perUserPlaylistLimit ?? 5, 20))
  const perPlaylistTrackLimit = Math.max(1, Math.min(options.perPlaylistTrackLimit ?? 100, 100))
  const maxNewUsers = Math.max(1, Math.min(options.maxNewUsers ?? 200, 1000))

  // Seeds: existing non-virtual users, oldest-updated first to spread coverage
  const seeds = await DiscoveredUserModel.find({
    spotifyId: { $exists: true, $nin: [null, ''] },
    $expr: { $ne: [{ $substr: ['$spotifyId', 0, 7] }, 'artist_'] },
  })
    .sort({ updatedAt: 1 })
    .limit(seedLimit)
    .lean()

  const newUsersMap = new Map<string, ExpansionResultUser>()
  const sourcesByUser: ExpansionResult['sourcesByUser'] = {}

  for (const seed of seeds) {
    try {
      // Fetch seed's public playlists
      const playlistsPage = await spotifyGET<any>(
        `https://api.spotify.com/v1/users/${encodeURIComponent(seed.spotifyId)}/playlists?limit=${perUserPlaylistLimit}`,
        accessToken
      )
      const playlists = playlistsPage?.items || []

      for (const p of playlists) {
        if (!p?.id) continue

        // Add playlist owner
        const owner = p.owner
        if (owner?.id && owner.id !== seed.spotifyId) {
          const id = String(owner.id)
          if (!newUsersMap.has(id)) {
            newUsersMap.set(id, {
              spotifyId: id,
              displayName: owner.display_name || 'Spotify User',
              profileUrl: owner.external_urls?.spotify || `https://open.spotify.com/user/${id}`,
              avatarUrl: owner.images?.[0]?.url,
              followersCount: 0,
              followingCount: 0,
              matchScore: 80,
              discoveryMethod: 'playlist_contributor',
              matchDetails: { genreMatch: ['unknown'], artistMatches: [] },
            })
          }
          (sourcesByUser[id] ||= []).push({
            type: 'playlist',
            playlistId: String(p.id),
            playlistName: p.name,
            ownerId: owner.id,
          })
        }

        // Fetch playlist tracks and collect contributors via added_by
        try {
          const tracks = await spotifyGET<any>(
            `https://api.spotify.com/v1/playlists/${p.id}/tracks?limit=${perPlaylistTrackLimit}`,
            accessToken
          )
          const items = tracks?.items || []
          for (const it of items) {
            const adder = it?.added_by
            const user = adder?.id ? adder : null
            if (user && user.id) {
              const id = String(user.id)
              if (!newUsersMap.has(id)) {
                newUsersMap.set(id, {
                  spotifyId: id,
                  displayName: user.display_name || 'Spotify User',
                  profileUrl: user.external_urls?.spotify || `https://open.spotify.com/user/${id}`,
                  avatarUrl: undefined,
                  followersCount: 0,
                  followingCount: 0,
                  matchScore: 65,
                  discoveryMethod: 'playlist_contributor',
                  matchDetails: { genreMatch: ['unknown'], artistMatches: [] },
                })
              }
              (sourcesByUser[id] ||= []).push({
                type: 'playlist',
                playlistId: String(p.id),
                playlistName: p.name,
                ownerId: p.owner?.id,
                trackId: it?.track?.id,
                addedById: user.id,
              })
            }
            if (newUsersMap.size >= maxNewUsers) break
          }
        } catch {
          // Continue; some playlists may be inaccessible
        }

        if (newUsersMap.size >= maxNewUsers) break
      }
    } catch {
      // Ignore individual seed errors
    }

    if (newUsersMap.size >= maxNewUsers) break
    // Small delay between seed users to be polite
    await new Promise((r) => setTimeout(r, 200))
  }

  const users = Array.from(newUsersMap.values()).slice(0, maxNewUsers)
  await enrichUsersBasic(users, accessToken)

  return {
    query: { musicGenre: 'playlist', artistType: 'contributors', maxResults: maxNewUsers },
    usersFound: users.length,
    users,
    executedAt: new Date().toISOString(),
    sourcesByUser,
  }
}
