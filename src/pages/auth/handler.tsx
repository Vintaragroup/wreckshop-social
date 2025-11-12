/**
 * Stack Auth Handler Component
 * 
 * This component provides the authentication pages (signup, signin, etc.)
 * as a catch-all route that Stack Auth can handle.
 * 
 * Stack Auth provides built-in UI for:
 * - /handler/sign-up
 * - /handler/sign-in
 * - /handler/account-settings
 * - And more...
 */

import { StackHandler } from '@stackframe/stack';

export function StackAuthHandler() {
  return <StackHandler />;
}

export default StackAuthHandler;
