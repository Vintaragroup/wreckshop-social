import { useState, useEffect } from "react"
import {
  Users,
  Sparkles,
  TrendingUp,
  Target,
  Music,
  Download,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Alert, AlertDescription } from "./ui/alert"
import { Skeleton } from "./ui/skeleton"
import { apiUrl } from "../lib/api"

interface DiscoveredUserProfile {
  spotifyId: string
  displayName: string
  profileUrl: string
  avatarUrl?: string
  followersCount: number
  followingCount: number
  matchScore: number
  discoveryMethod: string
  matchDetails: {
    genreMatch: string[]
    artistMatches: string[]
  }
  discoveredVia?: {
    musicGenre: string
    artistType: string
  }
}

interface DiscoveredUsersStats {
  total: number
  byGenre: Record<string, number>
  byArtistType: Record<string, number>
  enrichedCount: number
  averageMatchScore: number
}

interface QueryResult {
  ok: boolean
  data?: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
    users: DiscoveredUserProfile[]
  }
  error?: string
}

const GENRES = [
  "indie",
  "hip-hop",
  "pop",
  "electronic",
  "rock",
  "r&b",
  "country",
  "jazz",
  "metal",
  "latino",
]
const ARTIST_TYPES = ["mainstream", "underground", "indie", "emerging"]

export function DiscoveredUsersSection() {
  const [users, setUsers] = useState<DiscoveredUserProfile[]>([])
  const [stats, setStats] = useState<DiscoveredUsersStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedGenre, setSelectedGenre] = useState<string | undefined>()
  const [selectedArtistType, setSelectedArtistType] = useState<string | undefined>()
  const [searchTerm, setSearchTerm] = useState("")
  const [limit, setLimit] = useState(50)

  // Load stats and users on mount
  useEffect(() => {
    console.log("[DiscoveredUsers] Component mounted, loading stats and users")
    fetchStats()
    fetchUsers()
  }, [])

  // Refetch users when filters change
  useEffect(() => {
    if (stats) {
      const timer = setTimeout(() => {
        fetchUsers()
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [selectedGenre, selectedArtistType, limit])

  const fetchStats = async () => {
    try {
      const res = await fetch(apiUrl("/spotify/discover/stats"))
      if (!res.ok) {
        const text = await res.text()
        throw new Error(`HTTP ${res.status}: ${text || 'Failed to fetch stats'}`)
      }
      const json = (await res.json()) as { ok: boolean; data?: DiscoveredUsersStats; error?: string }
      if (json.ok && json.data) {
        setStats(json.data)
      } else {
        console.error("[DiscoveredUsers] Stats error:", json.error || "Unknown error")
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err)
    }
  }

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      // Only include filters when they are set to a concrete value (not placeholder "all")
      if (selectedGenre && selectedGenre !== "all") params.append("genre", selectedGenre)
      if (selectedArtistType && selectedArtistType !== "all")
        params.append("artistType", selectedArtistType)
      params.append("limit", limit.toString())

  const url = apiUrl(`/spotify/discover/saved?${params.toString()}`)
      console.log("[DiscoveredUsers] Fetching from:", url)
      
      const response = await fetch(url)
      if (!response.ok) {
        const text = await response.text()
        throw new Error(`HTTP ${response.status}: ${text || 'Failed to fetch users'}`)
      }
      const json = (await response.json()) as QueryResult

      console.log("[DiscoveredUsers] Response:", json)

      if (json.ok && json.data) {
        let filtered = json.data.users
        console.log("[DiscoveredUsers] Found", filtered.length, "users from API")

        if (searchTerm) {
          const term = searchTerm.toLowerCase()
          filtered = filtered.filter(
            (u) =>
              u.displayName.toLowerCase().includes(term) ||
              u.matchDetails.artistMatches.some((a) => a.toLowerCase().includes(term)) ||
              u.matchDetails.genreMatch.some((g) => g.toLowerCase().includes(term))
          )
          console.log("[DiscoveredUsers] After search filter:", filtered.length, "users")
        }

        console.log("[DiscoveredUsers] Setting users state to", filtered.length, "users")
        setUsers(filtered)
      } else {
        const errorMsg = json.error || "Failed to fetch users"
        console.error("[DiscoveredUsers] Error:", errorMsg)
        setError(errorMsg)
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to fetch users"
      console.error("[DiscoveredUsers] Fetch error:", errorMsg)
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-accent" />
            <h2 className="text-2xl font-bold">Discovered Users</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Found via Spotify discovery algorithm based on music taste
          </p>
        </div>
        <Button onClick={fetchUsers} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <TrendingUp className="w-4 h-4 mr-2" />
              Refresh
            </>
          )}
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total Discovered</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Users className="w-8 h-8 text-accent/50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Avg Match Score</p>
                  <p className="text-2xl font-bold">{stats.averageMatchScore.toFixed(0)}%</p>
                </div>
                <Target className="w-8 h-8 text-accent/50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Genres</p>
                  <p className="text-2xl font-bold">{Object.keys(stats.byGenre).length}</p>
                </div>
                <Music className="w-8 h-8 text-accent/50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Enriched</p>
                  <p className="text-2xl font-bold">{stats.enrichedCount}</p>
                </div>
                <Sparkles className="w-8 h-8 text-accent/50" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter & Search</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Genre Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Genre</label>
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger>
                  <SelectValue placeholder="All genres" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All genres</SelectItem>
                  {GENRES.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Artist Type Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Artist Type</label>
              <Select value={selectedArtistType} onValueChange={setSelectedArtistType}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  {ARTIST_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Limit */}
            <div>
              <label className="text-sm font-medium mb-2 block">Results Per Page</label>
              <Select value={limit.toString()} onValueChange={(v) => setLimit(parseInt(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <Input
                placeholder="Name, artist, genre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={fetchUsers} className="w-full" disabled={loading}>
            {loading ? "Searching..." : "Apply Filters & Search"}
          </Button>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))
        ) : users.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="p-8 text-center space-y-4">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {(selectedGenre && selectedGenre !== 'all') || (selectedArtistType && selectedArtistType !== 'all') ? (
                      <>
                        No users found for
                        {selectedGenre && selectedGenre !== 'all' && (
                          <> genre <span className="font-medium capitalize">{selectedGenre}</span></>
                        )}
                        {selectedArtistType && selectedArtistType !== 'all' && (
                          <>
                            {selectedGenre && selectedGenre !== 'all' ? ' and' : ''} artist type{' '}
                            <span className="font-medium capitalize">{selectedArtistType}</span>
                          </>
                        )}.
                      </>
                    ) : (
                      <>No users found. Try adjusting your filters.</>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">You can also run a new Spotify discovery to add more users.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedGenre(undefined)
                      setSelectedArtistType(undefined)
                      fetchUsers()
                    }}
                  >
                    Clear filters
                  </Button>
                  <Button asChild>
                    <a href="/integrations">Discover with Spotify</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          users.map((user) => (
            <Card key={user.spotifyId} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 space-y-4">
                {/* User Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <Avatar>
                      <AvatarImage src={user.avatarUrl} />
                      <AvatarFallback>{user.displayName.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <a
                        href={user.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium hover:underline line-clamp-1"
                      >
                        {user.displayName}
                      </a>
                      <p className="text-xs text-muted-foreground">
                        {user.discoveryMethod === "playlist_contributor" && "Playlist owner"}
                        {user.discoveryMethod === "artist_follower" && "Artist fan"}
                        {user.discoveryMethod === "playlist_listener" && "Listener"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Match Score */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium">Match Score</span>
                    <span className="text-sm font-bold text-accent">{user.matchScore}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-accent rounded-full h-2 transition-all"
                      style={{ width: `${user.matchScore}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Followers</p>
                    <p className="font-medium">
                      {user.followersCount > 0
                        ? (user.followersCount / 1000).toFixed(1) + "K"
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Following</p>
                    <p className="font-medium">
                      {user.followingCount > 0 ? (user.followingCount / 1000).toFixed(1) + "K" : "-"}
                    </p>
                  </div>
                </div>

                {/* Genre Matches */}
                {user.matchDetails.genreMatch.length > 0 && (
                  <div>
                    <p className="text-xs font-medium mb-2">Genres</p>
                    <div className="flex flex-wrap gap-1">
                      {user.matchDetails.genreMatch.map((genre) => (
                        <Badge key={genre} variant="secondary" className="text-xs">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Artist Matches */}
                {user.matchDetails.artistMatches.length > 0 && (
                  <div>
                    <p className="text-xs font-medium mb-2">Matching Artists</p>
                    <div className="flex flex-wrap gap-1">
                      {user.matchDetails.artistMatches.slice(0, 3).map((artist) => (
                        <Badge key={artist} variant="outline" className="text-xs">
                          {artist}
                        </Badge>
                      ))}
                      {user.matchDetails.artistMatches.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{user.matchDetails.artistMatches.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Discovery Info */}
                {user.discoveredVia && (
                  <div className="text-xs text-muted-foreground bg-secondary/50 p-2 rounded">
                    <span>
                      Discovered via{" "}
                      <span className="font-medium capitalize">{user.discoveredVia.musicGenre}</span>{" "}
                      /
                      <span className="font-medium capitalize">
                        {user.discoveredVia.artistType}
                      </span>
                    </span>
                  </div>
                )}

                {/* Action Button */}
                <Button
                  variant="outline"
                  className="w-full text-xs h-8"
                  asChild
                >
                  <a href={user.profileUrl} target="_blank" rel="noopener noreferrer">
                    View on Spotify →
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary */}
      {users.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              Showing {users.length} discovered users
              {stats && stats.total > users.length && ` of ${stats.total} total`}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
