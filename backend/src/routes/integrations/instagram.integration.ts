import { Router, Request, Response } from 'express'
import prisma from '../../lib/prisma'
import { authenticateJWT } from '../../lib/middleware/auth.middleware'
import { instagramAnalyticsRouter } from './instagram-analytics.routes'
import { z } from 'zod'

export const instagramIntegrationRouter = Router()

// Mount analytics sub-router first (more specific routes)
instagramIntegrationRouter.use('/instagram/analytics', instagramAnalyticsRouter)

/**
 * POST /api/integrations/instagram
 * Saves or updates Instagram integration for an artist
 * Body: { artistId: string, instagramAccountId: string, username: string, accessToken: string, profile: {...} }
 */
instagramIntegrationRouter.post(
  '/instagram',
  authenticateJWT,
  async (req: Request, res: Response) => {
    try {
      const bodySchema = z.object({
        artistId: z.string(),
        instagramAccountId: z.string(),
        username: z.string(),
        accessToken: z.string(),
        profile: z.object({
          id: z.string(),
          username: z.string(),
          name: z.string().optional(),
          profile_picture_url: z.string().optional(),
          followers_count: z.number().optional(),
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

      const { artistId, instagramAccountId, username, profile } = parsed.data

      // Verify artist exists
      const artist = await prisma.artist.findUnique({
        where: { id: artistId },
      })

      if (!artist) {
        return res.status(404).json({
          ok: false,
          error: 'Artist not found',
        })
      }

      // Save or update Instagram integration
      const integration = await prisma.instagramIntegration.upsert({
        where: { artistId },
        create: {
          artistId,
          instagramAccountId,
          username,
          profileUrl: `https://instagram.com/${username}`,
          profileImageUrl: profile.profile_picture_url,
          followers: profile.followers_count || 0,
          isBusinessAccount: true,
          engagementRate: 0, // Will be calculated from post data
          lastSyncedAt: new Date(),
        },
        update: {
          instagramAccountId,
          username,
          profileImageUrl: profile.profile_picture_url,
          followers: profile.followers_count || 0,
          lastSyncedAt: new Date(),
        },
      })

      return res.json({
        ok: true,
        integration: {
          id: integration.id,
          username: integration.username,
          followers: integration.followers,
          isBusinessAccount: integration.isBusinessAccount,
          engagementRate: integration.engagementRate,
          lastSyncedAt: integration.lastSyncedAt,
        },
      })
    } catch (error: any) {
      console.error('Instagram integration error:', error)
      res.status(500).json({
        ok: false,
        error: 'Failed to save Instagram integration',
        message: error.message,
      })
    }
  }
)

/**
 * GET /api/integrations/instagram/:artistId
 * Returns Instagram connection details for an artist
 */
instagramIntegrationRouter.get('/instagram/:artistId', async (req: Request, res: Response) => {
  try {
    const { artistId } = req.params

    const integration = await prisma.instagramIntegration.findUnique({
      where: { artistId },
      select: {
        id: true,
        instagramAccountId: true,
        username: true,
        profileUrl: true,
        profileImageUrl: true,
        followers: true,
        isBusinessAccount: true,
        engagementRate: true,
        monthlyReach: true,
        monthlyImpressions: true,
        lastSyncedAt: true,
      },
    })

    if (!integration) {
      return res.json({
        ok: true,
        integration: null,
        message: 'No Instagram integration found',
      })
    }

    return res.json({
      ok: true,
      integration,
    })
  } catch (error: any) {
    console.error('Get Instagram integration error:', error)
    res.status(500).json({
      ok: false,
      error: 'Failed to fetch Instagram integration',
      message: error.message,
    })
  }
})

/**
 * POST /api/integrations/instagram/:artistId/sync
 * Syncs Instagram data for an artist
 */
instagramIntegrationRouter.post(
  '/instagram/:artistId/sync',
  authenticateJWT,
  async (req: Request, res: Response) => {
    try {
      const { artistId } = req.params

      const integration = await prisma.instagramIntegration.findUnique({
        where: { artistId },
      })

      if (!integration) {
        return res.json({
          ok: false,
          error: 'No Instagram integration found',
        })
      }

      // Note: In production, you'd use the access token to fetch from Instagram Graph API
      // For now, this endpoint serves as a placeholder

      return res.json({
        ok: true,
        integration: {
          id: integration.id,
          followers: integration.followers,
          monthlyReach: integration.monthlyReach,
          monthlyImpressions: integration.monthlyImpressions,
          engagementRate: integration.engagementRate,
          lastSyncedAt: new Date(),
        },
      })
    } catch (error: any) {
      console.error('Instagram sync error:', error)
      res.status(500).json({
        ok: false,
        error: 'Failed to sync Instagram data',
        message: error.message,
      })
    }
  }
)

/**
 * DELETE /api/integrations/instagram/:artistId
 * Disconnects Instagram account
 */
instagramIntegrationRouter.delete(
  '/instagram/:artistId',
  authenticateJWT,
  async (req: Request, res: Response) => {
    try {
      const { artistId } = req.params

      await prisma.instagramIntegration.delete({
        where: { artistId },
      })

      return res.json({
        ok: true,
        message: 'Instagram disconnected successfully',
      })
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({
          ok: false,
          error: 'No active Instagram connection found',
        })
      }

      console.error('Disconnect Instagram error:', error)
      res.status(500).json({
        ok: false,
        error: 'Failed to disconnect Instagram',
        message: error.message,
      })
    }
  }
)
