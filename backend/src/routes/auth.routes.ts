/**
 * Authentication Routes
 * 
 * These routes handle:
 * - Stack Auth health checks
 * - JWT verification
 * - User information retrieval
 * - Session management
 * 
 * All protected routes use JWT tokens from Stack Auth
 */

import express, { Request, Response, NextFunction } from 'express';
import { stackAuthConfig } from '../lib/stack-auth.js';
import { authenticateJWT, extractToken, verifyToken } from '../lib/middleware/auth.middleware.js';
import { prisma } from '../lib/prisma.js';

const router = express.Router();

/**
 * GET /api/auth/health
 * 
 * Check if Stack Auth is properly configured.
 * Used for deployment verification.
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "Stack Auth configured and ready",
 *   "projectId": "63928c12-12fd-4780-82c4-b21c2706650f"
 * }
 */
router.get('/health', async (req: Request, res: Response) => {
  try {
    if (!stackAuthConfig.projectId || !stackAuthConfig.secretServerKey) {
      return res.status(500).json({
        success: false,
        message: 'Stack Auth not configured',
        missing: {
          projectId: !stackAuthConfig.projectId,
          secretKey: !stackAuthConfig.secretServerKey,
        },
      });
    }

    res.json({
      success: true,
      message: 'Stack Auth configured and ready',
      projectId: stackAuthConfig.projectId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/auth/me
 * 
 * Get current authenticated user information from Stack Auth token.
 * This endpoint is called by the frontend after login to fetch user data.
 * 
 * Headers:
 * - Authorization: Bearer <jwt_token>
 * 
 * Response:
 * {
 *   "id": "user_xxx",
 *   "email": "user@example.com",
 *   "displayName": "John Doe",
 *   "profilePictureUrl": "https://...",
 *   "accountType": "ARTIST_AND_MANAGER",
 *   "isVerified": true
 * }
 */
router.get('/me', authenticateJWT, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    res.json({
      id: req.user.id,
      email: req.user.email,
      displayName: req.user.displayName,
      profilePictureUrl: req.user.profilePictureUrl,
      accountType: req.user.accountType,
      isVerified: req.user.isVerified,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/auth/verify-jwt
 * 
 * Verify a JWT token. Used by frontend to validate token before making API calls.
 * 
 * Body:
 * {
 *   "token": "eyJhbGc..."
 * }
 * 
 * Response:
 * {
 *   "valid": true,
 *   "userId": "user_xxx",
 *   "email": "user@example.com",
 *   "displayName": "John Doe"
 * }
 */
router.post('/verify-jwt', async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        error: 'Token required',
      });
    }

    // Verify token with Stack Auth
    const decoded = await verifyToken(token);
    
    if (!decoded || !decoded.userId) {
      return res.json({
        valid: false,
        error: 'Invalid token',
      });
    }

    res.json({
      valid: true,
      userId: decoded.userId,
      email: decoded.email,
      displayName: decoded.displayName,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/auth/login
 * 
 * Frontend login endpoint.
 * Looks up user by email and returns auth token.
 * For demo purposes, uses local authentication instead of Stack Auth.
 * 
 * Body:
 * {
 *   "email": "user@example.com",
 *   "password": "password123"
 * }
 * 
 * Response:
 * {
 *   "data": {
 *     "accessToken": "eyJhbGc...",
 *     "user": {
 *       "id": "user_xxx",
 *       "email": "user@example.com",
 *       "name": "John Doe",
 *       "role": "ARTIST"
 *     }
 *   }
 * }
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password required',
      });
    }

    // Look up user by email
    const artist = await prisma.artist.findUnique({
      where: { email },
    });

    if (!artist) {
      // For demo, allow login without validation
      // In production, verify password hash
      const userId = `user_demo_${Date.now()}`;
      const newArtist = await prisma.artist.create({
        data: {
          stackAuthUserId: userId,
          email,
          stageName: email.split('@')[0],
          fullName: email.split('@')[0],
          accountType: 'ARTIST',
          isVerified: false,
        },
      });

      const mockToken = Buffer.from(JSON.stringify({
        userId: newArtist.stackAuthUserId,
        email: newArtist.email,
        displayName: newArtist.stageName,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400,
      })).toString('base64');

      return res.json({
        ok: true,
        data: {
          accessToken: mockToken,
          user: {
            id: newArtist.id,
            email: newArtist.email,
            name: newArtist.stageName,
            role: 'ARTIST',
          },
        },
      });
    }

    // User found, generate token
    const mockToken = Buffer.from(JSON.stringify({
      userId: artist.stackAuthUserId,
      email: artist.email,
      displayName: artist.stageName,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400,
    })).toString('base64');

    res.json({
      ok: true,
      data: {
        accessToken: mockToken,
        user: {
          id: artist.id,
          email: artist.email,
          name: artist.stageName,
          role: 'ARTIST',
        },
      },
    });
  } catch (error) {
    console.error('[auth] Login error:', error);
    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/auth/signup
 * 
 * Frontend signup endpoint.
 * Creates a new user account in the database.
 * For demo purposes, uses local authentication instead of Stack Auth.
 * 
 * Body:
 * {
 *   "email": "user@example.com",
 *   "password": "password123",
 *   "name": "John Doe"
 * }
 * 
 * Response:
 * {
 *   "data": {
 *     "accessToken": "eyJhbGc...",
 *     "user": {
 *       "id": "user_xxx",
 *       "email": "user@example.com",
 *       "name": "John Doe",
 *       "role": "ARTIST"
 *     }
 *   }
 * }
 */
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        error: 'Email, password, and name required',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters',
      });
    }

    // Check if user already exists
    const existingArtist = await prisma.artist.findUnique({
      where: { email },
    });

    if (existingArtist) {
      return res.status(400).json({
        error: 'Email already registered',
      });
    }

    // Create new artist/user in database
    // In production, this would use Stack Auth's API
    const userId = `user_demo_${Date.now()}`;
    
    const artist = await prisma.artist.create({
      data: {
        stackAuthUserId: userId,
        email,
        stageName: name,
        fullName: name,
        accountType: 'ARTIST',
        isVerified: false,
      },
    });

    // Generate demo token
    const mockToken = Buffer.from(JSON.stringify({
      userId: artist.stackAuthUserId,
      email: artist.email,
      displayName: artist.stageName,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400,
    })).toString('base64');

    res.json({
      ok: true,
      data: {
        accessToken: mockToken,
        user: {
          id: artist.id,
          email: artist.email,
          name: artist.stageName,
          role: 'ARTIST',
        },
      },
    });
  } catch (error) {
    console.error('[auth] Signup error:', error);
    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/auth/logout
 * 
 * Frontend logout endpoint.
 * Handles any cleanup needed on the backend.
 * 
 * Headers:
 * - Authorization: Bearer <token>
 * 
 * Response:
 * {
 *   "ok": true,
 *   "message": "Logged out successfully"
 * }
 */
router.post('/logout', authenticateJWT, async (req: Request, res: Response) => {
  try {
    // Any backend cleanup can go here
    res.json({
      ok: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/auth/refresh
 * 
 * Refresh an expired token.
 * 
 * Headers:
 * - Authorization: Bearer <token>
 * 
 * Response:
 * {
 *   "ok": true,
 *   "data": {
 *     "accessToken": "eyJhbGc..."
 *   }
 * }
 */
router.post('/refresh', authenticateJWT, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        ok: false,
        error: 'User not authenticated',
      });
    }

    // Generate a new token
    const newToken = Buffer.from(JSON.stringify({
      userId: req.user.id,
      email: req.user.email,
      displayName: req.user.displayName,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400, // 24 hours
    })).toString('base64');

    res.json({
      ok: true,
      data: {
        accessToken: newToken,
      },
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
