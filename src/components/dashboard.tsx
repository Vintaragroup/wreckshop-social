import {
  Activity,
  AlertTriangle,
  Calendar,
  CheckCircle,
  ExternalLink,
  Mail,
  MessageCircle,
  Music,
  TrendingUp,
  TrendingDown,
  Users,
  Zap,
  Clock,
  AlertCircle,
  Instagram,
  Youtube,
  Smartphone,
  Facebook,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import React from "react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./ui/collapsible";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { Progress } from "./ui/progress";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "./ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import { useDashboardSnapshot } from "../lib/dashboard/snapshot";
import { Badge as UIBadge } from "./ui/badge";
import { useEngagementSeries } from "../lib/dashboard/engagement";
import { useUpcoming } from "../lib/dashboard/upcoming";
import { useDataIntakeSummary, useIntakeTimeseries } from "../lib/dashboard/intake";
import { useRecentCampaignPerformance } from "../lib/dashboard/campaigns";
import { useManagerOverview } from "../lib/dashboard/manager";
import { useAuth } from "../lib/auth/context";
import { useNavigate } from "react-router-dom";
import { appPath } from "../lib/routes";

// Placeholder for platforms without backend wiring yet
const staticPlatforms = [
  { name: "YouTube", status: "disconnected", lastSync: "—", rateLimit: 0, icon: Youtube },
  { name: "TikTok", status: "disconnected", lastSync: "—", rateLimit: 0, icon: Music },
  { name: "Facebook", status: "disconnected", lastSync: "—", rateLimit: 0, icon: Facebook },
];

// Engagement data now fetched live via hook. We still provide a small local fallback for SSR safety.
const engagementFallback = [
  { date: "2024-01-01", emails: 12500, sms: 3200, streams: 8900, tickets: 450 },
  { date: "2024-01-02", emails: 13200, sms: 3400, streams: 9200, tickets: 520 },
  { date: "2024-01-03", emails: 11800, sms: 3100, streams: 8500, tickets: 380 },
  { date: "2024-01-04", emails: 14100, sms: 3800, streams: 10200, tickets: 620 },
  { date: "2024-01-05", emails: 15300, sms: 4200, streams: 11400, tickets: 750 },
  { date: "2024-01-06", emails: 16800, sms: 4600, streams: 12100, tickets: 890 },
  { date: "2024-01-07", emails: 18200, sms: 5100, streams: 13500, tickets: 920 },
];

// Upcoming items are now fetched live; static removed.

// Alerts derived from live connector status

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  // Collapsible sections state (persisted)
  const [collapsed, setCollapsed] = React.useState<Record<string, boolean>>({
    manager: false,
    platforms: false,
    intake: false,
    contacts: false,
    upcoming: false,
    alerts: false,
    campaigns: false,
    engagement: false,
    syncs: false,
  });
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem('dashboard_collapsed')
      if (raw) {
        const parsed = JSON.parse(raw)
        setCollapsed((prev) => ({ ...prev, ...parsed }))
      }
    } catch {}
  }, [])
  const toggleSection = (key: keyof typeof collapsed) => {
    setCollapsed(prev => {
      const next = { ...prev, [key]: !prev[key] }
      try { localStorage.setItem('dashboard_collapsed', JSON.stringify(next)) } catch {}
      return next
    })
  }
  const { loading, error, data, refresh: refreshSnapshot } = useDashboardSnapshot();
  const [intakeWindow, setIntakeWindow] = React.useState<'7d'|'30d'>('7d')
  const [engWindow, setEngWindow] = React.useState<'7d'|'30d'>('7d')
  const { loading: loadingEngagement, error: errorEngagement, data: engagementData, refresh: refreshEngagement } = useEngagementSeries(engWindow);
  const { loading: loadingUpcoming, error: errorUpcoming, items: upcomingItems, refresh: refreshUpcoming } = useUpcoming(5);
  const { loading: loadingIntake, error: errorIntake, data: intake, refresh: refreshIntake } = useDataIntakeSummary(intakeWindow);
  const { loading: loadingIntakeSeries, error: errorIntakeSeries, data: intakeSeries, refresh: refreshIntakeSeries } = useIntakeTimeseries(intakeWindow);
  const { loading: loadingManager, error: errorManager, data: manager, refresh: refreshManager } = useManagerOverview();
  const { loading: loadingCampaigns, error: errorCampaigns, items: campaigns, refresh: refreshCampaigns } = useRecentCampaignPerformance(5);
  // Derived summaries for collapsed views
  const intakeTrendPct = React.useMemo(() => {
    if (!Array.isArray(intakeSeries) || intakeSeries.length < 2) return null
    const first = intakeSeries[0]?.count ?? 0
    const last = intakeSeries[intakeSeries.length - 1]?.count ?? 0
    const base = first === 0 ? 1 : first
    return ((last - first) / base) * 100
  }, [intakeSeries])

  const alertsCount = React.useMemo(() => {
    try {
      const connectors = data.connectors || {}
      let count = 0
      Object.keys(connectors).forEach((key) => {
        const c: any = (connectors as any)[key]
        if (!c?.connected) count++
        if (c?.note) count++
        if (c?.connected && c?.lastSync) {
          const last = new Date(c.lastSync)
          if (!isNaN(last.getTime())) {
            const daysAgo = (Date.now() - last.getTime()) / (1000 * 60 * 60 * 24)
            if (daysAgo > 7) count++
          }
        }
      })
      return count
    } catch { return 0 }
  }, [data?.connectors])

  const nextUpcomingText = React.useMemo(() => {
    if (!Array.isArray(upcomingItems) || upcomingItems.length === 0) return null
    const next = upcomingItems[0]
    return new Date(next.time).toLocaleString()
  }, [upcomingItems])

  const campaignsSummary = React.useMemo(() => {
    if (!Array.isArray(campaigns) || campaigns.length === 0) return null
    const latest = campaigns[0]
    return {
      count: campaigns.length,
      latestOpen: typeof latest.openRate === 'number' ? `${latest.openRate.toFixed(1)}%` : '—'
    }
  }, [campaigns])

  const engagementLatest = React.useMemo(() => {
    const series = (engagementData && engagementData.length > 0) ? engagementData : engagementFallback
    if (!Array.isArray(series) || series.length === 0) return null
    const last = series[series.length - 1]
    const total = ['emails','sms','streams','tickets'].reduce((acc, k) => acc + (Number((last as any)[k]) || 0), 0)
    return total
  }, [engagementData])
  const connectorsData = (() => {
    const arr: Array<{ name: string; status: string; lastSync: string; rateLimit: number; icon: any; note?: string }>
      = []
    // Instagram (live via Prisma or Mongo fallback)
    const ig = data.connectors.instagram
    if (ig) {
      arr.push({
        name: 'Instagram',
        status: ig.connected ? 'connected' : 'disconnected',
        lastSync: ig.lastSync ? new Date(ig.lastSync).toLocaleString() : '—',
        rateLimit: 0,
        icon: Instagram,
        note: ig.note,
      })
    }
    // Spotify (live via Prisma status when present)
    const sp = data.connectors.spotify
    if (sp) {
      arr.push({
        name: 'Spotify',
        status: sp.connected ? 'connected' : 'disconnected',
        lastSync: sp.lastSync ? new Date(sp.lastSync).toLocaleString() : '—',
        rateLimit: 0,
        icon: Music,
      })
    }
    // Others (static placeholders for now)
    return arr.concat(staticPlatforms)
  })()
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Welcome back! Here's what's happening with your audience today.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <Button variant="outline" size="sm" onClick={() => {
            const next = Object.fromEntries(Object.keys(collapsed).map(k => [k, true])) as typeof collapsed
            setCollapsed(next)
            try { localStorage.setItem('dashboard_collapsed', JSON.stringify(next)) } catch {}
          }}>Collapse all</Button>
          <Button variant="outline" size="sm" onClick={() => {
            const next = Object.fromEntries(Object.keys(collapsed).map(k => [k, false])) as typeof collapsed
            setCollapsed(next)
            try { localStorage.setItem('dashboard_collapsed', JSON.stringify(next)) } catch {}
          }}>Expand all</Button>
          <Button className="w-auto">
            <Zap className="w-4 h-4 mr-2" />
            Sync All Platforms
          </Button>
        </div>
      </div>

      {/* Manager Snapshot (only for managers/admins) */}
      {(user?.role === 'MANAGER' || user?.accountType === 'ARTIST_AND_MANAGER' || user?.isAdmin) && (
        <div>
          <div className="grid grid-cols-1 gap-3 md:gap-4">
            <Collapsible open={!collapsed.manager} onOpenChange={() => toggleSection('manager')}>
              <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Manager Overview {loadingManager ? '(loading...)' : ''}
                    {errorManager ? <span className="text-destructive text-xs ml-2">{String(errorManager)}</span> : null}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => navigate(appPath('/analytics'))}>
                      View details
                    </Button>
                    <CollapsibleTrigger asChild>
                      <Button size="icon" variant="ghost" aria-label="Toggle Manager Overview" aria-expanded={!collapsed.manager}>
                        {collapsed.manager ? (
                          <ChevronRight className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </div>
              </CardHeader>
              <CollapsibleContent>
              <CardContent>
                {!loadingManager && manager && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground">Artists Managed</div>
                      <div className="text-lg md:text-xl font-bold">{manager.totalArtistsManaged}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Active</div>
                      <div className="text-lg font-semibold">{manager.byStatus.ACTIVE}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Pending</div>
                      <div className="text-lg font-semibold">{manager.byStatus.PENDING}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Inactive</div>
                      <div className="text-lg font-semibold">{manager.byStatus.INACTIVE}</div>
                    </div>
                  </div>
                )}
                {!loadingManager && manager?.topArtist && (
                  <div className="mt-3 text-sm">
                    <span className="text-muted-foreground">Top artist:</span>{' '}
                    <span className="font-medium">{manager.topArtist.stageName}</span>
                  </div>
                )}
                {!loadingManager && !manager && !errorManager && (
                  <div className="text-sm text-muted-foreground">No manager data available.</div>
                )}
              </CardContent>
              </CollapsibleContent>
            </Card>
            </Collapsible>
          </div>
        </div>
      )}

      {/* Connectors Health */}
      <Collapsible open={!collapsed.platforms} onOpenChange={() => toggleSection('platforms')}>
        <div>
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h2 className="text-lg md:text-xl font-semibold">Platform Health</h2>
            <CollapsibleTrigger asChild>
              <Button size="icon" variant="ghost" aria-label="Toggle Platform Health" aria-expanded={!collapsed.platforms}>
                {collapsed.platforms ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={`ph-skel-${i}`} className="glass-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Skeleton className="w-5 h-5 rounded-sm" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-5 w-20" />
                    </div>
                    <Skeleton className="h-4 w-32" />
                  </CardContent>
                </Card>
              ))
            ) : connectorsData.map((connector) => (
              <Card key={connector.name} className="glass-card">
                <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <connector.icon className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">{connector.name}</span>
                  </div>
                  <Badge
                    variant={
                      connector.status === "connected"
                        ? "default"
                        : connector.status === "throttled"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {connector.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last sync</span>
                    <span>{connector.lastSync}</span>
                  </div>
                  {connector.note ? (
                    <div className="text-xs text-warning">{connector.note}</div>
                  ) : null}
                </div>
              </CardContent>
            </Card>
            ))}
          </div>
          </CollapsibleContent>
        </div>
      </Collapsible>

  {/* Row 1: Data Intake, Alerts, Last Syncs */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 items-stretch">
    {/* Data Intake (live) */}
        <div className="col-span-1 h-full">
        <Collapsible open={!collapsed.intake} onOpenChange={() => toggleSection('intake')}>
  <Card className="h-[200px] min-h-[200px] max-h-[200px] flex flex-col overflow-y-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Data Intake {loadingIntake ? '(loading...)' : ''}
                {errorIntake ? (
                  <span className="text-destructive text-xs ml-2 flex items-center gap-2">
                    {String(errorIntake)}
                    <Button size="sm" variant="outline" onClick={() => { refreshIntake(); refreshIntakeSeries(); }}>Retry</Button>
                  </span>
                ) : null}
              </CardTitle>
              <div className="flex items-center gap-2">
                <ToggleGroup type="single" value={intakeWindow} onValueChange={(v) => v && setIntakeWindow(v as '7d'|'30d')} className="hidden sm:flex">
                  <ToggleGroupItem value="7d" aria-label="7 Day">7d</ToggleGroupItem>
                  <ToggleGroupItem value="30d" aria-label="30 Day">30d</ToggleGroupItem>
                </ToggleGroup>
                {collapsed.intake && (
                  <div className="text-xs text-muted-foreground hidden sm:block">
                    Today {intake?.profilesToday ?? '—'} • 7d {intake?.sevenDayTotal ?? '—'} {typeof intakeTrendPct === 'number' && (
                      <span className={`ml-1 ${intakeTrendPct >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{intakeTrendPct >= 0 ? '+' : ''}{intakeTrendPct.toFixed(1)}%</span>
                    )}
                  </div>
                )}
                <CollapsibleTrigger asChild>
                  <Button size="icon" variant="ghost" aria-label="Toggle Data Intake" aria-expanded={!collapsed.intake}>
                    {collapsed.intake ? (
                      <ChevronRight className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>
          </CardHeader>
          <CollapsibleContent>
          <CardContent className="flex-1 overflow-y-auto space-y-4">
            {loadingIntake || loadingIntakeSeries ? (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Profiles Today</span>
                  <Skeleton className="h-6 w-12" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{intakeWindow === '7d' ? '7-Day Total' : '30-Day Total'}</span>
                  <Skeleton className="h-5 w-16" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Enriched</span>
                    <Skeleton className="h-4 w-10" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
                <Skeleton className="h-[64px] w-full" />
              </>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Profiles Today</span>
                  <span className="text-2xl font-bold">{intake?.profilesToday ?? '—'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{intakeWindow === '7d' ? '7-Day Total' : '30-Day Total'}</span>
                  <span className="text-xl font-semibold">{intake?.sevenDayTotal ?? '—'}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Enriched</span>
                    <span>{intake?.enrichedPercent != null ? `${intake.enrichedPercent}%` : '—'}</span>
                  </div>
                  <Progress value={intake?.enrichedPercent ?? 0} className="h-2" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Pending Queue</span>
                  <span className="text-sm font-medium text-warning">{intake?.pendingQueue ?? '—'}</span>
                </div>

                {/* Intake sparkline */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">{intakeWindow === '7d' ? '7-day' : '30-day'} trend</span>
                    {(() => {
                      if (!intakeSeries || intakeSeries.length < 2) return null
                      const first = intakeSeries[0]?.count ?? 0
                      const last = intakeSeries[intakeSeries.length - 1]?.count ?? 0
                      const base = first === 0 ? 1 : first
                      const pct = ((last - first) / base) * 100
                      const up = pct >= 0
                      return (
                        <span className={`text-[10px] font-medium ${up ? 'text-emerald-500' : 'text-rose-500'} flex items-center gap-1`}>
                          {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {pct.toFixed(1)}%
                        </span>
                      )
                    })()}
                    {errorIntakeSeries ? (
                      <span className="text-destructive text-[10px] ml-2">{String(errorIntakeSeries)}</span>
                    ) : null}
                  </div>
                  <ChartContainer
                    config={{ count: { label: 'New profiles', color: '#0EA5E9' } }}
                    className="h-[64px] w-full pl-0 pr-4"
                  >
                    <AreaChart data={intakeSeries || []} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="intakeSpark" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0EA5E9" stopOpacity={0.5} />
                          <stop offset="100%" stopColor="#0EA5E9" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" hide tickFormatter={(v) => new Date(v).toLocaleDateString()} />
                      <YAxis hide domain={[0, 'dataMax']} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="count" stroke="#0EA5E9" strokeWidth={2} fillOpacity={1} fill="url(#intakeSpark)" />
                    </AreaChart>
                  </ChartContainer>
                </div>
              </>
            )}
          </CardContent>
          </CollapsibleContent>
  </Card>
  </Collapsible>
  </div>

  {/* Alerts (small) */}
  <div className="col-span-1 h-full">
  <Collapsible open={!collapsed.alerts} onOpenChange={() => toggleSection('alerts')}>
  <Card className="h-[200px] min-h-[200px] max-h-[200px] flex flex-col overflow-y-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Alerts
              </CardTitle>
              <div className="flex items-center gap-2">
                {collapsed.alerts && (
                  <div className="text-xs text-muted-foreground hidden sm:block">
                    {alertsCount} {alertsCount === 1 ? 'alert' : 'alerts'}
                  </div>
                )}
                <CollapsibleTrigger asChild>
                  <Button size="icon" variant="ghost" aria-label="Toggle Alerts" aria-expanded={!collapsed.alerts}>
                    {collapsed.alerts ? (
                      <ChevronRight className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>
          </CardHeader>
          <CollapsibleContent>
          <CardContent className="flex-1 overflow-y-auto space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={`al-skel-top-${i}`} className="flex items-start space-x-3 p-3 border border-border rounded-lg">
                  <Skeleton className="w-4 h-4 mt-0.5" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-64 mb-1" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                  <Skeleton className="h-8 w-16" />
                </div>
              ))
            ) : (() => {
              const alerts: Array<{ type: 'error'|'warning'|'info'; message: string; time?: string; action?: { label: string; onClick: () => void } }> = []
              const connectors = data.connectors || {}
              Object.keys(connectors).forEach((key) => {
                const c: any = (connectors as any)[key]
                if (!c?.connected) {
                  alerts.push({ type: 'error', message: `${c?.name || key} not connected`, action: { label: 'Manage', onClick: () => navigate(appPath('/integrations')) } })
                }
                if (c?.note) {
                  alerts.push({ type: 'warning', message: `${c?.name || key}: ${c.note}` , action: { label: 'Refresh', onClick: () => navigate(appPath('/integrations')) } })
                }
                // Stale sync threshold: > 7 days ago -> info
                if (c?.connected && c?.lastSync) {
                  const last = new Date(c.lastSync)
                  if (!isNaN(last.getTime())) {
                    const daysAgo = (Date.now() - last.getTime()) / (1000 * 60 * 60 * 24)
                    if (daysAgo > 7) {
                      alerts.push({ type: 'info', message: `${c?.name || key} has not synced in ${Math.floor(daysAgo)} days`, action: { label: 'Sync now', onClick: () => navigate(appPath('/integrations')) } })
                    }
                  }
                }
              })
              if (alerts.length === 0) return <div className="text-sm text-muted-foreground">No alerts.</div>
              return alerts.map((alert, index) => (
                <div key={`al-top-${index}`} className="flex items-start space-x-3 p-3 border border-border rounded-lg">
                  {alert.type === 'error' && <AlertCircle className="w-4 h-4 text-destructive mt-0.5" />}
                  {alert.type === 'warning' && <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />}
                  {alert.type === 'info' && <Clock className="w-4 h-4 text-primary mt-0.5" />}
                  <div className="flex-1">
                    <div className="text-sm font-medium">{alert.message}</div>
                    {alert.time ? <div className="text-xs text-muted-foreground">{alert.time}</div> : null}
                  </div>
                  {alert.action ? (
                    <Button variant="ghost" size="sm" onClick={alert.action.onClick}>
                      {alert.action.label}
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm">Dismiss</Button>
                  )}
                </div>
              ))
            })()}
          </CardContent>
          </CollapsibleContent>
        </Card>
        </Collapsible>
  </div>

        {/* Last Syncs (small) */}
  <div className="col-span-1 h-full">
  <Collapsible open={!collapsed.syncs} onOpenChange={() => toggleSection('syncs')}>
  <Card className="h-[200px] min-h-[200px] max-h-[200px] flex flex-col overflow-y-auto">
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Last syncs
        </CardTitle>
        <CollapsibleTrigger asChild>
          <Button size="icon" variant="ghost" aria-label="Toggle Last Syncs" aria-expanded={!collapsed.syncs}>
            {collapsed.syncs ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </CollapsibleTrigger>
      </div>
    </CardHeader>
    <CollapsibleContent>
  <CardContent className="flex-1 overflow-y-auto space-y-2">
      {loading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <div key={`ls-skel-${i}`} className="flex items-center justify-between p-2 border rounded">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-28" />
          </div>
        ))
      ) : (
        connectorsData
          .filter((c) => !!c.lastSync)
          .slice(0, 3)
          .map((c) => (
            <div key={`ls-${c.name}`} className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center gap-2">
                <c.icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{c.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">{c.lastSync}</span>
            </div>
          ))
      )}
      {!loading && connectorsData.filter((c) => !!c.lastSync).length === 0 && (
        <div className="text-sm text-muted-foreground">No recent syncs.</div>
      )}
    </CardContent>
    </CollapsibleContent>
  </Card>
  </Collapsible>
  </div>

  </div>

  {/* Row 2: Recent Contacts and Upcoming */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
  {/* Recent Contacts */}
  <Collapsible open={!collapsed.contacts} onOpenChange={() => toggleSection('contacts')}>
  <Card className="h-[300px] min-h-[300px] max-h-[300px] flex flex-col overflow-hidden min-w-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Recent Contacts {loading ? '(loading...)' : `(${Math.min(data.recentContacts.length, 5)})`}
                {error ? (
                  <span className="text-destructive text-xs ml-2 flex items-center gap-2">
                    {error}
                    <Button size="sm" variant="outline" onClick={refreshSnapshot}>Retry</Button>
                  </span>
                ) : null}
              </CardTitle>
              <div className="flex items-center gap-2">
                {collapsed.contacts && (
                  <div className="text-xs text-muted-foreground hidden sm:block">
                    Showing {Math.min(data.recentContacts.length, 5)} of {data.recentContacts.length}
                  </div>
                )}
                <CollapsibleTrigger asChild>
                  <Button size="icon" variant="ghost" aria-label="Toggle Recent Contacts" aria-expanded={!collapsed.contacts}>
                    {collapsed.contacts ? (
                      <ChevronRight className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>
          </CardHeader>
          <CollapsibleContent>
          <CardContent className="flex-1 overflow-y-auto space-y-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={`rc-skel-${i}`} className="flex items-center justify-between border rounded-lg p-3">
                  <div>
                    <Skeleton className="h-4 w-40 mb-1" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-5 w-12" />
                    <Skeleton className="h-5 w-10" />
                  </div>
                </div>
              ))
            ) : data.recentContacts.slice(0, 5).map((c) => (
              <div key={c._id} className="flex items-center justify-between border rounded-lg p-3">
                <div>
                  <div className="font-medium">{c.displayName || c.email || c.phone || 'Unnamed contact'}</div>
                  <div className="text-xs text-muted-foreground">
                    {c.email ? c.email : ''}{c.email && c.phone ? ' • ' : ''}{c.phone ? c.phone : ''}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {c.consent?.email ? <UIBadge variant="outline">Email</UIBadge> : null}
                  {c.consent?.sms ? <UIBadge variant="outline">SMS</UIBadge> : null}
                </div>
              </div>
            ))}
            {!loading && data.recentContacts.length === 0 && !error && (
              <div className="text-sm text-muted-foreground">No recent contacts yet.</div>
            )}
          </CardContent>
          </CollapsibleContent>
        </Card>
  </Collapsible>

  {/* Upcoming */}
  <Collapsible open={!collapsed.upcoming} onOpenChange={() => toggleSection('upcoming')}>
  <Card className="h-[300px] min-h-[300px] max-h-[300px] flex flex-col overflow-hidden min-w-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Upcoming {loadingUpcoming ? '(loading...)' : ''}
                {errorUpcoming ? (
                  <span className="text-destructive text-xs ml-2 flex items-center gap-2">
                    {String(errorUpcoming)}
                    <Button size="sm" variant="outline" onClick={refreshUpcoming}>Retry</Button>
                  </span>
                ) : null}
              </CardTitle>
              <div className="flex items-center gap-2">
                {collapsed.upcoming && (
                  <div className="text-xs text-muted-foreground hidden sm:block">
                    {upcomingItems.length} {upcomingItems.length === 1 ? 'item' : 'items'}{nextUpcomingText ? ` • Next ${nextUpcomingText}` : ''}
                  </div>
                )}
                <CollapsibleTrigger asChild>
                  <Button size="icon" variant="ghost" aria-label="Toggle Upcoming" aria-expanded={!collapsed.upcoming}>
                    {collapsed.upcoming ? (
                      <ChevronRight className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>
          </CardHeader>
          <CollapsibleContent>
          <CardContent className="flex-1 overflow-y-auto space-y-4">
            {loadingUpcoming ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={`up-skel-${i}`} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="w-4 h-4 rounded" />
                    <div>
                      <Skeleton className="h-4 w-40 mb-1" />
                      <Skeleton className="h-3 w-28" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-16" />
                </div>
              ))
            ) : upcomingItems.map((item, index) => (
              <div key={item.id || index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  {item.type === "campaign" && <Mail className="w-4 h-4 text-primary" />}
                  {item.type === "release" && <Music className="w-4 h-4 text-accent" />}
                  {item.type === "event" && <Calendar className="w-4 h-4 text-warning" />}
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-muted-foreground">{new Date(item.time).toLocaleString()}</div>
                  </div>
                </div>
                <Badge
                  variant={
                    item.status === "scheduled"
                      ? "default"
                      : item.status === "live"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {item.status}
                </Badge>
              </div>
            ))}
            {!loadingUpcoming && upcomingItems.length === 0 && !errorUpcoming && (
              <div className="text-sm text-muted-foreground">No upcoming items.</div>
            )}
          </CardContent>
          </CollapsibleContent>
  </Card>
  </Collapsible>
    </div>

    {/* Row 3: Recent Campaigns */}
      <Collapsible open={!collapsed.campaigns} onOpenChange={() => toggleSection('campaigns')}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              Recent Campaigns {loadingCampaigns ? '(loading...)' : ''}
              {errorCampaigns ? (
                <span className="text-destructive text-xs ml-2 flex items-center gap-2">
                  {String(errorCampaigns)}
                  <Button size="sm" variant="outline" onClick={refreshCampaigns}>Retry</Button>
                </span>
              ) : null}
            </CardTitle>
            <div className="flex items-center gap-2">
              {collapsed.campaigns && (
                <div className="text-xs text-muted-foreground hidden sm:block">
                  {campaignsSummary ? `${campaignsSummary.count} • Latest open ${campaignsSummary.latestOpen}` : '—'}
                </div>
              )}
              <Button size="sm" variant="outline" onClick={() => navigate(appPath('/campaigns'))}>View all</Button>
              <CollapsibleTrigger asChild>
                <Button size="icon" variant="ghost" aria-label="Toggle Recent Campaigns" aria-expanded={!collapsed.campaigns}>
                  {collapsed.campaigns ? (
                    <ChevronRight className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
        </CardHeader>
        <CollapsibleContent>
        <CardContent>
          {loadingCampaigns ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={`cmp-skel-${i}`} className="grid grid-cols-5 gap-2 items-center">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
            </div>
          ) : (!loadingCampaigns && campaigns && campaigns.length > 0) ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground">
                    <th className="py-2 pr-2">Name</th>
                    <th className="py-2 pr-2">Sent</th>
                    <th className="py-2 pr-2">Open rate</th>
                    <th className="py-2 pr-2">Click rate</th>
                    <th className="py-2 pr-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((c) => (
                    <tr key={c.id} className="border-t">
                      <td className="py-2 pr-2">
                        <div className="font-medium">{c.name}</div>
                        <div className="text-[11px] text-muted-foreground">{c.launchedAt ? new Date(c.launchedAt).toLocaleString() : '—'}</div>
                      </td>
                      <td className="py-2 pr-2">{c.sent}</td>
                      <td className="py-2 pr-2">{c.openRate.toFixed(2)}%</td>
                      <td className="py-2 pr-2">{c.clickRate.toFixed(2)}%</td>
                      <td className="py-2 pr-2">
                        <Badge variant={c.status === 'running' ? 'destructive' : c.status === 'scheduled' ? 'default' : 'secondary'}>
                          {c.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            !loadingCampaigns && <div className="text-sm text-muted-foreground">No recent campaigns.</div>
          )}
        </CardContent>
        </CollapsibleContent>
      </Card>
      </Collapsible>

  {/* Row 4: Engagement */}
      <Collapsible open={!collapsed.engagement} onOpenChange={() => toggleSection('engagement')}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              {engWindow === '7d' ? '7-Day' : '30-Day'} Engagement {loadingEngagement ? '(loading...)' : ''}
              {errorEngagement ? (
                <span className="text-destructive text-xs ml-2 flex items-center gap-2">
                  {String(errorEngagement)}
                  <Button size="sm" variant="outline" onClick={refreshEngagement}>Retry</Button>
                </span>
              ) : null}
            </CardTitle>
            <div className="flex items-center gap-2">
              <ToggleGroup type="single" value={engWindow} onValueChange={(v) => v && setEngWindow(v as '7d'|'30d')} className="hidden sm:flex">
                <ToggleGroupItem value="7d" aria-label="7 Day">7d</ToggleGroupItem>
                <ToggleGroupItem value="30d" aria-label="30 Day">30d</ToggleGroupItem>
              </ToggleGroup>
              {collapsed.engagement && (
                <div className="text-xs text-muted-foreground hidden sm:block">
                  Latest day total {engagementLatest ?? '—'}
                </div>
              )}
              <CollapsibleTrigger asChild>
                <Button size="icon" variant="ghost" aria-label="Toggle Engagement" aria-expanded={!collapsed.engagement}>
                  {collapsed.engagement ? (
                    <ChevronRight className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
        </CardHeader>
        <CollapsibleContent>
        <CardContent>
          {loadingEngagement ? (
            <Skeleton className="h-[200px] w-full" />
          ) : (
          <ChartContainer
            config={{
              emails: {
                label: "Emails",
                color: "#7C3AED",
              },
              sms: {
                label: "SMS",
                color: "#22C55E",
              },
              streams: {
                label: "Streams",
                color: "#F59E0B",
              },
              tickets: {
                label: "Tickets",
                color: "#EF4444",
              },
            }}
            className="h-[200px] w-full pl-0 pr-6 md:pl-2 md:pr-8"
          >
            <LineChart data={(engagementData && engagementData.length > 0) ? engagementData : engagementFallback}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                  type="monotone"
                  dataKey="emails"
                  stroke="#7C3AED"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="sms"
                  stroke="#22C55E"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="streams"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="tickets"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
          </ChartContainer>
          )}
        </CardContent>
        </CollapsibleContent>
      </Card>
      </Collapsible>

    </div>
  );
}