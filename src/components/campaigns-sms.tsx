import { useState } from "react";
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

const smsCampaigns = [
  {
    id: 1,
    name: "Last Minute Tickets",
    status: "active",
    audience: "Event Interested",
    message: "🎫 LAST CHANCE! Travis Scott Houston tickets still available. Get yours: wreck.sh/tickets",
    sent: 8920,
    delivered: 8876,
    opened: 7234,
    clicked: 1456,
    revenue: "$4,320",
    scheduledFor: "Dec 10, 2024 6:00 PM",
    createdAt: "Dec 10, 2024",
    characterCount: 97,
    quietHours: true,
  },
  {
    id: 2,
    name: "VIP Package Alert",
    status: "paused",
    audience: "VIP Customers",
    message: "✨ Exclusive VIP packages now available for Houston show! Limited quantity: wreck.sh/vip",
    sent: 1230,
    delivered: 1225,
    opened: 1189,
    clicked: 234,
    revenue: "$2,100",
    scheduledFor: "Dec 8, 2024 12:00 PM",
    createdAt: "Dec 7, 2024",
    characterCount: 94,
    quietHours: false,
  },
  {
    id: 3,
    name: "Album Drop Reminder",
    status: "completed",
    audience: "All Subscribers",
    message: "🔥 UTOPIA is NOW LIVE! Stream on all platforms: wreck.sh/utopia Don't miss Travis Scott's new album!",
    sent: 15430,
    delivered: 15398,
    opened: 14892,
    clicked: 3234,
    revenue: "$8,920",
    scheduledFor: "Dec 1, 2024 12:01 AM",
    createdAt: "Nov 30, 2024",
    characterCount: 104,
    quietHours: false,
  },
  {
    id: 4,
    name: "Flash Sale - 24hrs",
    status: "scheduled",
    audience: "High Engagement",
    message: "⚡ FLASH SALE! 30% off all merch for next 24hrs only. Use code FLASH30: wreck.sh/shop",
    sent: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
    revenue: "$0",
    scheduledFor: "Dec 15, 2024 9:00 AM",
    createdAt: "Dec 12, 2024",
    characterCount: 89,
    quietHours: true,
  },
  {
    id: 5,
    name: "Concert Reminder",
    status: "draft",
    audience: "Houston Locals",
    message: "🎤 Reminder: Travis Scott Houston show TOMORROW! Gates open 7pm. See you there! 🔥",
    sent: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
    revenue: "$0",
    scheduledFor: null,
    createdAt: "Dec 12, 2024",
    characterCount: 85,
    quietHours: true,
  },
];

interface CampaignsSMSProps {
  onPageChange?: (page: string) => void;
}

export function CampaignsSMS({ onPageChange }: CampaignsSMSProps = {}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterAudience, setFilterAudience] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredCampaigns = smsCampaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || campaign.status === filterStatus;
    const matchesAudience = filterAudience === "all" || campaign.audience.toLowerCase().includes(filterAudience.toLowerCase());
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
            SMS Campaigns ({filteredCampaigns.length})
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
                <TableRow key={campaign.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{campaign.name}</div>
                      <div className="text-sm text-muted-foreground max-w-xs line-clamp-2">
                        {campaign.message}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-xs ${getCharacterCountColor(campaign.characterCount)}`}>
                          {campaign.characterCount}/160 chars
                        </span>
                        {campaign.quietHours && (
                          <Badge variant="outline" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            Quiet Hours
                          </Badge>
                        )}
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
                    {campaign.sent > 0 ? (
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">
                          {calculateDeliveryRate(campaign.delivered, campaign.sent)}%
                        </span>
                        <Progress 
                          value={parseFloat(calculateDeliveryRate(campaign.delivered, campaign.sent))} 
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
      <CreateSMSCampaignModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </div>
  );
}