import { useState, useEffect } from 'react'
import { Search, Loader2, AlertCircle, CheckCircle, Music, Users } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4002'

interface Genre {
  id: string
  label: string
  description: string
}

interface ArtistType {
  id: string
  label: string
  description: string
}

interface DiscoveredUser {
  spotifyId: string
  displayName: string
  profileUrl: string
  avatarUrl?: string
  followersCount: number
  followingCount: number
  matchScore: number
  discoveryMethod: 'playlist_contributor' | 'playlist_listener' | 'artist_follower'
  matchDetails: {
    genreMatch: string[]
    artistMatches: string[]
  }
}

export function SpotifyUserDiscovery() {
  const [genres, setGenres] = useState<Genre[]>([])
  const [artistTypes, setArtistTypes] = useState<ArtistType[]>([])
  const [selectedGenre, setSelectedGenre] = useState('')
  const [selectedArtistType, setSelectedArtistType] = useState('')
  const [maxResults, setMaxResults] = useState('50')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [discoveredUsers, setDiscoveredUsers] = useState<DiscoveredUser[]>([])
  const [searchExecuted, setSearchExecuted] = useState(false)

  // Load available genres and artist types on mount
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [genresRes, typesRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/spotify/discover/genres`),
          fetch(`${BACKEND_URL}/api/spotify/discover/artist-types`),
        ])

        if (genresRes.ok) {
          const genresData = await genresRes.json()
          setGenres(genresData.data || [])
          if (genresData.data?.[0]) {
            setSelectedGenre(genresData.data[0].id)
          }
        }

        if (typesRes.ok) {
          const typesData = await typesRes.json()
          setArtistTypes(typesData.data || [])
          if (typesData.data?.[0]) {
            setSelectedArtistType(typesData.data[0].id)
          }
        }
      } catch (err) {
        console.error('Failed to load options:', err)
      }
    }

    loadOptions()
  }, [])

  const handleSearch = async () => {
    if (!selectedGenre || !selectedArtistType) {
      setError('Please select both a music genre and artist type')
      return
    }

    setIsLoading(true)
    setError(null)
    setDiscoveredUsers([])

    try {
      const accessToken = sessionStorage.getItem('spotify_access_token')
      if (!accessToken) {
        setError('Please connect your Spotify account first')
        setIsLoading(false)
        return
      }

      const url = new URL(`${BACKEND_URL}/api/spotify/discover/users`)
      url.searchParams.set('genre', selectedGenre)
      url.searchParams.set('artistType', selectedArtistType)
      url.searchParams.set('maxResults', maxResults)

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Search failed')
      }

      const data = await response.json()
      setDiscoveredUsers(data.data?.users || [])
      setSearchExecuted(true)
    } catch (err: any) {
      setError(err.message || 'Failed to discover users')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Discover Spotify Users
          </CardTitle>
          <CardDescription>
            Find audiences based on music genre and artist type preferences
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="flex gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-200">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Music Genre Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Music Genre</label>
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger>
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  {genres.map((genre) => (
                    <SelectItem key={genre.id} value={genre.id}>
                      {genre.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {genres.find((g) => g.id === selectedGenre) && (
                <p className="text-xs text-gray-500">
                  {genres.find((g) => g.id === selectedGenre)?.description}
                </p>
              )}
            </div>

            {/* Artist Type Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Artist Type</label>
              <Select value={selectedArtistType} onValueChange={setSelectedArtistType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select artist type" />
                </SelectTrigger>
                <SelectContent>
                  {artistTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {artistTypes.find((t) => t.id === selectedArtistType) && (
                <p className="text-xs text-gray-500">
                  {artistTypes.find((t) => t.id === selectedArtistType)?.description}
                </p>
              )}
            </div>
          </div>

          {/* Max Results Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Max Results</label>
            <Input
              type="number"
              min="1"
              max="200"
              value={maxResults}
              onChange={(e) => setMaxResults(e.target.value)}
              placeholder="50"
            />
            <p className="text-xs text-gray-500">Between 1 and 200 results</p>
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            disabled={isLoading || !selectedGenre || !selectedArtistType}
            className="w-full gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Discover Users
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      {searchExecuted && (
        <Card>
          <CardHeader>
            <CardTitle>
              {discoveredUsers.length === 0 ? 'No Results' : `Found ${discoveredUsers.length} Users`}
            </CardTitle>
            <CardDescription>
              Users interested in {genres.find((g) => g.id === selectedGenre)?.label}{' '}
              {artistTypes.find((t) => t.id === selectedArtistType)?.label?.toLowerCase()} artists
            </CardDescription>
          </CardHeader>

          <CardContent>
            {discoveredUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Music className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No users found matching your criteria</p>
                <p className="text-xs mt-1">Try different genre or artist type combinations</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {discoveredUsers.map((user) => (
                  <div
                    key={user.spotifyId}
                    className="p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                  >
                    <div className="flex items-start gap-3">
                      {user.avatarUrl && (
                        <img
                          src={user.avatarUrl}
                          alt={user.displayName}
                          className="h-12 w-12 rounded-full"
                        />
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium truncate">{user.displayName}</h3>
                          <Badge variant="outline" className="text-xs">
                            {Math.round(user.matchScore)}% match
                          </Badge>
                        </div>

                        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1 mt-1">
                          <div className="flex gap-2">
                            <span>👥 Followers: {user.followersCount.toLocaleString()}</span>
                            <span>•</span>
                            <span>Following: {user.followingCount.toLocaleString()}</span>
                          </div>

                          {user.matchDetails.genreMatch.length > 0 && (
                            <div>
                              <span className="font-medium">Genres:</span>{' '}
                              {user.matchDetails.genreMatch.join(', ')}
                            </div>
                          )}

                          {user.matchDetails.artistMatches.length > 0 && (
                            <div>
                              <span className="font-medium">Artists:</span>{' '}
                              {user.matchDetails.artistMatches.join(', ')}
                            </div>
                          )}
                        </div>
                      </div>

                      {user.profileUrl && (
                        <a
                          href={user.profileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-green-600 hover:text-green-700 font-medium"
                        >
                          View
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Export for integration into integrations or discovery page
export function SpotifyDiscoveryCard() {
  const [showFullView, setShowFullView] = useState(false)

  if (showFullView) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => setShowFullView(false)}>
          ← Back
        </Button>
        <SpotifyUserDiscovery />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Spotify User Discovery
        </CardTitle>
        <CardDescription>Find audiences by music preference</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Search for Spotify users interested in specific music genres and artist types.
        </p>

        <Button onClick={() => setShowFullView(true)} className="w-full">
          Open Discovery Tool
        </Button>
      </CardContent>
    </Card>
  )
}
