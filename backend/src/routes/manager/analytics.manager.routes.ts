/**
 * Analytics & Audience Manager Routes
 * 
 * Routes for managers to view analytics and manage audience segments for their artists
 */

import { Router, Request, Response } from 'express';
import { authenticateJWT, requireManagerAccess } from '../../lib/middleware/auth.middleware';
import SegmentModel from '../../models/segment';
import { z } from 'zod';

export const analyticsManagerRoutes = Router();

// ============================================
// Analytics Endpoints
// ============================================

/**
 * GET /api/manager/artists/:artistId/analytics/overview
 * 
 * Get analytics overview for a managed artist
 * Requires viewAnalytics permission
 * 
 * Response:
 * {
 *   ok: true,
 *   data: {
 *     totalFollowers: number,
 *     totalReach: number,
 *     engagementRate: number,
 *     monthlyListeners: number,
 *     topLocation: string,
 *     topGenre: string,
 *     leaderboardRank?: number
 *   }
 * }
 */
analyticsManagerRoutes.get(
  '/manager/artists/:artistId/analytics/overview',
  authenticateJWT,
  requireManagerAccess('viewAnalytics'),
  async (req: Request, res: Response) => {
    try {
      const { artistId } = req.params;

      // In a full implementation, this would aggregate data from:
      // - Spotify: followers, monthly listeners
      // - Instagram: followers, engagement rate
      // - YouTube: subscribers, view count
      // - TikTok: followers, views
      
      // For now, return a structure showing what would be aggregated
      res.json({
        ok: true,
        data: {
          totalFollowers: 0, // Would sum across platforms
          totalReach: 0, // Would calculate from engagement
          engagementRate: 0, // Average across platforms
          monthlyListeners: 0, // From Spotify
          topLocation: 'Unknown',
          topGenre: 'Unknown',
          leaderboardRank: null,
          note: 'Full analytics implementation comes with platform integrations',
        },
      });
    } catch (error) {
      console.error('[analytics-manager] Error fetching analytics:', error);
      res.status(500).json({ ok: false, error: 'Internal server error' });
    }
  }
);

/**
 * GET /api/manager/artists/:artistId/analytics/platforms
 * 
 * Get per-platform analytics for a managed artist
 * Requires viewAnalytics permission
 * 
 * Response:
 * {
 *   ok: true,
 *   data: {
 *     spotify: { followers, monthlyListeners, ... },
 *     instagram: { followers, engagementRate, ... },
 *     youtube: { subscribers, totalViews, ... },
 *     tiktok: { followers, totalViews, ... }
 *   }
 * }
 */
analyticsManagerRoutes.get(
  '/manager/artists/:artistId/analytics/platforms',
  authenticateJWT,
  requireManagerAccess('viewAnalytics'),
  async (req: Request, res: Response) => {
    try {
      const { artistId } = req.params;

      // This would normally fetch from integrations and aggregate data
      res.json({
        ok: true,
        data: {
          spotify: {
            connected: false,
            followers: 0,
            monthlyListeners: 0,
            topTracks: [],
            lastUpdated: null,
          },
          instagram: {
            connected: false,
            followers: 0,
            engagementRate: 0,
            totalPosts: 0,
            lastUpdated: null,
          },
          youtube: {
            connected: false,
            subscribers: 0,
            totalViews: 0,
            videosCount: 0,
            lastUpdated: null,
          },
          tiktok: {
            connected: false,
            followers: 0,
            totalViews: 0,
            videosCount: 0,
            lastUpdated: null,
          },
        },
      });
    } catch (error) {
      console.error('[analytics-manager] Error fetching platform analytics:', error);
      res.status(500).json({ ok: false, error: 'Internal server error' });
    }
  }
);

/**
 * GET /api/manager/artists/:artistId/analytics/campaigns
 * 
 * Get campaign performance analytics for a managed artist
 * Requires viewAnalytics permission
 */
analyticsManagerRoutes.get(
  '/manager/artists/:artistId/analytics/campaigns',
  authenticateJWT,
  requireManagerAccess('viewAnalytics'),
  async (req: Request, res: Response) => {
    try {
      const { artistId } = req.params;

      // This would aggregate campaign performance data
      res.json({
        ok: true,
        data: {
          totalCampaigns: 0,
          activeCampaigns: 0,
          averageEngagementRate: 0,
          topCampaign: null,
          recentCampaigns: [],
        },
      });
    } catch (error) {
      console.error('[analytics-manager] Error fetching campaign analytics:', error);
      res.status(500).json({ ok: false, error: 'Internal server error' });
    }
  }
);

// ============================================
// Audience & Segment Endpoints
// ============================================

const SegmentBody = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  artistId: z.string().optional(),
  criteria: z.any().optional(), // Flexible criteria object
  tags: z.array(z.string()).optional(),
  status: z.enum(['draft', 'active', 'archived']).optional(),
});

/**
 * GET /api/manager/artists/:artistId/segments
 * 
 * List all audience segments for a managed artist
 * Requires viewAnalytics permission
 */
analyticsManagerRoutes.get(
  '/manager/artists/:artistId/segments',
  authenticateJWT,
  requireManagerAccess('viewAnalytics'),
  async (req: Request, res: Response) => {
    try {
      const { artistId } = req.params;
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
      const page = parseInt(req.query.page as string) || 0;

      const [docs, total] = await Promise.all([
        SegmentModel.find({ artistId })
          .sort({ createdAt: -1 })
          .limit(limit)
          .skip(page * limit)
          .lean()
          .exec(),
        SegmentModel.countDocuments({ artistId }).exec(),
      ]);

      res.json({ ok: true, data: docs, total });
    } catch (error) {
      console.error('[analytics-manager] Error fetching segments:', error);
      res.status(500).json({ ok: false, error: 'Internal server error' });
    }
  }
);

/**
 * POST /api/manager/artists/:artistId/segments
 * 
 * Create a new audience segment for a managed artist
 * Requires createCampaign permission
 */
analyticsManagerRoutes.post(
  '/manager/artists/:artistId/segments',
  authenticateJWT,
  requireManagerAccess('createCampaign'),
  async (req: Request, res: Response) => {
    try {
      const parsed = SegmentBody.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ ok: false, error: parsed.error.flatten() });
      }

      const input = parsed.data;
      const { artistId } = req.params;

      const doc = await SegmentModel.create({
        ...input,
        artistId,
      });

      res.status(201).json({ ok: true, data: doc });
    } catch (error) {
      console.error('[analytics-manager] Error creating segment:', error);
      res.status(500).json({ ok: false, error: 'Internal server error' });
    }
  }
);

/**
 * GET /api/manager/artists/:artistId/segments/:segmentId
 * 
 * Get a specific audience segment for a managed artist
 * Requires viewAnalytics permission
 */
analyticsManagerRoutes.get(
  '/manager/artists/:artistId/segments/:segmentId',
  authenticateJWT,
  requireManagerAccess('viewAnalytics'),
  async (req: Request, res: Response) => {
    try {
      const { artistId, segmentId } = req.params;

      const doc = await SegmentModel.findById(segmentId).lean().exec();
      if (!doc) {
        return res.status(404).json({ ok: false, error: 'Segment not found' });
      }

      // Verify segment belongs to the artist
      if ((doc as any).artistId !== artistId) {
        return res.status(403).json({ ok: false, error: 'Forbidden' });
      }

      res.json({ ok: true, data: doc });
    } catch (error) {
      console.error('[analytics-manager] Error fetching segment:', error);
      res.status(500).json({ ok: false, error: 'Internal server error' });
    }
  }
);

/**
 * PATCH /api/manager/artists/:artistId/segments/:segmentId
 * 
 * Update an audience segment for a managed artist
 * Requires createCampaign permission
 */
analyticsManagerRoutes.patch(
  '/manager/artists/:artistId/segments/:segmentId',
  authenticateJWT,
  requireManagerAccess('createCampaign'),
  async (req: Request, res: Response) => {
    try {
      const { artistId, segmentId } = req.params;

      // Verify segment belongs to the artist
      const existing = await SegmentModel.findById(segmentId).lean().exec();
      if (!existing) {
        return res.status(404).json({ ok: false, error: 'Segment not found' });
      }

      if ((existing as any).artistId !== artistId) {
        return res.status(403).json({ ok: false, error: 'Forbidden' });
      }

      const doc = await SegmentModel.findByIdAndUpdate(segmentId, req.body, { new: true });
      res.json({ ok: true, data: doc });
    } catch (error) {
      console.error('[analytics-manager] Error updating segment:', error);
      res.status(500).json({ ok: false, error: 'Internal server error' });
    }
  }
);

/**
 * DELETE /api/manager/artists/:artistId/segments/:segmentId
 * 
 * Delete an audience segment for a managed artist
 * Requires createCampaign permission
 */
analyticsManagerRoutes.delete(
  '/manager/artists/:artistId/segments/:segmentId',
  authenticateJWT,
  requireManagerAccess('createCampaign'),
  async (req: Request, res: Response) => {
    try {
      const { artistId, segmentId } = req.params;

      // Verify segment belongs to the artist
      const existing = await SegmentModel.findById(segmentId).lean().exec();
      if (!existing) {
        return res.status(404).json({ ok: false, error: 'Segment not found' });
      }

      if ((existing as any).artistId !== artistId) {
        return res.status(403).json({ ok: false, error: 'Forbidden' });
      }

      await SegmentModel.findByIdAndDelete(segmentId);
      res.json({ ok: true, message: 'Segment deleted' });
    } catch (error) {
      console.error('[analytics-manager] Error deleting segment:', error);
      res.status(500).json({ ok: false, error: 'Internal server error' });
    }
  }
);

export default analyticsManagerRoutes;
