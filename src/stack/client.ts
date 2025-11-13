/**
 * Stack Client (Deprecated)
 * 
 * This file is no longer used since we switched to Stack Auth's hosted sign-in flow
 * (app.stack-auth.com/{projectId}/sign-in?provider=...).
 * 
 * We handle OAuth callbacks at /auth/oauth/callback/:provider with our own
 * AuthContext (src/lib/auth/context.tsx) for session management.
 * 
 * The @stackframe/stack SDK package is incompatible with our Vite/React setup
 * and is not needed for the hosted flow approach.
 */

export default null;
