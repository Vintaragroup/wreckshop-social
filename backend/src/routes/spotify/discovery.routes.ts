import { Router, Request, Response } from 'express'
import { discoverUsersByMusicAndArtist, DiscoveryFilters } from '../../services/spotify/discovery.service'
import {
  saveDiscoveredUsers,
  queryDiscoveredUsers,
  getDiscoveredUsersByGenre,
  getDiscoveredUsersByArtistType,
  getDiscoveryStats,
} from '../../services/spotify/discovered-user.service'
import { env } from '../../env'

export const spotifyDiscoveryRouter = Router()

/**
 * GET /api/spotify/discover/users
 * Query params:
 *   - genre: music genre (indie, hip-hop, pop, electronic, rock, r&b, country, jazz, metal, latino)
 *   - artistType: artist category (mainstream, underground, indie, emerging)
 *   - maxResults: max number of results (1-200, default 50)
 * 
 * Returns: Array of discovered user profiles with match scores
 */
spotifyDiscoveryRouter.get('/spotify/discover/users', async (req: Request, res: Response) => {
  const { genre, artistType, maxResults } = req.query as {
    genre?: string
    artistType?: string
    maxResults?: string
  }

  // Validate required params
  if (!genre || !artistType) {
    return res.status(400).json({
      ok: false,
      error: 'Missing required query params: genre and artistType',
      example: '/spotify/discover/users?genre=indie&artistType=emerging&maxResults=50',
    })
  }

  try {
    // Get system access token or use user's token if provided
    const accessToken = req.headers.authorization?.replace('Bearer ', '')

    if (!accessToken) {
      return res.status(401).json({
        ok: false,
        error: 'Spotify access token required. Provide via Authorization header.',
      })
    }

    const filters: DiscoveryFilters = {
      musicGenre: genre,
      artistType: artistType,
      maxResults: maxResults ? Math.min(parseInt(maxResults), 200) : 50,
    }

    console.log(`[Discovery] Searching for users: genre=${genre}, artistType=${artistType}`)

    const result = await discoverUsersByMusicAndArtist(filters, accessToken)

    // Persist discovered users to database
    try {
      const savedUsers = await saveDiscoveredUsers(result)
      console.log(`[Discovery] Persisted ${savedUsers.length} users to database`)
    } catch (dbErr: any) {
      console.error('[Discovery] Failed to persist users:', dbErr?.message)
      // Don't fail the request if database persistence fails
    }

    return res.json({
      ok: true,
      data: result,
      message: `Found ${result.usersFound} users matching criteria`,
    })
  } catch (err: any) {
    console.error('[Discovery] Error:', err)
    return res.status(500).json({
      ok: false,
      error: err?.message || 'User discovery failed',
    })
  }
})

/**
 * GET /api/spotify/discover/genres
 * Returns: List of available music genres for search
 */
spotifyDiscoveryRouter.get('/spotify/discover/genres', (req: Request, res: Response) => {
  const genres = [
    { id: 'indie', label: 'Indie', description: 'Independent and alternative music' },
    { id: 'hip-hop', label: 'Hip-Hop', description: 'Hip-hop, rap, and trap' },
    { id: 'pop', label: 'Pop', description: 'Popular and chart-topping music' },
    { id: 'electronic', label: 'Electronic', description: 'Electronic, EDM, house, and techno' },
    { id: 'rock', label: 'Rock', description: 'Rock, hard rock, and classic rock' },
    { id: 'r&b', label: 'R&B', description: 'R&B and soul music' },
    { id: 'country', label: 'Country', description: 'Country and Americana' },
    { id: 'jazz', label: 'Jazz', description: 'Jazz and smooth jazz' },
    { id: 'metal', label: 'Metal', description: 'Metal and subgenres' },
    { id: 'latino', label: 'Latino', description: 'Latin and Latino music' },
  ]

  return res.json({
    ok: true,
    data: genres,
  })
})

/**
 * GET /api/spotify/discover/artist-types
 * Returns: List of available artist types for search
 */
spotifyDiscoveryRouter.get('/spotify/discover/artist-types', (req: Request, res: Response) => {
  const artistTypes = [
    {
      id: 'mainstream',
      label: 'Mainstream',
      description: 'Popular and well-known artists',
    },
    {
      id: 'underground',
      label: 'Underground',
      description: 'Independent and lesser-known artists',
    },
    {
      id: 'indie',
      label: 'Indie',
      description: 'Indie and independent artists',
    },
    {
      id: 'emerging',
      label: 'Emerging',
      description: 'New, rising, and up-and-coming artists',
    },
  ]

  return res.json({
    ok: true,
    data: artistTypes,
  })
})

/**
 * GET /api/spotify/discover/saved
 * Returns: Saved discovered users from database
 * Query params:
 *   - genre: filter by music genre (optional)
 *   - artistType: filter by artist type (optional)
 *   - limit: max results (1-200, default 50)
 *   - offset: pagination offset (default 0)
 *   - minScore: minimum match score (0-100, optional)
 */
spotifyDiscoveryRouter.get('/spotify/discover/saved', async (req: Request, res: Response) => {
  const { genre, artistType, limit, offset, minScore } = req.query as {
    genre?: string
    artistType?: string
    limit?: string
    offset?: string
    minScore?: string
  }

  try {
    const result = await queryDiscoveredUsers({
      genre,
      artistType,
      limit: limit ? parseInt(limit) : 50,
      offset: offset ? parseInt(offset) : 0,
      minMatchScore: minScore ? parseInt(minScore) : undefined,
    })

    return res.json({
      ok: true,
      data: result,
    })
  } catch (err: any) {
    console.error('[Discovery] Error querying saved users:', err)
    return res.status(500).json({
      ok: false,
      error: err?.message || 'Failed to query saved users',
    })
  }
})

/**
 * GET /api/spotify/discover/stats
 * Returns: Statistics about discovered users
 */
spotifyDiscoveryRouter.get('/spotify/discover/stats', async (req: Request, res: Response) => {
  try {
    const stats = await getDiscoveryStats()
    return res.json({
      ok: true,
      data: stats,
    })
  } catch (err: any) {
    console.error('[Discovery] Error getting stats:', err)
    return res.status(500).json({
      ok: false,
      error: err?.message || 'Failed to get discovery stats',
    })
  }
})

/**
 * POST /api/spotify/discover/save-results
 * Manually save discovery results to database
 * Body: { discoveryResult: DiscoveryResult }
 */
spotifyDiscoveryRouter.post('/spotify/discover/save-results', async (req: Request, res: Response) => {
  const { discoveryResult } = req.body

  if (!discoveryResult) {
    return res.status(400).json({
      ok: false,
      error: 'discoveryResult is required in request body',
    })
  }

  try {
    const savedUsers = await saveDiscoveredUsers(discoveryResult)
    return res.json({
      ok: true,
      data: {
        saved: savedUsers.length,
        users: savedUsers,
      },
      message: `Saved ${savedUsers.length} discovered users to database`,
    })
  } catch (err: any) {
    console.error('[Discovery] Error saving results:', err)
    return res.status(500).json({
      ok: false,
      error: err?.message || 'Failed to save discovery results',
    })
  }
})

