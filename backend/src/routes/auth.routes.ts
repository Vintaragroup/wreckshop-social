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
 *   "projectId": "proj_xxx"
 * }
 */
router.get('/health', async (req: Request, res: Response) => {
  try {
    const projectId = process.env.STACK_PROJECT_ID;
    const secretKey = process.env.STACK_SECRET_SERVER_KEY;

    if (!projectId || !secretKey) {
      return res.status(500).json({
        success: false,
        message: 'Stack Auth not configured',
        missing: {
          projectId: !projectId,
          secretKey: !secretKey,
        },
      });
    }

    res.json({
      success: true,
      message: 'Stack Auth configured and ready',
      projectId,
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
 *   "profilePictureUrl": "https://..."
 * }
 */
router.get('/me', async (req: Request, res: Response) => {
  try {
    // TODO: Extract JWT from Authorization header
    // TODO: Verify JWT with Stack Auth
    // TODO: Return user info

    res.status(401).json({
      error: 'Not implemented',
      message: 'JWT verification middleware coming in Day 4',
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
 *   "email": "user@example.com"
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

    // TODO: Verify JWT with Stack Auth
    // TODO: Return verification result

    res.status(501).json({
      error: 'Not implemented',
      message: 'JWT verification coming in Day 4',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
