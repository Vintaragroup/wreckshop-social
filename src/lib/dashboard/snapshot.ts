import { useEffect, useState } from 'react'
import { apiRequest } from '../api'
import { useAuth } from '../auth/context'

export interface ConnectorStatus {
  name: string
  connected: boolean
  lastSync?: string
  note?: string
}

export interface DashboardSnapshot {
  connectors: Record<string, ConnectorStatus>
  recentContacts: Array<{ _id: string; displayName?: string; email?: string; phone?: string; consent?: { email?: boolean; sms?: boolean } }>
}

export function useDashboardSnapshot() {
  const { user, token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<DashboardSnapshot>({ connectors: {}, recentContacts: [] })
  const [refreshTick, setRefreshTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!user || !token) return
      setLoading(true)
      setError(null)
      try {
        const artistId = user.id
        const connectors: Record<string, ConnectorStatus> = {}

        // 1) Try Prisma-based integrations status for spotify/instagram
        try {
          const status = await apiRequest<{ ok: true; integrations?: any }>(`/integrations/status/${artistId}`)
          const s = status?.integrations
          if (s?.spotify) {
            connectors.spotify = {
              name: 'Spotify',
              connected: !!s.spotify.connected,
              lastSync: s.spotify.lastSyncedAt || undefined,
            }
          }
          if (s?.instagram) {
            connectors.instagram = {
              name: 'Instagram',
              connected: !!s.instagram.connected,
              lastSync: s.instagram.lastSyncedAt || undefined,
            }
          }
        } catch (e) {
          // Non-fatal
        }

        // 2) Instagram fallback via Mongo by userId when prisma says disconnected/missing
        if (!connectors.instagram?.connected) {
          try {
            const ig = await apiRequest<{ ok: true; connection: any }>(`/integrations/instagram/${user.id}`)
            if (ig?.connection) {
              connectors.instagram = {
                name: 'Instagram',
                connected: true,
                lastSync: ig.connection.lastSync || ig.connection.connectedAt,
                note: ig.connection.needsRefresh ? 'Token needs refresh soon' : undefined,
              }
            }
          } catch (e: any) {
            // If 404, keep disconnected; otherwise log error
          }
        }

        // 3) Recent contacts (best-effort)
        let recentContacts: DashboardSnapshot['recentContacts'] = []
        try {
          const res = await apiRequest<{ ok: true; data: any[] }>(`/audience/contacts`)
          recentContacts = Array.isArray(res?.data) ? res.data.slice(0, 5) : []
        } catch {}

        if (!cancelled) setData({ connectors, recentContacts })
      } catch (err: any) {
        if (!cancelled) setError(err?.message || 'Failed to load dashboard snapshot')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [user, token, refreshTick])

  const refresh = () => setRefreshTick((t) => t + 1)

  return { loading, error, data, refresh }
}
