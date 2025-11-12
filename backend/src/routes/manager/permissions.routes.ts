/**
 * Manager Permission Routes
 * 
 * Handles:
 * - Granting managers access to artists
 * - Revoking manager access
 * - Listing managers for an artist
 * - Listing artists managed by a manager
 * - Updating permission granularity
 */

import { Router, Request, Response } from 'express'
import { authenticateJWT } from '../../lib/middleware/auth.middleware'
import prisma from '../../lib/prisma'
import { z } from 'zod'

export const permissionsRouter = Router()

/**
 * POST /api/manager/grant-access
 * Grant a manager access to manage an artist
 * 
 * Body: {
 *   artistId: string,
 *   managerEmail: string (or managerId),
 *   permissions: {
 *     viewAnalytics?: boolean,
 *     createCampaign?: boolean,
 *     editCampaign?: boolean,
 *     deleteCampaign?: boolean,
 *     postSocial?: boolean,
 *     editProfile?: boolean,
 *     configureIntegrations?: boolean,
 *     inviteCollaborator?: boolean,
 *     manageTeam?: boolean,
 *   }
 * }
 */
permissionsRouter.post(
  '/grant-access',
  authenticateJWT,
  async (req: Request, res: Response) => {
    try {
      const bodySchema = z.object({
        artistId: z.string(),
        managerEmail: z.string().email().optional(),
        managerId: z.string().optional(),
        permissions: z.object({
          viewAnalytics: z.boolean().optional(),
          createCampaign: z.boolean().optional(),
          editCampaign: z.boolean().optional(),
          deleteCampaign: z.boolean().optional(),
          postSocial: z.boolean().optional(),
          editProfile: z.boolean().optional(),
          configureIntegrations: z.boolean().optional(),
          inviteCollaborator: z.boolean().optional(),
          manageTeam: z.boolean().optional(),
        }).optional(),
      })

      const parsed = bodySchema.safeParse(req.body)
      if (!parsed.success) {
        return res.status(400).json({
          ok: false,
          error: 'Invalid request',
          details: parsed.error.flatten(),
        })
      }

      const { artistId, managerEmail, managerId, permissions } = parsed.data
      const requesterId = req.user?.id

      // Verify artist exists and requester owns it
      const artist = await prisma.artist.findUnique({
        where: { id: artistId },
      })

      if (!artist) {
        return res.status(404).json({
          ok: false,
          error: 'Artist not found',
        })
      }

      if (artist.id !== requesterId) {
        return res.status(403).json({
          ok: false,
          error: 'You can only grant access to your own artist profile',
        })
      }

      // Find manager by email or ID
      let finalManagerId = managerId
      if (!finalManagerId && managerEmail) {
        const manager = await prisma.artist.findUnique({
          where: { email: managerEmail },
        })
        if (!manager) {
          return res.status(404).json({
            ok: false,
            error: 'Manager not found',
          })
        }
        finalManagerId = manager.id
      }

      if (!finalManagerId) {
        return res.status(400).json({
          ok: false,
          error: 'Either managerId or managerEmail is required',
        })
      }

      // Verify manager exists
      const manager = await prisma.artist.findUnique({
        where: { id: finalManagerId },
      })

      if (!manager) {
        return res.status(404).json({
          ok: false,
          error: 'Manager not found',
        })
      }

      // Create or update manager-artist relationship
      const managerArtist = await prisma.managerArtist.upsert({
        where: {
          managerId_artistId: {
            managerId: finalManagerId,
            artistId,
          },
        },
        create: {
          managerId: finalManagerId,
          artistId,
          status: 'ACTIVE',
          viewAnalytics: permissions?.viewAnalytics ?? false,
          createCampaign: permissions?.createCampaign ?? false,
          editCampaign: permissions?.editCampaign ?? false,
          deleteCampaign: permissions?.deleteCampaign ?? false,
          postSocial: permissions?.postSocial ?? false,
          editProfile: permissions?.editProfile ?? false,
          configureIntegrations: permissions?.configureIntegrations ?? false,
          inviteCollaborator: permissions?.inviteCollaborator ?? false,
          manageTeam: permissions?.manageTeam ?? false,
          approvedAt: new Date(),
        },
        update: {
          status: 'ACTIVE',
          viewAnalytics: permissions?.viewAnalytics ?? undefined,
          createCampaign: permissions?.createCampaign ?? undefined,
          editCampaign: permissions?.editCampaign ?? undefined,
          deleteCampaign: permissions?.deleteCampaign ?? undefined,
          postSocial: permissions?.postSocial ?? undefined,
          editProfile: permissions?.editProfile ?? undefined,
          configureIntegrations: permissions?.configureIntegrations ?? undefined,
          inviteCollaborator: permissions?.inviteCollaborator ?? undefined,
          manageTeam: permissions?.manageTeam ?? undefined,
          approvedAt: new Date(),
        },
        include: {
          manager: {
            select: {
              id: true,
              email: true,
              fullName: true,
              profilePictureUrl: true,
            },
          },
        },
      })

      return res.json({
        ok: true,
        managerArtist,
      })
    } catch (error: any) {
      console.error('Grant access error:', error)
      res.status(500).json({
        ok: false,
        error: 'Failed to grant access',
        message: error.message,
      })
    }
  }
)

/**
 * GET /api/manager/artists
 * List all artists managed by the current manager
 */
permissionsRouter.get('/artists', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const managerId = req.user?.id

    const managedArtists = await prisma.managerArtist.findMany({
      where: {
        managerId,
        status: 'ACTIVE',
      },
      include: {
        artist: {
          select: {
            id: true,
            email: true,
            stageName: true,
            fullName: true,
            profilePictureUrl: true,
            genres: true,
            isVerified: true,
          },
        },
      },
      orderBy: {
        invitedAt: 'desc',
      },
    })

    return res.json({
      ok: true,
      artists: managedArtists.map((ma) => ({
        id: ma.artist!.id,
        email: ma.artist!.email,
        stageName: ma.artist!.stageName,
        fullName: ma.artist!.fullName,
        profilePictureUrl: ma.artist!.profilePictureUrl,
        genres: ma.artist!.genres,
        isVerified: ma.artist!.isVerified,
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
        status: ma.status,
        approvedAt: ma.approvedAt,
      })),
    })
  } catch (error: any) {
    console.error('Get managed artists error:', error)
    res.status(500).json({
      ok: false,
      error: 'Failed to fetch managed artists',
      message: error.message,
    })
  }
})

/**
 * GET /api/manager/managers/:artistId
 * List all managers with access to a specific artist
 * (Artist can call this to see who has access to their profile)
 */
permissionsRouter.get(
  '/managers/:artistId',
  authenticateJWT,
  async (req: Request, res: Response) => {
    try {
      const { artistId } = req.params
      const requesterId = req.user?.id

      // Verify artist exists and requester owns it
      const artist = await prisma.artist.findUnique({
        where: { id: artistId },
      })

      if (!artist) {
        return res.status(404).json({
          ok: false,
          error: 'Artist not found',
        })
      }

      if (artist.id !== requesterId) {
        return res.status(403).json({
          ok: false,
          error: 'You can only view managers for your own artist profile',
        })
      }

      const managers = await prisma.managerArtist.findMany({
        where: {
          artistId,
          status: 'ACTIVE',
        },
        include: {
          manager: {
            select: {
              id: true,
              email: true,
              fullName: true,
              profilePictureUrl: true,
              createdAt: true,
            },
          },
        },
        orderBy: {
          approvedAt: 'desc',
        },
      })

      return res.json({
        ok: true,
        managers: managers.map((ma) => ({
          id: ma.manager.id,
          email: ma.manager.email,
          fullName: ma.manager.fullName,
          profilePictureUrl: ma.manager.profilePictureUrl,
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
          status: ma.status,
          approvedAt: ma.approvedAt,
        })),
      })
    } catch (error: any) {
      console.error('Get managers error:', error)
      res.status(500).json({
        ok: false,
        error: 'Failed to fetch managers',
        message: error.message,
      })
    }
  }
)

/**
 * PATCH /api/manager/permissions/:managerId/:artistId
 * Update permissions for a manager-artist relationship
 */
permissionsRouter.patch(
  '/permissions/:managerId/:artistId',
  authenticateJWT,
  async (req: Request, res: Response) => {
    try {
      const { managerId, artistId } = req.params
      const requesterId = req.user?.id

      // Verify artist exists and requester owns it
      const artist = await prisma.artist.findUnique({
        where: { id: artistId },
      })

      if (!artist) {
        return res.status(404).json({
          ok: false,
          error: 'Artist not found',
        })
      }

      if (artist.id !== requesterId) {
        return res.status(403).json({
          ok: false,
          error: 'You can only manage permissions for your own artist profile',
        })
      }

      const permissionsSchema = z.object({
        viewAnalytics: z.boolean().optional(),
        createCampaign: z.boolean().optional(),
        editCampaign: z.boolean().optional(),
        deleteCampaign: z.boolean().optional(),
        postSocial: z.boolean().optional(),
        editProfile: z.boolean().optional(),
        configureIntegrations: z.boolean().optional(),
        inviteCollaborator: z.boolean().optional(),
        manageTeam: z.boolean().optional(),
      })

      const parsed = permissionsSchema.safeParse(req.body)
      if (!parsed.success) {
        return res.status(400).json({
          ok: false,
          error: 'Invalid permissions',
          details: parsed.error.flatten(),
        })
      }

      const updatedPermissions = parsed.data

      const managerArtist = await prisma.managerArtist.update({
        where: {
          managerId_artistId: {
            managerId,
            artistId,
          },
        },
        data: updatedPermissions,
        include: {
          manager: {
            select: {
              id: true,
              email: true,
              fullName: true,
            },
          },
        },
      })

      return res.json({
        ok: true,
        managerArtist,
      })
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({
          ok: false,
          error: 'Manager-artist relationship not found',
        })
      }

      console.error('Update permissions error:', error)
      res.status(500).json({
        ok: false,
        error: 'Failed to update permissions',
        message: error.message,
      })
    }
  }
)

/**
 * DELETE /api/manager/revoke-access/:managerId/:artistId
 * Revoke manager access to an artist
 */
permissionsRouter.delete(
  '/revoke-access/:managerId/:artistId',
  authenticateJWT,
  async (req: Request, res: Response) => {
    try {
      const { managerId, artistId } = req.params
      const requesterId = req.user?.id

      // Verify artist exists and requester owns it
      const artist = await prisma.artist.findUnique({
        where: { id: artistId },
      })

      if (!artist) {
        return res.status(404).json({
          ok: false,
          error: 'Artist not found',
        })
      }

      if (artist.id !== requesterId) {
        return res.status(403).json({
          ok: false,
          error: 'You can only revoke access for your own artist profile',
        })
      }

      await prisma.managerArtist.delete({
        where: {
          managerId_artistId: {
            managerId,
            artistId,
          },
        },
      })

      return res.json({
        ok: true,
        message: 'Manager access revoked',
      })
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({
          ok: false,
          error: 'Manager-artist relationship not found',
        })
      }

      console.error('Revoke access error:', error)
      res.status(500).json({
        ok: false,
        error: 'Failed to revoke access',
        message: error.message,
      })
    }
  }
)

/**
 * Utility function to check if a manager has a specific permission
 * for an artist (used by other routes)
 */
export async function checkManagerPermission(
  managerId: string,
  artistId: string,
  permission: 'viewAnalytics' | 'createCampaign' | 'editCampaign' | 'deleteCampaign' | 'postSocial' | 'editProfile' | 'configureIntegrations' | 'inviteCollaborator' | 'manageTeam'
): Promise<boolean> {
  try {
    const relationship = await prisma.managerArtist.findUnique({
      where: {
        managerId_artistId: {
          managerId,
          artistId,
        },
      },
    })

    if (!relationship || relationship.status !== 'ACTIVE') {
      return false
    }

    return (relationship[permission] as boolean) === true
  } catch (error) {
    return false
  }
}
