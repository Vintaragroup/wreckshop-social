/**
 * Content Manager Routes
 * 
 * Routes for managers to manage releases, events, and content for their artists
 */

import { Router, Request, Response } from 'express';
import { authenticateJWT, requireManagerAccess } from '../../lib/middleware/auth.middleware';
import ReleaseModel from '../../models/release';
import EventModel from '../../models/event';
import { z } from 'zod';

export const contentManagerRoutes = Router();

// ============================================
// Release Management Endpoints
// ============================================

const ReleaseBody = z.object({
  title: z.string().min(1),
  artistId: z.string().optional(),
  description: z.string().optional(),
  releaseDate: z.string().datetime().optional(),
  genre: z.string().optional(),
  releaseType: z.enum(['single', 'album', 'ep', 'compilation']).optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['draft', 'scheduled', 'released', 'archived']).optional(),
});

/**
 * GET /api/manager/artists/:artistId/releases
 * 
 * List all releases for a managed artist
 * Requires viewAnalytics permission
 */
contentManagerRoutes.get(
  '/manager/artists/:artistId/releases',
  authenticateJWT,
  requireManagerAccess('viewAnalytics'),
  async (req: Request, res: Response) => {
    try {
      const { artistId } = req.params;
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
      const page = parseInt(req.query.page as string) || 0;

      const [docs, total] = await Promise.all([
        ReleaseModel.find({ artistId })
          .sort({ createdAt: -1 })
          .limit(limit)
          .skip(page * limit)
          .lean()
          .exec(),
        ReleaseModel.countDocuments({ artistId }).exec(),
      ]);

      res.json({ ok: true, data: docs, total });
    } catch (error) {
      console.error('[content-manager] Error fetching releases:', error);
      res.status(500).json({ ok: false, error: 'Internal server error' });
    }
  }
);

/**
 * POST /api/manager/artists/:artistId/releases
 * 
 * Create a new release for a managed artist
 * Requires editProfile permission
 */
contentManagerRoutes.post(
  '/manager/artists/:artistId/releases',
  authenticateJWT,
  requireManagerAccess('editProfile'),
  async (req: Request, res: Response) => {
    try {
      const parsed = ReleaseBody.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ ok: false, error: parsed.error.flatten() });
      }

      const input = parsed.data;
      const { artistId } = req.params;

      const doc = await ReleaseModel.create({
        ...input,
        artistId,
        releaseDate: input.releaseDate ? new Date(input.releaseDate) : undefined,
      });

      res.status(201).json({ ok: true, data: doc });
    } catch (error) {
      console.error('[content-manager] Error creating release:', error);
      res.status(500).json({ ok: false, error: 'Internal server error' });
    }
  }
);

/**
 * GET /api/manager/artists/:artistId/releases/:releaseId
 * 
 * Get a specific release for a managed artist
 * Requires viewAnalytics permission
 */
contentManagerRoutes.get(
  '/manager/artists/:artistId/releases/:releaseId',
  authenticateJWT,
  requireManagerAccess('viewAnalytics'),
  async (req: Request, res: Response) => {
    try {
      const { artistId, releaseId } = req.params;

      const doc = await ReleaseModel.findById(releaseId).lean().exec();
      if (!doc) {
        return res.status(404).json({ ok: false, error: 'Release not found' });
      }

      // Verify release belongs to the artist
      if ((doc as any).artistId !== artistId) {
        return res.status(403).json({ ok: false, error: 'Forbidden' });
      }

      res.json({ ok: true, data: doc });
    } catch (error) {
      console.error('[content-manager] Error fetching release:', error);
      res.status(500).json({ ok: false, error: 'Internal server error' });
    }
  }
);

/**
 * PATCH /api/manager/artists/:artistId/releases/:releaseId
 * 
 * Update a release for a managed artist
 * Requires editProfile permission
 */
contentManagerRoutes.patch(
  '/manager/artists/:artistId/releases/:releaseId',
  authenticateJWT,
  requireManagerAccess('editProfile'),
  async (req: Request, res: Response) => {
    try {
      const { artistId, releaseId } = req.params;

      // Verify release belongs to the artist
      const existing = await ReleaseModel.findById(releaseId).lean().exec();
      if (!existing) {
        return res.status(404).json({ ok: false, error: 'Release not found' });
      }

      if ((existing as any).artistId !== artistId) {
        return res.status(403).json({ ok: false, error: 'Forbidden' });
      }

      const doc = await ReleaseModel.findByIdAndUpdate(releaseId, req.body, { new: true });
      res.json({ ok: true, data: doc });
    } catch (error) {
      console.error('[content-manager] Error updating release:', error);
      res.status(500).json({ ok: false, error: 'Internal server error' });
    }
  }
);

/**
 * DELETE /api/manager/artists/:artistId/releases/:releaseId
 * 
 * Delete a release for a managed artist
 * Requires editProfile permission
 */
contentManagerRoutes.delete(
  '/manager/artists/:artistId/releases/:releaseId',
  authenticateJWT,
  requireManagerAccess('editProfile'),
  async (req: Request, res: Response) => {
    try {
      const { artistId, releaseId } = req.params;

      // Verify release belongs to the artist
      const existing = await ReleaseModel.findById(releaseId).lean().exec();
      if (!existing) {
        return res.status(404).json({ ok: false, error: 'Release not found' });
      }

      if ((existing as any).artistId !== artistId) {
        return res.status(403).json({ ok: false, error: 'Forbidden' });
      }

      await ReleaseModel.findByIdAndDelete(releaseId);
      res.json({ ok: true, message: 'Release deleted' });
    } catch (error) {
      console.error('[content-manager] Error deleting release:', error);
      res.status(500).json({ ok: false, error: 'Internal server error' });
    }
  }
);

// ============================================
// Event Management Endpoints
// ============================================

const EventBody = z.object({
  title: z.string().min(1),
  artistId: z.string().optional(),
  description: z.string().optional(),
  eventDate: z.string().datetime().optional(),
  location: z.string().optional(),
  type: z.enum(['concert', 'festival', 'virtual', 'meet-and-greet', 'other']).optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['draft', 'scheduled', 'cancelled', 'completed']).optional(),
});

/**
 * GET /api/manager/artists/:artistId/events
 * 
 * List all events for a managed artist
 * Requires viewAnalytics permission
 */
contentManagerRoutes.get(
  '/manager/artists/:artistId/events',
  authenticateJWT,
  requireManagerAccess('viewAnalytics'),
  async (req: Request, res: Response) => {
    try {
      const { artistId } = req.params;
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
      const page = parseInt(req.query.page as string) || 0;

      const [docs, total] = await Promise.all([
        EventModel.find({ artistId })
          .sort({ createdAt: -1 })
          .limit(limit)
          .skip(page * limit)
          .lean()
          .exec(),
        EventModel.countDocuments({ artistId }).exec(),
      ]);

      res.json({ ok: true, data: docs, total });
    } catch (error) {
      console.error('[content-manager] Error fetching events:', error);
      res.status(500).json({ ok: false, error: 'Internal server error' });
    }
  }
);

/**
 * POST /api/manager/artists/:artistId/events
 * 
 * Create a new event for a managed artist
 * Requires editProfile permission
 */
contentManagerRoutes.post(
  '/manager/artists/:artistId/events',
  authenticateJWT,
  requireManagerAccess('editProfile'),
  async (req: Request, res: Response) => {
    try {
      const parsed = EventBody.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ ok: false, error: parsed.error.flatten() });
      }

      const input = parsed.data;
      const { artistId } = req.params;

      const doc = await EventModel.create({
        ...input,
        artistId,
        eventDate: input.eventDate ? new Date(input.eventDate) : undefined,
      });

      res.status(201).json({ ok: true, data: doc });
    } catch (error) {
      console.error('[content-manager] Error creating event:', error);
      res.status(500).json({ ok: false, error: 'Internal server error' });
    }
  }
);

/**
 * GET /api/manager/artists/:artistId/events/:eventId
 * 
 * Get a specific event for a managed artist
 * Requires viewAnalytics permission
 */
contentManagerRoutes.get(
  '/manager/artists/:artistId/events/:eventId',
  authenticateJWT,
  requireManagerAccess('viewAnalytics'),
  async (req: Request, res: Response) => {
    try {
      const { artistId, eventId } = req.params;

      const doc = await EventModel.findById(eventId).lean().exec();
      if (!doc) {
        return res.status(404).json({ ok: false, error: 'Event not found' });
      }

      // Verify event belongs to the artist
      if ((doc as any).artistId !== artistId) {
        return res.status(403).json({ ok: false, error: 'Forbidden' });
      }

      res.json({ ok: true, data: doc });
    } catch (error) {
      console.error('[content-manager] Error fetching event:', error);
      res.status(500).json({ ok: false, error: 'Internal server error' });
    }
  }
);

/**
 * PATCH /api/manager/artists/:artistId/events/:eventId
 * 
 * Update an event for a managed artist
 * Requires editProfile permission
 */
contentManagerRoutes.patch(
  '/manager/artists/:artistId/events/:eventId',
  authenticateJWT,
  requireManagerAccess('editProfile'),
  async (req: Request, res: Response) => {
    try {
      const { artistId, eventId } = req.params;

      // Verify event belongs to the artist
      const existing = await EventModel.findById(eventId).lean().exec();
      if (!existing) {
        return res.status(404).json({ ok: false, error: 'Event not found' });
      }

      if ((existing as any).artistId !== artistId) {
        return res.status(403).json({ ok: false, error: 'Forbidden' });
      }

      const doc = await EventModel.findByIdAndUpdate(eventId, req.body, { new: true });
      res.json({ ok: true, data: doc });
    } catch (error) {
      console.error('[content-manager] Error updating event:', error);
      res.status(500).json({ ok: false, error: 'Internal server error' });
    }
  }
);

/**
 * DELETE /api/manager/artists/:artistId/events/:eventId
 * 
 * Delete an event for a managed artist
 * Requires editProfile permission
 */
contentManagerRoutes.delete(
  '/manager/artists/:artistId/events/:eventId',
  authenticateJWT,
  requireManagerAccess('editProfile'),
  async (req: Request, res: Response) => {
    try {
      const { artistId, eventId } = req.params;

      // Verify event belongs to the artist
      const existing = await EventModel.findById(eventId).lean().exec();
      if (!existing) {
        return res.status(404).json({ ok: false, error: 'Event not found' });
      }

      if ((existing as any).artistId !== artistId) {
        return res.status(403).json({ ok: false, error: 'Forbidden' });
      }

      await EventModel.findByIdAndDelete(eventId);
      res.json({ ok: true, message: 'Event deleted' });
    } catch (error) {
      console.error('[content-manager] Error deleting event:', error);
      res.status(500).json({ ok: false, error: 'Internal server error' });
    }
  }
);

export default contentManagerRoutes;
