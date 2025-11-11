/**
 * API Client
 * Type-safe API client for backend communication with request/response interceptors
 */

import * as Types from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4002';

// ============================================================================
// Request/Response Interceptors
// ============================================================================

interface RequestConfig extends RequestInit {
  token?: string;
  params?: Record<string, any>;
}

type RequestInterceptor = (config: RequestConfig) => RequestConfig;
type ResponseInterceptor = (response: Response) => Promise<Response>;
type ErrorInterceptor = (error: unknown) => void;

const requestInterceptors: RequestInterceptor[] = [];
const responseInterceptors: ResponseInterceptor[] = [];
const errorInterceptors: ErrorInterceptor[] = [];

export const api = {
  // Interceptor management
  addRequestInterceptor(interceptor: RequestInterceptor) {
    requestInterceptors.push(interceptor);
  },

  addResponseInterceptor(interceptor: ResponseInterceptor) {
    responseInterceptors.push(interceptor);
  },

  addErrorInterceptor(interceptor: ErrorInterceptor) {
    errorInterceptors.push(interceptor);
  },

  // ============================================================================
  // Internal Fetch Method
  // ============================================================================

  async _fetch<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<Types.ApiResponse<T>> {
    let finalConfig = { ...config };

    // Apply request interceptors
    for (const interceptor of requestInterceptors) {
      finalConfig = interceptor(finalConfig);
    }

    // Build URL with query params
    let url = `${API_BASE_URL}${endpoint}`;
    if (finalConfig.params) {
      const searchParams = new URLSearchParams();
      Object.entries(finalConfig.params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
      url = `${url}?${searchParams.toString()}`;
      delete finalConfig.params;
    }

    // Set default headers
    const headers = new Headers(finalConfig.headers || {});
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    // Add auth token if provided
    if (finalConfig.token) {
      headers.set('Authorization', `Bearer ${finalConfig.token}`);
      delete finalConfig.token;
    }

    finalConfig.headers = headers;

    try {
      let response = await fetch(url, finalConfig);

      // Apply response interceptors
      for (const interceptor of responseInterceptors) {
        response = await interceptor(response);
      }

      const contentType = response.headers.get('content-type');
      const isJson = contentType?.includes('application/json');
      const data = isJson ? await response.json() : await response.text();

      if (!response.ok) {
        const error = new Error(
          data?.message || data?.error || `HTTP ${response.status}`
        );
        (error as any).status = response.status;
        (error as any).data = data;
        throw error;
      }

      return data as Types.ApiResponse<T>;
    } catch (error) {
      for (const interceptor of errorInterceptors) {
        interceptor(error);
      }
      throw error;
    }
  },

  // ============================================================================
  // Manager Endpoints - Artists
  // ============================================================================

  artists: {
    /**
     * Create a new artist
     * POST /api/manager/artists
     */
    async create(data: Types.CreateArtistRequest, token: string) {
      return api._fetch<Types.Artist>('/api/manager/artists', {
        method: 'POST',
        body: JSON.stringify(data),
        token,
      });
    },

    /**
     * List all artists managed by the current user
     * GET /api/manager/artists
     */
    async list(params?: Types.ListQuery, token?: string) {
      return api._fetch<Types.Artist[]>('/api/manager/artists', {
        method: 'GET',
        params,
        token,
      });
    },

    /**
     * Get a specific artist
     * GET /api/manager/artists/:id
     */
    async get(id: string, token?: string) {
      return api._fetch<Types.Artist>(`/api/manager/artists/${id}`, {
        method: 'GET',
        token,
      });
    },

    /**
     * Update an artist
     * PUT /api/manager/artists/:id
     */
    async update(id: string, data: Types.UpdateArtistRequest, token: string) {
      return api._fetch<Types.Artist>(`/api/manager/artists/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        token,
      });
    },

    /**
     * Delete an artist
     * DELETE /api/manager/artists/:id
     */
    async delete(id: string, token: string) {
      return api._fetch<void>(`/api/manager/artists/${id}`, {
        method: 'DELETE',
        token,
      });
    },

    /**
     * Change artist status
     * PUT /api/manager/artists/:id/status
     */
    async changeStatus(
      id: string,
      data: Types.ChangeArtistStatusRequest,
      token: string
    ) {
      return api._fetch<Types.Artist>(`/api/manager/artists/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify(data),
        token,
      });
    },
  },

  // ============================================================================
  // Manager Endpoints - Campaigns
  // ============================================================================

  campaigns: {
    /**
     * Create a new campaign
     * POST /api/manager/campaigns
     */
    async create(data: Types.CreateCampaignRequest, token: string) {
      return api._fetch<Types.Campaign>('/api/manager/campaigns', {
        method: 'POST',
        body: JSON.stringify(data),
        token,
      });
    },

    /**
     * List all campaigns
     * GET /api/manager/campaigns
     */
    async list(params?: Types.ListQuery, token?: string) {
      return api._fetch<Types.Campaign[]>('/api/manager/campaigns', {
        method: 'GET',
        params,
        token,
      });
    },

    /**
     * Get a specific campaign
     * GET /api/manager/campaigns/:id
     */
    async get(id: string, token?: string) {
      return api._fetch<Types.Campaign>(`/api/manager/campaigns/${id}`, {
        method: 'GET',
        token,
      });
    },

    /**
     * Update a campaign
     * PUT /api/manager/campaigns/:id
     */
    async update(id: string, data: Types.UpdateCampaignRequest, token: string) {
      return api._fetch<Types.Campaign>(`/api/manager/campaigns/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        token,
      });
    },

    /**
     * Delete a campaign
     * DELETE /api/manager/campaigns/:id
     */
    async delete(id: string, token: string) {
      return api._fetch<void>(`/api/manager/campaigns/${id}`, {
        method: 'DELETE',
        token,
      });
    },
  },

  // ============================================================================
  // Manager Endpoints - Integrations
  // ============================================================================

  integrations: {
    /**
     * List all integrations
     * GET /api/manager/integrations
     */
    async list(token?: string) {
      return api._fetch<Types.Integration[]>('/api/manager/integrations', {
        method: 'GET',
        token,
      });
    },

    /**
     * Connect a platform integration
     * POST /api/manager/integrations
     */
    async connect(data: Types.ConnectIntegrationRequest, token: string) {
      return api._fetch<Types.Integration>('/api/manager/integrations', {
        method: 'POST',
        body: JSON.stringify(data),
        token,
      });
    },

    /**
     * Disconnect an integration
     * DELETE /api/manager/integrations/:id
     */
    async disconnect(id: string, token: string) {
      return api._fetch<void>(`/api/manager/integrations/${id}`, {
        method: 'DELETE',
        token,
      });
    },
  },

  // ============================================================================
  // Manager Endpoints - Content
  // ============================================================================

  content: {
    releases: {
      async create(data: Types.CreateReleaseRequest, token: string) {
        return api._fetch<Types.Release>('/api/manager/releases', {
          method: 'POST',
          body: JSON.stringify(data),
          token,
        });
      },

      async list(params?: Types.ListQuery, token?: string) {
        return api._fetch<Types.Release[]>('/api/manager/releases', {
          method: 'GET',
          params,
          token,
        });
      },

      async get(id: string, token?: string) {
        return api._fetch<Types.Release>(`/api/manager/releases/${id}`, {
          method: 'GET',
          token,
        });
      },

      async update(id: string, data: Partial<Types.Release>, token: string) {
        return api._fetch<Types.Release>(`/api/manager/releases/${id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
          token,
        });
      },

      async delete(id: string, token: string) {
        return api._fetch<void>(`/api/manager/releases/${id}`, {
          method: 'DELETE',
          token,
        });
      },
    },

    events: {
      async create(data: Types.CreateEventRequest, token: string) {
        return api._fetch<Types.Event>('/api/manager/events', {
          method: 'POST',
          body: JSON.stringify(data),
          token,
        });
      },

      async list(params?: Types.ListQuery, token?: string) {
        return api._fetch<Types.Event[]>('/api/manager/events', {
          method: 'GET',
          params,
          token,
        });
      },

      async get(id: string, token?: string) {
        return api._fetch<Types.Event>(`/api/manager/events/${id}`, {
          method: 'GET',
          token,
        });
      },

      async update(id: string, data: Partial<Types.Event>, token: string) {
        return api._fetch<Types.Event>(`/api/manager/events/${id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
          token,
        });
      },

      async delete(id: string, token: string) {
        return api._fetch<void>(`/api/manager/events/${id}`, {
          method: 'DELETE',
          token,
        });
      },
    },
  },

  // ============================================================================
  // Manager Endpoints - Analytics
  // ============================================================================

  analytics: {
    async getOverview(token: string) {
      return api._fetch<any>('/api/manager/analytics/overview', {
        method: 'GET',
        token,
      });
    },

    segments: {
      async create(data: Types.CreateSegmentRequest, token: string) {
        return api._fetch<Types.Segment>('/api/manager/analytics/segments', {
          method: 'POST',
          body: JSON.stringify(data),
          token,
        });
      },

      async list(token?: string) {
        return api._fetch<Types.Segment[]>('/api/manager/analytics/segments', {
          method: 'GET',
          token,
        });
      },

      async get(id: string, token?: string) {
        return api._fetch<Types.Segment>(
          `/api/manager/analytics/segments/${id}`,
          {
            method: 'GET',
            token,
          }
        );
      },

      async update(id: string, data: Partial<Types.Segment>, token: string) {
        return api._fetch<Types.Segment>(
          `/api/manager/analytics/segments/${id}`,
          {
            method: 'PUT',
            body: JSON.stringify(data),
            token,
          }
        );
      },

      async delete(id: string, token: string) {
        return api._fetch<void>(`/api/manager/analytics/segments/${id}`, {
          method: 'DELETE',
          token,
        });
      },
    },
  },

  // ============================================================================
  // Dashboard Endpoints - Public
  // ============================================================================

  dashboard: {
    /**
     * Get artist leaderboard
     * GET /api/dashboard/leaderboard
     */
    async getLeaderboard(params?: Types.LeaderboardQuery) {
      return api._fetch<Types.LeaderboardResponse>('/api/dashboard/leaderboard', {
        method: 'GET',
        params,
      });
    },

    /**
     * Get trending artists
     * GET /api/dashboard/trending
     */
    async getTrending(params?: Types.TrendingQuery) {
      return api._fetch<Types.PaginatedResponse<Types.TrendingArtist>>(
        '/api/dashboard/trending',
        {
          method: 'GET',
          params,
        }
      );
    },

    /**
     * Discover artists by genre
     * GET /api/dashboard/discover
     */
    async discover(params: Types.DiscoveryQuery) {
      return api._fetch<Types.PaginatedResponse<Types.DiscoveryArtist>>(
        '/api/dashboard/discover',
        {
          method: 'GET',
          params,
        }
      );
    },

    /**
     * Search artists
     * GET /api/dashboard/artists/search
     */
    async search(params: Types.SearchQuery) {
      return api._fetch<Types.PaginatedResponse<Types.DiscoveryArtist>>(
        '/api/dashboard/artists/search',
        {
          method: 'GET',
          params,
        }
      );
    },

    /**
     * Get public artist profile
     * GET /api/dashboard/artists/:id
     */
    async getArtistProfile(id: string) {
      return api._fetch<Types.ArtistProfile>(`/api/dashboard/artists/${id}`, {
        method: 'GET',
      });
    },

    /**
     * Get manager dashboard overview
     * GET /api/dashboard/manager
     */
    async getManagerDashboard(token: string) {
      return api._fetch<Types.ManagerDashboardData>('/api/dashboard/manager', {
        method: 'GET',
        token,
      });
    },
  },
};

// ============================================================================
// Export for use in components
// ============================================================================

export default api;
export * from './types';
