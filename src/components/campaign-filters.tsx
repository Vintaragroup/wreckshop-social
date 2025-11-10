import { useState, useMemo } from 'react'
import { ChevronDown, Settings, Download, Trash2, PlayCircle, Pause, Clock } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Checkbox } from './ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Input } from './ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

interface Campaign {
  id: string | number
  name: string
  status: 'draft' | 'scheduled' | 'running' | 'paused' | 'completed' | 'failed'
  type: string
  audience: string
  sent: number
  delivered: number
  opened: number
  clicked: number
  createdAt: string
}

interface CampaignFiltersProps {
  campaigns: Campaign[]
  onFilter: (filtered: Campaign[]) => void
}

export function CampaignFilters({ campaigns, onFilter }: CampaignFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('newest')

  // Get unique values for filters
  const statuses = useMemo(() => ['draft', 'scheduled', 'running', 'paused', 'completed', 'failed'], [])
  const types = useMemo(() => {
    const typeSet = new Set(campaigns.map(c => c.type))
    return Array.from(typeSet)
  }, [campaigns])

  // Apply filters and sorting
  useMemo(() => {
    let filtered = campaigns

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.audience.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter)
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(c => c.type === typeFilter)
    }

    // Sorting
    switch (sortBy) {
      case 'newest':
        filtered = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'oldest':
        filtered = [...filtered].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case 'engagement_high':
        filtered = [...filtered].sort((a, b) => {
          const rateA = a.delivered > 0 ? (a.opened / a.delivered) * 100 : 0
          const rateB = b.delivered > 0 ? (b.opened / b.delivered) * 100 : 0
          return rateB - rateA
        })
        break
      case 'engagement_low':
        filtered = [...filtered].sort((a, b) => {
          const rateA = a.delivered > 0 ? (a.opened / a.delivered) * 100 : 0
          const rateB = b.delivered > 0 ? (b.opened / b.delivered) * 100 : 0
          return rateA - rateB
        })
        break
      case 'sent_high':
        filtered = [...filtered].sort((a, b) => b.sent - a.sent)
        break
      case 'sent_low':
        filtered = [...filtered].sort((a, b) => a.sent - b.sent)
        break
    }

    onFilter(filtered)
  }, [searchQuery, statusFilter, typeFilter, sortBy, campaigns, onFilter])

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Search Bar */}
          <Input
            placeholder="Search campaigns by name or audience..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />

          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>
                    <span className="capitalize">{status}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {types.map(type => (
                  <SelectItem key={type} value={type}>
                    <span className="capitalize">{type}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort By */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="engagement_high">Engagement (High to Low)</SelectItem>
                <SelectItem value="engagement_low">Engagement (Low to High)</SelectItem>
                <SelectItem value="sent_high">Recipients (High to Low)</SelectItem>
                <SelectItem value="sent_low">Recipients (Low to High)</SelectItem>
              </SelectContent>
            </Select>

            {/* Reset Filters */}
            {(searchQuery || statusFilter !== 'all' || typeFilter !== 'all' || sortBy !== 'newest') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('')
                  setStatusFilter('all')
                  setTypeFilter('all')
                  setSortBy('newest')
                }}
                className="w-full sm:w-auto"
              >
                Reset Filters
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface BulkActionBarProps {
  selectedCount: number
  onSelectAll: (selected: boolean) => void
  onBulkAction: (action: 'pause' | 'resume' | 'export' | 'delete') => void
  isLoading?: boolean
}

export function BulkActionBar({
  selectedCount,
  onSelectAll,
  onBulkAction,
  isLoading = false,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selectedCount > 0}
              onCheckedChange={(checked) => onSelectAll(checked as boolean)}
              className="cursor-pointer"
            />
            <span className="text-sm font-medium text-blue-900">
              {selectedCount} campaign{selectedCount !== 1 ? 's' : ''} selected
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkAction('pause')}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Pause className="w-4 h-4" />
              <span className="hidden sm:inline">Pause</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkAction('resume')}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <PlayCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Resume</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  More
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onBulkAction('export')}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onBulkAction('delete')}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Selected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface CampaignPerformanceBadgeProps {
  openRate: number
  clickRate: number
}

export function CampaignPerformanceBadge({ openRate, clickRate }: CampaignPerformanceBadgeProps) {
  let performance = 'low'
  let color = 'bg-red-100 text-red-800'

  const avgRate = (openRate + clickRate) / 2

  if (avgRate >= 40) {
    performance = 'excellent'
    color = 'bg-green-100 text-green-800'
  } else if (avgRate >= 20) {
    performance = 'good'
    color = 'bg-blue-100 text-blue-800'
  } else if (avgRate >= 10) {
    performance = 'average'
    color = 'bg-yellow-100 text-yellow-800'
  }

  return (
    <Badge className={color} variant="secondary">
      {performance.charAt(0).toUpperCase() + performance.slice(1)}
    </Badge>
  )
}
