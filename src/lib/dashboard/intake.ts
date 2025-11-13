import { useEffect, useState } from 'react'
import { apiRequest } from '../api'
import { useAuth } from '../auth/context'

export interface IntakeSummary {
  profilesToday: number
  sevenDayTotal: number
  enrichedPercent: number
  pendingQueue: number
  window: '7d' | '30d' | string
}

export function useDataIntakeSummary(window: '7d' | '30d' = '7d') {
  const { user, token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<IntakeSummary | null>(null)
  const [refreshTick, setRefreshTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function run() {
      if (!user || !token) return
      setLoading(true)
      setError(null)
      try {
        const res = await apiRequest<{ ok: true; data: IntakeSummary }>(`/audience/stats/summary?window=${window}`)
        if (!cancelled) setData(res?.data || null)
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load intake summary')
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

export interface IntakePoint {
  date: string
  count: number
}

export function useIntakeTimeseries(window: '7d' | '30d' = '7d') {
  const { user, token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<IntakePoint[]>([])
  const [refreshTick, setRefreshTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function run() {
      if (!user || !token) return
      setLoading(true)
      setError(null)
      try {
        const res = await apiRequest<{ ok: true; data: IntakePoint[] }>(`/audience/stats/timeseries?window=${window}`)
        if (!cancelled) setData(res?.data || [])
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load intake timeseries')
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
