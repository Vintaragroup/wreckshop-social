import { Router, Request, Response } from 'express'
import { discoverUsersByMusicAndArtist, DiscoveryFilters } from '../../services/spotify/discovery.service'
import {
  saveDiscoveredUsers,
  queryDiscoveredUsers,
  getDiscoveredUsersByGenre,
  getDiscoveredUsersByArtistType,
  getDiscoveryStats,
} from '../../services/spotify/discovered-user.service'
import { GeolocationService } from '../../services/geolocation.service'
import DiscoveredUserModel from '../../models/discovered-user'
import SegmentModel from '../../models/segment'
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

/**
 * POST /api/spotify/discover/create-segment
 * Create an audience segment from discovered users
 * Body: { 
 *   name: string, 
 *   filters: { 
 *     genres?: string[], 
 *     artistTypes?: string[], 
 *     minScore?: number,
 *     countries?: string[],
 *     states?: string[],
 *     cities?: string[],
 *     timezone?: string[],
 *     geoRadius?: { centerLat: number, centerLng: number, radiusKm: number }
 *   }, 
 *   ownerProfileId?: string 
 * }
 */
spotifyDiscoveryRouter.post(
  '/spotify/discover/create-segment',
  async (req: Request, res: Response) => {
    const { name, filters, ownerProfileId } = req.body

    if (!name) {
      return res.status(400).json({
        ok: false,
        error: 'Segment name is required',
      })
    }

    try {
      // Build query using GeolocationService for combined music + geo filters
      const query = GeolocationService.buildCombinedQuery(
        {
          genres: filters?.genres,
          artistTypes: filters?.artistTypes,
          minScore: filters?.minScore,
        },
        {
          countries: filters?.countries,
          states: filters?.states,
          cities: filters?.cities,
          timezone: filters?.timezone,
          geoRadius: filters?.geoRadius,
        }
      )

      // Count matching users
      const count = await DiscoveredUserModel.countDocuments(query)

      // Determine geographic scope
      let geographicScope = 'global'
      if (filters?.geoRadius) geographicScope = 'radius'
      else if (filters?.cities?.length > 0) geographicScope = 'city'
      else if (filters?.states?.length > 0) geographicScope = 'state'
      else if (filters?.countries?.length > 0) geographicScope = 'country'

      // Build description
      const parts = []
      if (filters?.genres?.length > 0) parts.push(`Genres: ${filters.genres.join(', ')}`)
      if (filters?.artistTypes?.length > 0) parts.push(`Artist Types: ${filters.artistTypes.join(', ')}`)
      if (filters?.countries?.length > 0) parts.push(`Countries: ${filters.countries.join(', ')}`)
      if (filters?.states?.length > 0) parts.push(`States: ${filters.states.join(', ')}`)
      if (filters?.cities?.length > 0) parts.push(`Cities: ${filters.cities.join(', ')}`)
      if (filters?.timezone?.length > 0) parts.push(`Timezones: ${filters.timezone.join(', ')}`)
      if (filters?.geoRadius)
        parts.push(
          `Radius: ${filters.geoRadius.radiusKm}km from (${filters.geoRadius.centerLat}, ${filters.geoRadius.centerLng})`
        )
      if (filters?.minScore) parts.push(`Min Score: ${filters.minScore}%`)

      const description =
        parts.length > 0 ? `Discovered users segment - ${parts.join(' | ')}` : 'Discovered users segment'

      // Create and save segment to database
      const segment = await SegmentModel.create({
        name,
        description,
        ownerProfileId: ownerProfileId || null,
        query: {
          type: 'discovered-user',
          filters: {
            genres: filters?.genres || [],
            artistTypes: filters?.artistTypes || [],
            minScore: filters?.minScore || 0,
            countries: filters?.countries || [],
            states: filters?.states || [],
            cities: filters?.cities || [],
            timezone: filters?.timezone || [],
            geoRadius: filters?.geoRadius || null,
          },
        },
        tags: [
          'discovered-users',
          ...(filters?.genres || []),
          ...(filters?.artistTypes || []),
          ...(filters?.countries || []),
          ...(filters?.states || []),
          ...(filters?.cities || []),
        ],
        estimatedCount: count,
        geographicScope,
      })

      return res.json({
        ok: true,
        data: {
          id: segment._id,
          name: segment.name,
          filters,
          userCount: count,
          geographicScope,
          createdAt: segment.createdAt,
        },
        message: `Created segment "${name}" with ${count} users (${geographicScope} scope)`,
      })
    } catch (err: any) {
      console.error('[Discovery] Error creating segment:', err)
      return res.status(500).json({
        ok: false,
        error: err?.message || 'Failed to create segment',
      })
    }
  }
)


/**
 * GET /api/spotify/discover/segment-suggestions
 * Get automatic segment suggestions based on discovered users
 */
spotifyDiscoveryRouter.get('/spotify/discover/segment-suggestions', async (req: Request, res: Response) => {
  try {
    const stats = await getDiscoveryStats()

    // Create suggestions based on distribution
    const suggestions = [
      {
        name: 'High-Engagement Fans',
        description: 'Users with 80%+ match score',
        filters: { minScore: 80 },
      },
      {
        name: 'Genre Specialists',
        description: 'Users focused on a single genre',
        filters: {},
        note: 'Can be refined by genre',
      },
      {
        name: 'Emerging Artist Fans',
        description: 'Users interested in emerging artists',
        filters: { artistTypes: ['emerging'] },
      },
      {
        name: 'Underground Enthusiasts',
        description: 'Users into underground music scene',
        filters: { artistTypes: ['underground'] },
      },
      {
        name: 'Mainstream Listeners',
        description: 'Users with mainstream music preferences',
        filters: { artistTypes: ['mainstream'] },
      },
      ...Object.keys(stats.byGenre).map((genre) => ({
        name: `${genre.charAt(0).toUpperCase() + genre.slice(1)} Fans`,
        description: `${stats.byGenre[genre]} users interested in ${genre} music`,
        filters: { genres: [genre] },
      })),
    ]

    return res.json({
      ok: true,
      data: suggestions,
    })
  } catch (err: any) {
    console.error('[Discovery] Error getting suggestions:', err)
    return res.status(500).json({
      ok: false,
      error: err?.message || 'Failed to get segment suggestions',
    })
  }
})

/**
 * GET /api/spotify/discover/segments
 * List all discovered user segments
 */
spotifyDiscoveryRouter.get('/spotify/discover/segments', async (req: Request, res: Response) => {
  try {
    const segments = await SegmentModel.find({
      'query.type': 'discovered-user',
    })
      .sort({ createdAt: -1 })
      .lean()

    return res.json({
      ok: true,
      data: segments,
    })
  } catch (err: any) {
    console.error('[Discovery] Error listing segments:', err)
    return res.status(500).json({
      ok: false,
      error: err?.message || 'Failed to list segments',
    })
  }
})

/**
 * GET /api/spotify/discover/segments/:id
 * Get a discovered user segment and its users
 */
spotifyDiscoveryRouter.get('/spotify/discover/segments/:id', async (req: Request, res: Response) => {
  try {
    const segment = await SegmentModel.findById(req.params.id)
    if (!segment) {
      return res.status(404).json({
        ok: false,
        error: 'Segment not found',
      })
    }

    // Check if this is a discovered-user segment
    const queryData = segment.query as any
    if (queryData?.type !== 'discovered-user') {
      return res.status(400).json({
        ok: false,
        error: 'This segment type is not supported for discovered users',
      })
    }

    // Build MongoDB query from segment filters
    const mongoQuery: any = {}
    const filters = queryData.filters || {}

    if (filters.genres && filters.genres.length > 0) {
      mongoQuery['discoveredVia.musicGenre'] = { $in: filters.genres }
    }

    if (filters.artistTypes && filters.artistTypes.length > 0) {
      mongoQuery['discoveredVia.artistType'] = { $in: filters.artistTypes }
    }

    if (filters.minScore && filters.minScore > 0) {
      mongoQuery.matchScore = { $gte: filters.minScore }
    }

    // Get users in this segment
    const users = await DiscoveredUserModel.find(mongoQuery)
      .select('spotifyId displayName email genres matchScore discoveredVia')
      .limit(10000)
      .lean()

    return res.json({
      ok: true,
      data: {
        segment,
        users,
        userCount: users.length,
      },
    })
  } catch (err: any) {
    console.error('[Discovery] Error getting segment:', err)
    return res.status(500).json({
      ok: false,
      error: err?.message || 'Failed to get segment',
    })
  }
})

/**
 * DELETE /api/spotify/discover/segments/:id
 * Delete a discovered user segment
 */
spotifyDiscoveryRouter.delete('/spotify/discover/segments/:id', async (req: Request, res: Response) => {
  try {
    const segment = await SegmentModel.findByIdAndDelete(req.params.id)
    if (!segment) {
      return res.status(404).json({
        ok: false,
        error: 'Segment not found',
      })
    }

    return res.json({
      ok: true,
      message: `Deleted segment "${segment.name}"`,
    })
  } catch (err: any) {
    console.error('[Discovery] Error deleting segment:', err)
    return res.status(500).json({
      ok: false,
      error: err?.message || 'Failed to delete segment',
    })
  }
})

/**
 * GET /api/spotify/discover/geo/countries
 * Get list of countries with discovered users
 */
spotifyDiscoveryRouter.get('/spotify/discover/geo/countries', async (req: Request, res: Response) => {
  try {
    const countries = await DiscoveredUserModel.distinct('location.country')
    const countryNames = await DiscoveredUserModel.distinct('location.countryName')

    const countryData = GeolocationService.getCountries().filter(c =>
      countries.includes(c.code)
    )

    return res.json({
      ok: true,
      data: countryData,
    })
  } catch (err: any) {
    console.error('[Discovery] Error getting countries:', err)
    return res.status(500).json({
      ok: false,
      error: err?.message || 'Failed to get countries',
    })
  }
})

/**
 * GET /api/spotify/discover/geo/states?country=US
 * Get states for a specific country with discovered users
 */
spotifyDiscoveryRouter.get('/spotify/discover/geo/states', async (req: Request, res: Response) => {
  try {
    const { country } = req.query

    if (!country) {
      return res.status(400).json({
        ok: false,
        error: 'Country code is required',
      })
    }

    const states = await DiscoveredUserModel.distinct('location.state', {
      'location.country': country,
    })

    let stateOptions: Array<{ code: string; name: string }> = []

    if (country === 'US') {
      stateOptions = GeolocationService.getUSStates().filter(s => states.includes(s.code))
    } else {
      stateOptions = states.map((s: any) => ({ code: s, name: s }))
    }

    return res.json({
      ok: true,
      data: stateOptions,
    })
  } catch (err: any) {
    console.error('[Discovery] Error getting states:', err)
    return res.status(500).json({
      ok: false,
      error: err?.message || 'Failed to get states',
    })
  }
})

/**
 * GET /api/spotify/discover/geo/cities?country=US&state=TX
 * Get cities for a specific country/state with discovered users
 */
spotifyDiscoveryRouter.get('/spotify/discover/geo/cities', async (req: Request, res: Response) => {
  try {
    const { country, state } = req.query

    const query: any = {}
    if (country) query['location.country'] = country
    if (state) query['location.state'] = state

    const cities = await DiscoveredUserModel.distinct('location.city', query)

    const cityData = (cities as any[])
      .filter((c: any): c is string => Boolean(c))
      .sort()
      .map((city: string) => ({
        name: city,
        count: 0, // Would need aggregation for actual counts
      }))

    return res.json({
      ok: true,
      data: cityData,
    })
  } catch (err: any) {
    console.error('[Discovery] Error getting cities:', err)
    return res.status(500).json({
      ok: false,
      error: err?.message || 'Failed to get cities',
    })
  }
})

/**
 * GET /api/spotify/discover/geo/timezones
 * Get timezones with discovered users
 */
spotifyDiscoveryRouter.get('/spotify/discover/geo/timezones', async (req: Request, res: Response) => {
  try {
    const timezones = await DiscoveredUserModel.distinct('location.timezone')

    const timezoneData = GeolocationService.getCommonTimezones().filter(tz =>
      timezones.includes(tz.id)
    )

    return res.json({
      ok: true,
      data: timezoneData,
    })
  } catch (err: any) {
    console.error('[Discovery] Error getting timezones:', err)
    return res.status(500).json({
      ok: false,
      error: err?.message || 'Failed to get timezones',
    })
  }
})

/**
 * GET /api/spotify/discover/geo/analytics
 * Get geographic analytics about discovered users
 */
spotifyDiscoveryRouter.get('/spotify/discover/geo/analytics', async (req: Request, res: Response) => {
  try {
    const totalUsers = await DiscoveredUserModel.countDocuments()

    // Top countries
    const topCountries = await DiscoveredUserModel.aggregate([
      { $group: { _id: '$location.country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ])

    // Top states
    const topStates = await DiscoveredUserModel.aggregate([
      {
        $group: {
          _id: { country: '$location.country', state: '$location.state' },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ])

    // Top cities
    const topCities = await DiscoveredUserModel.aggregate([
      {
        $group: {
          _id: { country: '$location.country', city: '$location.city' },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 15 },
    ])

    // Timezone distribution
    const timezoneDistribution = await DiscoveredUserModel.aggregate([
      { $group: { _id: '$location.timezone', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])

    return res.json({
      ok: true,
      data: {
        totalUsers,
        topCountries: topCountries.map((c: any) => ({
          country: c._id,
          count: c.count,
          percentage: ((c.count / totalUsers) * 100).toFixed(2),
        })),
        topStates: topStates.map((s: any) => ({
          country: s._id.country,
          state: s._id.state,
          count: s.count,
          percentage: ((s.count / totalUsers) * 100).toFixed(2),
        })),
        topCities: topCities.map((c: any) => ({
          country: c._id.country,
          city: c._id.city,
          count: c.count,
          percentage: ((c.count / totalUsers) * 100).toFixed(2),
        })),
        timezoneDistribution: timezoneDistribution.map((t: any) => ({
          timezone: t._id,
          count: t.count,
          percentage: ((t.count / totalUsers) * 100).toFixed(2),
        })),
      },
    })
  } catch (err: any) {
    console.error('[Discovery] Error getting geo analytics:', err)
    return res.status(500).json({
      ok: false,
      error: err?.message || 'Failed to get geographic analytics',
    })
  }
})



