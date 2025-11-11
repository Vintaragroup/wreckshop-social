/**
 * Discovery Page
 * Public artist discovery with leaderboards, trending, and search
 */

import { useState, useMemo } from 'react';
import { useLeaderboard, useTrendingArtists, useDiscoverArtists, useSearchArtists } from '../../lib/api/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import {
  TrendingUp,
  Search as SearchIcon,
  Music,
  Users,
  Zap,
  Globe,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GENRES = [
  'Hip-Hop',
  'Pop',
  'Rock',
  'Electronic',
  'R&B',
  'Indie',
  'Jazz',
  'Soul',
  'Country',
  'Alternative',
];

export function DiscoveryPage() {
  const navigate = useNavigate();
  const [metric, setMetric] = useState<'leaderboardScore' | 'followersCount' | 'engagementRate'>('leaderboardScore');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Hip-Hop');
  const [limit] = useState(20);

  // Fetch data
  const { data: leaderboard, loading: leaderboardLoading } = useLeaderboard({
    metric,
    limit,
  });
  const { data: trending, loading: trendingLoading } = useTrendingArtists({
    limit,
  });
  const { data: discovery, loading: discoveryLoading } = useDiscoverArtists(selectedGenre);
  const { data: searchResults, loading: searchLoading } = useSearchArtists(searchQuery);

  // Determine which results to show
  const resultsToShow = useMemo(() => {
    if (searchQuery) {
      return searchResults?.data || [];
    }
    return [];
  }, [searchQuery, searchResults]);

  const handleArtistClick = (artistId: string) => {
    navigate(`/artist/${artistId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold">Discover Artists</h1>
          <p className="text-slate-400 mt-1">Explore trending artists and find new talent</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  placeholder="Search artists..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-900 border-slate-700 text-white"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setSearchQuery('')}
                disabled={!searchQuery}
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        {searchQuery && resultsToShow.length > 0 ? (
          // Search Results
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Search Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resultsToShow.map((artist) => (
                <Card
                  key={artist.id}
                  className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition cursor-pointer"
                  onClick={() => handleArtistClick(artist.id)}
                >
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-lg truncate">{artist.stageName}</h3>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {artist.genres?.map((genre) => (
                        <Badge key={genre} variant="secondary" className="text-xs">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-4 text-sm text-slate-400">
                      {artist.score && <p>Score: {artist.score.toLocaleString()}</p>}
                      {artist.region && <p>Region: {artist.region}</p>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          // Tabs for different discovery modes
          <Tabs defaultValue="trending" className="space-y-6">
            <TabsList className="bg-slate-800 border-slate-700">
              <TabsTrigger value="trending">
                <TrendingUp className="w-4 h-4 mr-2" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="leaderboard">
                <Zap className="w-4 h-4 mr-2" />
                Leaderboard
              </TabsTrigger>
              <TabsTrigger value="genre">
                <Music className="w-4 h-4 mr-2" />
                By Genre
              </TabsTrigger>
            </TabsList>

            {/* Trending Tab */}
            <TabsContent value="trending" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trendingLoading ? (
                  <>
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="bg-slate-800/50 border-slate-700 animate-pulse">
                        <CardContent className="pt-6 h-40" />
                      </Card>
                    ))}
                  </>
                ) : trending?.data && trending.data.length > 0 ? (
                  trending.data.map((artist) => (
                    <Card
                      key={artist.id}
                      className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-slate-600 transition cursor-pointer"
                      onClick={() => handleArtistClick(artist.id)}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg flex-1 truncate">
                            {artist.stageName}
                          </h3>
                          <Badge variant="default" className="ml-2 flex-shrink-0">
                            +{(artist.trend * 100).toFixed(0)}%
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {artist.genres?.map((genre) => (
                            <Badge key={genre} variant="secondary" className="text-xs">
                              {genre}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <div className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            {artist.region}
                          </div>
                          <div>Score: {artist.score.toLocaleString()}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <TrendingUp className="w-12 h-12 mx-auto text-slate-500 mb-2" />
                    <p className="text-slate-400">No trending artists found</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Leaderboard Tab */}
            <TabsContent value="leaderboard" className="space-y-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Artist Leaderboard</CardTitle>
                      <CardDescription>Ranked by performance</CardDescription>
                    </div>
                    <Select
                      value={metric}
                      onValueChange={(v: any) => setMetric(v)}
                    >
                      <SelectTrigger className="w-40 bg-slate-900 border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700">
                        <SelectItem value="leaderboardScore">Score</SelectItem>
                        <SelectItem value="followersCount">Followers</SelectItem>
                        <SelectItem value="engagementRate">Engagement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  {leaderboardLoading ? (
                    <div className="space-y-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-12 bg-slate-700 rounded animate-pulse" />
                      ))}
                    </div>
                  ) : leaderboard?.data && leaderboard.data.length > 0 ? (
                    <div className="space-y-2">
                      {leaderboard.data.map((entry, index) => (
                        <div
                          key={entry.id}
                          className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg hover:bg-slate-900 transition cursor-pointer"
                          onClick={() => handleArtistClick(entry.id)}
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div className="text-2xl font-bold text-slate-500 w-8">
                              #{entry.rank}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">{entry.stageName}</h4>
                              <div className="flex gap-2 mt-1">
                                {entry.genres?.slice(0, 2).map((genre) => (
                                  <Badge key={genre} variant="secondary" className="text-xs">
                                    {genre}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">{entry.score.toLocaleString()}</p>
                            <p className="text-xs text-slate-400">pts</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Zap className="w-12 h-12 mx-auto text-slate-500 mb-2" />
                      <p className="text-slate-400">No artists on leaderboard</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Genre Tab */}
            <TabsContent value="genre" className="space-y-4">
              <Card className="bg-slate-800/50 border-slate-700 mb-4">
                <CardContent className="pt-6">
                  <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                    <SelectTrigger className="w-full md:w-64 bg-slate-900 border-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      {GENRES.map((genre) => (
                        <SelectItem key={genre} value={genre}>
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {discoveryLoading ? (
                  <>
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="bg-slate-800/50 border-slate-700 animate-pulse">
                        <CardContent className="pt-6 h-40" />
                      </Card>
                    ))}
                  </>
                ) : discovery?.data && discovery.data.length > 0 ? (
                  discovery.data.map((artist) => (
                    <Card
                      key={artist.id}
                      className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition cursor-pointer"
                      onClick={() => handleArtistClick(artist.id)}
                    >
                      <CardContent className="pt-6">
                        <h3 className="font-semibold text-lg truncate">{artist.stageName}</h3>
                        <div className="flex flex-wrap gap-1 mt-2 mb-4">
                          {artist.genres?.map((genre) => (
                            <Badge key={genre} variant="secondary" className="text-xs">
                              {genre}
                            </Badge>
                          ))}
                        </div>
                        <div className="space-y-1 text-sm text-slate-400">
                          {artist.region && <p>📍 {artist.region}</p>}
                          {artist.score && <p>⭐ {artist.score.toLocaleString()} pts</p>}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <Music className="w-12 h-12 mx-auto text-slate-500 mb-2" />
                    <p className="text-slate-400">No artists found in {selectedGenre}</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
