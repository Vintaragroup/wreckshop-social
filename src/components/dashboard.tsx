import {
  Activity,
  AlertTriangle,
  Calendar,
  CheckCircle,
  ExternalLink,
  Mail,
  MessageCircle,
  Music,
  TrendingUp,
  Users,
  Zap,
  Clock,
  AlertCircle,
  Instagram,
  Youtube,
  Smartphone,
  Facebook,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "./ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const connectorsData = [
  {
    name: "Instagram",
    status: "connected",
    lastSync: "2 min ago",
    rateLimit: 85,
    icon: Instagram,
  },
  {
    name: "YouTube",
    status: "connected",
    lastSync: "5 min ago",
    rateLimit: 45,
    icon: Youtube,
  },
  {
    name: "TikTok",
    status: "throttled",
    lastSync: "15 min ago",
    rateLimit: 95,
    icon: Music,
  },
  {
    name: "Facebook",
    status: "error",
    lastSync: "2 hours ago",
    rateLimit: 0,
    icon: Facebook,
  },
];

const engagementData = [
  { date: "2024-01-01", emails: 12500, sms: 3200, streams: 8900, tickets: 450 },
  { date: "2024-01-02", emails: 13200, sms: 3400, streams: 9200, tickets: 520 },
  { date: "2024-01-03", emails: 11800, sms: 3100, streams: 8500, tickets: 380 },
  { date: "2024-01-04", emails: 14100, sms: 3800, streams: 10200, tickets: 620 },
  { date: "2024-01-05", emails: 15300, sms: 4200, streams: 11400, tickets: 750 },
  { date: "2024-01-06", emails: 16800, sms: 4600, streams: 12100, tickets: 890 },
  { date: "2024-01-07", emails: 18200, sms: 5100, streams: 13500, tickets: 920 },
];

const upcomingItems = [
  {
    type: "campaign",
    title: "New Album Announcement",
    time: "Today, 3:00 PM",
    status: "scheduled",
  },
  {
    type: "release",
    title: "Travis Scott - UTOPIA Deluxe",
    time: "Tomorrow, 12:00 AM",
    status: "pending",
  },
  {
    type: "event",
    title: "Houston Concert - NRG Stadium",
    time: "Dec 15, 8:00 PM",
    status: "live",
  },
];

const alertsData = [
  {
    type: "error",
    message: "Facebook sync failed - token expired",
    time: "5 min ago",
  },
  {
    type: "warning",
    message: "TikTok rate limit at 95%",
    time: "12 min ago",
  },
  {
    type: "info",
    message: "10DLC registration pending review",
    time: "2 hours ago",
  },
];

export function Dashboard() {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Welcome back! Here's what's happening with your audience today.
          </p>
        </div>
        <Button className="w-full md:w-auto">
          <Zap className="w-4 h-4 mr-2" />
          Sync All Platforms
        </Button>
      </div>

      {/* Connectors Health */}
      <div>
        <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Platform Health</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {connectorsData.map((connector) => (
            <Card key={connector.name} className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <connector.icon className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">{connector.name}</span>
                  </div>
                  <Badge
                    variant={
                      connector.status === "connected"
                        ? "default"
                        : connector.status === "throttled"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {connector.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last sync</span>
                    <span>{connector.lastSync}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Rate limit</span>
                      <span>{connector.rateLimit}%</span>
                    </div>
                    <Progress 
                      value={connector.rateLimit} 
                      className="h-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Data Intake & Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Data Intake */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Data Intake
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Profiles Today</span>
              <span className="text-2xl font-bold">2,847</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">7-Day Total</span>
              <span className="text-xl font-semibold">18,392</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Enriched</span>
                <span>92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Pending Queue</span>
              <span className="text-sm font-medium text-warning">156</span>
            </div>
          </CardContent>
        </Card>

        {/* Engagement Snapshot */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              7-Day Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                emails: {
                  label: "Emails",
                  color: "#7C3AED",
                },
                sms: {
                  label: "SMS",
                  color: "#22C55E",
                },
                streams: {
                  label: "Streams",
                  color: "#F59E0B",
                },
                tickets: {
                  label: "Tickets",
                  color: "#EF4444",
                },
              }}
              className="h-[200px] w-full pl-0 pr-6 md:pl-2 md:pr-8"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line
                    type="monotone"
                    dataKey="emails"
                    stroke="#7C3AED"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="sms"
                    stroke="#22C55E"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="streams"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="tickets"
                    stroke="#EF4444"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-4">
              <div className="text-center">
                <div className="text-lg md:text-2xl font-bold" style={{ color: '#7C3AED' }}>105K</div>
                <div className="text-xs text-muted-foreground">Emails Sent</div>
              </div>
              <div className="text-center">
                <div className="text-lg md:text-2xl font-bold" style={{ color: '#22C55E' }}>27K</div>
                <div className="text-xs text-muted-foreground">SMS Sent</div>
              </div>
              <div className="text-center">
                <div className="text-lg md:text-2xl font-bold" style={{ color: '#F59E0B' }}>74K</div>
                <div className="text-xs text-muted-foreground">Streams</div>
              </div>
              <div className="text-center">
                <div className="text-lg md:text-2xl font-bold" style={{ color: '#EF4444' }}>4.5K</div>
                <div className="text-xs text-muted-foreground">Tickets</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Upcoming */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Upcoming
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  {item.type === "campaign" && <Mail className="w-4 h-4 text-primary" />}
                  {item.type === "release" && <Music className="w-4 h-4 text-accent" />}
                  {item.type === "event" && <Calendar className="w-4 h-4 text-warning" />}
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-muted-foreground">{item.time}</div>
                  </div>
                </div>
                <Badge
                  variant={
                    item.status === "scheduled"
                      ? "default"
                      : item.status === "live"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {item.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {alertsData.map((alert, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 border border-border rounded-lg">
                {alert.type === "error" && <AlertCircle className="w-4 h-4 text-destructive mt-0.5" />}
                {alert.type === "warning" && <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />}
                {alert.type === "info" && <Clock className="w-4 h-4 text-primary mt-0.5" />}
                <div className="flex-1">
                  <div className="text-sm font-medium">{alert.message}</div>
                  <div className="text-xs text-muted-foreground">{alert.time}</div>
                </div>
                <Button variant="ghost" size="sm">
                  Resolve
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}