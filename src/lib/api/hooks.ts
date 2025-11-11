/**
 * API Hooks
 * React hooks for API interactions with error handling and loading states
 */

import { useState, useCallback, useEffect } from 'react';
import api from './client';
import * as Types from './types';

// ============================================================================
// Generic Hook for API Calls
// ============================================================================

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  token?: string;
}

export function useApi<T>(
  asyncFn: (token?: string) => Promise<Types.ApiResponse<T>>,
  options: UseApiOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (token?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await asyncFn(token || options.token);
      if (response.ok && response.data) {
        setData(response.data);
        options.onSuccess?.(response.data);
      } else {
        throw new Error(response.error || 'Unknown error');
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options.onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [asyncFn, options]);

  return { data, loading, error, execute };
}

// ============================================================================
// Artist Hooks
// ============================================================================

export function useArtists(token?: string) {
  return useApi(() => api.artists.list(undefined, token), { token });
}

export function useArtist(id: string, token?: string) {
  return useApi(() => api.artists.get(id, token), { token });
}

export function useCreateArtist() {
  return useCallback(
    (data: Types.CreateArtistRequest, token: string) =>
      api.artists.create(data, token),
    []
  );
}

export function useUpdateArtist() {
  return useCallback(
    (id: string, data: Types.UpdateArtistRequest, token: string) =>
      api.artists.update(id, data, token),
    []
  );
}

export function useDeleteArtist() {
  return useCallback((id: string, token: string) => api.artists.delete(id, token), []);
}

// ============================================================================
// Campaigns Hooks
// ============================================================================

export function useCampaigns(token?: string) {
  return useApi(() => api.campaigns.list(undefined, token), { token });
}

export function useCampaign(id: string, token?: string) {
  return useApi(() => api.campaigns.get(id, token), { token });
}

export function useCreateCampaign() {
  return useCallback(
    (data: Types.CreateCampaignRequest, token: string) =>
      api.campaigns.create(data, token),
    []
  );
}

export function useUpdateCampaign() {
  return useCallback(
    (id: string, data: Types.UpdateCampaignRequest, token: string) =>
      api.campaigns.update(id, data, token),
    []
  );
}

export function useDeleteCampaign() {
  return useCallback(
    (id: string, token: string) => api.campaigns.delete(id, token),
    []
  );
}

// ============================================================================
// Integrations Hooks
// ============================================================================

export function useIntegrations(token?: string) {
  return useApi(() => api.integrations.list(token), { token });
}

export function useConnectIntegration() {
  return useCallback(
    (data: Types.ConnectIntegrationRequest, token: string) =>
      api.integrations.connect(data, token),
    []
  );
}

export function useDisconnectIntegration() {
  return useCallback(
    (id: string, token: string) => api.integrations.disconnect(id, token),
    []
  );
}

// ============================================================================
// Content Hooks
// ============================================================================

export function useReleases(token?: string) {
  return useApi(() => api.content.releases.list(undefined, token), { token });
}

export function useEvents(token?: string) {
  return useApi(() => api.content.events.list(undefined, token), { token });
}

export function useCreateRelease() {
  return useCallback(
    (data: Types.CreateReleaseRequest, token: string) =>
      api.content.releases.create(data, token),
    []
  );
}

export function useCreateEvent() {
  return useCallback(
    (data: Types.CreateEventRequest, token: string) =>
      api.content.events.create(data, token),
    []
  );
}

// ============================================================================
// Analytics Hooks
// ============================================================================

export function useAnalyticsOverview(token: string) {
  return useApi(() => api.analytics.getOverview(token), { token });
}

export function useSegments(token?: string) {
  return useApi(() => api.analytics.segments.list(token), { token });
}

// ============================================================================
// Dashboard Hooks
// ============================================================================

export function useLeaderboard(params?: Types.LeaderboardQuery) {
  return useApi(() => api.dashboard.getLeaderboard(params));
}

export function useTrendingArtists(params?: Types.TrendingQuery) {
  return useApi(() => api.dashboard.getTrending(params));
}

export function useDiscoverArtists(genre: string) {
  return useApi(() =>
    api.dashboard.discover({
      genre,
      limit: 20,
    })
  );
}

export function useSearchArtists(query: string) {
  return useApi(() =>
    api.dashboard.search({
      q: query,
      limit: 20,
    })
  );
}

export function useArtistProfile(id: string) {
  return useApi(() => api.dashboard.getArtistProfile(id));
}

export function useManagerDashboard(token: string) {
  const [data, setData] = useState<Types.ManagerDashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.dashboard.getManagerDashboard(token);
        if (response.ok && response.data) {
          setData(response.data);
        } else {
          throw new Error(response.error || 'Failed to fetch manager dashboard');
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  return { data, loading, error };
}
