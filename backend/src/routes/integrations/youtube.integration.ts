import { Router, Request, Response } from 'express'
import { authenticateJWT } from '../../lib/middleware/auth.middleware'
import { youtubeAnalyticsRouter } from './youtube-analytics.routes'
import { z } from 'zod'

export const youtubeIntegrationRouter = Router()

// Mount analytics sub-router first (more specific routes)
youtubeIntegrationRouter.use('/youtube/analytics', youtubeAnalyticsRouter)

/**
 * POST /api/integrations/youtube
 * Saves or updates YouTube integration for an artist
 * Body: { artistId: string, channelId: string, accessToken: string, refreshToken?: string }
 */
youtubeIntegrationRouter.post(
  '/youtube',
  authenticateJWT,
  async (req: Request, res: Response) => {
    try {
      const bodySchema = z.object({
        artistId: z.string(),
        channelId: z.string(),
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

      const { artistId, channelId } = parsed.data

      // TODO: Validate channel access and fetch channel details from YouTube API
      // TODO: Save to database when schema is ready

      return res.json({
        ok: true,
        integration: {
          id: `yt_${channelId}`,
          artistId,
          youtubeChannelId: channelId,
          connectedAt: new Date(),
        },
      })
    } catch (error: any) {
      console.error('YouTube integration error:', error)
      res.status(500).json({
        ok: false,
        error: 'Failed to save YouTube integration',
        message: error.message,
      })
    }
  }
)

/**
 * GET /api/integrations/youtube/:artistId
 * Returns YouTube connection details for an artist
 */
youtubeIntegrationRouter.get('/youtube/:artistId', async (req: Request, res: Response) => {
  try {
    const { artistId } = req.params

    // TODO: Fetch from database when schema is ready

    return res.status(404).json({
      ok: false,
      error: 'No YouTube integration found',
    })
  } catch (error: any) {
    console.error('Get YouTube integration error:', error)
    res.status(500).json({
      ok: false,
      error: 'Failed to fetch YouTube connection',
      message: error.message,
    })
  }
})

/**
 * DELETE /api/integrations/youtube/:artistId
 * Disconnects YouTube account
 */
youtubeIntegrationRouter.delete('/youtube/:artistId', async (req: Request, res: Response) => {
  try {
    const { artistId } = req.params

    // TODO: Delete from database when schema is ready

    return res.json({
      ok: true,
      message: 'YouTube disconnected successfully',
    })
  } catch (error: any) {
    console.error('Disconnect YouTube error:', error)
    res.status(500).json({
      ok: false,
      error: 'Failed to disconnect YouTube',
      message: error.message,
    })
  }
})
