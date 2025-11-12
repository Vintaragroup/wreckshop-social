import { Router, Request, Response } from 'express'
import { authenticateJWT } from '../../lib/middleware/auth.middleware'
import { tiktokAnalyticsRouter } from './tiktok-analytics.routes'
import { z } from 'zod'

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
      })

      const parsed = bodySchema.safeParse(req.body)
      if (!parsed.success) {
        return res.status(400).json({
          ok: false,
          error: 'Invalid request',
          details: parsed.error.flatten(),
        })
      }

      // TODO: Save to database when schema is ready
      return res.json({
        ok: true,
        integration: {
          id: `tt_${req.body.creatorId}`,
          artistId: req.body.artistId,
          creatorId: req.body.creatorId,
          connectedAt: new Date(),
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
    // TODO: Fetch from database
    return res.status(404).json({
      ok: false,
      error: 'No TikTok integration found',
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
    // TODO: Delete from database
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
