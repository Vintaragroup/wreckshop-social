import { Router, Request, Response } from 'express'
import prisma from '../../lib/prisma'
import { authenticateJWT } from '../../lib/middleware/auth.middleware'
import { enrichSpotifyProfile, SpotifyEnrichedData } from '../../services/spotify/enrichment.service'
import { spotifyAnalyticsRouter } from './spotify-analytics.routes'
import { z } from 'zod'

export const spotifyIntegrationRouter = Router()

// Mount analytics sub-router first (more specific routes)
spotifyIntegrationRouter.use('/spotify/analytics', spotifyAnalyticsRouter)

/**
 * POST /api/integrations/spotify
 * Saves or updates Spotify integration for an artist
 * Body: { artistId: string, accessToken: string, refreshToken?: string }
 */
spotifyIntegrationRouter.post(
  '/spotify',
  authenticateJWT,
  async (req: Request, res: Response) => {
    try {
      const bodySchema = z.object({
        artistId: z.string(),
        accessToken: z.string(),
        refreshToken: z.string().optional(),
      })

      const parsed = bodySchema.safeParse(req.body)
      if (!parsed.success) {
        return res.status(400).json({
          ok: false,
          error: 'Invalid request',
          details: parsed.error.flatten(),
        })
      }

      const { artistId, accessToken, refreshToken } = parsed.data

      // Verify artist exists and user owns it
      const artist = await prisma.artist.findUnique({
        where: { id: artistId },
      })

      if (!artist) {
        return res.status(404).json({
          ok: false,
          error: 'Artist not found',
        })
      }

      // Enrich Spotify profile with token
      const enrichedData = await enrichSpotifyProfile(accessToken)

      // Save or update Spotify integration
      const integration = await prisma.spotifyIntegration.upsert({
        where: { artistId },
        create: {
          artistId,
          spotifyAccountId: enrichedData.profile.id,
          displayName: enrichedData.profile.displayName,
          profileUrl: enrichedData.profile.profileUrl,
          profileImageUrl: enrichedData.profile.avatarUrl,
          followers: enrichedData.profile.followersCount,
          isArtistAccount: enrichedData.profile.followersCount > 100, // Heuristic
          genres: enrichedData.topGenres.slice(0, 5),
          monthlyListeners: enrichedData.topGenres.length > 0 ? 0 : 0, // Will be synced
          totalStreams: 0,
          lastSyncedAt: new Date(),
        },
        update: {
          spotifyAccountId: enrichedData.profile.id,
          displayName: enrichedData.profile.displayName,
          profileUrl: enrichedData.profile.profileUrl,
          profileImageUrl: enrichedData.profile.avatarUrl,
          followers: enrichedData.profile.followersCount,
          genres: enrichedData.topGenres.slice(0, 5),
          lastSyncedAt: new Date(),
        },
      })

      return res.json({
        ok: true,
        integration: {
          id: integration.id,
          spotifyAccountId: integration.spotifyAccountId,
          displayName: integration.displayName,
          followers: integration.followers,
          monthlyListeners: integration.monthlyListeners,
          totalStreams: integration.totalStreams,
          genres: integration.genres,
          profileUrl: integration.profileUrl,
          lastSyncedAt: integration.lastSyncedAt,
        },
      })
    } catch (error: any) {
      console.error('Spotify integration error:', error)
      res.status(500).json({
        ok: false,
        error: 'Failed to save Spotify integration',
        message: error.message,
      })
    }
  }
)

/**
 * GET /api/integrations/status/:artistId
 * Returns status of all integrations (Spotify + Instagram) for an artist
 */
spotifyIntegrationRouter.get('/status/:artistId', async (req: Request, res: Response) => {
  try {
    const { artistId } = req.params

    const [spotifyIntegration, instagramIntegration] = await Promise.all([
      prisma.spotifyIntegration.findUnique({
        where: { artistId },
        select: {
          id: true,
          spotifyAccountId: true,
          displayName: true,
          profileImageUrl: true,
          followers: true,
          monthlyListeners: true,
          totalStreams: true,
          genres: true,
          lastSyncedAt: true,
        },
      }),
      prisma.instagramIntegration.findUnique({
        where: { artistId },
        select: {
          id: true,
          instagramAccountId: true,
          username: true,
          profileImageUrl: true,
          followers: true,
          engagementRate: true,
          isBusinessAccount: true,
          lastSyncedAt: true,
        },
      }),
    ])

    return res.json({
      ok: true,
      integrations: {
        spotify: spotifyIntegration
          ? {
              connected: true,
              ...spotifyIntegration,
            }
          : {
              connected: false,
            },
        instagram: instagramIntegration
          ? {
              connected: true,
              ...instagramIntegration,
            }
          : {
              connected: false,
            },
      },
    })
  } catch (error: any) {
    console.error('Get integration status error:', error)
    res.status(500).json({
      ok: false,
      error: 'Failed to fetch integration status',
      message: error.message,
    })
  }
})

/**
 * GET /api/integrations/spotify/:artistId
 * Returns Spotify connection details for an artist
 */
spotifyIntegrationRouter.get('/spotify/:artistId', async (req: Request, res: Response) => {
  try {
    const { artistId } = req.params

    const integration = await prisma.spotifyIntegration.findUnique({
      where: { artistId },
      select: {
        id: true,
        spotifyAccountId: true,
        displayName: true,
        profileUrl: true,
        profileImageUrl: true,
        followers: true,
        monthlyListeners: true,
        totalStreams: true,
        genres: true,
        isArtistAccount: true,
        lastSyncedAt: true,
      },
    })

    if (!integration) {
      return res.status(404).json({
        ok: false,
        error: 'No Spotify integration found',
      })
    }

    return res.json({
      ok: true,
      integration,
    })
  } catch (error: any) {
    console.error('Get Spotify integration error:', error)
    res.status(500).json({
      ok: false,
      error: 'Failed to fetch Spotify integration',
      message: error.message,
    })
  }
})

/**
 * POST /api/integrations/spotify/:artistId/sync
 * Syncs Spotify data for an artist
 * Requires access token to be stored (for now, uses existing enrichment)
 */
spotifyIntegrationRouter.post(
  '/spotify/:artistId/sync',
  authenticateJWT,
  async (req: Request, res: Response) => {
    try {
      const { artistId } = req.params

      const integration = await prisma.spotifyIntegration.findUnique({
        where: { artistId },
      })

      if (!integration) {
        return res.status(404).json({
          ok: false,
          error: 'No Spotify integration found',
        })
      }

      // Note: In production, you'd need to store the access token securely
      // For now, this endpoint serves as a placeholder that can be called
      // from a scheduled job once tokens are stored

      return res.json({
        ok: true,
        integration: {
          id: integration.id,
          followers: integration.followers,
          monthlyListeners: integration.monthlyListeners,
          totalStreams: integration.totalStreams,
          lastSyncedAt: new Date(),
        },
      })
    } catch (error: any) {
      console.error('Spotify sync error:', error)
      res.status(500).json({
        ok: false,
        error: 'Failed to sync Spotify data',
        message: error.message,
      })
    }
  }
)

/**
 * DELETE /api/integrations/spotify/:artistId
 * Disconnects Spotify account
 */
spotifyIntegrationRouter.delete(
  '/spotify/:artistId',
  authenticateJWT,
  async (req: Request, res: Response) => {
    try {
      const { artistId } = req.params

      await prisma.spotifyIntegration.delete({
        where: { artistId },
      })

      return res.json({
        ok: true,
        message: 'Spotify disconnected successfully',
      })
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({
          ok: false,
          error: 'No active Spotify connection found',
        })
      }

      console.error('Disconnect Spotify error:', error)
      res.status(500).json({
        ok: false,
        error: 'Failed to disconnect Spotify',
        message: error.message,
      })
    }
  }
)
