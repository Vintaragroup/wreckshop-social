import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog'
import {
  Beaker,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Trophy,
  Pause,
  Play,
  Zap,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { apiUrl } from '../lib/api'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'

interface Variant {
  name: string
  sent: number
  delivered: number
  opened: number
  clicked: number
  bounced: number
  unsubscribed: number
  complained: number
  converted: number
}

interface Winner {
  variantId: string
  metric: string
  confidence: number
  improvement: number
  pValue: number
}

interface ABTest {
  _id: string
  name: string
  testType: string
  status: 'draft' | 'running' | 'paused' | 'completed'
  variants: Variant[]
  winner?: Winner
  settings?: {
    confidenceLevel?: number
    testDuration?: string
    durationValue?: number
  }
  createdAt: string
  startedAt?: string
  completedAt?: string
}

interface ABTestResultsProps {
  testId: string
  test: ABTest
  onWinnerDeclared?: () => void
  onStatusChanged?: () => void
}

export function ABTestResults({
  testId,
  test,
  onWinnerDeclared,
  onStatusChanged,
}: ABTestResultsProps) {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showWinnerDialog, setShowWinnerDialog] = useState(false)
  const [selectedWinnerVariant, setSelectedWinnerVariant] = useState('')
  const [declareWinnerLoading, setDeclareWinnerLoading] = useState(false)

  useEffect(() => {
    loadResults()
    const interval = setInterval(loadResults, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [testId])

  const loadResults = async () => {
    try {
      const res = await fetch(apiUrl(`/ab-tests/${testId}/results`))
      if (!res.ok) throw new Error('Failed to load results')
      const json = await res.json()
      setResults(json.data)
    } catch (error: any) {
      console.error('Failed to load results:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePauseTest = async () => {
    try {
      const res = await fetch(apiUrl(`/ab-tests/${testId}/pause`), { method: 'POST' })
      if (!res.ok) throw new Error('Failed to pause test')
      toast.success('Test paused')
      onStatusChanged?.()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleResumeTest = async () => {
    try {
      const res = await fetch(apiUrl(`/ab-tests/${testId}/start`), { method: 'POST' })
      if (!res.ok) throw new Error('Failed to resume test')
      toast.success('Test resumed')
      onStatusChanged?.()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleDeclareWinner = async () => {
    try {
      setDeclareWinnerLoading(true)
      const res = await fetch(apiUrl(`/ab-tests/${testId}/winner`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantId: selectedWinnerVariant,
          metric: 'engagement',
        }),
      })
      if (!res.ok) throw new Error('Failed to declare winner')
      toast.success('Winner declared!')
      setShowWinnerDialog(false)
      onWinnerDeclared?.()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setDeclareWinnerLoading(false)
    }
  }

  const getStatusBadge = () => {
    switch (test.status) {
      case 'running':
        return <Badge className="bg-green-600">Running</Badge>
      case 'paused':
        return <Badge className="bg-yellow-600">Paused</Badge>
      case 'completed':
        return <Badge className="bg-blue-600">Completed</Badge>
      case 'draft':
        return <Badge variant="outline">Draft</Badge>
      default:
        return null
    }
  }

  const getConfidenceColor = (pValue: number, confidence: number) => {
    if (pValue < 0.05) return 'text-green-600'
    if (pValue < 0.1) return 'text-yellow-600'
    return 'text-red-600'
  }

  const renderMetricsChart = () => {
    if (!results?.variants) return null

    const chartData = results.variants.map((v: Variant, idx: number) => ({
      name: v.name,
      'Open Rate': ((v.opened / v.delivered) * 100).toFixed(1),
      'Click Rate': ((v.clicked / v.delivered) * 100).toFixed(1),
      'Conversion Rate': ((v.converted / v.delivered) * 100).toFixed(1),
    }))

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Open Rate" fill="#3b82f6" />
          <Bar dataKey="Click Rate" fill="#10b981" />
          <Bar dataKey="Conversion Rate" fill="#f59e0b" />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  const renderEngagementChart = () => {
    if (!results?.variants) return null

    const chartData = results.variants.map((v: Variant, idx: number) => ({
      name: v.name,
      'Delivered': v.delivered,
      'Opened': v.opened,
      'Clicked': v.clicked,
      'Converted': v.converted,
    }))

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Delivered" stackId="a" fill="#e5e7eb" />
          <Bar dataKey="Opened" stackId="a" fill="#3b82f6" />
          <Bar dataKey="Clicked" stackId="a" fill="#10b981" />
          <Bar dataKey="Converted" stackId="a" fill="#f59e0b" />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Loading results...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Beaker className="w-6 h-6" />
            {test.name}
          </h2>
          <p className="text-muted-foreground mt-1">
            {getStatusBadge()}
            <span className="ml-2 text-sm">
              Created {formatDistanceToNow(new Date(test.createdAt), { addSuffix: true })}
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          {test.status === 'running' && (
            <Button variant="outline" onClick={handlePauseTest} className="flex items-center gap-2">
              <Pause className="w-4 h-4" />
              Pause
            </Button>
          )}
          {test.status === 'paused' && (
            <Button onClick={handleResumeTest} className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Resume
            </Button>
          )}
          {test.status === 'completed' && !test.winner && (
            <Button
              onClick={() => setShowWinnerDialog(true)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <Trophy className="w-4 h-4" />
              Declare Winner
            </Button>
          )}
        </div>
      </div>

      {/* Winner Announcement */}
      {test.winner && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900">Winner Declared!</p>
                  <p className="text-sm text-green-800 mt-1">
                    Variant "{test.winner.variantId}" won with {test.winner.improvement}% improvement
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-900">Confidence</p>
                <p className="text-lg font-bold text-green-600">{test.winner.confidence}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Variant Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results?.variants?.map((variant: Variant, idx: number) => {
          const deliveryRate = variant.sent > 0 ? ((variant.delivered / variant.sent) * 100).toFixed(1) : 0
          const openRate = variant.delivered > 0 ? ((variant.opened / variant.delivered) * 100).toFixed(1) : 0
          const clickRate = variant.delivered > 0 ? ((variant.clicked / variant.delivered) * 100).toFixed(1) : 0
          const conversionRate = variant.clicked > 0 ? ((variant.converted / variant.clicked) * 100).toFixed(1) : 0

          return (
            <Card key={idx}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{variant.name}</CardTitle>
                  {test.winner?.variantId === String(idx) && (
                    <Trophy className="w-5 h-5 text-yellow-500" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 rounded">
                    <p className="text-xs text-muted-foreground">Sent</p>
                    <p className="text-lg font-bold">{variant.sent.toLocaleString()}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="text-xs text-muted-foreground">Delivered</p>
                    <p className="text-lg font-bold">{variant.delivered.toLocaleString()}</p>
                    <p className="text-xs text-blue-600 mt-1">{deliveryRate}%</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded">
                    <p className="text-xs text-muted-foreground">Opened</p>
                    <p className="text-lg font-bold">{variant.opened.toLocaleString()}</p>
                    <p className="text-xs text-purple-600 mt-1">{openRate}%</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <p className="text-xs text-muted-foreground">Clicked</p>
                    <p className="text-lg font-bold">{variant.clicked.toLocaleString()}</p>
                    <p className="text-xs text-green-600 mt-1">{clickRate}%</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">Delivery Rate</span>
                      <span className="text-xs font-bold">{deliveryRate}%</span>
                    </div>
                    <Progress value={Number(deliveryRate)} className="h-1" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">Open Rate</span>
                      <span className="text-xs font-bold">{openRate}%</span>
                    </div>
                    <Progress value={Number(openRate)} className="h-1" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">Click Rate</span>
                      <span className="text-xs font-bold">{clickRate}%</span>
                    </div>
                    <Progress value={Number(clickRate)} className="h-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Key Metrics Comparison</CardTitle>
          <CardDescription>Open, click, and conversion rates by variant</CardDescription>
        </CardHeader>
        <CardContent>{renderMetricsChart()}</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Engagement Funnel</CardTitle>
          <CardDescription>Message journey through each stage</CardDescription>
        </CardHeader>
        <CardContent>{renderEngagementChart()}</CardContent>
      </Card>

      {/* Statistical Significance */}
      {results?.comparison && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Statistical Significance
            </CardTitle>
            <CardDescription>Variant performance comparison</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {results.comparison.map((comp: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">{comp.variant1} vs {comp.variant2}</p>
                  <p className="text-xs text-muted-foreground">Chi-square: {comp.chiSquare?.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-sm ${getConfidenceColor(comp.pValue, 95)}`}>
                    p-value: {comp.pValue?.toFixed(4)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {comp.pValue < 0.05 ? '✓ Significant' : '○ Not significant'}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Declare Winner Dialog */}
      <AlertDialog open={showWinnerDialog} onOpenChange={setShowWinnerDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Declare Test Winner</AlertDialogTitle>
            <AlertDialogDescription>
              Select which variant should be applied to future campaigns based on these results.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3">
            {results?.variants?.map((variant: Variant, idx: number) => (
              <Button
                key={idx}
                variant={selectedWinnerVariant === String(idx) ? 'default' : 'outline'}
                className="w-full justify-start h-auto p-3"
                onClick={() => setSelectedWinnerVariant(String(idx))}
              >
                <div className="text-left">
                  <p className="font-medium">{variant.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Open: {((variant.opened / variant.delivered) * 100).toFixed(1)}% | Click:{' '}
                    {((variant.clicked / variant.delivered) * 100).toFixed(1)}%
                  </p>
                </div>
              </Button>
            ))}
          </div>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeclareWinner} disabled={!selectedWinnerVariant || declareWinnerLoading}>
            {declareWinnerLoading ? 'Declaring...' : 'Declare Winner'}
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
