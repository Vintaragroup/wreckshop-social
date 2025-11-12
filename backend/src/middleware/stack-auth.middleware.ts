/**
 * Stack Auth JWT Validation Middleware
 * 
 * Validates Stack Auth JWT tokens from the Authorization header.
 * Extracts user ID and makes it available on req.user
 */

import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

export interface StackAuthUser {
  id: string;
  email: string;
  displayName?: string;
  primaryEmail?: string;
}

// Extend Express Request to include Stack Auth user
declare global {
  namespace Express {
    interface Request {
      stackAuthUser?: StackAuthUser;
    }
  }
}

/**
 * Validate Stack Auth JWT Token
 * 
 * Verifies the token by calling Stack Auth's verify endpoint.
 * If valid, attaches user data to req.stackAuthUser
 */
export async function validateStackAuthToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing or invalid Authorization header' });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token with Stack Auth
    const verifyResponse = await axios.get(
      'https://api.stack-auth.com/api/v1/auth/sessions',
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Stack-Project-Id': process.env.STACK_PROJECT_ID,
          'X-Stack-Publishable-Client-Key': process.env.STACK_CLIENT_KEY,
          'X-Stack-Access-Type': 'client',
        },
      }
    );

    const user = verifyResponse.data;

    if (!user || !user.id) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    // Attach user to request
    req.stackAuthUser = {
      id: user.id,
      email: user.primaryEmail || '',
      displayName: user.displayName || '',
      primaryEmail: user.primaryEmail || '',
    };

    next();
  } catch (error) {
    console.error('[AUTH] Token validation failed:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
}

/**
 * Optional authentication middleware
 * 
 * Tries to validate token, but doesn't fail if it's missing.
 * Useful for endpoints that work for both authenticated and unauthenticated users.
 */
export async function optionalStackAuthToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided, continue without authentication
      next();
      return;
    }

    const token = authHeader.substring(7);

    const verifyResponse = await axios.get(
      'https://api.stack-auth.com/api/v1/auth/sessions',
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Stack-Project-Id': process.env.STACK_PROJECT_ID,
          'X-Stack-Publishable-Client-Key': process.env.STACK_CLIENT_KEY,
          'X-Stack-Access-Type': 'client',
        },
      }
    );

    const user = verifyResponse.data;

    if (user && user.id) {
      req.stackAuthUser = {
        id: user.id,
        email: user.primaryEmail || '',
        displayName: user.displayName || '',
        primaryEmail: user.primaryEmail || '',
      };
    }

    next();
  } catch (error) {
    // Token validation failed, continue without authentication
    console.warn('[AUTH] Optional token validation skipped:', error instanceof Error ? error.message : 'Unknown error');
    next();
  }
}

/**
 * Extract user ID from request
 * Used in protected routes to get the authenticated user's ID
 */
export function getStackAuthUserId(req: Request): string {
  const stackAuthUser = (req as any).stackAuthUser as StackAuthUser | undefined;
  if (!stackAuthUser?.id) {
    throw new Error('User not authenticated');
  }
  return stackAuthUser.id;
}
