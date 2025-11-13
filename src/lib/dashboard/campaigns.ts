import { useEffect, useState } from 'react'
import { apiRequest } from '../api'
import { useAuth } from '../auth/context'

export interface CampaignDoc {
  _id: string
  name: string
  status?: string
  launchedAt?: string
  createdAt?: string
}

export interface CampaignAnalytics {
  metrics: {
    sent: number
    delivered: number
    opened: number
    clicked: number
    bounced: number
    unsubscribed: number
    complained?: number
    converted?: number
  }
  rates: {
    deliveryRate: number
    openRate: number
    clickRate: number
    unsubscribeRate: number
    bounceRate: number
    conversionRate: number
  }
  campaignStatus?: string
  launchedAt?: string
}

export interface CampaignPerformanceItem {
  id: string
  name: string
  status: string
  launchedAt?: string
  sent: number
  openRate: number
  clickRate: number
}

export function useRecentCampaignPerformance(limit = 5) {
  const { user, token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<CampaignPerformanceItem[]>([])
  const [refreshTick, setRefreshTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function run() {
      if (!user || !token) return
      setLoading(true)
      setError(null)
      try {
        const listRes = await apiRequest<{ ok: true; data: CampaignDoc[] }>(`/campaigns`)
        const recent = (listRes?.data || []).slice(0, limit)
        const analytics = await Promise.all(
          recent.map(async (c) => {
            try {
              const a = await apiRequest<{ ok: true; data: CampaignAnalytics }>(`/campaigns/${c._id}/analytics`)
              return { campaign: c, analytics: a?.data }
            } catch (err) {
              // If analytics fails for one, continue with zeros
              return { campaign: c, analytics: undefined as unknown as CampaignAnalytics }
            }
          })
        )
        const mapped: CampaignPerformanceItem[] = analytics.map(({ campaign, analytics }) => {
          const sent = analytics?.metrics?.sent ?? 0
          const openRate = analytics?.rates?.openRate ?? 0
          const clickRate = analytics?.rates?.clickRate ?? 0
          return {
            id: campaign._id,
            name: campaign.name,
            status: (analytics?.campaignStatus || campaign.status || 'draft') as string,
            launchedAt: (analytics?.launchedAt || campaign.launchedAt || campaign.createdAt) as string,
            sent,
            openRate: Math.round(openRate * 100) / 100,
            clickRate: Math.round(clickRate * 100) / 100,
          }
        })
        if (!cancelled) setItems(mapped)
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load campaigns')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => { cancelled = true }
  }, [user?.id, token, limit, refreshTick])
  const refresh = () => setRefreshTick((t) => t + 1)

  return { loading, error, items, refresh }
}
