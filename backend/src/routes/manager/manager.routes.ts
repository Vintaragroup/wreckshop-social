/**
 * Manager Routes
 * 
 * Routes for managers to:
 * - Manage their artist relationships
 * - View and update managed artists' data
 * - Create campaigns for managed artists
 * - View analytics for managed artists
 * 
 * All routes require authentication and proper manager permissions
 */

import { Router, Request, Response } from 'express';
import { authenticateJWT, requireManagerAccess } from '../../lib/middleware/auth.middleware';
import { prisma } from '../../lib/prisma';

export const managerRoutes = Router();

// ============================================
// Manager-Artist Relationship Endpoints
// ============================================

/**
 * GET /api/manager/artists
 * 
 * List all artists managed by the authenticated manager
 * 
 * Response:
 * {
 *   ok: true,
 *   data: [
 *     {
 *       id: string,
 *       stageName: string,
 *       email: string,
 *       profilePictureUrl?: string,
 *       status: "PENDING" | "ACTIVE" | "INACTIVE" | "REJECTED",
 *       permissions: {
 *         viewAnalytics: boolean,
 *         createCampaign: boolean,
 *         editCampaign: boolean,
 *         deleteCampaign: boolean,
 *         postSocial: boolean,
 *         editProfile: boolean,
 *         configureIntegrations: boolean,
 *         inviteCollaborator: boolean,
 *         manageTeam: boolean
 *       },
 *       invitedAt: string,
 *       approvedAt?: string
 *     }
 *   ]
 * }
 */
managerRoutes.get('/manager/artists', authenticateJWT, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Find all artists managed by this user
    const managedArtists = await prisma.managerArtist.findMany({
      where: { managerId: req.user.id },
      include: {
        artist: {
          select: {
            id: true,
            stageName: true,
            email: true,
            profilePictureUrl: true,
          },
        },
      },
      orderBy: { invitedAt: 'desc' },
    });

    const data = managedArtists.map((ma: any) => ({
      id: ma.artist.id,
      stageName: ma.artist.stageName,
      email: ma.artist.email,
      profilePictureUrl: ma.artist.profilePictureUrl,
      status: ma.status,
      permissions: {
        viewAnalytics: ma.viewAnalytics,
        createCampaign: ma.createCampaign,
        editCampaign: ma.editCampaign,
        deleteCampaign: ma.deleteCampaign,
        postSocial: ma.postSocial,
        editProfile: ma.editProfile,
        configureIntegrations: ma.configureIntegrations,
        inviteCollaborator: ma.inviteCollaborator,
        manageTeam: ma.manageTeam,
      },
      invitedAt: ma.invitedAt.toISOString(),
      approvedAt: ma.approvedAt?.toISOString(),
    }));

    res.json({ ok: true, data });
  } catch (error) {
    console.error('[manager] Error fetching managed artists:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/manager/invite
 * 
 * Invite an artist to be managed by the authenticated manager
 * 
 * Body:
 * {
 *   artistId: string
 * }
 * 
 * Response:
 * {
 *   ok: true,
 *   data: {
 *     id: string,
 *     managerId: string,
 *     artistId: string,
 *     status: "PENDING",
 *     invitedAt: string
 *   }
 * }
 */
managerRoutes.post('/manager/invite', authenticateJWT, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { artistId } = req.body;

    if (!artistId || typeof artistId !== 'string') {
      return res.status(400).json({ error: 'Invalid artistId' });
    }

    // Verify artist exists
    const artist = await prisma.artist.findUnique({
      where: { id: artistId },
      select: { id: true },
    });

    if (!artist) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    // Check if relationship already exists
    const existingRelationship = await prisma.managerArtist.findFirst({
      where: {
        managerId: req.user.id,
        artistId: artistId,
      },
    });

    if (existingRelationship) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'This artist is already associated with your account',
      });
    }

    // Create manager-artist relationship
    const relationship = await prisma.managerArtist.create({
      data: {
        managerId: req.user.id,
        artistId: artistId,
        status: 'PENDING',
        // Default permissions - all false initially, can be updated
        viewAnalytics: false,
        createCampaign: false,
        editCampaign: false,
        deleteCampaign: false,
        postSocial: false,
        editProfile: false,
        configureIntegrations: false,
        inviteCollaborator: false,
        manageTeam: false,
      },
    });

    res.status(201).json({
      ok: true,
      data: {
        id: relationship.id,
        managerId: relationship.managerId,
        artistId: relationship.artistId,
        status: relationship.status,
        invitedAt: relationship.invitedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('[manager] Error inviting artist:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PATCH /api/manager/artists/:artistId/permissions
 * 
 * Update permissions for a managed artist
 * 
 * Body:
 * {
 *   viewAnalytics?: boolean,
 *   createCampaign?: boolean,
 *   editCampaign?: boolean,
 *   deleteCampaign?: boolean,
 *   postSocial?: boolean,
 *   editProfile?: boolean,
 *   configureIntegrations?: boolean,
 *   inviteCollaborator?: boolean,
 *   manageTeam?: boolean
 * }
 * 
 * Response:
 * {
 *   ok: true,
 *   data: { permissions object with updated values }
 * }
 */
managerRoutes.patch(
  '/manager/artists/:artistId/permissions',
  authenticateJWT,
  requireManagerAccess('manageTeam'),
  async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { artistId } = req.params;
      const permissions = req.body;

      // Find the relationship
      const relationship = await prisma.managerArtist.findFirst({
        where: {
          managerId: req.user.id,
          artistId: artistId,
          status: 'ACTIVE',
        },
      });

      if (!relationship) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'You do not have permission to manage this artist',
        });
      }

      // Update permissions
      const updated = await prisma.managerArtist.update({
        where: { id: relationship.id },
        data: {
          viewAnalytics: permissions.viewAnalytics ?? relationship.viewAnalytics,
          createCampaign: permissions.createCampaign ?? relationship.createCampaign,
          editCampaign: permissions.editCampaign ?? relationship.editCampaign,
          deleteCampaign: permissions.deleteCampaign ?? relationship.deleteCampaign,
          postSocial: permissions.postSocial ?? relationship.postSocial,
          editProfile: permissions.editProfile ?? relationship.editProfile,
          configureIntegrations:
            permissions.configureIntegrations ?? relationship.configureIntegrations,
          inviteCollaborator: permissions.inviteCollaborator ?? relationship.inviteCollaborator,
          manageTeam: permissions.manageTeam ?? relationship.manageTeam,
        },
      });

      res.json({
        ok: true,
        data: {
          viewAnalytics: updated.viewAnalytics,
          createCampaign: updated.createCampaign,
          editCampaign: updated.editCampaign,
          deleteCampaign: updated.deleteCampaign,
          postSocial: updated.postSocial,
          editProfile: updated.editProfile,
          configureIntegrations: updated.configureIntegrations,
          inviteCollaborator: updated.inviteCollaborator,
          manageTeam: updated.manageTeam,
        },
      });
    } catch (error) {
      console.error('[manager] Error updating permissions:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// ============================================
// Artist Profile Endpoints (Manager-specific)
// ============================================

/**
 * GET /api/manager/artists/:artistId/profile
 * 
 * Get detailed profile of a managed artist
 * Requires viewAnalytics permission
 * 
 * Response:
 * {
 *   ok: true,
 *   data: {
 *     id: string,
 *     email: string,
 *     stageName: string,
 *     fullName?: string,
 *     bio?: string,
 *     genres: string[],
 *     niches: string[],
 *     countryCode?: string,
 *     region?: string,
 *     isVerified: boolean,
 *     leaderboardScore: number,
 *     createdAt: string,
 *     updatedAt: string
 *   }
 * }
 */
managerRoutes.get(
  '/manager/artists/:artistId/profile',
  authenticateJWT,
  requireManagerAccess('viewAnalytics'),
  async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { artistId } = req.params;

      const artist = await prisma.artist.findUnique({
        where: { id: artistId },
        select: {
          id: true,
          email: true,
          stageName: true,
          fullName: true,
          bio: true,
          genres: true,
          niches: true,
          countryCode: true,
          region: true,
          isVerified: true,
          leaderboardScore: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!artist) {
        return res.status(404).json({ error: 'Artist not found' });
      }

      res.json({
        ok: true,
        data: {
          ...artist,
          createdAt: artist.createdAt.toISOString(),
          updatedAt: artist.updatedAt.toISOString(),
        },
      });
    } catch (error) {
      console.error('[manager] Error fetching artist profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * PATCH /api/manager/artists/:artistId/profile
 * 
 * Update a managed artist's profile
 * Requires editProfile permission
 * 
 * Body:
 * {
 *   fullName?: string,
 *   bio?: string,
 *   genres?: string[],
 *   niches?: string[],
 *   countryCode?: string,
 *   region?: string
 * }
 * 
 * Response:
 * {
 *   ok: true,
 *   data: { updated artist profile }
 * }
 */
managerRoutes.patch(
  '/manager/artists/:artistId/profile',
  authenticateJWT,
  requireManagerAccess('editProfile'),
  async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { artistId } = req.params;
      const { fullName, bio, genres, niches, countryCode, region } = req.body;

      // Verify artist exists
      const artist = await prisma.artist.findUnique({
        where: { id: artistId },
        select: { id: true },
      });

      if (!artist) {
        return res.status(404).json({ error: 'Artist not found' });
      }

      // Update profile
      const updated = await prisma.artist.update({
        where: { id: artistId },
        data: {
          fullName: fullName ?? undefined,
          bio: bio ?? undefined,
          genres: genres ?? undefined,
          niches: niches ?? undefined,
          countryCode: countryCode ?? undefined,
          region: region ?? undefined,
        },
        select: {
          id: true,
          email: true,
          stageName: true,
          fullName: true,
          bio: true,
          genres: true,
          niches: true,
          countryCode: true,
          region: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      res.json({
        ok: true,
        data: {
          ...updated,
          createdAt: updated.createdAt.toISOString(),
          updatedAt: updated.updatedAt.toISOString(),
        },
      });
    } catch (error) {
      console.error('[manager] Error updating artist profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default managerRoutes;
