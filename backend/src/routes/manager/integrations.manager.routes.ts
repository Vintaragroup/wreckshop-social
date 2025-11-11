/**
 * Integration Manager Routes
 * 
 * Routes for managers to manage platform integrations for their artists
 * Handles: Spotify, Instagram, YouTube, TikTok
 */

import { Router, Request, Response } from 'express';
import { authenticateJWT, requireManagerAccess } from '../../lib/middleware/auth.middleware';
import { prisma } from '../../lib/prisma';

export const integrationManagerRoutes = Router();

/**
 * GET /api/manager/artists/:artistId/integrations
 * 
 * List all platform integrations for a managed artist
 * Requires viewAnalytics permission
 * 
 * Response:
 * {
 *   ok: true,
 *   data: {
 *     spotify?: { spotifyAccountId, displayName, followers, monthlyListeners, lastSyncedAt },
 *     instagram?: { instagramAccountId, username, followers, engagementRate, lastSyncedAt },
 *     youtube?: { youtubeChannelId, channelTitle, subscribers, totalViews, lastSyncedAt },
 *     tiktok?: { tiktokUserId, username, followers, lastSyncedAt }
 *   }
 * }
 */
integrationManagerRoutes.get(
  '/manager/artists/:artistId/integrations',
  authenticateJWT,
  requireManagerAccess('viewAnalytics'),
  async (req: Request, res: Response) => {
    try {
      const { artistId } = req.params;

      // Fetch all integrations for the artist
      const [spotify, instagram, youtube, tiktok] = await Promise.all([
        prisma.spotifyIntegration.findFirst({
          where: { artistId },
          select: {
            spotifyAccountId: true,
            displayName: true,
            followers: true,
            monthlyListeners: true,
            lastSyncedAt: true,
          },
        }),
        prisma.instagramIntegration.findFirst({
          where: { artistId },
          select: {
            instagramAccountId: true,
            username: true,
            followers: true,
            engagementRate: true,
            lastSyncedAt: true,
          },
        }),
        prisma.youtubeIntegration.findFirst({
          where: { artistId },
          select: {
            youtubeChannelId: true,
            channelTitle: true,
            subscribers: true,
            totalViews: true,
            lastSyncedAt: true,
          },
        }),
        prisma.tikTokIntegration.findFirst({
          where: { artistId },
          select: {
            tiktokUserId: true,
            username: true,
            followers: true,
            lastSyncedAt: true,
          },
        }),
      ]);

      const data: any = {};
      if (spotify) data.spotify = spotify;
      if (instagram) data.instagram = instagram;
      if (youtube) data.youtube = youtube;
      if (tiktok) data.tiktok = tiktok;

      res.json({ ok: true, data });
    } catch (error) {
      console.error('[integration-manager] Error fetching integrations:', error);
      res.status(500).json({ ok: false, error: 'Internal server error' });
    }
  }
);

/**
 * GET /api/manager/artists/:artistId/integrations/spotify
 * 
 * Get detailed Spotify integration for a managed artist
 * Requires viewAnalytics permission
 * 
 * Response:
 * {
 *   ok: true,
 *   data: {
 *     spotifyAccountId: string,
 *     displayName: string,
 *     followers: number,
 *     monthlyListeners: number,
 *     lastSyncedAt: string
 *   }
 * }
 */
integrationManagerRoutes.get(
  '/manager/artists/:artistId/integrations/spotify',
  authenticateJWT,
  requireManagerAccess('viewAnalytics'),
  async (req: Request, res: Response) => {
    try {
      const { artistId } = req.params;

      const integration = await prisma.spotifyIntegration.findFirst({
        where: { artistId },
      });

      if (!integration) {
        return res.status(404).json({
          ok: false,
          error: 'Spotify integration not found',
        });
      }

      res.json({
        ok: true,
        data: {
          spotifyAccountId: integration.spotifyAccountId,
          displayName: integration.displayName,
          followers: integration.followers,
          monthlyListeners: integration.monthlyListeners,
          lastSyncedAt: integration.lastSyncedAt?.toISOString(),
        },
      });
    } catch (error) {
      console.error('[integration-manager] Error fetching Spotify integration:', error);
      res.status(500).json({ ok: false, error: 'Internal server error' });
    }
  }
);

/**
 * GET /api/manager/artists/:artistId/integrations/instagram
 * 
 * Get detailed Instagram integration for a managed artist
 */
integrationManagerRoutes.get(
  '/manager/artists/:artistId/integrations/instagram',
  authenticateJWT,
  requireManagerAccess('viewAnalytics'),
  async (req: Request, res: Response) => {
    try {
      const { artistId } = req.params;

      const integration = await prisma.instagramIntegration.findFirst({
        where: { artistId },
      });

      if (!integration) {
        return res.status(404).json({
          ok: false,
          error: 'Instagram integration not found',
        });
      }

      res.json({
        ok: true,
        data: {
          instagramAccountId: integration.instagramAccountId,
          username: integration.username,
          followers: integration.followers,
          engagementRate: integration.engagementRate,
          lastSyncedAt: integration.lastSyncedAt?.toISOString(),
        },
      });
    } catch (error) {
      console.error('[integration-manager] Error fetching Instagram integration:', error);
      res.status(500).json({ ok: false, error: 'Internal server error' });
    }
  }
);

/**
 * GET /api/manager/artists/:artistId/integrations/youtube
 * 
 * Get detailed YouTube integration for a managed artist
 */
integrationManagerRoutes.get(
  '/manager/artists/:artistId/integrations/youtube',
  authenticateJWT,
  requireManagerAccess('viewAnalytics'),
  async (req: Request, res: Response) => {
    try {
      const { artistId } = req.params;

      const integration = await prisma.youtubeIntegration.findFirst({
        where: { artistId },
      });

      if (!integration) {
        return res.status(404).json({
          ok: false,
          error: 'YouTube integration not found',
        });
      }

      res.json({
        ok: true,
        data: {
          youtubeChannelId: integration.youtubeChannelId,
          channelTitle: integration.channelTitle,
          subscribers: integration.subscribers,
          totalViews: integration.totalViews,
          lastSyncedAt: integration.lastSyncedAt?.toISOString(),
        },
      });
    } catch (error) {
      console.error('[integration-manager] Error fetching YouTube integration:', error);
      res.status(500).json({ ok: false, error: 'Internal server error' });
    }
  }
);

/**
 * GET /api/manager/artists/:artistId/integrations/tiktok
 * 
 * Get detailed TikTok integration for a managed artist
 */
integrationManagerRoutes.get(
  '/manager/artists/:artistId/integrations/tiktok',
  authenticateJWT,
  requireManagerAccess('viewAnalytics'),
  async (req: Request, res: Response) => {
    try {
      const { artistId } = req.params;

      const integration = await prisma.tikTokIntegration.findFirst({
        where: { artistId },
      });

      if (!integration) {
        return res.status(404).json({
          ok: false,
          error: 'TikTok integration not found',
        });
      }

      res.json({
        ok: true,
        data: {
          tiktokUserId: integration.tiktokUserId,
          username: integration.username,
          followers: integration.followers,
          lastSyncedAt: integration.lastSyncedAt?.toISOString(),
        },
      });
    } catch (error) {
      console.error('[integration-manager] Error fetching TikTok integration:', error);
      res.status(500).json({ ok: false, error: 'Internal server error' });
    }
  }
);

/**
 * POST /api/manager/artists/:artistId/integrations/:platform/disconnect
 * 
 * Disconnect a platform integration for a managed artist
 * Requires configureIntegrations permission
 * 
 * Params:
 * - platform: "spotify" | "instagram" | "youtube" | "tiktok"
 * 
 * Response:
 * {
 *   ok: true,
 *   message: "Integration disconnected"
 * }
 */
integrationManagerRoutes.post(
  '/manager/artists/:artistId/integrations/:platform/disconnect',
  authenticateJWT,
  requireManagerAccess('configureIntegrations'),
  async (req: Request, res: Response) => {
    try {
      const { artistId, platform } = req.params;

      const validPlatforms = ['spotify', 'instagram', 'youtube', 'tiktok'];
      if (!validPlatforms.includes(platform)) {
        return res.status(400).json({
          ok: false,
          error: 'Invalid platform',
        });
      }

      // Map platform to model and field
      const platformMap: Record<string, any> = {
        spotify: { model: 'spotifyIntegration', field: 'SpotifyIntegration' },
        instagram: { model: 'instagramIntegration', field: 'InstagramIntegration' },
        youtube: { model: 'youtubeIntegration', field: 'YoutubeIntegration' },
        tiktok: { model: 'tikTokIntegration', field: 'TikTokIntegration' },
      };

      const config = platformMap[platform];

      // Delete the integration
      await (prisma as any)[config.model].deleteMany({
        where: { artistId },
      });

      res.json({
        ok: true,
        message: `${platform} integration disconnected`,
      });
    } catch (error) {
      console.error('[integration-manager] Error disconnecting integration:', error);
      res.status(500).json({ ok: false, error: 'Internal server error' });
    }
  }
);

export default integrationManagerRoutes;
