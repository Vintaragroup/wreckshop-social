/**
 * Stack Auth Configuration
 * 
 * This file initializes the Stack Auth server application instance.
 * Stack Auth handles authentication, 2FA, OAuth tokens, and user sessions.
 * 
 * Docs: https://docs.stack-auth.com
 */

import { StackServerApp } from '@stackframe/stack';

const projectId = process.env.STACK_PROJECT_ID;
const secretKey = process.env.STACK_SECRET_SERVER_KEY;

if (!projectId || !secretKey) {
  throw new Error(
    'Stack Auth configuration missing. Please set STACK_PROJECT_ID and STACK_SECRET_SERVER_KEY in .env.local'
  );
}

/**
 * Stack Auth Server App Instance
 * 
 * Used for:
 * - Verifying JWT tokens from frontend
 * - Accessing OAuth token data
 * - Managing user sessions
 * - Handling webhooks
 */
const stackApp = new StackServerApp({
  projectId,
  secretServerKey: secretKey,
});

export default stackApp;
