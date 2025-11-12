/**
 * Admin Management Routes
 * 
 * Routes for managing admin access
 * These routes should be protected with additional security in production
 */

import { Router, Request, Response } from 'express'
import { authenticateJWT } from '../../lib/middleware/auth.middleware'
import prisma from '../../lib/prisma'
import { z } from 'zod'

export const adminRouter = Router()

/**
 * PATCH /api/admin/set-admin
 * Grant admin access to a user by email
 * 
 * Body: { email: string }
 * 
 * SECURITY: Only existing admins can grant admin status
 */
adminRouter.patch('/set-admin', authenticateJWT, async (req: Request, res: Response) => {
  try {
    // Check if requester is admin
    if (!req.user?.isAdmin) {
      return res.status(403).json({
        ok: false,
        error: 'Forbidden',
        message: 'Only admins can grant admin access',
      })
    }

    const bodySchema = z.object({
      email: z.string().email(),
    })

    const parsed = bodySchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        error: 'Invalid request',
        details: parsed.error.flatten(),
      })
    }

    const { email } = parsed.data

    // Find user by email
    const artist = await prisma.artist.findUnique({
      where: { email },
    })

    if (!artist) {
      return res.status(404).json({
        ok: false,
        error: 'User not found',
      })
    }

    // Update user to admin
    const updatedArtist = await prisma.artist.update({
      where: { id: artist.id },
      data: {
        isAdmin: true,
      },
      select: {
        id: true,
        email: true,
        stageName: true,
        fullName: true,
        isAdmin: true,
        createdAt: true,
      },
    })

    return res.json({
      ok: true,
      message: `${email} is now an admin`,
      artist: updatedArtist,
    })
  } catch (error: any) {
    console.error('Set admin error:', error)
    res.status(500).json({
      ok: false,
      error: 'Failed to set admin',
      message: error.message,
    })
  }
})

/**
 * PATCH /api/admin/remove-admin
 * Revoke admin access from a user by email
 * 
 * SECURITY: Only existing admins can revoke admin status
 */
adminRouter.patch('/remove-admin', authenticateJWT, async (req: Request, res: Response) => {
  try {
    // Check if requester is admin
    if (!req.user?.isAdmin) {
      return res.status(403).json({
        ok: false,
        error: 'Forbidden',
        message: 'Only admins can revoke admin access',
      })
    }

    const bodySchema = z.object({
      email: z.string().email(),
    })

    const parsed = bodySchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        error: 'Invalid request',
        details: parsed.error.flatten(),
      })
    }

    const { email } = parsed.data

    // Find user by email
    const artist = await prisma.artist.findUnique({
      where: { email },
    })

    if (!artist) {
      return res.status(404).json({
        ok: false,
        error: 'User not found',
      })
    }

    // Update user to non-admin
    const updatedArtist = await prisma.artist.update({
      where: { id: artist.id },
      data: {
        isAdmin: false,
      },
      select: {
        id: true,
        email: true,
        stageName: true,
        fullName: true,
        isAdmin: true,
        createdAt: true,
      },
    })

    return res.json({
      ok: true,
      message: `${email} admin access removed`,
      artist: updatedArtist,
    })
  } catch (error: any) {
    console.error('Remove admin error:', error)
    res.status(500).json({
      ok: false,
      error: 'Failed to remove admin',
      message: error.message,
    })
  }
})

/**
 * GET /api/admin/list
 * List all admin users
 * 
 * SECURITY: Only admins can view admin list
 */
adminRouter.get('/list', authenticateJWT, async (req: Request, res: Response) => {
  try {
    // Check if requester is admin
    if (!req.user?.isAdmin) {
      return res.status(403).json({
        ok: false,
        error: 'Forbidden',
        message: 'Only admins can view admin list',
      })
    }

    const admins = await prisma.artist.findMany({
      where: { isAdmin: true },
      select: {
        id: true,
        email: true,
        stageName: true,
        fullName: true,
        isAdmin: true,
        accountType: true,
        createdAt: true,
      },
    })

    return res.json({
      ok: true,
      admins,
    })
  } catch (error: any) {
    console.error('List admins error:', error)
    res.status(500).json({
      ok: false,
      error: 'Failed to list admins',
      message: error.message,
    })
  }
})
