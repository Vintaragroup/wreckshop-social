/**
 * Authentication Middleware
 * 
 * Handles:
 * - JWT token extraction from Authorization header
 * - Token verification with Stack Auth
 * - User context attachment to requests
 * - Error handling for auth failures
 */

import { Request, Response, NextFunction } from 'express';
import { verifyStackAuthToken } from '../stack-auth';
import { prisma } from '../prisma';

/**
 * Extend Express Request type to include authenticated user
 */
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        stackAuthUserId: string;
        email: string;
        displayName?: string;
        profilePictureUrl?: string;
        accountType?: string;
        isVerified?: boolean;
      };
      token?: string;
    }
  }
}

/**
 * Extract JWT token from Authorization header
 * 
 * Expected format: "Bearer <token>"
 * 
 * @param authHeader The Authorization header value
 * @returns The token string, or null if not found/invalid format
 */
export function extractToken(authHeader?: string): string | null {
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
}

/**
 * Verify JWT token with Stack Auth
 * 
 * @param token The JWT token to verify
 * @returns Decoded token payload with user info
 */
export async function verifyToken(token: string): Promise<any> {
  try {
    const decoded = await verifyStackAuthToken(token);
    return decoded;
  } catch (error) {
    console.error('[auth] Token verification failed:', error);
    throw new Error('Invalid token');
  }
}

/**
 * Middleware: Authenticate JWT token
 * 
 * Usage:
 * app.use('/api/protected', authenticateJWT, protectedRoute);
 * 
 * Behavior:
 * - Extracts JWT from Authorization header
 * - Verifies token with Stack Auth
 * - Fetches user profile from database
 * - Attaches user to req.user
 * - Returns 401 if token missing/invalid
 */
export async function authenticateJWT(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Extract token from header
    const token = extractToken(req.headers.authorization);
    if (!token) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing or invalid Authorization header. Expected: "Bearer <token>"',
      });
      return;
    }

    // Verify token with Stack Auth
    const decoded = await verifyToken(token);
    if (!decoded || !decoded.userId) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Token verification failed',
      });
      return;
    }

    // Fetch user profile from database
    const artist = await prisma.artist.findUnique({
      where: { stackAuthUserId: decoded.userId },
      select: {
        id: true,
        stackAuthUserId: true,
        email: true,
        stageName: true,
        profilePictureUrl: true,
        accountType: true,
        isVerified: true,
      },
    });

    if (!artist) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User profile not found. Please complete registration.',
      });
      return;
    }

    // Attach user to request
    req.user = {
      id: artist.id,
      stackAuthUserId: artist.stackAuthUserId,
      email: artist.email,
      displayName: artist.stageName,
      profilePictureUrl: artist.profilePictureUrl || undefined,
      accountType: artist.accountType,
      isVerified: artist.isVerified,
    };
    req.token = token;

    next();
  } catch (error) {
    console.error('[auth] Authentication error:', error);
    res.status(401).json({
      error: 'Unauthorized',
      message: error instanceof Error ? error.message : 'Authentication failed',
    });
  }
}

/**
 * Type definitions for role-based access control
 */
export type UserRole = 'ARTIST' | 'MANAGER' | 'ARTIST_AND_MANAGER';
export type Permission = 
  | 'viewAnalytics'
  | 'createCampaign'
  | 'editCampaign'
  | 'deleteCampaign'
  | 'postSocial'
  | 'editProfile'
  | 'configureIntegrations'
  | 'inviteCollaborator'
  | 'manageTeam';

/**
 * Middleware: Require user to be manager
 * 
 * Usage:
 * app.use('/api/manager', authenticateJWT, requireManager, managerRoute);
 * 
 * Checks if user's accountType is ARTIST_AND_MANAGER
 */
export async function requireManager(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (req.user.accountType !== 'ARTIST_AND_MANAGER') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'This endpoint requires manager account type',
      });
      return;
    }

    next();
  } catch (error) {
    console.error('[auth] Manager check error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Middleware: Check if user has permission to manage an artist
 * 
 * Usage:
 * app.post('/api/artists/:artistId/campaigns', authenticateJWT, requireManagerAccess, route);
 * 
 * Checks ManagerArtist relationship and specific permissions
 * 
 * @param permission The specific permission to check
 */
export function requireManagerAccess(permission: Permission) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { artistId } = req.params;
      if (!artistId) {
        res.status(400).json({
          error: 'Bad request',
          message: 'artistId parameter required',
        });
        return;
      }

      // Find manager relationship
      const relationship = await prisma.managerArtist.findFirst({
        where: {
          managerId: req.user.id,
          artistId: artistId,
          status: 'ACTIVE',
        },
      });

      if (!relationship) {
        res.status(403).json({
          error: 'Forbidden',
          message: 'You do not have access to manage this artist',
        });
        return;
      }

      // Check specific permission
      if (!(relationship as any)[permission]) {
        res.status(403).json({
          error: 'Forbidden',
          message: `Permission denied: ${permission}`,
        });
        return;
      }

      // Attach artist info to request for use in route handler
      (req as any).managedArtist = { artistId, relationship };

      next();
    } catch (error) {
      console.error('[auth] Manager access check error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}

/**
 * Middleware: Allow both artists and managers
 * 
 * Usage:
 * app.use('/api/dashboard', authenticateJWT, requireArtistOrManager, route);
 */
export async function requireArtistOrManager(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Both account types are allowed
    next();
  } catch (error) {
    console.error('[auth] Artist/Manager check error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Middleware: Optional authentication
 * 
 * Attempts to authenticate user but doesn't fail if token missing.
 * Useful for endpoints that have different behavior for authenticated users.
 * 
 * Usage:
 * app.use('/api/public', optionalAuth, publicRoute);
 */
export async function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractToken(req.headers.authorization);
    
    if (token) {
      try {
        const decoded = await verifyToken(token);
        if (decoded && decoded.userId) {
          const artist = await prisma.artist.findUnique({
            where: { stackAuthUserId: decoded.userId },
            select: {
              id: true,
              stackAuthUserId: true,
              email: true,
              stageName: true,
              profilePictureUrl: true,
              accountType: true,
              isVerified: true,
            },
          });

          if (artist) {
            req.user = {
              id: artist.id,
              stackAuthUserId: artist.stackAuthUserId,
              email: artist.email,
              displayName: artist.stageName,
              profilePictureUrl: artist.profilePictureUrl || undefined,
              accountType: artist.accountType,
              isVerified: artist.isVerified,
            };
            req.token = token;
          }
        }
      } catch (error) {
        // Silently fail - token was provided but invalid, log only
        console.debug('[auth] Optional token verification failed:', error instanceof Error ? error.message : error);
      }
    }

    next();
  } catch (error) {
    console.error('[auth] Optional auth error:', error);
    // Don't fail, just continue without user
    next();
  }
}

export default {
  extractToken,
  verifyToken,
  authenticateJWT,
  requireManager,
  requireManagerAccess,
  requireArtistOrManager,
  optionalAuth,
};
