import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MessageSquare,
  Clock,
  TrendingUp,
  Eye,
  Edit,
  Copy,
  Pause,
  Play,
  MoreHorizontal,
  Send,
  Users,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import { CreateSMSCampaignModal } from "./create-sms-campaign-modal";
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

type CampaignDoc = {
  _id: string
  name: string
  status?: 'draft'|'scheduled'|'running'|'paused'|'completed'|'failed'
  channels?: { sms?: { bodyText?: string } }
  schedule?: { startAt?: string | Date }
}

interface CampaignsSMSProps {
  onPageChange?: (page: string) => void;
}

export function CampaignsSMS({ onPageChange }: CampaignsSMSProps = {}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterAudience, setFilterAudience] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [items, setItems] = useState<CampaignDoc[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function loadCampaigns() {
    setLoading(true); setError(null)
    try {
      const res = await fetch('/api/campaigns')
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || `Failed to load campaigns (${res.status})`)
      setItems(json.data || [])
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadCampaigns() }, [])

  const smsCampaigns = useMemo(() => items.filter(c => c.channels?.sms), [items])
  const filteredCampaigns = smsCampaigns.filter(campaign => {
    const message = campaign.channels?.sms?.bodyText || ''
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || (campaign.status || 'draft') === filterStatus;
    // Audience filtering not yet wired
    const matchesAudience = filterAudience === "all";
    return matchesSearch && matchesStatus && matchesAudience;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-accent text-accent-foreground">Active</Badge>;
      case "scheduled":
        return <Badge variant="secondary">Scheduled</Badge>;
      case "completed":
        return <Badge variant="outline">Completed</Badge>;
      case "draft":
        return <Badge className="bg-muted text-muted-foreground">Draft</Badge>;
      case "paused":
        return <Badge variant="destructive">Paused</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getCharacterCountColor = (count: number) => {
    if (count <= 160) return "text-accent";
    if (count <= 320) return "text-warning";
    return "text-destructive";
  };

  const calculateDeliveryRate = (delivered: number, sent: number) => {
    return sent > 0 ? ((delivered / sent) * 100).toFixed(1) : "0";
  };

  const calculateClickRate = (clicked: number, delivered: number) => {
    return delivered > 0 ? ((clicked / delivered) * 100).toFixed(1) : "0";
  };

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
            <h1 className="text-3xl font-bold">SMS Campaigns</h1>
            <p className="text-muted-foreground">
              Create and send targeted SMS messages to your audience
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <TrendingUp className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        </div>
      </div>

      {/* Campaign Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">34</div>
                <div className="text-sm text-muted-foreground">Total Campaigns</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Send className="w-5 h-5 text-accent" />
              <div>
                <div className="text-2xl font-bold">267K</div>
                <div className="text-sm text-muted-foreground">Messages Sent</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-warning" />
              <div>
                <div className="text-2xl font-bold">97.2%</div>
                <div className="text-sm text-muted-foreground">Delivery Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-destructive" />
              <div>
                <div className="text-2xl font-bold">$15.3K</div>
                <div className="text-sm text-muted-foreground">Revenue Generated</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Alert */}
      <Card className="border-warning bg-warning/5">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <div>
              <div className="font-medium">SMS Compliance Active</div>
              <div className="text-sm text-muted-foreground">
                Quiet hours enabled (9pm-8am local time). 10DLC registration verified. 
                Opt-out keywords monitored.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search campaigns by name or message..."
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
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterAudience} onValueChange={setFilterAudience}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Audiences</SelectItem>
                  <SelectItem value="vip">VIP Customers</SelectItem>
                  <SelectItem value="subscribers">All Subscribers</SelectItem>
                  <SelectItem value="houston">Houston Locals</SelectItem>
                  <SelectItem value="engagement">High Engagement</SelectItem>
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

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            SMS Campaigns {loading ? '(loading...)' : `(${filteredCampaigns.length})`} {error ? <span className="text-destructive text-xs ml-2">{error}</span> : null}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>Delivery Rate</TableHead>
                <TableHead>Click Rate</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Scheduled</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCampaigns.map((campaign) => (
                <TableRow key={campaign._id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{campaign.name}</div>
                      {campaign.channels?.sms?.bodyText && (
                        <div className="text-sm text-muted-foreground max-w-xs line-clamp-2">
                          {campaign.channels.sms.bodyText}
                        </div>
                      )}
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-muted-foreground">Preview</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(campaign.status || 'draft')}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <Badge variant="outline">Segments TBD</Badge>
                    </div>
                  </TableCell>
                  <TableCell><span className="text-muted-foreground">-</span></TableCell>
                  <TableCell><span className="text-muted-foreground">-</span></TableCell>
                  <TableCell className="font-medium"><span className="text-muted-foreground">-</span></TableCell>
                  <TableCell>
                    {campaign.schedule?.startAt ? new Date(campaign.schedule.startAt).toLocaleString() : (
                      <span className="text-muted-foreground">Not scheduled</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Campaign
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        {(campaign.status || 'draft') === "running" ? (
                          <DropdownMenuItem>
                            <Pause className="w-4 h-4 mr-2" />
                            Pause
                          </DropdownMenuItem>
                        ) : (campaign.status || 'draft') === "paused" ? (
                          <DropdownMenuItem>
                            <Play className="w-4 h-4 mr-2" />
                            Resume
                          </DropdownMenuItem>
                        ) : null}
                        {(campaign.status || 'draft') === "draft" && (
                          <DropdownMenuItem>
                            <Send className="w-4 h-4 mr-2" />
                            Send Now
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Campaign Modal */}
      <CreateSMSCampaignModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCreated={() => { setShowCreateModal(false); loadCampaigns() }}
      />
    </div>
  );
}