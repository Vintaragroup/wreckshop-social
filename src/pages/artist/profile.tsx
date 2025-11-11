/**
 * Artist Profile Page
 * Public artist profile showing stats, integrations, and engagement
 */

import { useParams, useNavigate } from 'react-router-dom';
import { useArtistProfile } from '../../lib/api/hooks';
import { useAuth } from '../../lib/auth/context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  Users,
  TrendingUp,
  Music,
  Zap,
  Share2,
  MessageCircle,
  MoreVertical,
  ArrowLeft,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';

// Platform icons mapping
const platformIcons: Record<string, React.ReactNode> = {
  spotify: '🎵',
  instagram: '📸',
  youtube: '📺',
  tiktok: '🎶',
  twitter: '𝕏',
};

export function ArtistProfilePage() {
  const { artistId } = useParams<{ artistId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profile, loading, error } = useArtistProfile(artistId || '');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <p className="text-red-200">{error?.message || 'Artist not found'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isManager = user?.role === 'MANAGER';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{profile.stageName}</h1>
              {profile.isVerified && (
                <Badge className="mt-2">✓ Verified</Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <MessageCircle className="w-4 h-4 mr-2" />
              Message
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-800 border-slate-700">
                <DropdownMenuItem>Report</DropdownMenuItem>
                <DropdownMenuItem>Block</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        {profile.profileImage && (
          <div className="mb-8 rounded-lg overflow-hidden aspect-video bg-slate-800 flex items-center justify-center">
            <img
              src={profile.profileImage}
              alt={profile.stageName}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Bio and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Bio */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio Card */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">{profile.bio || 'No bio available'}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {profile.genres.map((genre) => (
                    <Badge key={genre} variant="secondary">
                      {genre}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-slate-400 mt-4">
                  📍 {profile.region}
                </p>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
                  <Users className="w-4 h-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(profile.stats?.totalFollowers / 1000000).toFixed(1)}M
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Engagement</CardTitle>
                  <TrendingUp className="w-4 h-4 text-orange-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {profile.stats?.engagementRate.toFixed(1)}%
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Leaderboard</CardTitle>
                  <Zap className="w-4 h-4 text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {profile.leaderboardScore.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Integrations */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>Connected Platforms</CardTitle>
                <CardDescription>Streaming and social accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Spotify */}
                  {profile.integrations?.spotify?.connected && (
                    <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{platformIcons.spotify}</span>
                        <div>
                          <p className="font-semibold">Spotify</p>
                          <p className="text-sm text-slate-400">
                            {profile.integrations.spotify.followers?.toLocaleString()} followers
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Visit
                      </Button>
                    </div>
                  )}

                  {/* Instagram */}
                  {profile.integrations?.instagram?.connected && (
                    <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{platformIcons.instagram}</span>
                        <div>
                          <p className="font-semibold">Instagram</p>
                          <p className="text-sm text-slate-400">
                            @{profile.integrations.instagram.handle}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Follow
                      </Button>
                    </div>
                  )}

                  {/* YouTube */}
                  {profile.integrations?.youtube?.connected && (
                    <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{platformIcons.youtube}</span>
                        <div>
                          <p className="font-semibold">YouTube</p>
                          <p className="text-sm text-slate-400">
                            {profile.integrations.youtube.subscribers?.toLocaleString()} subscribers
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Subscribe
                      </Button>
                    </div>
                  )}

                  {!profile.integrations?.spotify?.connected &&
                    !profile.integrations?.instagram?.connected &&
                    !profile.integrations?.youtube?.connected && (
                      <div className="col-span-full text-center py-8">
                        <Music className="w-12 h-12 mx-auto text-slate-500 mb-2" />
                        <p className="text-slate-400">No connected platforms</p>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-sm">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={profile.status === 'ACTIVE' ? 'default' : 'secondary'}>
                  {profile.status}
                </Badge>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-sm">Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-slate-400 break-all">{profile.email}</p>
                <Button size="sm" className="w-full" variant="outline">
                  Send Message
                </Button>
              </CardContent>
            </Card>

            {/* Manager Actions */}
            {isManager && (
              <Card className="bg-slate-800/50 border-slate-700 border-green-700/30 bg-green-900/10">
                <CardHeader>
                  <CardTitle className="text-sm">Manager Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button size="sm" className="w-full" variant="outline">
                    Add to Roster
                  </Button>
                  <Button size="sm" className="w-full" variant="outline">
                    Create Campaign
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Member Since */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-sm">Member Since</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-300">
                  {new Date(profile.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
