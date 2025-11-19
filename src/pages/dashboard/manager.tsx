/**
 * Manager Dashboard Page
 * Displays manager overview with artists, campaigns, and integrations
 */

import { useAuth } from '../../lib/auth/context';
import { useManagerDashboard, useArtists } from '../../lib/api/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
  Users,
  TrendingUp,
  Music,
  Zap,
  Plus,
  Settings,
  LogOut,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { appPath } from '../../lib/routes';

export function ManagerDashboardPage() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const { data: dashboard, loading: dashboardLoading, error: dashboardError } = useManagerDashboard(token || '');
  const { data: artists, loading: artistsLoading } = useArtists(token || undefined);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Manager Dashboard</h1>
            <p className="text-slate-400 mt-1">{user?.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(appPath('/settings'))}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Overview Cards */}
        {dashboardLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="bg-slate-800/50 border-slate-700 animate-pulse">
                <CardContent className="pt-6 h-24" />
              </Card>
            ))}
          </div>
        ) : dashboard ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Total Artists */}
            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Artists</CardTitle>
                <Users className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboard.totalArtistsManaged}</div>
                <p className="text-xs text-slate-400 mt-1">Managed artists</p>
              </CardContent>
            </Card>

            {/* Total Followers */}
            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
                <TrendingUp className="w-4 h-4 text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(dashboard.totalFollowers / 1000000).toFixed(1)}M
                </div>
                <p className="text-xs text-slate-400 mt-1">Across all artists</p>
              </CardContent>
            </Card>

            {/* Avg Engagement */}
            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
                <Zap className="w-4 h-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboard.totalEngagementRate.toFixed(1)}%</div>
                <p className="text-xs text-slate-400 mt-1">Engagement rate</p>
              </CardContent>
            </Card>

            {/* Top Artist */}
            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Artist</CardTitle>
                <Music className="w-4 h-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold truncate">
                  {dashboard.topArtist?.stageName || 'N/A'}
                </div>
                <p className="text-xs text-slate-400 mt-1">by leaderboard score</p>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {dashboardError && (
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-8">
            <p className="text-red-200">{dashboardError.message}</p>
          </div>
        )}

        {/* Artist Status Distribution */}
        {dashboard && (
          <Card className="bg-slate-800/50 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle>Artist Status Distribution</CardTitle>
              <CardDescription>Current status of managed artists</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <div>
                    <p className="text-sm font-medium">Active</p>
                    <p className="text-2xl font-bold">{dashboard.byStatus.ACTIVE}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div>
                    <p className="text-sm font-medium">Pending</p>
                    <p className="text-2xl font-bold">{dashboard.byStatus.PENDING}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-400" />
                  <div>
                    <p className="text-sm font-medium">Inactive</p>
                    <p className="text-2xl font-bold">{dashboard.byStatus.INACTIVE}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div>
                    <p className="text-sm font-medium">Rejected</p>
                    <p className="text-2xl font-bold">{dashboard.byStatus.REJECTED}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs for Management */}
        <Tabs defaultValue="artists" className="space-y-4">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="artists">Artists</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
          </TabsList>

          {/* Artists Tab */}
          <TabsContent value="artists" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Managed Artists</CardTitle>
                  <CardDescription>All artists in your roster</CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Artist
                </Button>
              </CardHeader>
              <CardContent>
                {artistsLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-12 bg-slate-700 rounded animate-pulse" />
                    ))}
                  </div>
                ) : artists && artists.length > 0 ? (
                  <div className="space-y-2">
                    {artists.map((artist) => (
                      <div
                        key={artist.id}
                        className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg hover:bg-slate-900 transition"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold">{artist.stageName}</h4>
                          <p className="text-sm text-slate-400">{artist.email}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={
                            artist.status === 'ACTIVE' ? 'default' :
                            artist.status === 'PENDING' ? 'secondary' :
                            'outline'
                          }>
                            {artist.status}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Music className="w-12 h-12 mx-auto text-slate-500 mb-2" />
                    <p className="text-slate-400">No artists yet. Add your first artist to get started!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Campaigns</CardTitle>
                  <CardDescription>Manage campaigns for your artists</CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Campaign
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-center py-8">
                  Campaign management coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Platform Integrations</CardTitle>
                  <CardDescription>Connect your streaming platforms</CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Connect Platform
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['Spotify', 'Instagram', 'YouTube', 'TikTok'].map((platform) => (
                    <Card key={platform} className="bg-slate-900 border-slate-700">
                      <CardContent className="pt-6 text-center">
                        <p className="font-semibold">{platform}</p>
                        <Badge variant="outline" className="mt-2">
                          Not Connected
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Content</CardTitle>
                  <CardDescription>Manage releases and events</CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Content
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-center py-8">
                  Content management coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
