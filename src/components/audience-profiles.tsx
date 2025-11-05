import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  MoreHorizontal,
  Instagram,
  Youtube,
  Music,
  MapPin,
  Mail,
  MessageSquare,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Clock,
  TrendingUp,
  Star,
  Phone,
  Heart,
  Headphones,
  Share2,
  Activity,
  ArrowLeft,
  Target,
} from "lucide-react";
import { useIsMobile } from "./ui/use-mobile";
import { MobileTable } from "./mobile-table";
import { AddProfileModal } from "./add-profile-modal";
import { DiscoveredUsersSection } from "./discovered-users";
import { ProfileExportModal } from "./profile-export-modal";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Checkbox } from "./ui/checkbox";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const platformIcons = {
  instagram: Instagram,
  youtube: Youtube,
  tiktok: Music,
  spotify: Music,
};

const profilesData = [
  {
    id: 1,
    name: "Sarah Johnson",
    handle: "@sarahj_music",
    email: "sarah.johnson@email.com",
    phone: "+1 (713) 555-0123",
    platforms: ["instagram", "youtube"],
    favoriteArtists: ["Travis Scott", "Don Toliver"],
    genres: ["Hip Hop", "R&B"],
    location: "Houston, TX",
    age: 24,
    consent: { email: true, sms: true },
    lastActivity: "2 hours ago",
    engagementScore: 92,
    avatar: "SJ",
    joinDate: "Jan 15, 2024",
    totalSpent: "$245",
    concertsAttended: 3,
    streamingMinutes: 1450,
    bestContactTime: "Evening (6-9 PM)",
    preferredChannel: "Instagram DM",
    recentActivity: [
      { action: "Opened email", campaign: "UTOPIA Album Launch", time: "2h ago" },
      { action: "Clicked SMS link", campaign: "Houston Concert", time: "1 day ago" },
      { action: "Streamed new track", track: "FE!N", time: "2 days ago" },
    ],
    platformStats: {
      instagram: { followers: 2340, engagement: 8.4, posts: 156 },
      youtube: { subscribers: 890, views: 12450, videos: 23 },
    }
  },
  {
    id: 2,
    name: "Marcus Williams",
    handle: "@marcusbeats",
    email: "marcus.beats@email.com",
    phone: "+1 (214) 555-0456",
    platforms: ["instagram", "tiktok"],
    favoriteArtists: ["Maxo Kream", "Megan Thee Stallion"],
    genres: ["Hip Hop", "Trap"],
    location: "Dallas, TX",
    age: 28,
    consent: { email: true, sms: false },
    lastActivity: "1 day ago",
    engagementScore: 78,
    avatar: "MW",
    joinDate: "Mar 8, 2024",
    totalSpent: "$89",
    concertsAttended: 1,
    streamingMinutes: 890,
    bestContactTime: "Afternoon (2-5 PM)",
    preferredChannel: "Email",
    recentActivity: [
      { action: "Opened email", campaign: "Weekly Newsletter", time: "1 day ago" },
      { action: "Viewed artist page", artist: "Maxo Kream", time: "3 days ago" },
      { action: "Added to playlist", track: "CRACC ERA", time: "5 days ago" },
    ],
    platformStats: {
      instagram: { followers: 1280, engagement: 5.2, posts: 89 },
      tiktok: { followers: 3400, likes: 45600, videos: 67 },
    }
  },
  {
    id: 3,
    name: "Jessica Chen",
    handle: "@jess.vibes",
    email: "jess.vibes@email.com",
    phone: "+1 (512) 555-0789",
    platforms: ["youtube", "spotify"],
    favoriteArtists: ["Travis Scott", "The Weeknd"],
    genres: ["Hip Hop", "Pop"],
    location: "Austin, TX",
    age: 22,
    consent: { email: true, sms: true },
    lastActivity: "3 hours ago",
    engagementScore: 85,
    avatar: "JC",
    joinDate: "Feb 20, 2024",
    totalSpent: "$178",
    concertsAttended: 2,
    streamingMinutes: 2340,
    bestContactTime: "Morning (9-11 AM)",
    preferredChannel: "SMS",
    recentActivity: [
      { action: "Clicked SMS link", campaign: "Flash Sale", time: "3h ago" },
      { action: "Purchased merch", item: "UTOPIA Hoodie", time: "1 day ago" },
      { action: "Shared playlist", playlist: "Cactus Jack Vibes", time: "2 days ago" },
    ],
    platformStats: {
      youtube: { subscribers: 1560, views: 23400, videos: 12 },
      spotify: { followers: 234, monthlyListeners: 5600, playlists: 45 },
    }
  },
  {
    id: 4,
    name: "David Rodriguez",
    handle: "@drodmusic",
    email: "david.rod@email.com",
    phone: "+1 (210) 555-0321",
    platforms: ["instagram", "youtube", "tiktok"],
    favoriteArtists: ["Don Toliver", "Sheck Wes"],
    genres: ["Hip Hop", "Alternative"],
    location: "San Antonio, TX",
    age: 26,
    consent: { email: false, sms: true },
    lastActivity: "5 hours ago",
    engagementScore: 67,
    avatar: "DR",
    joinDate: "Apr 12, 2024",
    totalSpent: "$67",
    concertsAttended: 1,
    streamingMinutes: 670,
    bestContactTime: "Night (9-11 PM)",
    preferredChannel: "TikTok DM",
    recentActivity: [
      { action: "Liked TikTok video", artist: "Don Toliver", time: "5h ago" },
      { action: "Followed on Instagram", artist: "Sheck Wes", time: "1 day ago" },
      { action: "Streamed album", album: "Life of a Don", time: "3 days ago" },
    ],
    platformStats: {
      instagram: { followers: 890, engagement: 4.1, posts: 234 },
      youtube: { subscribers: 456, views: 8900, videos: 34 },
      tiktok: { followers: 2100, likes: 23400, videos: 89 },
    }
  },
];

interface AudienceProfilesProps {
  onPageChange?: (page: string) => void;
}

export function AudienceProfiles({ onPageChange }: AudienceProfilesProps = {}) {
  const [selectedProfiles, setSelectedProfiles] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<number | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAddProfileModalOpen, setIsAddProfileModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleProfile = (profileId: number) => {
    setSelectedProfiles(prev =>
      prev.includes(profileId)
        ? prev.filter(id => id !== profileId)
        : [...prev, profileId]
    );
  };

  const toggleAll = () => {
    setSelectedProfiles(
      selectedProfiles.length === profilesData.length
        ? []
        : profilesData.map(p => p.id)
    );
  };

  const viewProfile = (profileId: number) => {
    setSelectedProfile(profileId);
    setIsProfileModalOpen(true);
  };

  const getSelectedProfileData = () => {
    return profilesData.find(p => p.id === selectedProfile);
  };

  const getRecommendedChannel = (profile: any) => {
    if (profile.engagementScore > 85) return "Multi-channel";
    if (profile.preferredChannel) return profile.preferredChannel;
    if (profile.consent.sms && profile.consent.email) return "SMS + Email";
    if (profile.consent.email) return "Email";
    if (profile.consent.sms) return "SMS";
    return "Social Media";
  };

  const filteredProfiles = profilesData.filter(
    (profile) =>
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange?.("audience")}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="sr-only">Back to Audience Overview</span>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Audience Profiles</h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Manage and analyze individual fan profiles
            </p>
          </div>
        </div>
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-2">
          <Button 
            variant="outline" 
            className="w-full md:w-auto"
            onClick={() => setIsExportModalOpen(true)}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button 
            className="w-full md:w-auto"
            onClick={() => setIsAddProfileModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Profile
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-4">
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search profiles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Select defaultValue="all">
            <SelectTrigger className={`${isMobile ? "w-full" : "w-32"}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Profiles</SelectItem>
              <SelectItem value="high-engagement">High Engagement</SelectItem>
              <SelectItem value="recent">Recent Activity</SelectItem>
              <SelectItem value="vip">VIP Customers</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Selection Summary */}
      {selectedProfiles.length > 0 && (
        <div className="bg-muted p-4 rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-medium">
              {selectedProfiles.length} profile{selectedProfiles.length !== 1 ? 's' : ''} selected
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Mail className="w-4 h-4 mr-2" />
              Send Email
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare className="w-4 h-4 mr-2" />
              Send SMS
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Selected
            </Button>
          </div>
        </div>
      )}

      {/* Profiles Table */}
      <MobileTable 
        data={filteredProfiles}
        columns={[
          {
            key: "name",
            label: "Profile",
            render: (_, profile) => (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {profile.avatar}
                </div>
                <div>
                  <div className="font-medium text-sm">{profile.name}</div>
                  <div className="text-xs text-muted-foreground">{profile.handle}</div>
                </div>
              </div>
            )
          },
          {
            key: "platforms",
            label: "Platforms",
            render: (_, profile) => (
              <div className="flex space-x-1">
                {profile.platforms.slice(0, 3).map((platform: string) => {
                  const Icon = platformIcons[platform as keyof typeof platformIcons];
                  return (
                    <div key={platform} className="w-5 h-5 bg-muted rounded flex items-center justify-center">
                      <Icon className="w-3 h-3" />
                    </div>
                  );
                })}
                {profile.platforms.length > 3 && (
                  <span className="text-xs text-muted-foreground">+{profile.platforms.length - 3}</span>
                )}
              </div>
            )
          },
          {
            key: "location",
            label: "Location", 
            render: (_, profile) => (
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-muted-foreground" />
                <span className="text-sm">{profile.location}</span>
              </div>
            )
          },
          {
            key: "engagementScore",
            label: "Engagement",
            render: (score) => (
              <div className="flex items-center space-x-2">
                <Progress value={score} className="h-2 w-16" />
                <span className="text-sm font-medium">{score}</span>
              </div>
            )
          },
          {
            key: "lastActivity",
            label: "Last Activity",
            render: (activity) => (
              <span className="text-sm text-muted-foreground">{activity}</span>
            )
          }
        ]}
      >
        <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedProfiles.length === profilesData.length}
                      onCheckedChange={toggleAll}
                    />
                  </TableHead>
                  <TableHead>Profile</TableHead>
                  <TableHead>Platforms</TableHead>
                  <TableHead>Music Preferences</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Consent</TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProfiles.includes(profile.id)}
                        onCheckedChange={() => toggleProfile(profile.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                          {profile.avatar}
                        </div>
                        <div>
                          <div className="font-medium">{profile.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {profile.handle}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        {profile.platforms.map((platform) => {
                          const Icon = platformIcons[platform as keyof typeof platformIcons];
                          return (
                            <div
                              key={platform}
                              className="w-6 h-6 bg-muted rounded flex items-center justify-center"
                            >
                              <Icon className="w-3 h-3" />
                            </div>
                          );
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex flex-wrap gap-1">
                          {profile.favoriteArtists.slice(0, 2).map((artist) => (
                            <Badge key={artist} variant="secondary" className="text-xs">
                              {artist}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {profile.genres.join(", ")}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm">{profile.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        {profile.consent.email && (
                          <div className="w-5 h-5 bg-accent rounded flex items-center justify-center">
                            <Mail className="w-3 h-3 text-accent-foreground" />
                          </div>
                        )}
                        {profile.consent.sms && (
                          <div className="w-5 h-5 bg-warning rounded flex items-center justify-center">
                            <MessageSquare className="w-3 h-3 text-warning-foreground" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${profile.engagementScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {profile.engagementScore}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {profile.lastActivity}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => viewProfile(profile.id)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="w-4 h-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Send SMS
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Profile
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </MobileTable>

      {/* Discovered Users Section */}
      <div className="mt-8 pt-8 border-t">
        <DiscoveredUsersSection />
      </div>

      {/* Profile Detail Modal */}
      <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby="profile-description">
          {selectedProfile && (() => {
            const profile = getSelectedProfileData();
            if (!profile) return null;
            
            return (
              <>
                <DialogHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-lg font-bold">
                      {profile.avatar}
                    </div>
                    <div>
                      <DialogTitle className="text-2xl">{profile.name}</DialogTitle>
                      <DialogDescription id="profile-description" className="text-muted-foreground">
                        {profile.handle} • {profile.location}
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="platforms">Platforms</TabsTrigger>
                    <TabsTrigger value="engagement">Engagement</TabsTrigger>
                    <TabsTrigger value="preferences">Preferences</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            <div>
                              <div className="text-2xl font-bold">{profile.engagementScore}</div>
                              <div className="text-sm text-muted-foreground">Engagement Score</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-5 h-5 text-accent" />
                            <div>
                              <div className="text-2xl font-bold">{profile.concertsAttended}</div>
                              <div className="text-sm text-muted-foreground">Concerts Attended</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2">
                            <Headphones className="w-5 h-5 text-warning" />
                            <div>
                              <div className="text-2xl font-bold">{profile.streamingMinutes}</div>
                              <div className="text-sm text-muted-foreground">Minutes Streamed</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Mail className="w-5 h-5 mr-2" />
                            Contact Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{profile.email}</div>
                              <div className="text-sm text-muted-foreground">
                                {profile.consent.email ? "✓ Email consent" : "✗ No email consent"}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{profile.phone}</div>
                              <div className="text-sm text-muted-foreground">
                                {profile.consent.sms ? "✓ SMS consent" : "✗ No SMS consent"}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{profile.location}</div>
                              <div className="text-sm text-muted-foreground">Age: {profile.age}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Target className="w-5 h-5 mr-2" />
                            Best Way to Reach
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <div className="font-medium text-primary">
                              {getRecommendedChannel(profile)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Recommended channel based on engagement
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{profile.bestContactTime}</div>
                              <div className="text-sm text-muted-foreground">Best contact time</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Activity className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{profile.lastActivity}</div>
                              <div className="text-sm text-muted-foreground">Last activity</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Music className="w-5 h-5 mr-2" />
                          Music Preferences
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="text-sm font-medium mb-2">Favorite Artists</div>
                            <div className="flex flex-wrap gap-2">
                              {profile.favoriteArtists.map((artist) => (
                                <Badge key={artist} className="bg-primary text-primary-foreground">
                                  <Star className="w-3 h-3 mr-1" />
                                  {artist}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium mb-2">Genres</div>
                            <div className="flex flex-wrap gap-2">
                              {profile.genres.map((genre) => (
                                <Badge key={genre} variant="secondary">
                                  {genre}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="platforms" className="space-y-4">
                    {Object.entries(profile.platformStats).map(([platform, stats]: [string, any]) => {
                      const Icon = platformIcons[platform as keyof typeof platformIcons];
                      return (
                        <Card key={platform}>
                          <CardHeader>
                            <CardTitle className="flex items-center capitalize">
                              <Icon className="w-5 h-5 mr-2" />
                              {platform}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {Object.entries(stats).map(([key, value]) => (
                                <div key={key} className="text-center">
                                  <div className="text-2xl font-bold">{value.toLocaleString()}</div>
                                  <div className="text-sm text-muted-foreground capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </TabsContent>

                  <TabsContent value="engagement" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Activity className="w-5 h-5 mr-2" />
                          Recent Activity
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {profile.recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                              <div>
                                <div className="font-medium">{activity.action}</div>
                                <div className="text-sm text-muted-foreground">
                                  {activity.campaign || activity.track || activity.artist || activity.item || activity.playlist || activity.album}
                                </div>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {activity.time}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Engagement Score Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span>Email Engagement</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={profile.engagementScore * 0.8} className="w-20 h-2" />
                              <span className="text-sm">{Math.round(profile.engagementScore * 0.8)}</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Social Media</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={profile.engagementScore * 0.9} className="w-20 h-2" />
                              <span className="text-sm">{Math.round(profile.engagementScore * 0.9)}</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Purchase History</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={profile.engagementScore * 0.6} className="w-20 h-2" />
                              <span className="text-sm">{Math.round(profile.engagementScore * 0.6)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Customer Value</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span>Total Spent</span>
                            <span className="font-bold text-primary">{profile.totalSpent}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Member Since</span>
                            <span>{profile.joinDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Lifetime Value</span>
                            <span className="font-bold text-accent">
                              ${Math.round(parseInt(profile.totalSpent.replace('$', '')) * 1.5)}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="preferences" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Communication Preferences</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span>Email Marketing</span>
                              <Badge variant={profile.consent.email ? "default" : "secondary"}>
                                {profile.consent.email ? "Opted In" : "Opted Out"}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>SMS Marketing</span>
                              <Badge variant={profile.consent.sms ? "default" : "secondary"}>
                                {profile.consent.sms ? "Opted In" : "Opted Out"}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Preferred Contact Time</span>
                              <span className="text-sm">{profile.bestContactTime}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Targeting Recommendations</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="p-3 bg-primary/10 rounded-lg">
                            <div className="font-medium text-primary">High-Value Customer</div>
                            <div className="text-sm text-muted-foreground">
                              Include in VIP campaigns and exclusive offers
                            </div>
                          </div>
                          <div className="p-3 bg-accent/10 rounded-lg">
                            <div className="font-medium text-accent">Active Engager</div>
                            <div className="text-sm text-muted-foreground">
                              Perfect for social media campaigns and user-generated content
                            </div>
                          </div>
                          {profile.concertsAttended > 2 && (
                            <div className="p-3 bg-warning/10 rounded-lg">
                              <div className="font-medium text-warning">Concert Enthusiast</div>
                              <div className="text-sm text-muted-foreground">
                                Target with early access to ticket sales
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Campaign
                  </Button>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Add Profile Modal */}
      <AddProfileModal
        isOpen={isAddProfileModalOpen}
        onClose={() => setIsAddProfileModalOpen(false)}
      />

      {/* Export Data Modal */}
      <ProfileExportModal
        open={isExportModalOpen}
        onOpenChange={setIsExportModalOpen}
        selectedProfiles={selectedProfiles.map(id => profilesData.find(p => p.id === id)).filter(Boolean)}
        totalProfiles={profilesData.length}
      />
    </div>
  );
}