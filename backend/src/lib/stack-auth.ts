/**
 * Stack Auth Configuration
 * 
 * Stack Auth handles authentication, 2FA, OAuth tokens, and user sessions.
 * This file provides access to Stack Auth APIs via HTTP calls.
 * 
 * Docs: https://docs.stack-auth.com
 */

import { env } from '../env'

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
  projectId: env.STACK_PROJECT_ID,
  clientKey: env.STACK_CLIENT_KEY,
  secretServerKey: env.STACK_SERVER_KEY,
  webhookSecret: env.STACK_WEBHOOK_SECRET,
  apiBaseUrl: env.STACK_API_URL.replace(/\/$/, ''),
}

/**
 * Helper function to verify JWT tokens from Stack Auth
 * Used to validate tokens sent by frontend
 */
export async function verifyStackAuthToken(token: string): Promise<any> {
  try {
    if (!token) {
      throw new Error('Missing Stack Auth token')
    }

    const response = await fetch(`${stackAuthConfig.apiBaseUrl}/api/v1/users/me`, {
      headers: {
        'x-stack-access-type': 'server',
        'x-stack-project-id': stackAuthConfig.projectId,
        'x-stack-secret-server-key': stackAuthConfig.secretServerKey,
        'x-stack-access-token': token,
      },
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(`Token verification failed: ${response.status} ${errorBody}`)
    }

    const data = await response.json()

    return {
      raw: data,
      userId: data.id ?? data.user_id ?? data.userId,
      email: data.primaryEmail ?? data.email ?? data.user?.primaryEmail,
      displayName: data.displayName ?? data.fullName ?? data.name,
    }
  } catch (error) {
    console.error('[stack-auth] Token verification error:', error)
    throw error
  }
}

export default stackAuthConfig;
