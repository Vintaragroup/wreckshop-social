import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiListProfiles, apiEnqueueIngest, apiDiscover, ProfileDTO, DiscoverCandidateDTO, apiGetProfileCounts, type Provider } from '../lib/api'

export function useProfiles(q?: string, provider?: Provider, tag?: string) {
  return useQuery({
    queryKey: ['profiles', q ?? '', provider ?? '', tag ?? ''],
    queryFn: () => apiListProfiles(q, provider, tag),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  })
}

export function useIngestProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (params: { provider: Provider; handleOrUrl: string; accessToken?: string }) =>
      apiEnqueueIngest(params),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['profiles'] })
    },
  })
}

export type { ProfileDTO }

export function useDiscover(provider: 'soundcloud' | 'deezer' | 'youtube' | 'audius' | 'lastfm', q: string, genre?: string, limit = 20) {
  return useQuery({
    queryKey: ['discover', provider, q, genre ?? '', String(limit)],
    queryFn: () => ((q.trim().length > 0 || !!(genre && genre.trim().length)) ? apiDiscover(provider, q, limit, genre) : Promise.resolve([] as DiscoverCandidateDTO[])),
    enabled: q.trim().length > 0 || !!(genre && genre.trim().length),
  })
}

export function useProfileCounts() {
  return useQuery({
    queryKey: ['profiles-counts'],
    queryFn: () => apiGetProfileCounts(),
    staleTime: 30_000,
  })
}
