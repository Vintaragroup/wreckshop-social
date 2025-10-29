import { useState } from "react";
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
} from "lucide-react";
import { CreateJourneyModal } from "./create-journey-modal";
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

const journeys = [
  {
    id: 1,
    name: "New Fan Onboarding",
    status: "active",
    trigger: "New Subscriber",
    contacts: 2340,
    completed: 1876,
    active: 312,
    stopped: 152,
    revenue: "$3,450",
    createdAt: "Nov 28, 2024",
    lastModified: "Dec 8, 2024",
    steps: [
      { type: "trigger", name: "New Subscriber", icon: Users },
      { type: "delay", name: "Wait 1 hour", icon: Timer },
      { type: "email", name: "Welcome Email", icon: Mail },
      { type: "delay", name: "Wait 3 days", icon: Timer },
      { type: "condition", name: "Opened Email?", icon: GitBranch },
      { type: "email", name: "Artist Introduction", icon: Mail },
      { type: "sms", name: "Exclusive Content", icon: MessageSquare },
    ],
    performance: {
      step1: 100,
      step2: 95,
      step3: 82,
      step4: 76,
      step5: 68,
      step6: 61,
      step7: 48,
    }
  },
  {
    id: 2,
    name: "Re-engagement Campaign",
    status: "active",
    trigger: "Inactive 30 Days",
    contacts: 890,
    completed: 234,
    active: 156,
    stopped: 500,
    revenue: "$1,890",
    createdAt: "Dec 1, 2024",
    lastModified: "Dec 10, 2024",
    steps: [
      { type: "trigger", name: "Inactive 30 Days", icon: Clock },
      { type: "email", name: "We Miss You", icon: Mail },
      { type: "delay", name: "Wait 7 days", icon: Timer },
      { type: "condition", name: "Opened Email?", icon: GitBranch },
      { type: "sms", name: "Special Offer", icon: MessageSquare },
      { type: "exit", name: "Remove from List", icon: Zap },
    ],
    performance: {
      step1: 100,
      step2: 89,
      step3: 67,
      step4: 45,
      step5: 32,
      step6: 26,
    }
  },
  {
    id: 3,
    name: "Album Launch Sequence",
    status: "scheduled",
    trigger: "Album Release Date",
    contacts: 0,
    completed: 0,
    active: 0,
    stopped: 0,
    revenue: "$0",
    createdAt: "Dec 5, 2024",
    lastModified: "Dec 11, 2024",
    steps: [
      { type: "trigger", name: "Album Release", icon: Users },
      { type: "email", name: "Album Announcement", icon: Mail },
      { type: "delay", name: "Wait 1 day", icon: Timer },
      { type: "sms", name: "Stream Reminder", icon: MessageSquare },
      { type: "delay", name: "Wait 7 days", icon: Timer },
      { type: "email", name: "Behind the Scenes", icon: Mail },
    ],
    performance: {}
  },
  {
    id: 4,
    name: "VIP Customer Journey",
    status: "paused",
    trigger: "High Spending",
    contacts: 156,
    completed: 89,
    active: 23,
    stopped: 44,
    revenue: "$5,670",
    createdAt: "Oct 15, 2024",
    lastModified: "Dec 2, 2024",
    steps: [
      { type: "trigger", name: "High Spending", icon: Users },
      { type: "email", name: "VIP Welcome", icon: Mail },
      { type: "sms", name: "Exclusive Access", icon: MessageSquare },
      { type: "delay", name: "Wait 14 days", icon: Timer },
      { type: "email", name: "VIP Rewards", icon: Mail },
    ],
    performance: {
      step1: 100,
      step2: 94,
      step3: 87,
      step4: 78,
      step5: 65,
    }
  },
];

interface CampaignsJourneysProps {
  onPageChange?: (page: string) => void;
}

export function CampaignsJourneys({ onPageChange }: CampaignsJourneysProps = {}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTrigger, setFilterTrigger] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredJourneys = journeys.filter(journey => {
    const matchesSearch = journey.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         journey.trigger.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || journey.status === filterStatus;
    const matchesTrigger = filterTrigger === "all" || journey.trigger.toLowerCase().includes(filterTrigger.toLowerCase());
    return matchesSearch && matchesStatus && matchesTrigger;
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

  const calculateCompletionRate = (completed: number, contacts: number) => {
    return contacts > 0 ? ((completed / contacts) * 100).toFixed(1) : "0";
  };

  const JourneySteps = ({ steps, performance }: { steps: any[], performance: any }) => (
    <div className="flex items-center space-x-2 text-xs">
      {steps.slice(0, 4).map((step, index) => {
        const Icon = step.icon;
        const completionRate = performance[`step${index + 1}`] || 0;
        return (
          <div key={index} className="flex items-center space-x-1">
            <div className="relative">
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  completionRate > 80 ? 'bg-accent' : 
                  completionRate > 50 ? 'bg-warning' : 'bg-muted'
                }`}
              >
                <Icon className="w-3 h-3 text-white" />
              </div>
              {completionRate > 0 && (
                <div className="absolute -bottom-1 -right-1 text-xs font-medium">
                  {completionRate}%
                </div>
              )}
            </div>
            {index < 3 && <ArrowRight className="w-3 h-3 text-muted-foreground" />}
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
                <div className="text-2xl font-bold">12</div>
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
                <div className="text-2xl font-bold">3.4K</div>
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
                <div className="text-2xl font-bold">72.4%</div>
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
                <div className="text-2xl font-bold">$11K</div>
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
                <TableRow key={journey.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{journey.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Created {journey.createdAt}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(journey.status)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{journey.trigger}</Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {journey.contacts.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {journey.active} active, {journey.completed} completed
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {journey.contacts > 0 ? (
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">
                          {calculateCompletionRate(journey.completed, journey.contacts)}%
                        </span>
                        <Progress 
                          value={parseFloat(calculateCompletionRate(journey.completed, journey.contacts))} 
                          className="w-16 h-1"
                        />
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <JourneySteps steps={journey.steps} performance={journey.performance} />
                  </TableCell>
                  <TableCell className="font-medium">
                    {journey.revenue}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {journey.lastModified}
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
                        {journey.status === "active" ? (
                          <DropdownMenuItem>
                            <Pause className="w-4 h-4 mr-2" />
                            Pause
                          </DropdownMenuItem>
                        ) : journey.status === "paused" ? (
                          <DropdownMenuItem>
                            <Play className="w-4 h-4 mr-2" />
                            Resume
                          </DropdownMenuItem>
                        ) : null}
                        <DropdownMenuItem>
                          <TrendingUp className="w-4 h-4 mr-2" />
                          View Analytics
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

      {/* Create Journey Modal */}
      <CreateJourneyModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </div>
  );
}