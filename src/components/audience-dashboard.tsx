import { useEffect, useState } from "react";
import {
  Users,
  TrendingUp,
  Mail,
  MessageSquare,
  MapPin,
  Music,
  Instagram,
  Youtube,
  Calendar,
  Target,
  Zap,
  Activity,
} from "lucide-react";
import { CreateEmailCampaignModal } from "./create-email-campaign-modal";
import { CreateSMSCampaignModal } from "./create-sms-campaign-modal";
import { ExportDataModal } from "./export-data-modal";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface AudienceDashboardProps {
  onPageChange?: (page: string) => void;
}

export function AudienceDashboard({ onPageChange }: AudienceDashboardProps = {}) {
  const [timeRange, setTimeRange] = useState("30d");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showSMSModal, setShowSMSModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [contacts, setContacts] = useState<any[]>([])
  const [contactsLoading, setContactsLoading] = useState(false)
  const [contactsError, setContactsError] = useState<string | null>(null)

  async function loadContacts() {
    setContactsLoading(true); setContactsError(null)
    try {
      const res = await fetch('/api/audience/contacts')
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || `Failed to load contacts (${res.status})`)
      setContacts(json.data || [])
    } catch (e: any) {
      setContactsError(e.message)
    } finally {
      setContactsLoading(false)
    }
  }

  useEffect(() => { loadContacts() }, [])

  const topLocations = [
    { city: "Houston, TX", count: 8924, percentage: 24.8 },
    { city: "Dallas, TX", count: 6743, percentage: 18.7 },
    { city: "Austin, TX", count: 4532, percentage: 12.6 },
    { city: "San Antonio, TX", count: 3421, percentage: 9.5 },
    { city: "Atlanta, GA", count: 2876, percentage: 8.0 },
  ];

  const topArtists = [
    { name: "Travis Scott", fans: 15420, growth: 12.4 },
    { name: "Don Toliver", fans: 12330, growth: 8.7 },
    { name: "Maxo Kream", fans: 8940, growth: 15.2 },
    { name: "Megan Thee Stallion", fans: 7650, growth: 6.3 },
    { name: "Sheck Wes", fans: 5430, growth: 22.1 },
  ];

  const platformStats = [
    { platform: "Instagram", users: 18420, engagement: 4.2, icon: Instagram },
    { platform: "YouTube", users: 15680, engagement: 6.8, icon: Youtube },
    { platform: "TikTok", users: 12340, engagement: 8.1, icon: Music },
    { platform: "Spotify", users: 21560, engagement: 12.4, icon: Music },
  ];

  const recentActivity = [
    { type: "New Subscriber", count: 247, trend: "up", change: 15.2 },
    { type: "Email Opens", count: 1420, trend: "up", change: 8.4 },
    { type: "SMS Clicks", count: 89, trend: "down", change: -3.2 },
    { type: "Profile Updates", count: 156, trend: "up", change: 12.1 },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Audience Overview</h1>
          <p className="text-muted-foreground">
            Track and analyze your fan base across all platforms
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => onPageChange?.("audience-segments")}>
            <Target className="w-4 h-4 mr-2" />
            View Segments
          </Button>
          <Button onClick={() => onPageChange?.("audience-profiles")}>
            <Users className="w-4 h-4 mr-2" />
            View Profiles
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button 
              variant="outline" 
              className="h-12 flex items-center justify-center space-x-2"
              onClick={() => onPageChange?.("audience-segments")}
            >
              <Users className="w-4 h-4" />
              <span>Create Segment</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-12 flex items-center justify-center space-x-2"
              onClick={() => setShowEmailModal(true)}
            >
              <Mail className="w-4 h-4" />
              <span>Email Campaign</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-12 flex items-center justify-center space-x-2"
              onClick={() => setShowSMSModal(true)}
            >
              <MessageSquare className="w-4 h-4" />
              <span>SMS Campaign</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-12 flex items-center justify-center space-x-2"
              onClick={() => setShowExportModal(true)}
            >
              <Target className="w-4 h-4" />
              <span>Export Data</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">35,947</div>
                <div className="text-sm text-muted-foreground">Total Audience</div>
                <div className="text-xs text-accent mt-1 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12.4% this month
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-accent" />
              <div>
                <div className="text-2xl font-bold">28,432</div>
                <div className="text-sm text-muted-foreground">Email Subscribers</div>
                <div className="text-xs text-muted-foreground mt-1">79.1% of audience</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-warning" />
              <div>
                <div className="text-2xl font-bold">19,654</div>
                <div className="text-sm text-muted-foreground">SMS Subscribers</div>
                <div className="text-xs text-muted-foreground mt-1">54.7% of audience</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-destructive" />
              <div>
                <div className="text-2xl font-bold">87.3</div>
                <div className="text-sm text-muted-foreground">Avg. Engagement</div>
                <div className="text-xs text-accent mt-1 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +3.2 points
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Contacts (Live) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Recent Contacts {contactsLoading ? '(loading...)' : `(${Math.min(contacts.length, 5)})`}
              {contactsError ? <span className="text-destructive text-xs ml-2">{contactsError}</span> : null}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(contacts.slice(0, 5)).map((c) => (
              <div key={c._id} className="flex items-center justify-between border rounded-lg p-3">
                <div>
                  <div className="font-medium">{c.displayName || c.email || c.phone || 'Unnamed contact'}</div>
                  <div className="text-xs text-muted-foreground">
                    {c.email ? c.email : ''}{c.email && c.phone ? ' • ' : ''}{c.phone ? c.phone : ''}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {c.consent?.email ? <Badge variant="outline">Email</Badge> : null}
                  {c.consent?.sms ? <Badge variant="outline">SMS</Badge> : null}
                </div>
              </div>
            ))}
            {(!contactsLoading && contacts.length === 0 && !contactsError) && (
              <div className="text-sm text-muted-foreground">No contacts yet.</div>
            )}
          </CardContent>
        </Card>

        {/* Platform Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Platform Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {platformStats.map((platform) => {
              const Icon = platform.icon;
              return (
                <div key={platform.platform} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium">{platform.platform}</div>
                      <div className="text-sm text-muted-foreground">
                        {platform.users.toLocaleString()} users
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{platform.engagement}%</div>
                    <div className="text-sm text-muted-foreground">engagement</div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Top Locations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Top Locations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topLocations.map((location, index) => (
              <div key={location.city} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{location.city}</div>
                    <div className="text-sm text-muted-foreground">
                      {location.count.toLocaleString()} fans
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Progress value={location.percentage} className="w-16 h-2" />
                  <span className="text-sm font-medium w-12 text-right">
                    {location.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Artists */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Music className="w-5 h-5 mr-2" />
              Artist Affinity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topArtists.map((artist, index) => (
              <div key={artist.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-accent-foreground text-xs font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{artist.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {artist.fans.toLocaleString()} fans
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +{artist.growth}%
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.type} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{activity.type}</div>
                  <div className="text-sm text-muted-foreground">
                    {activity.count.toLocaleString()} in last {timeRange}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp 
                    className={`w-4 h-4 ${
                      activity.trend === 'up' ? 'text-accent' : 'text-destructive'
                    } ${activity.trend === 'down' ? 'rotate-180' : ''}`} 
                  />
                  <span className={`text-sm font-medium ${
                    activity.trend === 'up' ? 'text-accent' : 'text-destructive'
                  }`}>
                    {activity.change > 0 ? '+' : ''}{activity.change}%
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <CreateEmailCampaignModal 
        open={showEmailModal} 
        onOpenChange={setShowEmailModal}
      />
      
      <CreateSMSCampaignModal 
        open={showSMSModal} 
        onOpenChange={setShowSMSModal}
      />
      
      <ExportDataModal 
        open={showExportModal} 
        onOpenChange={setShowExportModal}
      />
    </div>
  );
}