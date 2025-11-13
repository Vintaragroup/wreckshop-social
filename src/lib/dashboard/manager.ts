import { useEffect, useState } from 'react'
import { apiRequest } from '../api'
import { useAuth } from '../auth/context'

export interface ManagerOverview {
  totalArtistsManaged: number
  totalFollowers: number
  totalEngagementRate: number
  topArtist: { id: string; stageName: string; leaderboardScore?: number } | null
  recentActivity: Array<any>
  byStatus: { ACTIVE: number; PENDING: number; INACTIVE: number; REJECTED: number }
}

export function useManagerOverview() {
  const { user, token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<ManagerOverview | null>(null)
  const [refreshTick, setRefreshTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function run() {
      if (!user || !token) return
      setLoading(true)
      setError(null)
      try {
        const res = await apiRequest<{ ok: true; data: ManagerOverview }>(`/dashboard/manager`)
        if (!cancelled) setData(res?.data || null)
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load manager overview')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => { cancelled = true }
  }, [user?.id, token, refreshTick])

  const refresh = () => setRefreshTick((t) => t + 1)

  return { loading, error, data, refresh }
}
