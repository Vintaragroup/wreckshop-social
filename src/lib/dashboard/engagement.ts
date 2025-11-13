import { useEffect, useState } from 'react'
import { apiRequest } from '../api'
import { useAuth } from '../auth/context'

export type EngagementPoint = {
  date: string
  emails: number
  sms: number
  streams: number
  tickets: number
}

export function useEngagementSeries(window: '7d' | '30d' = '7d') {
  const { user, token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<EngagementPoint[]>([])
  const [refreshTick, setRefreshTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function run() {
      if (!user || !token) return
      setLoading(true)
      setError(null)
      try {
        const res = await apiRequest<{ ok: true; data: EngagementPoint[] }>(`/dashboard/artists/${user.id}/engagement?window=${window}`)
        if (!cancelled) setData(res?.data || [])
      } catch (e: any) {
        const msg = e?.message || 'Failed to load engagement series'
        if (!cancelled) setError(msg)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => { cancelled = true }
  }, [user?.id, token, window, refreshTick])

  const refresh = () => setRefreshTick((t) => t + 1)

  return { loading, error, data, refresh }
}
