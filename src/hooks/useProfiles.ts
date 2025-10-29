import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiListProfiles, apiEnqueueIngest, ProfileDTO } from '../lib/api'

export function useProfiles(q?: string) {
  return useQuery({
    queryKey: ['profiles', q ?? ''],
    queryFn: () => apiListProfiles(q),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  })
}

export function useIngestProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (params: { provider: 'spotify' | 'amazon'; handleOrUrl: string; accessToken?: string }) =>
      apiEnqueueIngest(params),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['profiles'] })
    },
  })
}

export type { ProfileDTO }
