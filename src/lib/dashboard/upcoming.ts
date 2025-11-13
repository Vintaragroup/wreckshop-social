import { useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../api'
import { useAuth } from '../auth/context'

export type UpcomingItem = {
  type: 'campaign' | 'release' | 'event'
  id: string
  title: string
  time: string // ISO string
  status?: string
}

function isFuture(dateIso?: string | Date | null) {
  if (!dateIso) return false
  const d = typeof dateIso === 'string' ? new Date(dateIso) : dateIso
  if (isNaN(d.getTime())) return false
  return d.getTime() > Date.now()
}

export function useUpcoming(limit = 5) {
  const { user, token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<UpcomingItem[]>([])
  const [refreshTick, setRefreshTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function run() {
      if (!user || !token) return
      setLoading(true)
      setError(null)
      try {
        const [campaigns, events, releases] = await Promise.all([
          apiRequest<any>(`/campaigns`).catch(() => ({ data: [] })),
          apiRequest<any>(`/events`).catch(() => ({ data: [] })),
          apiRequest<any>(`/releases`).catch(() => ({ data: [] })),
        ])

        const campaignItems: UpcomingItem[] = Array.isArray(campaigns?.data)
          ? campaigns.data
              .filter((c: any) => isFuture(c?.schedule?.startAt) || (c?.status === 'scheduled'))
              .map((c: any) => ({
                type: 'campaign',
                id: String(c._id || c.id),
                title: c.name || 'Untitled Campaign',
                time: (c?.schedule?.startAt ? new Date(c.schedule.startAt) : new Date()).toISOString(),
                status: c.status || 'scheduled',
              }))
          : []

        const eventItems: UpcomingItem[] = Array.isArray(events?.data)
          ? events.data
              .filter((e: any) => isFuture(e?.date))
              .map((e: any) => ({
                type: 'event',
                id: String(e._id || e.id),
                title: e.title || 'Event',
                time: new Date(e.date).toISOString(),
                status: e.status || 'announced',
              }))
          : []

        const releaseItems: UpcomingItem[] = Array.isArray(releases?.data)
          ? releases.data
              .filter((r: any) => isFuture(r?.releaseDate))
              .map((r: any) => ({
                type: 'release',
                id: String(r._id || r.id),
                title: r.title || 'Release',
                time: new Date(r.releaseDate).toISOString(),
                status: 'upcoming',
              }))
          : []

        const combined = [...campaignItems, ...eventItems, ...releaseItems]
          .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
          .slice(0, limit)

        if (!cancelled) setItems(combined)
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load upcoming items')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => { cancelled = true }
  }, [user?.id, token, limit, refreshTick])

  const grouped = useMemo(() => items, [items])
  const refresh = () => setRefreshTick((t) => t + 1)

  return { loading, error, items: grouped, refresh }
}
