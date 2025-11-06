import { useEffect, useMemo, useState } from "react";
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

type Artist = {
  _id: string;
  name: string;
  stageName?: string;
  bio?: string;
  avatarUrl?: string;
  genres: string[];
  status: 'active' | 'inactive';
  handles?: Record<string, string | undefined>;
  followers?: { total?: number } & Record<string, number | undefined>;
  lastRelease?: string;
  nextEvent?: string;
  upcomingDate?: string;
};

// Live artists list is fetched from the API
const artists: Artist[] = []

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
  const [artistRows, setArtistRows] = useState<Artist[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState<string | null>(null)

  const fetchArtists = async (q?: string, status?: string) => {
    setIsLoading(true)
    setIsError(null)
    try {
      const params = new URLSearchParams()
      if (q && q.trim()) params.set('q', q.trim())
      if (status && status !== 'all') params.set('status', status)
      const qs = params.toString() ? `?${params.toString()}` : ''
      const res = await fetch(`/api/artists${qs}`, { credentials: 'include' })
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
      const json = await res.json()
      setArtistRows(json?.data ?? [])
    } catch (e: any) {
      console.error('Failed to load artists', e)
      setIsError(e?.message || 'Failed to load')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchArtists()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredArtists = useMemo(() => {
    const q = searchQuery.toLowerCase()
    return artistRows.filter((artist) => {
      const matchesSearch =
        artist.name.toLowerCase().includes(q) ||
        (artist.stageName?.toLowerCase().includes(q) ?? false) ||
        (artist.bio?.toLowerCase().includes(q) ?? false) ||
        (artist.genres || []).some((g) => g.toLowerCase().includes(q))
      const matchesStatus = filterStatus === 'all' || artist.status === (filterStatus as any)
      return matchesSearch && matchesStatus
    })
  }, [artistRows, searchQuery, filterStatus])

  const handleCreateSmartLink = (artistId: number, type: "event" | "release") => {
    console.log(`Creating smart link for artist ${artistId}, type: ${type}`);
  };

  const ArtistCard = ({ artist }: { artist: Artist }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={artist.avatarUrl} alt={artist.name} />
            <AvatarFallback>{artist.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{artist.name}</h3>
                {artist.bio && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {artist.bio}
                  </p>
                )}
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
              {Object.entries(artist.handles || {}).slice(0, 4).map(([platform, handle]) => {
                const Icon = platformIcons[platform as keyof typeof platformIcons];
                return (
                  <div
                    key={platform}
                    className="flex items-center space-x-1 text-xs text-muted-foreground"
                  >
                    <Icon className="w-3 h-3" />
                    <span>{handle as string}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-sm">
              <div>
                <span className="text-muted-foreground">Followers: </span>
                <span className="font-medium">{artist.followers?.total ? artist.followers.total.toLocaleString() : '—'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Last Release: </span>
                <span className="font-medium">{artist.lastRelease || '—'}</span>
              </div>
            </div>

            {artist.nextEvent && (
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Next Event: </span>
                <span className="font-medium">{artist.nextEvent}</span>
                {artist.upcomingDate && (
                  <span className="text-muted-foreground">({artist.upcomingDate})</span>
                )}
              </div>
            )}

            <div className="flex items-center space-x-2 pt-2">
              <Button size="sm" onClick={() => handleCreateSmartLink((artist as any)._id, "event")}>
                <Calendar className="w-4 h-4 mr-1" />
                Announce Event
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleCreateSmartLink((artist as any)._id, "release")}>
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
        onCreated={() => fetchArtists(searchQuery, filterStatus)}
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
            <div className="text-2xl font-bold text-primary">{artistRows.length}</div>
            <div className="text-sm text-muted-foreground">Total Artists</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-accent">{artistRows.reduce((sum, a) => sum + (a.followers?.total || 0), 0).toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total Followers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-warning">{artistRows.filter(a => a.status === 'active').length}</div>
            <div className="text-sm text-muted-foreground">Active Artists</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{artistRows.filter(a => !!a.nextEvent).length}</div>
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
              <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); fetchArtists(searchQuery, v); }}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => fetchArtists(searchQuery, filterStatus)}>
                <Filter className="w-4 h-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Artists Grid */}
      <div className="space-y-4">
        {isLoading && (
          <Card><CardContent className="p-6 text-sm text-muted-foreground">Loading artists…</CardContent></Card>
        )}
        {isError && (
          <Card><CardContent className="p-6 text-sm text-destructive">Failed to load artists: {isError}</CardContent></Card>
        )}
        {!isLoading && !isError && filteredArtists.map((artist) => (
          <ArtistCard key={(artist as any)._id} artist={artist} />
        ))}
        {!isLoading && !isError && filteredArtists.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Music className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Add your first artist</h3>
              <p className="text-muted-foreground mb-4">Create an artist profile to build your roster and start promoting releases and events.</p>
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