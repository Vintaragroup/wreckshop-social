import { Router, Request, Response } from 'express'
import { authenticateJWT } from '../../lib/middleware/auth.middleware'
import { tiktokAnalyticsRouter } from './tiktok-analytics.routes'
import { z } from 'zod'
import prisma from '../../lib/prisma'

export const tiktokIntegrationRouter = Router()

// Mount analytics sub-router first
tiktokIntegrationRouter.use('/tiktok/analytics', tiktokAnalyticsRouter)

/**
 * POST /api/integrations/tiktok
 * Saves TikTok integration
 */
tiktokIntegrationRouter.post(
  '/tiktok',
  authenticateJWT,
  async (req: Request, res: Response) => {
    try {
      const bodySchema = z.object({
        artistId: z.string(),
        creatorId: z.string(),
        username: z.string(),
        accessToken: z.string(),
        profileImageUrl: z.string().optional(),
        followers: z.number().optional(),
      })

      const parsed = bodySchema.safeParse(req.body)
      if (!parsed.success) {
        return res.status(400).json({
          ok: false,
          error: 'Invalid request',
          details: parsed.error.flatten(),
        })
      }

      const { artistId, creatorId, username, accessToken, profileImageUrl, followers } = parsed.data

      // Upsert TikTok integration in database
      const integration = await prisma.tikTokIntegration.upsert({
        where: { artistId },
        create: {
          artistId,
          tiktokUserId: creatorId,
          username,
          accessToken,
          profileImageUrl: profileImageUrl || null,
          followers: followers || 0,
          profileUrl: `https://www.tiktok.com/@${username}`,
        },
        update: {
          tiktokUserId: creatorId,
          username,
          accessToken,
          profileImageUrl: profileImageUrl || null,
          followers: followers || 0,
          profileUrl: `https://www.tiktok.com/@${username}`,
          updatedAt: new Date(),
        },
      })

      return res.json({
        ok: true,
        integration: {
          id: integration.id,
          artistId: integration.artistId,
          creatorId: integration.tiktokUserId,
          username: integration.username,
          followers: integration.followers,
          connectedAt: integration.createdAt,
        },
      })
    } catch (error: any) {
      console.error('TikTok integration error:', error)
      res.status(500).json({
        ok: false,
        error: 'Failed to save TikTok integration',
        message: error.message,
      })
    }
  }
)

/**
 * GET /api/integrations/tiktok/:artistId
 */
tiktokIntegrationRouter.get('/tiktok/:artistId', async (req: Request, res: Response) => {
  try {
    const { artistId } = req.params

    const integration = await prisma.tikTokIntegration.findUnique({
      where: { artistId },
      select: {
        id: true,
        tiktokUserId: true,
        username: true,
        followers: true,
        profileImageUrl: true,
        profileUrl: true,
        createdAt: true,
      },
    })

    if (!integration) {
      return res.status(404).json({
        ok: false,
        error: 'No TikTok integration found',
      })
    }

    return res.json({
      ok: true,
      integration,
    })
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      error: 'Failed to fetch TikTok connection',
      message: error.message,
    })
  }
})

/**
 * DELETE /api/integrations/tiktok/:artistId
 */
tiktokIntegrationRouter.delete('/tiktok/:artistId', async (req: Request, res: Response) => {
  try {
    const { artistId } = req.params

    const integration = await prisma.tikTokIntegration.findUnique({
      where: { artistId },
    })

    if (!integration) {
      return res.status(404).json({
        ok: false,
        error: 'No TikTok integration found to delete',
      })
    }

    await prisma.tikTokIntegration.delete({
      where: { artistId },
    })

    return res.json({
      ok: true,
      message: 'TikTok disconnected successfully',
    })
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      error: 'Failed to disconnect TikTok',
      message: error.message,
    })
  }
})
