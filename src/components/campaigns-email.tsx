import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Mail,
  Calendar,
  TrendingUp,
  Eye,
  Edit,
  Copy,
  Pause,
  Play,
  MoreHorizontal,
  Send,
  Users,
  ArrowLeft,
} from "lucide-react";
import { CreateEmailCampaignModal } from "./create-email-campaign-modal";
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

const emailCampaigns = [
  {
    id: 1,
    name: "UTOPIA Album Launch",
    status: "active",
    audience: "Travis Scott Fans",
    subject: "🔥 UTOPIA is HERE! Stream Now",
    sent: 45230,
    delivered: 44891,
    opened: 18356,
    clicked: 3671,
    revenue: "$12,450",
    scheduledFor: "Dec 10, 2024 9:00 AM",
    createdAt: "Dec 8, 2024",
    template: "Album Launch",
    sender: "Wreckshop Records",
  },
  {
    id: 2,
    name: "Houston Concert Presale",
    status: "scheduled",
    audience: "Houston Locals",
    subject: "🎫 Exclusive Presale: Travis Scott Houston",
    sent: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
    revenue: "$0",
    scheduledFor: "Dec 12, 2024 10:00 AM",
    createdAt: "Dec 9, 2024",
    template: "Event Presale",
    sender: "Wreckshop Records",
  },
  {
    id: 3,
    name: "Merch Drop Announcement",
    status: "completed",
    audience: "High Engagement",
    subject: "✨ New Merch Drop - Limited Edition",
    sent: 23450,
    delivered: 23234,
    opened: 12456,
    clicked: 2891,
    revenue: "$8,920",
    scheduledFor: "Dec 5, 2024 2:00 PM",
    createdAt: "Dec 4, 2024",
    template: "Merchandise",
    sender: "Wreckshop Records",
  },
  {
    id: 4,
    name: "Weekly Newsletter #47",
    status: "draft",
    audience: "All Subscribers",
    subject: "This Week in Hip Hop",
    sent: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
    revenue: "$0",
    scheduledFor: null,
    createdAt: "Dec 10, 2024",
    template: "Newsletter",
    sender: "Wreckshop Records",
  },
];

interface CampaignsEmailProps {
  onPageChange?: (page: string) => void;
}

export function CampaignsEmail({ onPageChange }: CampaignsEmailProps = {}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTemplate, setFilterTemplate] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredCampaigns = emailCampaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || campaign.status === filterStatus;
    const matchesTemplate = filterTemplate === "all" || campaign.template.toLowerCase() === filterTemplate;
    return matchesSearch && matchesStatus && matchesTemplate;
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

  const calculateOpenRate = (opened: number, delivered: number) => {
    return delivered > 0 ? ((opened / delivered) * 100).toFixed(1) : "0";
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
            <h1 className="text-3xl font-bold">Email Campaigns</h1>
            <p className="text-muted-foreground">
              Create, manage, and track your email marketing campaigns
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
              <Mail className="w-5 h-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">87</div>
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
                <div className="text-2xl font-bold">1.8M</div>
                <div className="text-sm text-muted-foreground">Emails Sent</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-warning" />
              <div>
                <div className="text-2xl font-bold">24.8%</div>
                <div className="text-sm text-muted-foreground">Avg. Open Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-destructive" />
              <div>
                <div className="text-2xl font-bold">$89K</div>
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
                  placeholder="Search campaigns by name or subject..."
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
              <Select value={filterTemplate} onValueChange={setFilterTemplate}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Templates</SelectItem>
                  <SelectItem value="album launch">Album Launch</SelectItem>
                  <SelectItem value="event presale">Event Presale</SelectItem>
                  <SelectItem value="merchandise">Merchandise</SelectItem>
                  <SelectItem value="newsletter">Newsletter</SelectItem>
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
            <Mail className="w-5 h-5 mr-2" />
            Email Campaigns ({filteredCampaigns.length})
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
                <TableHead>Open Rate</TableHead>
                <TableHead>Click Rate</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Scheduled</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCampaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{campaign.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {campaign.subject}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Template: {campaign.template}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <Badge variant="outline">{campaign.audience}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {campaign.sent > 0 ? (
                      <div>
                        <div className="font-medium">
                          {campaign.sent.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {campaign.delivered.toLocaleString()} delivered
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {campaign.delivered > 0 ? (
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">
                          {calculateOpenRate(campaign.opened, campaign.delivered)}%
                        </span>
                        <Progress 
                          value={parseFloat(calculateOpenRate(campaign.opened, campaign.delivered))} 
                          className="w-16 h-1"
                        />
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {campaign.delivered > 0 ? (
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">
                          {calculateClickRate(campaign.clicked, campaign.delivered)}%
                        </span>
                        <Progress 
                          value={parseFloat(calculateClickRate(campaign.clicked, campaign.delivered))} 
                          className="w-16 h-1"
                        />
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {campaign.revenue}
                  </TableCell>
                  <TableCell>
                    {campaign.scheduledFor ? (
                      <div className="text-sm">
                        <div>{campaign.scheduledFor.split(' ')[0]}</div>
                        <div className="text-muted-foreground">
                          {campaign.scheduledFor.split(' ').slice(1).join(' ')}
                        </div>
                      </div>
                    ) : (
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
                        {campaign.status === "active" ? (
                          <DropdownMenuItem>
                            <Pause className="w-4 h-4 mr-2" />
                            Pause
                          </DropdownMenuItem>
                        ) : campaign.status === "paused" ? (
                          <DropdownMenuItem>
                            <Play className="w-4 h-4 mr-2" />
                            Resume
                          </DropdownMenuItem>
                        ) : null}
                        {campaign.status === "draft" && (
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
      <CreateEmailCampaignModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </div>
  );
}