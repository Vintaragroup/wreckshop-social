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

export default router;
