/**
 * Stack Auth Configuration
 * 
 * Stack Auth handles authentication, 2FA, OAuth tokens, and user sessions.
 * This file provides access to Stack Auth APIs via HTTP calls.
 * 
 * Docs: https://docs.stack-auth.com
 */

const projectId = process.env.STACK_PROJECT_ID;
const secretKey = process.env.STACK_SECRET_SERVER_KEY;

if (!projectId || !secretKey) {
  throw new Error(
    'Stack Auth configuration missing. Please set STACK_PROJECT_ID and STACK_SECRET_SERVER_KEY in .env or .env.local'
  );
}

/**
 * Stack Auth Configuration Object
 * 
 * Used for:
 * - Server-side JWT verification
 * - OAuth token validation
 * - Webhook verification
 * - Server-to-Stack Auth API calls
 */
export const stackAuthConfig = {
  projectId,
  secretServerKey: secretKey,
  baseUrl: 'https://api.stackframe.io',
};

/**
 * Helper function to verify JWT tokens from Stack Auth
 * Used to validate tokens sent by frontend
 */
export async function verifyStackAuthToken(token: string): Promise<any> {
  try {
    // In production, verify with Stack Auth API or use their SDK properly
    // For now, basic structure - you'll implement based on Stack Auth docs
    const response = await fetch(`${stackAuthConfig.baseUrl}/v1/tokens/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${stackAuthConfig.secretServerKey}`,
      },
      body: JSON.stringify({
        token,
        projectId: stackAuthConfig.projectId,
      }),
    });

    if (!response.ok) {
      throw new Error('Token verification failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Token verification error:', error);
    throw error;
  }
}

export default stackAuthConfig;
