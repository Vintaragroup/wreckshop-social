/**
 * API Type Definitions
 * Auto-generated types from backend schemas
 */

// ============================================================================
// Artist Types
// ============================================================================

export interface Artist {
  id: string;
  userId: string;
  stageName: string;
  email: string;
  bio: string;
  profileImage: string;
  genres: string[];
  region: string;
  isVerified: boolean;
  leaderboardScore: number;
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export interface ArtistProfile extends Artist {
  integrations: {
    spotify?: {
      connected: boolean;
      followers?: number;
      monthlyListeners?: number;
    };
    instagram?: {
      connected: boolean;
      followers?: number;
      handle?: string;
    };
    youtube?: {
      connected: boolean;
      subscribers?: number;
      handle?: string;
    };
  };
  stats: {
    totalFollowers: number;
    engagementRate: number;
    averagePlayCount: number;
  };
}

export interface CreateArtistRequest {
  stageName: string;
  email: string;
  bio?: string;
  profileImage?: string;
  genres?: string[];
  region?: string;
}

export interface UpdateArtistRequest {
  stageName?: string;
  bio?: string;
  profileImage?: string;
  genres?: string[];
  region?: string;
  leaderboardScore?: number;
}

export interface ChangeArtistStatusRequest {
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE' | 'REJECTED';
  reason?: string;
}

// ============================================================================
// Campaign Types
// ============================================================================

export interface Campaign {
  id: string;
  managerId: string;
  artistId: string;
  name: string;
  description: string;
  type: 'EMAIL' | 'SMS' | 'SOCIAL' | 'MULTI_CHANNEL';
  status: 'DRAFT' | 'SCHEDULED' | 'LIVE' | 'PAUSED' | 'COMPLETED';
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignVariant {
  id: string;
  campaignId: string;
  name: string;
  content: string;
  isControl: boolean;
  conversionRate: number;
  createdAt: string;
}

export interface CreateCampaignRequest {
  artistId: string;
  name: string;
  description: string;
  type: 'EMAIL' | 'SMS' | 'SOCIAL' | 'MULTI_CHANNEL';
  startDate: string;
  endDate: string;
}

export interface UpdateCampaignRequest {
  name?: string;
  description?: string;
  status?: 'DRAFT' | 'SCHEDULED' | 'LIVE' | 'PAUSED' | 'COMPLETED';
  startDate?: string;
  endDate?: string;
}

// ============================================================================
// Integration Types
// ============================================================================

export interface Integration {
  id: string;
  managerId: string;
  platform: 'SPOTIFY' | 'INSTAGRAM' | 'YOUTUBE' | 'TIKTOK' | 'TWITTER';
  status: 'CONNECTED' | 'DISCONNECTED' | 'EXPIRED' | 'ERROR';
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConnectIntegrationRequest {
  platform: 'SPOTIFY' | 'INSTAGRAM' | 'YOUTUBE' | 'TIKTOK' | 'TWITTER';
  code?: string;
  state?: string;
}

// ============================================================================
// Release & Event Types
// ============================================================================

export interface Release {
  id: string;
  managerId: string;
  artistId: string;
  title: string;
  description: string;
  releaseDate: string;
  coverArt: string;
  type: 'SINGLE' | 'EP' | 'ALBUM';
  genre: string;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  managerId: string;
  artistId: string;
  title: string;
  description: string;
  eventDate: string;
  venue: string;
  city: string;
  country: string;
  ticketUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReleaseRequest {
  artistId: string;
  title: string;
  description: string;
  releaseDate: string;
  coverArt?: string;
  type: 'SINGLE' | 'EP' | 'ALBUM';
  genre: string;
}

export interface CreateEventRequest {
  artistId: string;
  title: string;
  description: string;
  eventDate: string;
  venue: string;
  city: string;
  country: string;
  ticketUrl?: string;
}

// ============================================================================
// Dashboard Types
// ============================================================================

export interface LeaderboardEntry {
  rank: number;
  id: string;
  stageName: string;
  score: number;
  genres: string[];
  followers?: number;
  engagementRate?: number;
}

export interface TrendingArtist {
  id: string;
  stageName: string;
  genres: string[];
  score: number;
  trend: number;
  region: string;
}

export interface DiscoveryArtist {
  id: string;
  stageName: string;
  genres: string[];
  region: string;
  score: number;
}

export interface ManagerDashboardData {
  totalArtistsManaged: number;
  totalFollowers: number;
  totalEngagementRate: number;
  topArtist: {
    id: string;
    stageName: string;
    email: string;
    leaderboardScore: number;
  };
  byStatus: {
    ACTIVE: number;
    PENDING: number;
    INACTIVE: number;
    REJECTED: number;
  };
  recentActivity: Array<{
    type: string;
    artistName: string;
    timestamp: string;
  }>;
}

// ============================================================================
// Analytics Types
// ============================================================================

export interface Segment {
  id: string;
  managerId: string;
  name: string;
  description: string;
  filters: Record<string, unknown>;
  audienceSize: number;
  createdAt: string;
  updatedAt: string;
}

export interface SegmentAttribute {
  id: string;
  segmentId: string;
  key: string;
  value: string;
  matchType: 'EXACT' | 'CONTAINS' | 'REGEX';
}

export interface CreateSegmentRequest {
  name: string;
  description: string;
  filters: Record<string, unknown>;
}

// ============================================================================
// API Response Wrappers
// ============================================================================

export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  ok: boolean;
  data: T[];
  total: number;
  page?: number;
  limit?: number;
}

export interface LeaderboardResponse {
  ok: boolean;
  data: LeaderboardEntry[];
  total: number;
}

// ============================================================================
// Auth Types
// ============================================================================

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ARTIST' | 'MANAGER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Query Parameters
// ============================================================================

export interface LeaderboardQuery {
  metric?: 'leaderboardScore' | 'followersCount' | 'engagementRate';
  genre?: string;
  timeframe?: 'all' | 'month' | 'week';
  limit?: number;
  page?: number;
}

export interface TrendingQuery {
  timeframe?: 'week' | 'month' | 'all';
  limit?: number;
  page?: number;
}

export interface DiscoveryQuery {
  genre: string;
  limit?: number;
  page?: number;
}

export interface SearchQuery {
  q: string;
  limit?: number;
  page?: number;
}

export interface ListQuery {
  limit?: number;
  page?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}
