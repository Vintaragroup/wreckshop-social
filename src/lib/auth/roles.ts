/**
 * Role-Based Access Control (RBAC) Utilities
 * 
 * Provides permission checking and role helpers for conditional UI rendering
 */

import { AuthUser } from './context';

export type AccountType = 'ARTIST' | 'ARTIST_AND_MANAGER';
export type UserRole = 'ARTIST' | 'MANAGER' | 'ADMIN';

/**
 * Check if user is an artist who can manage other artists
 */
export function isManager(user: AuthUser | null): boolean {
  if (!user) return false;
  return user.accountType === 'ARTIST_AND_MANAGER';
}

/**
 * Check if user is just an artist (cannot manage others)
 */
export function isArtistOnly(user: AuthUser | null): boolean {
  if (!user) return false;
  return user.accountType === 'ARTIST';
}

/**
 * Check if user has admin role
 */
export function isAdmin(user: AuthUser | null): boolean {
  if (!user) return false;
  // Check both the new isAdmin boolean field and the legacy role field
  return user.isAdmin === true || user.role === 'ADMIN';
}

/**
 * Check if user can access campaign features
 * - Managers can create and manage campaigns
 * - Artists can IF granted permission by manager
 */
export function canCreateCampaigns(user: AuthUser | null): boolean {
  if (!user) return false;
  if (isManager(user) || isAdmin(user)) return true;
  // Artist can create campaigns if granted permission
  return user.permissions?.createCampaigns ?? false;
}

/**
 * Check if user can access audience management
 * - Managers can view and manage audiences
 * - Artists have read-only access IF granted permission
 */
export function canManageAudience(user: AuthUser | null): boolean {
  if (!user) return false;
  if (isManager(user) || isAdmin(user)) return true;
  // Artist can manage audience if granted permission
  return user.permissions?.viewAnalytics ?? false;
}

/**
 * Check if user can access integrations
 * - Managers can configure integrations
 * - Artists CAN configure integrations (to connect their accounts)
 */
export function canConfigureIntegrations(user: AuthUser | null): boolean {
  if (!user) return false;
  if (isManager(user) || isAdmin(user)) return true;
  // Artists can ALWAYS configure integrations (connect their own accounts)
  return user.permissions?.configureIntegrations ?? true;
}

/**
 * Check if user can manage team/collaborators
 * - Only managers can add team members
 */
export function canManageTeam(user: AuthUser | null): boolean {
  if (!user) return false;
  return isManager(user) || isAdmin(user);
}

/**
 * Get feature availability for the current user
 */
export function getFeatureAvailability(user: AuthUser | null) {
  return {
    campaigns: canCreateCampaigns(user),
    audience: canManageAudience(user),
    integrations: canConfigureIntegrations(user),
    team: canManageTeam(user),
    analytics: !!user, // All authenticated users can view analytics
    compliance: !!user, // All authenticated users can view compliance
    settings: !!user, // All authenticated users can access settings
  };
}

/**
 * Get display name for user type
 */
export function getAccountTypeLabel(accountType?: AccountType): string {
  switch (accountType) {
    case 'ARTIST_AND_MANAGER':
      return 'Artist & Manager';
    case 'ARTIST':
      return 'Artist';
    default:
      return 'User';
  }
}
