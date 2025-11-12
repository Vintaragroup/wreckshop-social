import { Router, Request, Response } from 'express'
import { InstagramConnection } from '../models/instagram-connection'
import { z } from 'zod'
import { spotifyAnalyticsRouter } from './integrations/spotify-analytics.routes'

export const integrations = Router()

// Register Spotify analytics routes
integrations.use('/spotify/analytics', spotifyAnalyticsRouter)

/**
 * POST /api/integrations/instagram/callback
 * Saves Instagram OAuth connection after successful authentication
 * Body: { userId, access_token, user_id, expires_in, user: {...} }
 */
integrations.post('/instagram/callback', async (req: Request, res: Response) => {
  try {
    const bodySchema = z.object({
      userId: z.string(),
      access_token: z.string(),
      user_id: z.string(),
      expires_in: z.number().optional(),
      user: z.object({
        id: z.string(),
        username: z.string(),
        name: z.string().optional(),
        profile_picture_url: z.string().optional(),
        biography: z.string().optional(),
        website: z.string().optional(),
        followers_count: z.number().optional(),
        follows_count: z.number().optional(),
        media_count: z.number().optional(),
      }),
    })

    const parsed = bodySchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        error: 'Invalid request',
        details: parsed.error.flatten(),
      })
    }

    const { userId, access_token, user_id, expires_in, user } = parsed.data

    // Calculate token expiration (60 days from now, or expires_in if provided)
    const tokenExpiresAt = new Date()
    if (expires_in) {
      tokenExpiresAt.setSeconds(tokenExpiresAt.getSeconds() + expires_in)
    } else {
      tokenExpiresAt.setDate(tokenExpiresAt.getDate() + 60)
    }

    // Check if connection already exists
    let connection = await InstagramConnection.findOne({
      instagramUserId: user_id,
    })

    if (connection) {
      // Update existing connection
      connection.userId = userId
      connection.accessToken = access_token
      connection.tokenExpiresAt = tokenExpiresAt
      connection.profile = {
        username: user.username,
        name: user.name || user.username,
        profilePictureUrl: user.profile_picture_url,
        biography: user.biography,
        website: user.website,
        followersCount: user.followers_count || 0,
        followsCount: user.follows_count || 0,
        mediaCount: user.media_count || 0,
      }
      connection.isActive = true
      connection.lastSyncedAt = new Date()
      await connection.save()
    } else {
      // Create new connection
      connection = await InstagramConnection.create({
        userId,
        instagramUserId: user_id,
        accessToken: access_token,
        tokenExpiresAt,
        profile: {
          username: user.username,
          name: user.name || user.username,
          profilePictureUrl: user.profile_picture_url,
          biography: user.biography,
          website: user.website,
          followersCount: user.followers_count || 0,
          followsCount: user.follows_count || 0,
          mediaCount: user.media_count || 0,
        },
        scopes: [
          'instagram_business_basic',
          'instagram_business_content_publish',
          'instagram_business_manage_messages',
        ],
        lastSyncedAt: new Date(),
      })
    }

    return res.json({
      ok: true,
      connection: {
        id: connection._id,
        username: connection.profile.username,
        followers: connection.profile.followersCount,
        connectedAt: connection.connectedAt,
        expiresAt: connection.tokenExpiresAt,
      },
    })
  } catch (error: any) {
    console.error('Instagram callback error:', error)
    res.status(500).json({
      ok: false,
      error: 'Failed to save Instagram connection',
      message: error.message,
    })
  }
})

/**
 * GET /api/integrations
 * Returns all active integrations for a user
 * Query: ?userId=...
 */
integrations.get('/', async (req: Request, res: Response) => {
  try {
    const { userId } = req.query as { userId?: string }

    if (!userId) {
      return res.status(400).json({
        ok: false,
        error: 'userId query parameter required',
      })
    }

    // Get Instagram connections
    const instagramConnection = await InstagramConnection.findOne({
      userId,
      isActive: true,
    }).select('-accessToken')

    return res.json({
      ok: true,
      integrations: {
        instagram: instagramConnection
          ? {
              status: 'connected',
              connectedAccount: instagramConnection.profile.username,
              lastSync: instagramConnection.lastSyncedAt,
              profile: instagramConnection.profile,
              expiresAt: instagramConnection.tokenExpiresAt,
              needsRefresh:
                new Date() >
                new Date(instagramConnection.tokenExpiresAt.getTime() - 10 * 24 * 60 * 60 * 1000), // Within 10 days
            }
          : {
              status: 'disconnected',
              connectedAccount: null,
              lastSync: null,
            },
      },
    })
  } catch (error: any) {
    console.error('Get integrations error:', error)
    res.status(500).json({
      ok: false,
      error: 'Failed to fetch integrations',
      message: error.message,
    })
  }
})

/**
 * GET /api/integrations/instagram/:userId
 * Returns Instagram connection details for a specific user
 */
integrations.get('/instagram/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params

    const connection = await InstagramConnection.findOne({
      userId,
      isActive: true,
    }).select('-accessToken')

    if (!connection) {
      return res.status(404).json({
        ok: false,
        error: 'No active Instagram connection found',
      })
    }

    return res.json({
      ok: true,
      connection: {
        id: connection._id,
        username: connection.profile.username,
        name: connection.profile.name,
        profilePictureUrl: connection.profile.profilePictureUrl,
        biography: connection.profile.biography,
        website: connection.profile.website,
        followers: connection.profile.followersCount,
        following: connection.profile.followsCount,
        mediaCount: connection.profile.mediaCount,
        connectedAt: connection.connectedAt,
        lastSync: connection.lastSyncedAt,
        expiresAt: connection.tokenExpiresAt,
        needsRefresh:
          new Date() >
          new Date(connection.tokenExpiresAt.getTime() - 10 * 24 * 60 * 60 * 1000),
      },
    })
  } catch (error: any) {
    console.error('Get Instagram integration error:', error)
    res.status(500).json({
      ok: false,
      error: 'Failed to fetch Instagram connection',
      message: error.message,
    })
  }
})

/**
 * DELETE /api/integrations/instagram/:userId
 * Disconnects Instagram account
 */
integrations.delete('/instagram/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params

    const result = await InstagramConnection.updateOne(
      { userId, isActive: true },
      { isActive: false }
    )

    if (result.matchedCount === 0) {
      return res.status(404).json({
        ok: false,
        error: 'No active Instagram connection found',
      })
    }

    return res.json({
      ok: true,
      message: 'Instagram disconnected successfully',
    })
  } catch (error: any) {
    console.error('Disconnect Instagram error:', error)
    res.status(500).json({
      ok: false,
      error: 'Failed to disconnect Instagram',
      message: error.message,
    })
  }
})
