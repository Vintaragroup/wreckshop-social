import { useState, useEffect } from 'react';
import { RefreshCw, ExternalLink, Lock } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth/context';

interface PlatformSnapshot {
  platform: 'instagram' | 'spotify' | 'youtube' | 'tiktok' | 'apple-music' | 'facebook';
  name: string;
  icon: React.ReactNode;
  isConnected: boolean;
  lastSyncTime?: Date;
  stats: {
    [key: string]: string | number;
  };
}

const PLATFORM_CONFIGS = [
  {
    platform: 'instagram',
    name: 'Instagram',
    route: '/integrations/instagram',
    color: 'from-pink-500 to-purple-500',
  },
  {
    platform: 'spotify',
    name: 'Spotify',
    route: '/integrations/spotify',
    color: 'from-green-500 to-emerald-600',
  },
  {
    platform: 'youtube',
    name: 'YouTube',
    route: '/integrations/youtube',
    color: 'from-red-500 to-red-600',
  },
  {
    platform: 'tiktok',
    name: 'TikTok',
    route: '/integrations/tiktok',
    color: 'from-black to-gray-800',
  },
  {
    platform: 'apple-music',
    name: 'Apple Music',
    route: '/integrations/apple-music',
    color: 'from-gray-700 to-black',
  },
  {
    platform: 'facebook',
    name: 'Facebook',
    route: '/integrations/facebook',
    color: 'from-blue-500 to-blue-600',
  },
];

// Mock data - replace with API calls
const MOCK_SNAPSHOTS: Record<string, PlatformSnapshot> = {
  instagram: {
    platform: 'instagram',
    name: 'Instagram',
    icon: '📸',
    isConnected: true,
    lastSyncTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    stats: {
      followers: '45.2K',
      engagement: '8.3%',
      posts: '234',
      reach_week: '125.3K',
    },
  },
  spotify: {
    platform: 'spotify',
    name: 'Spotify',
    icon: '🎵',
    isConnected: true,
    lastSyncTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    stats: {
      listeners: '123K',
      streams: '2.1M',
      followers: '5.2K',
      playlists: '2,345',
    },
  },
  youtube: {
    platform: 'youtube',
    name: 'YouTube',
    icon: '📺',
    isConnected: false,
    stats: {
      subscribers: '—',
      views: '—',
      videos: '—',
    },
  },
  tiktok: {
    platform: 'tiktok',
    name: 'TikTok',
    icon: '🎬',
    isConnected: true,
    lastSyncTime: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    stats: {
      followers: '128K',
      engagement: '12.5%',
      videos: '89',
      total_likes: '1.2M',
    },
  },
  'apple-music': {
    platform: 'apple-music',
    name: 'Apple Music',
    icon: '🎶',
    isConnected: true,
    lastSyncTime: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    stats: {
      plays: '456K',
      sales: '1,234',
      revenue: '$2.3K',
      playlists: '1,245',
    },
  },
  facebook: {
    platform: 'facebook',
    name: 'Facebook',
    icon: 'f',
    isConnected: true,
    lastSyncTime: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    stats: {
      followers: '32.1K',
      engagement: '2.1%',
      posts: '156',
      reach_week: '89.2K',
    },
  },
};

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export default function PlatformAnalyticsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [snapshots, setSnapshots] = useState<PlatformSnapshot[]>(
    Object.values(MOCK_SNAPSHOTS)
  );
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncAll = async () => {
    setIsSyncing(true);
    try {
      // TODO: Call API endpoint to sync all platforms
      // await fetch('/api/analytics/platforms/sync', { method: 'POST' });
      
      // Simulate sync delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update last sync times
      setSnapshots(prev => 
        prev.map(snap => ({
          ...snap,
          lastSyncTime: snap.isConnected ? new Date() : snap.lastSyncTime,
        }))
      );
    } finally {
      setIsSyncing(false);
    }
  };

  const handleViewDetails = (platform: string) => {
    const config = PLATFORM_CONFIGS.find(p => p.platform === platform);
    if (config) {
      navigate(config.route);
    }
  };

  const handleConnect = (platform: string) => {
    navigate('/integrations');
  };

  const lastFullSync = new Date(Date.now() - 45 * 60 * 1000); // 45 minutes ago

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Platform Analytics</h1>
        <p className="text-muted-foreground">
          View performance metrics across all your connected platforms
        </p>
      </div>

      {/* Sync Section */}
      <div className="flex items-center justify-between p-4 border rounded-lg bg-secondary/50">
        <div>
          <p className="text-sm font-medium">Last full sync: {formatTimeAgo(lastFullSync)}</p>
          <p className="text-xs text-muted-foreground">
            Data updates automatically from connected platforms
          </p>
        </div>
        <Button
          onClick={handleSyncAll}
          disabled={isSyncing}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Syncing...' : 'Sync All Now'}
        </Button>
      </div>

      {/* Platform Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {snapshots.map((snapshot) => {
          const config = PLATFORM_CONFIGS.find(c => c.platform === snapshot.platform);
          
          return (
            <Card
              key={snapshot.platform}
              className="hover:shadow-lg transition-shadow overflow-hidden"
            >
              {/* Platform Header with color background */}
              {config && (
                <div
                  className={`h-1 bg-gradient-to-r ${config.color}`}
                />
              )}

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{snapshot.icon}</span>
                    <div>
                      <CardTitle className="text-lg">{snapshot.name}</CardTitle>
                      <Badge
                        variant={snapshot.isConnected ? 'default' : 'secondary'}
                        className="mt-1"
                      >
                        {snapshot.isConnected ? '✓ Connected' : 'Not Connected'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Quick Stats */}
                {snapshot.isConnected ? (
                  <>
                    <div className="space-y-2">
                      {Object.entries(snapshot.stats).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-muted-foreground capitalize">
                            {key.replace(/_/g, ' ')}
                          </span>
                          <span className="font-medium text-foreground">
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Last Sync Time */}
                    <div className="text-xs text-muted-foreground pt-2 border-t">
                      Last sync: {snapshot.lastSyncTime ? formatTimeAgo(snapshot.lastSyncTime) : 'Never'}
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={() => handleViewDetails(snapshot.platform)}
                      className="w-full mt-2"
                      variant="outline"
                      size="sm"
                    >
                      View Details
                      <ExternalLink className="w-3 h-3 ml-2" />
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="py-4 text-center">
                      <Lock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Connect your {snapshot.name} account to see analytics
                      </p>
                    </div>

                    <Button
                      onClick={() => handleConnect(snapshot.platform)}
                      className="w-full"
                      size="sm"
                    >
                      Connect Account
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State Message */}
      {!user && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              Connect your first platform in{' '}
              <button
                onClick={() => navigate('/integrations')}
                className="text-primary hover:underline"
              >
                Integrations
              </button>{' '}
              to get started
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
