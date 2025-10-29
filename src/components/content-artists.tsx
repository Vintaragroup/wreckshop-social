import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Music,
  Instagram,
  Youtube,
  ExternalLink,
  Calendar,
  Link,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
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
import { CreateArtistModal } from "./create-artist-modal";

const artists = [
  {
    id: 1,
    name: "Travis Scott",
    bio: "Multi-platinum rapper, singer, and producer from Houston, Texas",
    avatar: "/api/placeholder/80/80",
    handles: {
      instagram: "@travisscott",
      youtube: "TravisScottXX",
      tiktok: "@travisscott",
      twitter: "@trvisXX",
    },
    platforms: ["instagram", "youtube", "tiktok", "spotify", "apple"],
    followers: {
      total: 58300000,
      instagram: 45200000,
      youtube: 13100000,
    },
    genres: ["Hip Hop", "Trap", "Psychedelic Rap"],
    status: "active",
    lastRelease: "UTOPIA",
    nextEvent: "Astroworld Festival",
    upcomingDate: "Dec 15, 2024",
  },
  {
    id: 2,
    name: "Don Toliver",
    bio: "Houston-based rapper and singer signed to Cactus Jack Records",
    avatar: "/api/placeholder/80/80",
    handles: {
      instagram: "@dontoliver",
      youtube: "DonToliverOfficial",
      tiktok: "@dontoliver",
      twitter: "@dontoliver",
    },
    platforms: ["instagram", "youtube", "tiktok", "spotify"],
    followers: {
      total: 12400000,
      instagram: 8200000,
      youtube: 4200000,
    },
    genres: ["Hip Hop", "R&B", "Melodic Rap"],
    status: "active",
    lastRelease: "Love Sick",
    nextEvent: "Houston Show",
    upcomingDate: "Jan 8, 2025",
  },
  {
    id: 3,
    name: "Maxo Kream",
    bio: "Houston rapper known for his storytelling and street narratives",
    avatar: "/api/placeholder/80/80",
    handles: {
      instagram: "@maxokream",
      youtube: "MaxoKreamOfficial",
      tiktok: "@maxokream",
      twitter: "@MaxoKream",
    },
    platforms: ["instagram", "youtube", "spotify"],
    followers: {
      total: 890000,
      instagram: 650000,
      youtube: 240000,
    },
    genres: ["Hip Hop", "Gangsta Rap"],
    status: "active",
    lastRelease: "Weight of the World",
    nextEvent: null,
    upcomingDate: null,
  },
  {
    id: 4,
    name: "Sheck Wes",
    bio: "Rapper and basketball player, known for 'Mo Bamba'",
    avatar: "/api/placeholder/80/80",
    handles: {
      instagram: "@sheckwes",
      youtube: "SheckWesOfficial",
      tiktok: "@sheckwes",
      twitter: "@sheckwes",
    },
    platforms: ["instagram", "youtube", "tiktok"],
    followers: {
      total: 3200000,
      instagram: 2800000,
      youtube: 400000,
    },
    genres: ["Hip Hop", "Trap"],
    status: "inactive",
    lastRelease: "Mo Bamba",
    nextEvent: null,
    upcomingDate: null,
  },
];

const platformIcons = {
  instagram: Instagram,
  youtube: Youtube,
  tiktok: Music,
  spotify: Music,
  apple: Music,
  twitter: Music,
};

interface ContentArtistsProps {
  onPageChange?: (page: string) => void;
}

export function ContentArtists({ onPageChange }: ContentArtistsProps = {}) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddArtistModal, setShowAddArtistModal] = useState(false);

  const filteredArtists = artists.filter(artist => {
    const matchesSearch = artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         artist.bio.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || artist.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateSmartLink = (artistId: number, type: "event" | "release") => {
    console.log(`Creating smart link for artist ${artistId}, type: ${type}`);
  };

  const ArtistCard = ({ artist }: { artist: typeof artists[0] }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={artist.avatar} alt={artist.name} />
            <AvatarFallback>{artist.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{artist.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {artist.bio}
                </p>
              </div>
              <Badge variant={artist.status === "active" ? "default" : "secondary"}>
                {artist.status}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-1">
              {artist.genres.map((genre) => (
                <Badge key={genre} variant="outline" className="text-xs">
                  {genre}
                </Badge>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              {Object.entries(artist.handles).slice(0, 4).map(([platform, handle]) => {
                const Icon = platformIcons[platform as keyof typeof platformIcons];
                return (
                  <div
                    key={platform}
                    className="flex items-center space-x-1 text-xs text-muted-foreground"
                  >
                    <Icon className="w-3 h-3" />
                    <span>{handle}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-sm">
              <div>
                <span className="text-muted-foreground">Followers: </span>
                <span className="font-medium">
                  {(artist.followers.total / 1000000).toFixed(1)}M
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Last Release: </span>
                <span className="font-medium">{artist.lastRelease}</span>
              </div>
            </div>

            {artist.nextEvent && (
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Next Event: </span>
                <span className="font-medium">{artist.nextEvent}</span>
                <span className="text-muted-foreground">({artist.upcomingDate})</span>
              </div>
            )}

            <div className="flex items-center space-x-2 pt-2">
              <Button size="sm" onClick={() => handleCreateSmartLink(artist.id, "event")}>
                <Calendar className="w-4 h-4 mr-1" />
                Announce Event
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleCreateSmartLink(artist.id, "release")}>
                <Music className="w-4 h-4 mr-1" />
                Promote Release
              </Button>
              <Button size="sm" variant="outline">
                <Link className="w-4 h-4 mr-1" />
                Smart Link
              </Button>
              
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
                    Edit Artist
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Platforms
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <CreateArtistModal 
        open={showAddArtistModal} 
        onOpenChange={setShowAddArtistModal}
      />
      
      <div className="space-y-6">
        {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange?.("dashboard")}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="sr-only">Back to Content Overview</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Artists</h1>
            <p className="text-muted-foreground">
              Manage your roster and track artist performance across platforms
            </p>
          </div>
        </div>
        <Button onClick={() => setShowAddArtistModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Artist
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">4</div>
            <div className="text-sm text-muted-foreground">Total Artists</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-accent">74.9M</div>
            <div className="text-sm text-muted-foreground">Total Followers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-warning">3</div>
            <div className="text-sm text-muted-foreground">Active Artists</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">2</div>
            <div className="text-sm text-muted-foreground">Upcoming Events</div>
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
                  placeholder="Search artists by name or bio..."
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
                  <SelectItem value="inactive">Inactive</SelectItem>
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

      {/* Artists Grid */}
      <div className="space-y-4">
        {filteredArtists.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
        
        {filteredArtists.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Music className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No artists found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or add a new artist
              </p>
              <Button onClick={() => setShowAddArtistModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Artist
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
    </>
  );
}