import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import {
  Beaker,
  MoreVertical,
  Eye,
  Play,
  Pause,
  Trash2,
  Trophy,
  Calendar,
  Users,
  TrendingUp,
} from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog'
import { apiUrl } from '../lib/api'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'

interface ABTest {
  _id: string
  name: string
  testType: string
  status: 'draft' | 'running' | 'paused' | 'completed'
  variants: Array<{
    name: string
    sent: number
    delivered: number
    opened: number
    clicked: number
  }>
  winner?: {
    variantId: string
    improvement: number
  }
  totalAudience: number
  createdAt: string
  startedAt?: string
  completedAt?: string
}

interface ABTestsListProps {
  onViewResults?: (test: ABTest) => void
  onEdit?: (testId: string) => void
}

export function ABTestsList({ onViewResults, onEdit }: ABTestsListProps) {
  const [tests, setTests] = useState<ABTest[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'running' | 'completed' | 'draft'>('all')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    loadTests()
    const interval = setInterval(loadTests, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [filter, page])

  const loadTests = async () => {
    try {
      const params = new URLSearchParams()
      if (filter !== 'all') params.append('status', filter)
      params.append('page', String(page))

      const res = await fetch(apiUrl(`/ab-tests?${params.toString()}`))
      if (!res.ok) throw new Error('Failed to load tests')
      const json = await res.json()
      setTests(json.data.docs || [])
    } catch (error: any) {
      toast.error('Failed to load A/B tests')
    } finally {
      setLoading(false)
    }
  }

  const handlePause = async (testId: string) => {
    try {
      const res = await fetch(apiUrl(`/ab-tests/${testId}/pause`), { method: 'POST' })
      if (!res.ok) throw new Error('Failed to pause test')
      toast.success('Test paused')
      loadTests()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleResume = async (testId: string) => {
    try {
      const res = await fetch(apiUrl(`/ab-tests/${testId}/start`), { method: 'POST' })
      if (!res.ok) throw new Error('Failed to resume test')
      toast.success('Test resumed')
      loadTests()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleDelete = async (testId: string) => {
    try {
      const res = await fetch(apiUrl(`/ab-tests/${testId}`), { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete test')
      toast.success('Test deleted')
      setDeleteConfirm(null)
      loadTests()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running':
        return <Badge className="bg-green-600">Running</Badge>
      case 'paused':
        return <Badge className="bg-yellow-600">Paused</Badge>
      case 'completed':
        return <Badge className="bg-blue-600">Completed</Badge>
      case 'draft':
        return <Badge variant="outline">Draft</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const calculateEngagementRate = (test: ABTest) => {
    if (!test.variants.length) return 0
    const avgOpened = test.variants.reduce((acc, v) => acc + (v.opened / v.delivered), 0) / test.variants.length
    return (avgOpened * 100).toFixed(1)
  }

  const calculateClickRate = (test: ABTest) => {
    if (!test.variants.length) return 0
    const avgClicked = test.variants.reduce((acc, v) => acc + (v.clicked / v.delivered), 0) / test.variants.length
    return (avgClicked * 100).toFixed(1)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Loading A/B tests...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'running', 'completed', 'draft'] as const).map(status => (
          <Button
            key={status}
            variant={filter === status ? 'default' : 'outline'}
            onClick={() => {
              setFilter(status)
              setPage(1)
            }}
            className="capitalize"
          >
            {status}
          </Button>
        ))}
      </div>

      {/* Tests Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Beaker className="w-5 h-5" />
            A/B Tests
          </CardTitle>
          <CardDescription>{tests.length} tests found</CardDescription>
        </CardHeader>
        <CardContent>
          {tests.length === 0 ? (
            <div className="text-center py-8">
              <Beaker className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-muted-foreground">No A/B tests yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Create your first A/B test to start optimizing your campaigns
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Variants</TableHead>
                    <TableHead>Audience</TableHead>
                    <TableHead>Engagement</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tests.map(test => (
                    <TableRow key={test._id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{test.name}</p>
                          {test.winner && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-yellow-600">
                              <Trophy className="w-3 h-3" />
                              Winner: {test.winner.variantId}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="capitalize text-sm">{test.testType}</TableCell>
                      <TableCell>{getStatusBadge(test.status)}</TableCell>
                      <TableCell className="text-sm">{test.variants.length}</TableCell>
                      <TableCell className="flex items-center gap-1 text-sm">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        {test.totalAudience.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs">
                            <span>Open: {calculateEngagementRate(test)}%</span>
                            {test.status === 'completed' && <TrendingUp className="w-3 h-3 text-green-600" />}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            Click: {calculateClickRate(test)}%
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(test.createdAt), { addSuffix: true })}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onViewResults?.(test)} className="flex items-center gap-2">
                              <Eye className="w-4 h-4" />
                              View Results
                            </DropdownMenuItem>

                            {test.status === 'draft' && (
                              <DropdownMenuItem onClick={() => onEdit?.(test._id)} className="flex items-center gap-2">
                                <Beaker className="w-4 h-4" />
                                Edit
                              </DropdownMenuItem>
                            )}

                            {test.status === 'running' && (
                              <DropdownMenuItem onClick={() => handlePause(test._id)} className="flex items-center gap-2">
                                <Pause className="w-4 h-4" />
                                Pause
                              </DropdownMenuItem>
                            )}

                            {test.status === 'paused' && (
                              <DropdownMenuItem onClick={() => handleResume(test._id)} className="flex items-center gap-2">
                                <Play className="w-4 h-4" />
                                Resume
                              </DropdownMenuItem>
                            )}

                            {test.status === 'draft' && (
                              <DropdownMenuItem
                                onClick={() => setDeleteConfirm(test._id)}
                                className="flex items-center gap-2 text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete A/B Test?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The test and all associated data will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
