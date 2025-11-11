/**
 * Campaign Manager Routes
 * 
 * Routes for managers to manage campaigns for their artists
 * Requires proper authentication and campaign management permissions
 */

import { Router, Request, Response } from 'express';
import { authenticateJWT, requireManagerAccess } from '../../lib/middleware/auth.middleware';
import CampaignModel from '../../models/campaign';
import { z } from 'zod';

export const campaignManagerRoutes = Router();

// Campaign validation schema
const CampaignBody = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  ownerProfileId: z.string().optional(),
  releaseId: z.string().optional(),
  segments: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  channels: z.any().optional(),
  schedule: z
    .object({
      startAt: z.string().datetime().optional(),
      endAt: z.string().datetime().optional(),
      timezone: z.string().optional(),
    })
    .partial()
    .optional(),
  status: z
    .enum(['draft', 'scheduled', 'running', 'paused', 'completed', 'failed'])
    .optional(),
});

/**
 * GET /api/manager/artists/:artistId/campaigns
 * 
 * List all campaigns for a managed artist
 * Requires viewAnalytics permission
 * 
 * Query params:
 * - status: filter by campaign status
 * - limit: max results (default 50)
 * - page: pagination offset (default 0)
 * 
 * Response:
 * {
 *   ok: true,
 *   data: [
 *     {
 *       _id: string,
 *       name: string,
 *       status: string,
 *       createdAt: string,
 *       updatedAt: string,
 *       segments?: string[],
 *       tags?: string[],
 *       channels?: object
 *     }
 *   ],
 *   total: number
 * }
 */
campaignManagerRoutes.get(
  '/manager/artists/:artistId/campaigns',
  authenticateJWT,
  requireManagerAccess('viewAnalytics'),
  async (req: Request, res: Response) => {
    try {
      const { status } = req.query;
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
      const page = parseInt(req.query.page as string) || 0;

      const filter: any = { ownerProfileId: req.params.artistId };
      if (status) {
        filter.status = status;
      }

      const [docs, total] = await Promise.all([
        CampaignModel.find(filter)
          .sort({ createdAt: -1 })
          .limit(limit)
          .skip(page * limit)
          .lean()
          .exec(),
        CampaignModel.countDocuments(filter).exec(),
      ]);

      res.json({ ok: true, data: docs, total });
    } catch (error) {
      console.error('[campaign-manager] Error fetching campaigns:', error);
      res.status(500).json({ ok: false, error: 'Internal server error' });
    }
  }
);

/**
 * POST /api/manager/artists/:artistId/campaigns
 * 
 * Create a new campaign for a managed artist
 * Requires createCampaign permission
 * 
 * Body: Campaign data (name required)
 * 
 * Response:
 * {
 *   ok: true,
 *   data: { created campaign }
 * }
 */
campaignManagerRoutes.post(
  '/manager/artists/:artistId/campaigns',
  authenticateJWT,
  requireManagerAccess('createCampaign'),
  async (req: Request, res: Response) => {
    try {
      const parsed = CampaignBody.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ ok: false, error: parsed.error.flatten() });
      }

      const input = parsed.data;
      const artistId = req.params.artistId;

      const doc = await CampaignModel.create({
        ...input,
        ownerProfileId: artistId,
        schedule: {
          ...input.schedule,
          startAt: input.schedule?.startAt ? new Date(input.schedule.startAt) : undefined,
          endAt: input.schedule?.endAt ? new Date(input.schedule.endAt) : undefined,
        },
      });

      res.status(201).json({ ok: true, data: doc });
    } catch (error) {
      console.error('[campaign-manager] Error creating campaign:', error);
      res.status(500).json({ ok: false, error: 'Internal server error' });
    }
  }
);

/**
 * GET /api/manager/artists/:artistId/campaigns/:campaignId
 * 
 * Get a specific campaign for a managed artist
 * Requires viewAnalytics permission
 * 
 * Response:
 * {
 *   ok: true,
 *   data: { campaign details }
 * }
 */
campaignManagerRoutes.get(
  '/manager/artists/:artistId/campaigns/:campaignId',
  authenticateJWT,
  requireManagerAccess('viewAnalytics'),
  async (req: Request, res: Response) => {
    try {
      const { artistId, campaignId } = req.params;

      const doc = await CampaignModel.findById(campaignId).lean().exec();
      if (!doc) {
        return res.status(404).json({ ok: false, error: 'Campaign not found' });
      }

      // Verify campaign belongs to the artist
      if ((doc as any).ownerProfileId !== artistId) {
        return res.status(403).json({ ok: false, error: 'Forbidden' });
      }

      res.json({ ok: true, data: doc });
    } catch (error) {
      console.error('[campaign-manager] Error fetching campaign:', error);
      res.status(500).json({ ok: false, error: 'Internal server error' });
    }
  }
);

/**
 * PATCH /api/manager/artists/:artistId/campaigns/:campaignId
 * 
 * Update a campaign for a managed artist
 * Requires editCampaign permission
 * 
 * Body: Partial campaign data
 * 
 * Response:
 * {
 *   ok: true,
 *   data: { updated campaign }
 * }
 */
campaignManagerRoutes.patch(
  '/manager/artists/:artistId/campaigns/:campaignId',
  authenticateJWT,
  requireManagerAccess('editCampaign'),
  async (req: Request, res: Response) => {
    try {
      const { artistId, campaignId } = req.params;

      // Verify campaign belongs to the artist
      const existing = await CampaignModel.findById(campaignId).lean().exec();
      if (!existing) {
        return res.status(404).json({ ok: false, error: 'Campaign not found' });
      }

      if ((existing as any).ownerProfileId !== artistId) {
        return res.status(403).json({ ok: false, error: 'Forbidden' });
      }

      const doc = await CampaignModel.findByIdAndUpdate(campaignId, req.body, { new: true });
      res.json({ ok: true, data: doc });
    } catch (error) {
      console.error('[campaign-manager] Error updating campaign:', error);
      res.status(500).json({ ok: false, error: 'Internal server error' });
    }
  }
);

/**
 * DELETE /api/manager/artists/:artistId/campaigns/:campaignId
 * 
 * Delete a campaign for a managed artist
 * Requires deleteCampaign permission
 * 
 * Response:
 * {
 *   ok: true,
 *   message: "Campaign deleted"
 * }
 */
campaignManagerRoutes.delete(
  '/manager/artists/:artistId/campaigns/:campaignId',
  authenticateJWT,
  requireManagerAccess('deleteCampaign'),
  async (req: Request, res: Response) => {
    try {
      const { artistId, campaignId } = req.params;

      // Verify campaign belongs to the artist
      const existing = await CampaignModel.findById(campaignId).lean().exec();
      if (!existing) {
        return res.status(404).json({ ok: false, error: 'Campaign not found' });
      }

      if ((existing as any).ownerProfileId !== artistId) {
        return res.status(403).json({ ok: false, error: 'Forbidden' });
      }

      await CampaignModel.findByIdAndDelete(campaignId);
      res.json({ ok: true, message: 'Campaign deleted' });
    } catch (error) {
      console.error('[campaign-manager] Error deleting campaign:', error);
      res.status(500).json({ ok: false, error: 'Internal server error' });
    }
  }
);

export default campaignManagerRoutes;
