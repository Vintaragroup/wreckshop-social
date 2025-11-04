import { spotifyProvider } from '../../providers/spotify.provider'
import { MusicIdentity } from '../../providers/types'

export interface SpotifyUserProfile {
  id: string
  displayName: string
  email: string
  avatarUrl?: string
  profileUrl: string
  followersCount: number
  followingCount: number
  externalUrl: string
}

export interface SpotifyEnrichedData {
  profile: SpotifyUserProfile
  topArtists: Array<{
    id: string
    name: string
    genres: string[]
    popularity: number
    imageUrl?: string
    externalUrl?: string
  }>
  topTracks: Array<{
    id: string
    name: string
    artists: string[]
    popularity: number
    imageUrl?: string
    externalUrl?: string
  }>
  topGenres: string[]
  playlists: Array<{
    id: string
    name: string
    trackCount: number
    isPublic: boolean
    externalUrl?: string
  }>
}

/**
 * Enriches Spotify profile data by fetching comprehensive user information
 * including profile, top artists, tracks, genres, and playlists
 */
export async function enrichSpotifyProfile(
  accessToken: string
): Promise<SpotifyEnrichedData> {
  if (!accessToken) {
    throw new Error('Access token is required')
  }

  try {
    // Fetch user profile
    const profileData = await spotifyGET<{
      id: string
      display_name?: string
      email?: string
      images?: Array<{ url?: string }>
      external_urls?: { spotify?: string }
      followers?: { total?: number }
      following?: { total?: number }
      uri?: string
      href?: string
    }>('/v1/me', accessToken)

    const profile: SpotifyUserProfile = {
      id: profileData.id,
      displayName: profileData.display_name || 'Spotify User',
      email: profileData.email || '',
      avatarUrl: profileData.images?.[0]?.url,
      profileUrl: profileData.external_urls?.spotify || `https://open.spotify.com/user/${profileData.id}`,
      followersCount: profileData.followers?.total || 0,
      followingCount: profileData.following?.total || 0,
      externalUrl: profileData.href || '',
    }

    // Fetch top artists
    const topArtistsData = await spotifyGET<{
      items: Array<{
        id: string
        name: string
        genres?: string[]
        popularity?: number
        images?: Array<{ url?: string }>
        external_urls?: { spotify?: string }
      }>
    }>('/v1/me/top/artists?limit=50&time_range=medium_term', accessToken)

    const topArtists = topArtistsData.items.map((artist) => ({
      id: artist.id,
      name: artist.name,
      genres: artist.genres || [],
      popularity: artist.popularity || 0,
      imageUrl: artist.images?.[0]?.url,
      externalUrl: artist.external_urls?.spotify,
    }))

    // Fetch top tracks
    const topTracksData = await spotifyGET<{
      items: Array<{
        id: string
        name: string
        artists?: Array<{ name: string }>
        popularity?: number
        album?: { images?: Array<{ url?: string }> }
        external_urls?: { spotify?: string }
      }>
    }>('/v1/me/top/tracks?limit=50&time_range=medium_term', accessToken)

    const topTracks = topTracksData.items.map((track) => ({
      id: track.id,
      name: track.name,
      artists: track.artists?.map((a) => a.name) || [],
      popularity: track.popularity || 0,
      imageUrl: track.album?.images?.[0]?.url,
      externalUrl: track.external_urls?.spotify,
    }))

    // Extract unique genres from top artists
    const genreSet = new Set<string>()
    topArtists.forEach((artist) => {
      artist.genres.forEach((genre) => genreSet.add(genre))
    })
    const topGenres = Array.from(genreSet)

    // Fetch playlists
    const playlistsData = await spotifyGET<{
      items: Array<{
        id: string
        name: string
        tracks?: { total?: number }
        public?: boolean
        external_urls?: { spotify?: string }
      }>
    }>('/v1/me/playlists?limit=50', accessToken)

    const playlists = playlistsData.items.map((playlist) => ({
      id: playlist.id,
      name: playlist.name,
      trackCount: playlist.tracks?.total || 0,
      isPublic: playlist.public !== false,
      externalUrl: playlist.external_urls?.spotify,
    }))

    return {
      profile,
      topArtists,
      topTracks,
      topGenres,
      playlists,
    }
  } catch (error) {
    console.error('Error enriching Spotify profile:', error)
    throw new Error(`Failed to enrich Spotify profile: ${(error as Error).message}`)
  }
}

/**
 * Makes a GET request to Spotify API
 */
async function spotifyGET<T>(path: string, accessToken: string): Promise<T> {
  const res = await fetch(`https://api.spotify.com${path}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Spotify API ${path} failed: ${res.status} ${res.statusText} ${text}`)
  }

  return (await res.json()) as T
}

/**
 * Enriches a profile in the database with Spotify data
 * Should be called after user connects their Spotify account
 */
export async function enrichProfileWithSpotify(
  userId: string,
  accessToken: string,
  _database?: any // For DI in tests
): Promise<any> {
  const enrichedData = await enrichSpotifyProfile(accessToken)

  // TODO: Update database with enriched data
  // This would typically:
  // 1. Find or create profile document for user
  // 2. Add/update Spotify identity with enrichedData.profile
  // 3. Store top artists as artistAffinity
  // 4. Store top tracks
  // 5. Store top genres as interestTags
  // 6. Link playlists

  return {
    success: true,
    data: enrichedData,
    userId,
  }
}
