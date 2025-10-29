import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Music,
  Calendar,
  Link,
  ExternalLink,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Download,
} from "lucide-react";
import { CreateReleaseModal } from "./create-release-modal";
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

const releases = [
  {
    id: 1,
    title: "UTOPIA",
    artist: "Travis Scott",
    type: "Album",
    isrc: "USSM12300001",
    upc: "093624856764",
    releaseDate: "2023-07-28",
    status: "released",
    platforms: ["Spotify", "Apple Music", "YouTube Music", "Amazon Music"],
    cover: "/api/placeholder/80/80",
    streams: 2450000000,
    smartLinks: 3,
    revenue: "$890K",
  },
  {
    id: 2,
    title: "Love Sick",
    artist: "Don Toliver",
    type: "Album",
    isrc: "USSM12300002",
    upc: "093624856765",
    releaseDate: "2023-02-24",
    status: "released",
    platforms: ["Spotify", "Apple Music", "YouTube Music"],
    cover: "/api/placeholder/80/80",
    streams: 680000000,
    smartLinks: 2,
    revenue: "$245K",
  },
  {
    id: 3,
    title: "FE!N (Remix)",
    artist: "Travis Scott",
    type: "Single",
    isrc: "USSM12300003",
    upc: "093624856766",
    releaseDate: "2024-01-15",
    status: "released",
    platforms: ["Spotify", "Apple Music", "YouTube Music", "SoundCloud"],
    cover: "/api/placeholder/80/80",
    streams: 145000000,
    smartLinks: 5,
    revenue: "$67K",
  },
  {
    id: 4,
    title: "New Project",
    artist: "Maxo Kream",
    type: "EP",
    isrc: "USSM12300004",
    upc: "093624856767",
    releaseDate: "2024-03-15",
    status: "scheduled",
    platforms: ["Spotify", "Apple Music", "YouTube Music"],
    cover: "/api/placeholder/80/80",
    streams: 0,
    smartLinks: 1,
    revenue: "$0",
  },
];

export function ContentReleases() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [showCreateReleaseModal, setShowCreateReleaseModal] = useState(false);

  const filteredReleases = releases.filter(release => {
    const matchesSearch = release.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         release.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || release.status === filterStatus;
    const matchesType = filterType === "all" || release.type.toLowerCase() === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "released":
        return <Badge className="bg-accent text-accent-foreground">Released</Badge>;
      case "scheduled":
        return <Badge variant="secondary">Scheduled</Badge>;
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleGenerateSmartLink = (releaseId: number) => {
    console.log(`Generating smart link for release ${releaseId}`);
  };

  return (
    <>
      <CreateReleaseModal 
        open={showCreateReleaseModal} 
        onOpenChange={setShowCreateReleaseModal}
      />
      
      <div className="space-y-6">
        {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Releases</h1>
          <p className="text-muted-foreground">
            Manage music releases and track performance across platforms
          </p>
        </div>
        <Button onClick={() => setShowCreateReleaseModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Release
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">12</div>
            <div className="text-sm text-muted-foreground">Total Releases</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-accent">3.2B</div>
            <div className="text-sm text-muted-foreground">Total Streams</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-warning">11</div>
            <div className="text-sm text-muted-foreground">Smart Links</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">$1.2M</div>
            <div className="text-sm text-muted-foreground">Total Revenue</div>
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
                  placeholder="Search releases by title or artist..."
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
                  <SelectItem value="released">Released</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="album">Album</SelectItem>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="ep">EP</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Releases Table */}
      <Card>
        <CardHeader>
          <CardTitle>Releases ({filteredReleases.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Release</TableHead>
                <TableHead>Artist</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Release Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Platforms</TableHead>
                <TableHead>Streams</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReleases.map((release) => (
                <TableRow key={release.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <Music className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-medium">{release.title}</div>
                        <div className="text-sm text-muted-foreground">
                          ISRC: {release.isrc}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{release.artist}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{release.type}</Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(release.releaseDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{getStatusBadge(release.status)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {release.platforms.length} platforms
                    </div>
                  </TableCell>
                  <TableCell>
                    {release.streams > 0 ? (
                      <div>
                        <div className="font-medium">
                          {(release.streams / 1000000).toFixed(1)}M
                        </div>
                        <div className="text-xs text-muted-foreground">streams</div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{release.revenue}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleGenerateSmartLink(release.id)}>
                          <Link className="w-4 h-4 mr-2" />
                          Generate Smart Link
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Release
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View on Platforms
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
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
    </div>
    </>
  );
}