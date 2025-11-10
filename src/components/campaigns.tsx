import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Mail,
  MessageSquare,
  Calendar,
  TrendingUp,
  Eye,
  Edit,
  Copy,
  Pause,
  Play,
  MoreHorizontal,
  BarChart3,
  Beaker,
} from "lucide-react";
import { CreateCampaignModal } from "./create-campaign-modal";
import { CreateEmailCampaignModal } from "./create-email-campaign-modal";
import { CreateSMSCampaignModal } from "./create-sms-campaign-modal";
import { CreateJourneyModal } from "./create-journey-modal";
import { CampaignAnalyticsModal } from "./campaign-analytics-modal";
import { ABTestingWrapper } from "./ab-testing-wrapper";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
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
import { Progress } from "./ui/progress";

const emailCampaigns = [
  {
    id: 1,
    name: "UTOPIA Album Launch",
    status: "active",
    type: "email",
    audience: "Travis Scott Fans",
    sent: 45230,
    delivered: 44891,
    opened: 18356,
    clicked: 3671,
    revenue: "$12,450",
    scheduledFor: "Dec 10, 2024 9:00 AM",
    createdAt: "Dec 8, 2024",
  },
  {
    id: 2,
    name: "Houston Concert Presale",
    status: "scheduled",
    type: "email",
    audience: "Houston Locals",
    sent: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
    revenue: "$0",
    scheduledFor: "Dec 12, 2024 10:00 AM",
    createdAt: "Dec 9, 2024",
  },
  {
    id: 3,
    name: "Merch Drop Announcement",
    status: "completed",
    type: "email",
    audience: "High Engagement",
    sent: 23450,
    delivered: 23234,
    opened: 12456,
    clicked: 2891,
    revenue: "$8,920",
    scheduledFor: "Dec 5, 2024 2:00 PM",
    createdAt: "Dec 4, 2024",
  },
];

const smsCampaigns = [
  {
    id: 4,
    name: "Last Minute Tickets",
    status: "active",
    type: "sms",
    audience: "Event Interested",
    sent: 8920,
    delivered: 8876,
    opened: 7234,
    clicked: 1456,
    revenue: "$4,320",
    scheduledFor: "Dec 10, 2024 6:00 PM",
    createdAt: "Dec 10, 2024",
  },
  {
    id: 5,
    name: "VIP Package Alert",
    status: "paused",
    type: "sms",
    audience: "VIP Customers",
    sent: 1230,
    delivered: 1225,
    opened: 1189,
    clicked: 234,
    revenue: "$2,100",
    scheduledFor: "Dec 8, 2024 12:00 PM",
    createdAt: "Dec 7, 2024",
  },
];

const journeys = [
  {
    id: 6,
    name: "New Fan Onboarding",
    status: "active",
    type: "journey",
    audience: "New Subscribers",
    contacts: 2340,
    completed: 1876,
    revenue: "$3,450",
    createdAt: "Nov 28, 2024",
  },
];

export function Campaigns() {
  const [activeTab, setActiveTab] = useState("email");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showSMSModal, setShowSMSModal] = useState(false);
  const [showJourneyModal, setShowJourneyModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [selectedCampaignName, setSelectedCampaignName] = useState<string>("");

  const handleSelectCampaignType = (type: 'email' | 'sms' | 'journey') => {
    switch (type) {
      case 'email':
        setShowEmailModal(true);
        break;
      case 'sms':
        setShowSMSModal(true);
        break;
      case 'journey':
        setShowJourneyModal(true);
        break;
    }
  };

  const handleViewAnalytics = (campaignId: string, campaignName: string) => {
    setSelectedCampaignId(campaignId);
    setSelectedCampaignName(campaignName);
    setShowAnalyticsModal(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-accent text-accent-foreground">Active</Badge>;
      case "scheduled":
        return <Badge variant="secondary">Scheduled</Badge>;
      case "completed":
        return <Badge variant="outline">Completed</Badge>;
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
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">
            Create and manage your email, SMS, and automated campaigns
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <TrendingUp className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Campaign Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">127</div>
            <div className="text-sm text-muted-foreground">Total Campaigns</div>
            <div className="text-xs text-accent mt-1">+8 this month</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">2.1M</div>
            <div className="text-sm text-muted-foreground">Messages Sent</div>
            <div className="text-xs text-accent mt-1">+12% vs last month</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">24.8%</div>
            <div className="text-sm text-muted-foreground">Avg. Open Rate</div>
            <div className="text-xs text-accent mt-1">+2.1% improvement</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">$127K</div>
            <div className="text-sm text-muted-foreground">Revenue Generated</div>
            <div className="text-xs text-accent mt-1">+18% vs last month</div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="email" className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </TabsTrigger>
            <TabsTrigger value="sms" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>SMS</span>
            </TabsTrigger>
            <TabsTrigger value="journeys" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Journeys</span>
            </TabsTrigger>
            <TabsTrigger value="ab-testing" className="flex items-center space-x-2">
              <Beaker className="w-4 h-4" />
              <span>A/B Testing</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Campaigns</CardTitle>
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
                  {emailCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{campaign.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Created {campaign.createdAt}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{campaign.audience}</Badge>
                      </TableCell>
                      <TableCell>
                        {campaign.sent > 0 ? campaign.sent.toLocaleString() : "-"}
                      </TableCell>
                      <TableCell>
                        {campaign.delivered > 0 ? (
                          <div className="flex items-center space-x-2">
                            <span>
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
                            <span>
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
                      <TableCell className="text-sm">
                        {campaign.scheduledFor}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewAnalytics(campaign.id.toString(), campaign.name)}>
                              <BarChart3 className="w-4 h-4 mr-2" />
                              View Analytics
                            </DropdownMenuItem>
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
                            ) : (
                              <DropdownMenuItem>
                                <Play className="w-4 h-4 mr-2" />
                                Resume
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
        </TabsContent>

        <TabsContent value="sms">
          <Card>
            <CardHeader>
              <CardTitle>SMS Campaigns</CardTitle>
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
                  {smsCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{campaign.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Created {campaign.createdAt}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{campaign.audience}</Badge>
                      </TableCell>
                      <TableCell>
                        {campaign.sent > 0 ? campaign.sent.toLocaleString() : "-"}
                      </TableCell>
                      <TableCell>
                        {campaign.sent > 0 ? (
                          <div className="flex items-center space-x-2">
                            <span>
                              {((campaign.delivered / campaign.sent) * 100).toFixed(1)}%
                            </span>
                            <Progress 
                              value={(campaign.delivered / campaign.sent) * 100} 
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
                            <span>
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
                      <TableCell className="text-sm">
                        {campaign.scheduledFor}
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
                            ) : (
                              <DropdownMenuItem>
                                <Play className="w-4 h-4 mr-2" />
                                Resume
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
        </TabsContent>

        <TabsContent value="journeys">
          <Card>
            <CardHeader>
              <CardTitle>Customer Journeys</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Journey</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Audience</TableHead>
                    <TableHead>Contacts</TableHead>
                    <TableHead>Completion Rate</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {journeys.map((journey) => (
                    <TableRow key={journey.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{journey.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Multi-step automation
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(journey.status)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{journey.audience}</Badge>
                      </TableCell>
                      <TableCell>{journey.contacts.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>
                            {((journey.completed / journey.contacts) * 100).toFixed(1)}%
                          </span>
                          <Progress 
                            value={(journey.completed / journey.contacts) * 100} 
                            className="w-16 h-1"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {journey.revenue}
                      </TableCell>
                      <TableCell className="text-sm">
                        {journey.createdAt}
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
                              View Canvas
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Journey
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="w-4 h-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Pause className="w-4 h-4 mr-2" />
                              Pause
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ab-testing">
          <ABTestingWrapper campaignId="default" />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <CreateCampaignModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSelectCampaignType={handleSelectCampaignType}
      />
      <CreateEmailCampaignModal
        open={showEmailModal}
        onOpenChange={setShowEmailModal}
      />
      <CreateSMSCampaignModal
        open={showSMSModal}
        onOpenChange={setShowSMSModal}
      />
      <CreateJourneyModal
        open={showJourneyModal}
        onOpenChange={setShowJourneyModal}
      />
      {selectedCampaignId && (
        <CampaignAnalyticsModal
          open={showAnalyticsModal}
          onOpenChange={setShowAnalyticsModal}
          campaignId={selectedCampaignId}
          campaignName={selectedCampaignName}
        />
      )}
    </div>
  );
}