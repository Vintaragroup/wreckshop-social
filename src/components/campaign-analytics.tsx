import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Mail, MousePointerClick, TrendingUp, AlertCircle, CheckCircle2, Clock, Zap } from 'lucide-react'
import { apiUrl } from '../lib/api'
import { toast } from 'sonner'

interface CampaignAnalyticsProps {
  campaignId: string
  campaignName: string
}

interface Analytics {
  metrics: {
    sent: number
    delivered: number
    opened: number
    clicked: number
    bounced: number
    unsubscribed: number
    complained: number
    converted: number
  }
  rates: {
    deliveryRate: number
    openRate: number
    clickRate: number
    unsubscribeRate: number
    bounceRate: number
    conversionRate: number
  }
  engagementScore: number
  campaignStatus: string
  launchedAt?: string
  createdAt?: string
  timeline: Array<{
    time: string
    label: string
    opened: number
    clicked: number
    bounced: number
  }>
  eventCounts: {
    sent: number
    delivered: number
    opened: number
    clicked: number
    bounced: number
    failed: number
    unsubscribed: number
    complained: number
  }
}

export function CampaignAnalytics({ campaignId, campaignName }: CampaignAnalyticsProps) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [campaignId])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const res = await fetch(apiUrl(`/campaigns/${campaignId}/analytics`))
      if (!res.ok) throw new Error('Failed to load analytics')
      const json = await res.json()
      setAnalytics(json.data)
    } catch (error: any) {
      toast.error(error.message || 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-4 text-center text-muted-foreground">Loading analytics...</div>
  }

  if (!analytics) {
    return <div className="p-4 text-center text-muted-foreground">No analytics data available</div>
  }

  const metricsData = [
    {
      label: 'Sent',
      value: analytics.metrics.sent,
      icon: Mail,
      color: 'bg-blue-100',
      textColor: 'text-blue-900',
      trend: null,
    },
    {
      label: 'Delivered',
      value: analytics.metrics.delivered,
      rate: `${analytics.rates.deliveryRate.toFixed(1)}%`,
      icon: CheckCircle2,
      color: 'bg-green-100',
      textColor: 'text-green-900',
    },
    {
      label: 'Opened',
      value: analytics.metrics.opened,
      rate: `${analytics.rates.openRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'bg-purple-100',
      textColor: 'text-purple-900',
    },
    {
      label: 'Clicked',
      value: analytics.metrics.clicked,
      rate: `${analytics.rates.clickRate.toFixed(1)}%`,
      icon: MousePointerClick,
      color: 'bg-orange-100',
      textColor: 'text-orange-900',
    },
    {
      label: 'Bounced',
      value: analytics.metrics.bounced,
      rate: `${analytics.rates.bounceRate.toFixed(1)}%`,
      icon: AlertCircle,
      color: 'bg-red-100',
      textColor: 'text-red-900',
    },
    {
      label: 'Unsubscribed',
      value: analytics.metrics.unsubscribed,
      rate: `${analytics.rates.unsubscribeRate.toFixed(1)}%`,
      icon: Clock,
      color: 'bg-yellow-100',
      textColor: 'text-yellow-900',
    },
  ]

  const engagementColors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#ef4444']

  const pieData = [
    { name: 'Opened', value: analytics.metrics.opened, color: '#8b5cf6' },
    { name: 'Clicked', value: analytics.metrics.clicked, color: '#ec4899' },
    { name: 'Bounced', value: analytics.metrics.bounced, color: '#ef4444' },
    { name: 'Not Engaged', value: Math.max(0, analytics.metrics.delivered - analytics.metrics.opened), color: '#d1d5db' },
  ].filter(d => d.value > 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">{campaignName}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Campaign Status: <Badge variant="outline" className="ml-2">
              {analytics.campaignStatus}
            </Badge>
            {analytics.launchedAt && (
              <span className="ml-2">
                Launched: {new Date(analytics.launchedAt).toLocaleDateString()}
              </span>
            )}
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">{analytics.engagementScore}</div>
          <p className="text-sm text-muted-foreground">Engagement Score</p>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metricsData.map((metric, idx) => {
          const Icon = metric.icon
          return (
            <Card key={idx}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold">{metric.value.toLocaleString()}</p>
                      {metric.rate && <span className="text-sm text-muted-foreground">{metric.rate}</span>}
                    </div>
                  </div>
                  <div className={`${metric.color} p-3 rounded-lg`}>
                    <Icon className={`w-5 h-5 ${metric.textColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="timeline" className="w-full">
        <TabsList>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
        </TabsList>

        {/* Timeline Chart */}
        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Timeline</CardTitle>
              <CardDescription>Opens, clicks, and bounces over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.timeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" style={{ fontSize: '12px' }} />
                  <YAxis style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                    labelStyle={{ color: '#e5e7eb' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="opened" 
                    stroke="#8b5cf6" 
                    dot={false}
                    name="Opened"
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="clicked" 
                    stroke="#ec4899" 
                    dot={false}
                    name="Clicked"
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="bounced" 
                    stroke="#ef4444" 
                    dot={false}
                    name="Bounced"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Engagement Rates */}
        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Rates</CardTitle>
              <CardDescription>Key performance indicators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Delivery Rate</span>
                  <span className="text-sm text-muted-foreground">{analytics.rates.deliveryRate.toFixed(1)}%</span>
                </div>
                <Progress value={analytics.rates.deliveryRate} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Open Rate</span>
                  <span className="text-sm text-muted-foreground">{analytics.rates.openRate.toFixed(1)}%</span>
                </div>
                <Progress value={analytics.rates.openRate} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Click Rate</span>
                  <span className="text-sm text-muted-foreground">{analytics.rates.clickRate.toFixed(1)}%</span>
                </div>
                <Progress value={analytics.rates.clickRate} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Conversion Rate</span>
                  <span className="text-sm text-muted-foreground">{analytics.rates.conversionRate.toFixed(1)}%</span>
                </div>
                <Progress value={analytics.rates.conversionRate} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Bounce Rate</span>
                  <span className="text-sm text-muted-foreground">{analytics.rates.bounceRate.toFixed(1)}%</span>
                </div>
                <Progress value={analytics.rates.bounceRate} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Unsubscribe Rate</span>
                  <span className="text-sm text-muted-foreground">{analytics.rates.unsubscribeRate.toFixed(1)}%</span>
                </div>
                <Progress value={analytics.rates.unsubscribeRate} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Breakdown */}
        <TabsContent value="breakdown" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Engagement Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Engagement Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) => `${name} ${value} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Event Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Event Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(analytics.eventCounts).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between pb-2 border-b last:border-0">
                    <span className="text-sm font-medium capitalize">{key}</span>
                    <Badge variant="secondary">{(value as number).toLocaleString()}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Pro Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Pro Tips to Improve Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2 text-blue-900">
          <p>• <strong>Open Rate:</strong> Test subject lines and send times to improve opens</p>
          <p>• <strong>Click Rate:</strong> Use compelling CTAs and ensure mobile-friendly design</p>
          <p>• <strong>Bounce Rate:</strong> Maintain list hygiene and validate email addresses</p>
          <p>• <strong>Unsubscribe:</strong> Monitor trends - high rates may indicate content mismatch</p>
        </CardContent>
      </Card>
    </div>
  )
}
