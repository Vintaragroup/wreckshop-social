/**
 * Logger for discovery service
 */
const logger = {
  info: (data: any, msg: string) => console.log(`[INFO] ${msg}`, data),
  warn: (data: any, msg: string) => console.warn(`[WARN] ${msg}`, data),
  error: (data: any, msg: string) => console.error(`[ERROR] ${msg}`, data),
}

export interface DiscoveryFilters {
  musicGenre: string // e.g., "indie", "hip-hop", "pop", "electronic"
  artistType: string // e.g., "mainstream", "underground", "indie", "emerging"
  maxResults?: number // default 50, max 200
}

export interface DiscoveredUser {
  spotifyId: string
  displayName: string
  profileUrl: string
  avatarUrl?: string
  followersCount: number
  followingCount: number
  matchScore: number // 0-100 based on how well they match filters
  discoveryMethod: 'playlist_contributor' | 'playlist_listener' | 'artist_follower'
  matchDetails: {
    genreMatch: string[] // genres that matched filter
    artistMatches: string[] // artists that matched filter
  }
}

export interface DiscoveryResult {
  query: DiscoveryFilters
  usersFound: number
  users: DiscoveredUser[]
  executedAt: string
}

/**
 * Searches Spotify for users interested in specific music types and artist categories
 * 
 * Approach:
 * 1. Search for curated playlists matching the genre + artist type
 * 2. Fetch playlist followers
 * 3. For each follower, fetch their profile and assess match
 * 4. Score and rank by relevance
 */
export async function discoverUsersByMusicAndArtist(
  filters: DiscoveryFilters,
  accessToken: string
): Promise<DiscoveryResult> {
  const startTime = Date.now()

  if (!accessToken) {
    throw new Error('Access token is required for Spotify discovery')
  }

  const maxResults = Math.min(filters.maxResults || 50, 200)

  logger.info(
    { filters, maxResults },
    'Starting user discovery search'
  )

  try {
    // Step 1: Search for playlists matching genre + artist type
    const playlists = await searchPlaylistsByGenreAndArtist(
      filters.musicGenre,
      filters.artistType,
      accessToken
    )

    logger.info(
      { playlistCount: playlists.length },
      'Found playlists matching criteria'
    )

    // Step 2: Collect unique users from playlist followers
    const usersMap = new Map<string, DiscoveredUser>()

    for (const playlist of playlists) {
      try {
        const playlistFollowers = await fetchPlaylistFollowers(
          playlist.id,
          accessToken,
          Math.ceil(maxResults / playlists.length) // distribute max results across playlists
        )

        logger.info(
          { playlistId: playlist.id, followerCount: playlistFollowers.length },
          'Fetched playlist followers'
        )

        for (const follower of playlistFollowers) {
          if (!usersMap.has(follower.spotifyId)) {
            usersMap.set(follower.spotifyId, follower)
          } else {
            // Increase match score if user appears in multiple playlists
            const existing = usersMap.get(follower.spotifyId)!
            existing.matchScore = Math.min(existing.matchScore + 10, 100)
            existing.matchDetails.genreMatch = [
              ...new Set([
                ...existing.matchDetails.genreMatch,
                ...follower.matchDetails.genreMatch,
              ]),
            ]
            existing.matchDetails.artistMatches = [
              ...new Set([
                ...existing.matchDetails.artistMatches,
                ...follower.matchDetails.artistMatches,
              ]),
            ]
          }
        }
      } catch (err) {
        logger.warn(
          { playlistId: playlist.id, error: err },
          'Failed to fetch playlist followers'
        )
        // Continue with next playlist
      }
    }

    // Step 3: Convert to array and sort by match score
    const discoveredUsers = Array.from(usersMap.values())
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, maxResults)

    // Step 4: Enrich basic user profiles with follower counts & images where possible
    // Note: Spotify API exposes followers for arbitrary users via GET /v1/users/{id}
    // but not following counts (following is only available for the current user context).
    // We'll populate followersCount and avatarUrl when available.
    await enrichUsersWithProfile(discoveredUsers, accessToken)

    const duration = Date.now() - startTime

    logger.info(
      { usersFound: discoveredUsers.length, duration },
      'Discovery search completed'
    )

    return {
      query: filters,
      usersFound: discoveredUsers.length,
      users: discoveredUsers,
      executedAt: new Date().toISOString(),
    }
  } catch (error) {
    logger.error({ error, filters }, 'Discovery search failed')
    throw error
  }
}

/**
 * Search Spotify for curated playlists matching genre and artist type
 */
async function searchPlaylistsByGenreAndArtist(
  genre: string,
  artistType: string,
  accessToken: string
): Promise<Array<{ id: string; name: string; externalUrl: string }>> {
  // Build search query combining genre and artist type
  const query = buildPlaylistSearchQuery(genre, artistType)

  logger.info({ query }, 'Searching for playlists')

  const res = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=playlist&limit=10`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Spotify search failed: ${res.status} ${text}`)
  }

  const data = (await res.json()) as any
  const playlists = data.playlists?.items || []

  return playlists
    .filter((p: any) => p && p.id) // Filter out null/undefined playlists
    .map((p: any) => ({
      id: p.id,
      name: p.name,
      externalUrl: p.external_urls?.spotify || '',
    }))
}

/**
 * Build a Spotify search query based on genre and artist type
 */
function buildPlaylistSearchQuery(genre: string, artistType: string): string {
  const genreKeywords: Record<string, string[]> = {
    indie: ['indie', 'alternative', 'indie rock', 'indie pop'],
    'hip-hop': ['hip-hop', 'hip hop', 'rap', 'trap', 'boom bap'],
    pop: ['pop', 'pop hits', 'chart hits', 'top 40'],
    electronic: ['electronic', 'edm', 'house', 'techno', 'drum and bass'],
    rock: ['rock', 'hard rock', 'classic rock', 'alternative rock'],
    'r&b': ['r&b', 'rnb', 'soul', 'neo soul'],
    country: ['country', 'country music', 'country hits'],
    jazz: ['jazz', 'jazz hits', 'smooth jazz'],
    metal: ['metal', 'heavy metal', 'death metal', 'metalcore'],
    latino: ['latino', 'latin', 'reggaeton', 'latin trap'],
  }

  const artistTypeKeywords: Record<string, string[]> = {
    mainstream: ['popular', 'top', 'hits', 'viral'],
    underground: ['underground', 'deep', 'hidden gems', 'underground artists'],
    indie: ['indie', 'independent', 'independent artists'],
    emerging: ['new', 'rising', 'emerging', 'up and coming', 'breakthrough'],
  }

  const genreTerms = genreKeywords[genre.toLowerCase()] || [genre]
  const artistTerms = artistTypeKeywords[artistType.toLowerCase()] || [artistType]

  // Combine terms: "genre + artistType"
  const primaryGenre = genreTerms[0]
  const primaryArtistType = artistTerms[0]

  return `${primaryGenre} ${primaryArtistType}`
}

/**
 * Fetch followers of a playlist (who often represent fans of that genre/artist)
 */
async function fetchPlaylistFollowers(
  playlistId: string,
  accessToken: string,
  limit: number = 20
): Promise<DiscoveredUser[]> {
  // Fetch playlist details
  const playlistRes = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!playlistRes.ok) {
    throw new Error(`Failed to fetch playlist: ${playlistRes.status}`)
  }

  const playlistData = (await playlistRes.json()) as any

  // Fetch playlist tracks to get owner
  const tracksRes = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${Math.min(limit, 50)}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  )

  if (!tracksRes.ok) {
    throw new Error(`Failed to fetch playlist tracks: ${tracksRes.status}`)
  }

  const tracksData = (await tracksRes.json()) as any
  const tracks = tracksData.items || []

  // Extract users from track data (people who saved these tracks)
  // Note: Spotify API doesn't directly expose playlist followers,
  // so we use playlist contributors (people whose tracks are in the playlist)
  const users: DiscoveredUser[] = []

  if (playlistData?.owner && playlistData.owner.id) {
    const owner = playlistData.owner
    users.push({
      spotifyId: owner.id,
      displayName: owner.display_name || 'Spotify User',
      profileUrl: owner.external_urls?.spotify || `https://open.spotify.com/user/${owner.id}`,
      avatarUrl: owner.images?.[0]?.url,
      followersCount: 0, // Would need additional API call
      followingCount: 0,
      matchScore: 90, // High score for playlist owner
      discoveryMethod: 'playlist_contributor',
      matchDetails: {
        genreMatch: extractGenresFromPlaylist(playlistData),
        artistMatches: extractArtistsFromTracks(tracks),
      },
    })
  }

  // Extract artists from tracks
  const artistIds = new Set<string>()
  for (const item of tracks) {
    const track = item.track
    if (track?.artists) {
      track.artists.forEach((artist: any) => {
        if (artist.id) artistIds.add(artist.id)
      })
    }
  }

  // For each artist, fetch followers
  for (const artistId of Array.from(artistIds).slice(0, 5)) {
    try {
      const artistRes = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      if (artistRes.ok) {
        const artist = (await artistRes.json()) as any
        users.push({
          spotifyId: `artist_${artistId}`, // Virtual user ID for artist
          displayName: `Fans of ${artist.name}`,
          profileUrl: artist.external_urls?.spotify || '',
          avatarUrl: artist.images?.[0]?.url,
          followersCount: artist.followers?.total || 0,
          followingCount: 0,
          matchScore: 70,
          discoveryMethod: 'artist_follower',
          matchDetails: {
            genreMatch: artist.genres || [],
            artistMatches: [artist.name],
          },
        })
      }
    } catch (err) {
      logger.warn({ artistId, error: err }, 'Failed to fetch artist')
    }
  }

  return users.slice(0, limit)
}

/**
 * Extract genres from playlist metadata
 */
function extractGenresFromPlaylist(playlist: any): string[] {
  const genres: string[] = []

  // Try to extract from playlist description or name
  const description = (playlist.description || '').toLowerCase()
  const name = (playlist.name || '').toLowerCase()
  const text = `${name} ${description}`

  const commonGenres = [
    'indie',
    'hip-hop',
    'pop',
    'rock',
    'electronic',
    'r&b',
    'country',
    'jazz',
    'metal',
    'latino',
  ]

  for (const genre of commonGenres) {
    if (text.includes(genre)) {
      genres.push(genre)
    }
  }

  return genres.length > 0 ? genres : ['unknown']
}

/**
 * Extract artist names from tracks
 */
function extractArtistsFromTracks(tracks: any[]): string[] {
  const artists = new Set<string>()

  for (const item of tracks.slice(0, 10)) {
    const track = item.track
    if (track?.artists) {
      track.artists.forEach((artist: any) => {
        if (artist.name) artists.add(artist.name)
      })
    }
  }

  return Array.from(artists).slice(0, 5)
}

/**
 * Fetch Spotify user profile details for arbitrary user IDs.
 * Populates followersCount and avatarUrl when available.
 */
async function enrichUsersWithProfile(users: DiscoveredUser[], accessToken: string) {
  const targets = users.filter((u) => !u.spotifyId.startsWith('artist_'))
  for (const u of targets) {
    try {
      const res = await fetch(`https://api.spotify.com/v1/users/${encodeURIComponent(u.spotifyId)}`,
        { headers: { Authorization: `Bearer ${accessToken}` } })
      if (!res.ok) continue
      const info = (await res.json()) as any
      if (typeof info?.followers?.total === 'number') {
        u.followersCount = info.followers.total
      }
      const imageUrl = Array.isArray(info?.images) && info.images.length > 0 ? info.images[0]?.url : undefined
      if (imageUrl && !u.avatarUrl) {
        u.avatarUrl = imageUrl
      }
      const displayName = info?.display_name
      if (displayName && !u.displayName) {
        u.displayName = displayName
      }
      const profileUrl = info?.external_urls?.spotify
      if (profileUrl && !u.profileUrl) {
        u.profileUrl = profileUrl
      }
    } catch {
      // Ignore individual enrichment failures
    }
  }
}
