import { useState } from 'react';
import { ArrowLeft, RefreshCw, TrendingUp, TrendingDown, Heart } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../../components/ui/badge';
import { LineChartWrapper, AreaChartWrapper, type ChartDataPoint } from '../../components/charts';

const MOCK_DATA = {
  profile: {
    username: '@creatorhandle',
    profileImageUrl: 'https://via.placeholder.com/200',
    followerCount: 128000,
    totalLikes: 3200000,
  },
  metrics: {
    followersThisMonth: 8200,
    followerChange: 6.8,
    profileViewsChange: 12.0,
    videoViewsChange: 18.5,
    engagementRate: 12.5,
    avgLikesPerVideo: 28500,
  },
};

// Mock follower growth data
const FOLLOWER_GROWTH_DATA: ChartDataPoint[] = [
  { name: 'Week 1', followers: 119800, views: 280000 },
  { name: 'Week 2', followers: 123000, views: 320000 },
  { name: 'Week 3', followers: 126000, views: 380000 },
  { name: 'Week 4', followers: 128000, views: 425000 },
];

// Mock video performance data
const VIDEO_PERFORMANCE_DATA: ChartDataPoint[] = [
  { name: 'Video 1', views: 245000, likes: 18500 },
  { name: 'Video 2', views: 312000, likes: 24000 },
  { name: 'Video 3', views: 198000, likes: 15200 },
  { name: 'Video 4', views: 435000, likes: 32500 },
];

function MetricCard({ label, value, change, icon: Icon }: any) {
  const isPositive = change >= 0;
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
            <div className="flex items-center gap-1 mt-2">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span
                className={`text-xs font-medium ${
                  isPositive ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {isPositive ? '+' : ''}{change}%
              </span>
            </div>
          </div>
          <div className="p-3 bg-secondary rounded-lg">
            {Icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function TikTokPlatformPage() {
  const navigate = useNavigate();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(new Date(Date.now() - 3 * 60 * 60 * 1000));

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLastSync(new Date());
    } finally {
      setIsSyncing(false);
    }
  };

  function formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    return `${diffHours}h ago`;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/analytics/platforms')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">TikTok Analytics</h1>
            <p className="text-muted-foreground">{MOCK_DATA.profile.username}</p>
          </div>
        </div>
        <Button
          onClick={handleSync}
          disabled={isSyncing}
          variant="outline"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Syncing...' : 'Sync Now'}
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-6 items-start">
            <img
              src={MOCK_DATA.profile.profileImageUrl}
              alt={MOCK_DATA.profile.username}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{MOCK_DATA.profile.username}</h2>
              <Badge className="mt-2">Creator Account</Badge>
              
              <div className="flex gap-6 mt-4">
                <div>
                  <p className="text-xs text-muted-foreground">Followers</p>
                  <p className="text-xl font-bold">
                    {(MOCK_DATA.profile.followerCount / 1000).toFixed(0)}K
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Likes</p>
                  <p className="text-xl font-bold">
                    {(MOCK_DATA.profile.totalLikes / 1000000).toFixed(1)}M
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Followers This Month"
          value={`+${MOCK_DATA.metrics.followersThisMonth.toLocaleString()}`}
          change={MOCK_DATA.metrics.followerChange}
          icon={<Heart className="w-5 h-5 text-red-500" />}
        />
        <MetricCard
          label="Profile Views"
          value="+12.0%"
          change={MOCK_DATA.metrics.profileViewsChange}
          icon={<Heart className="w-5 h-5" />}
        />
        <MetricCard
          label="Video Views"
          value="+18.5%"
          change={MOCK_DATA.metrics.videoViewsChange}
          icon={<Heart className="w-5 h-5" />}
        />
        <MetricCard
          label="Engagement Rate"
          value={MOCK_DATA.metrics.engagementRate.toFixed(1) + '%'}
          change={2.1}
          icon={<Heart className="w-5 h-5" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Follower Growth (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <LineChartWrapper
            data={FOLLOWER_GROWTH_DATA}
            lines={[
              {
                dataKey: 'followers',
                stroke: '#ec4899',
                name: 'Followers',
              },
            ]}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Video Performance Trends</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <AreaChartWrapper
            data={VIDEO_PERFORMANCE_DATA}
            areas={[
              {
                dataKey: 'views',
                fill: '#3b82f6',
                stroke: '#3b82f6',
                name: 'Views',
              },
              {
                dataKey: 'likes',
                fill: '#ec4899',
                stroke: '#ec4899',
                name: 'Likes',
              },
            ]}
          />
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground text-center border-t pt-4">
        Last synced: {formatTimeAgo(lastSync)}
      </div>
    </div>
  );
}
