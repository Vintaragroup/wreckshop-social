import { useMemo, useState } from "react";
import { useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  GitBranch,
  Users,
  Clock,
  TrendingUp,
  Eye,
  Edit,
  Copy,
  Pause,
  Play,
  MoreHorizontal,
  ArrowRight,
  Mail,
  MessageSquare,
  Timer,
  Zap,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import { CreateJourneyModal } from "./create-journey-modal";
import { EditJourneyModal } from "./edit-journey-modal";
import { ViewJourneyCanvas } from "./view-journey-canvas";
import { JourneyAnalyticsModal } from "./journey-analytics-modal";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Progress } from "./ui/progress";

// Types aligned with backend Journey model
type JourneyStep = {
  id: string;
  type: 'trigger' | 'delay' | 'condition' | 'email' | 'sms' | 'branch' | 'exit' | 'webhook';
  name?: string;
  config?: any;
};

type JourneyDoc = {
  _id: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'paused';
  segmentId?: string;
  triggerKey?: string;
  steps: JourneyStep[];
  createdAt?: string;
  updatedAt?: string;
  metrics?: Array<{ stepId: string; entered: number; completed: number; dropped: number }>;
};

interface CampaignsJourneysProps {
  onPageChange?: (page: string) => void;
}

export function CampaignsJourneys({ onPageChange }: CampaignsJourneysProps = {}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTrigger, setFilterTrigger] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [refreshSeq, setRefreshSeq] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [selectedJourney, setSelectedJourney] = useState<JourneyDoc | null>(null);

  // Journeys from backend
  const [journeys, setJourneys] = useState<JourneyDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let aborted = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const url = new URL('/api/journeys', window.location.origin);
        if (filterStatus !== 'all') url.searchParams.set('status', filterStatus);
        const res = await fetch(url.toString(), { credentials: 'include' });
        if (!res.ok) throw new Error(`Failed to load journeys (${res.status})`);
        const json = await res.json();
        if (!aborted) setJourneys(json.data || []);
      } catch (e: any) {
        if (!aborted) setError(e?.message || 'Failed to load journeys');
      } finally {
        if (!aborted) setLoading(false);
      }
    }
    load();
    return () => { aborted = true };
  }, [filterStatus, refreshSeq]);

  const filteredJourneys = useMemo(() => {
    return journeys.filter((j) => {
      const matchesSearch = j.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (j.triggerKey || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || j.status === filterStatus;
      const matchesTrigger = filterTrigger === 'all' || (j.triggerKey || '').toLowerCase().includes(filterTrigger.toLowerCase());
      return matchesSearch && matchesStatus && matchesTrigger;
    });
  }, [journeys, searchQuery, filterStatus, filterTrigger]);

  // Minimal derived stats (no analytics yet)
  const stats = useMemo(() => {
    const activeCount = journeys.filter((j) => j.status === 'active').length;
    return { totalContacts: 0, totalCompleted: 0, activeCount, avgCompletion: 0, totalRevenue: 0 };
  }, [journeys]);

  async function postAction(id: string, action: 'publish' | 'pause' | 'resume' | 'duplicate') {
    try {
      const res = await fetch(`/api/journeys/${id}/${action}`, { method: 'POST', credentials: 'include' })
      if (!res.ok) throw new Error(`${action} failed (${res.status})`)
      setRefreshSeq((s) => s + 1)
      const label = action.charAt(0).toUpperCase() + action.slice(1)
      toast.success(`${label} successful`)
    } catch (err) {
      console.error('journey action error', err)
      setError((err as any)?.message || `${action} failed`)
      toast.error((err as any)?.message || `Failed to ${action}`)
    }
  }

  function openEdit(j: JourneyDoc) {
    setSelectedJourney(j);
    setEditOpen(true);
  }

  function openView(j: JourneyDoc) {
    setSelectedJourney(j);
    setViewOpen(true);
  }

  function openAnalytics(j: JourneyDoc) {
    setSelectedJourney(j);
    setAnalyticsOpen(true);
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-accent text-accent-foreground">Active</Badge>;
      case "scheduled":
        return <Badge variant="secondary">Scheduled</Badge>;
      case "completed":
        return <Badge variant="outline">Completed</Badge>;
        return <Badge className="bg-muted text-muted-foreground">Draft</Badge>;
      case "paused":
        return <Badge variant="destructive">Paused</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const calculateCompletionRate = (completed: number, contacts: number) => {
    return contacts > 0 ? ((completed / contacts) * 100).toFixed(1) : "0";
  };

  const stepIcon = (type: JourneyStep['type']) => {
    switch (type) {
      case 'trigger':
        return Users;
      case 'delay':
        return Timer;
      case 'email':
        return Mail;
      case 'sms':
        return MessageSquare;
      case 'condition':
      case 'branch':
        return GitBranch;
      case 'exit':
      case 'webhook':
      default:
        return Zap;
    }
  };

  const JourneySteps = ({ steps, performance }: { steps: JourneyStep[], performance: any }) => (
    <div className="flex items-center space-x-3 text-xs">
      {steps.slice(0, 4).map((step, index) => {
        const Icon = stepIcon(step.type);
        const completionRate = performance[`step${index + 1}`] || 0;
        return (
          <div key={index} className="flex items-center space-x-2">
            <div className="relative mr-6 pr-2 pb-1">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  completionRate > 80 ? 'bg-accent' :
                  completionRate > 50 ? 'bg-warning' : 'bg-muted'
                }`}
              >
                <Icon className="w-3 h-3 text-white" />
              </div>
              {completionRate > 0 && (
                <div className="absolute -bottom-2 -right-3 z-10 flex flex-col items-center text-[10px] font-semibold leading-none pointer-events-none select-none pb-1">
                  {/* Inline number + % below badge with small gap */}
                  <div className="flex items-baseline bg-background/95 ring-1 ring-border px-1 py-[1px] rounded-sm shadow-sm">
                    <span>{completionRate}</span>
                    <span className="ml-[1px] text-[8px]">%</span>
                  </div>
                </div>
              )}
            </div>
            {index < 3 && <ArrowRight className="w-3 h-3 text-muted-foreground mx-2" />}
          </div>
        );
      })}
      {steps.length > 4 && (
        <div className="text-muted-foreground">
          +{steps.length - 4} more
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange?.("campaigns")}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="sr-only">Back to Campaigns Overview</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Customer Journeys</h1>
            <p className="text-muted-foreground">
              Create automated multi-step campaigns that respond to user behavior
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setRefreshSeq((s) => s + 1)}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <TrendingUp className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Journey
          </Button>
        </div>
      </div>

      {/* Journey Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <GitBranch className="w-5 h-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">{stats.activeCount}</div>
                <div className="text-sm text-muted-foreground">Active Journeys</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-accent" />
              <div>
                <div className="text-2xl font-bold">{stats.totalContacts.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Contacts in Journeys</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-warning" />
              <div>
                <div className="text-2xl font-bold">{stats.avgCompletion.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Avg. Completion Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-destructive" />
              <div>
                <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Revenue Generated</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search journeys by name or trigger..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterTrigger} onValueChange={setFilterTrigger}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Trigger" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Triggers</SelectItem>
                  <SelectItem value="subscriber">New Subscriber</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="behavior">Behavior</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Journeys Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <GitBranch className="w-5 h-5 mr-2" />
            Customer Journeys ({filteredJourneys.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="text-sm text-destructive mb-2">{error}</div>
          )}
          {loading && (
            <div className="text-sm text-muted-foreground mb-2">Loading journeys…</div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Journey</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Trigger</TableHead>
                <TableHead>Contacts</TableHead>
                <TableHead>Completion Rate</TableHead>
                <TableHead>Journey Flow</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Modified</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJourneys.map((journey) => (
                <TableRow key={journey._id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{journey.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {journey.createdAt ? `Created ${new Date(journey.createdAt).toLocaleDateString()}` : ''}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(journey.status)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{journey.triggerKey || '-'}</Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">-</div>
                      <div className="text-xs text-muted-foreground">—</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">-</span>
                  </TableCell>
                  <TableCell>
                    <JourneySteps steps={journey.steps} performance={{}} />
                  </TableCell>
                  <TableCell className="font-medium">
                    -
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {journey.updatedAt ? new Date(journey.updatedAt).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => openView(journey)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Canvas
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => openEdit(journey)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Journey
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => postAction(journey._id, 'duplicate')}>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={async () => {
                            try {
                              if (!confirm('Delete this journey? This cannot be undone.')) return;
                              const res = await fetch(`/api/journeys/${journey._id}`, { method: 'DELETE', credentials: 'include' })
                              if (!res.ok) throw new Error(`delete failed (${res.status})`)
                              setRefreshSeq((s) => s + 1)
                              toast.success('Journey deleted')
                            } catch (err) {
                              console.error('delete failed', err)
                              setError((err as any)?.message || 'Delete failed')
                              toast.error((err as any)?.message || 'Delete failed')
                            }
                          }}
                        >
                          <Pause className="w-4 h-4 mr-2 rotate-90" />
                          Delete
                        </DropdownMenuItem>
                        {journey.status === "draft" ? (
                          journey.segmentId ? (
                            <DropdownMenuItem onSelect={() => { if (confirm('Publish this journey now? Existing eligible profiles may enter immediately.')) postAction(journey._id, 'publish') }}>
                              <Play className="w-4 h-4 mr-2" />
                              Publish
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem disabled>
                              <Play className="w-4 h-4 mr-2" />
                              Publish (select segment first)
                            </DropdownMenuItem>
                          )
                        ) : journey.status === "active" ? (
                          <DropdownMenuItem onSelect={() => postAction(journey._id, 'pause')}>
                            <Pause className="w-4 h-4 mr-2" />
                            Pause
                          </DropdownMenuItem>
                        ) : journey.status === "paused" ? (
                          <DropdownMenuItem onSelect={() => postAction(journey._id, 'resume')}>
                            <Play className="w-4 h-4 mr-2" />
                            Resume
                          </DropdownMenuItem>
                        ) : null}
                        <DropdownMenuItem onSelect={() => openAnalytics(journey)}>
                          <TrendingUp className="w-4 h-4 mr-2" />
                          View Analytics
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredJourneys.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9}>
                    <div className="p-10 text-center">
                      <GitBranch className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Create your first journey</h3>
                      <p className="text-muted-foreground mb-4">Automate multi-step outreach across email and SMS, triggered by behavior.</p>
                      <Button onClick={() => setShowCreateModal(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Journey
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Journey Modal */}
      <CreateJourneyModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCreated={() => setRefreshSeq((s) => s + 1)}
      />

      {/* Edit Journey Modal */}
      <EditJourneyModal
        open={editOpen}
        onOpenChange={setEditOpen}
        journey={selectedJourney}
        onSaved={() => setRefreshSeq((s) => s + 1)}
      />

      {/* View Canvas (read-only preview) */}
      <ViewJourneyCanvas
        open={viewOpen}
        onOpenChange={setViewOpen}
        journey={selectedJourney as any}
      />

      {/* Journey Analytics (placeholder) */}
      <JourneyAnalyticsModal
        open={analyticsOpen}
        onOpenChange={setAnalyticsOpen}
        journey={selectedJourney as any}
      />
    </div>
  );
}