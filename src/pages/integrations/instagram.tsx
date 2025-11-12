import { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, TrendingUp, TrendingDown, Users, Heart, MessageCircle, Share2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../../components/ui/badge';

// Mock data structure
interface InstagramMetrics {
  profile: {
    username: string;
    profilePictureUrl: string;
    bio: string;
    website?: string;
    followerCount: number;
    postCount: number;
  };
  metrics: {
    followersThisMonth: number;
    followerChange: number;
    followerChangePercent: number;
    engagementRate: number;
    engagementRateChange: number;
    weeklyReach: number;
    avgLikesPerPost: number;
    avgCommentsPerPost: number;
  };
}

const MOCK_DATA: InstagramMetrics = {
  profile: {
    username: 'artistname',
    profilePictureUrl: 'https://via.placeholder.com/200',
    bio: 'Independent artist. Music is life. 🎵',
    website: 'https://artistname.com',
    followerCount: 45200,
    postCount: 234,
  },
  metrics: {
    followersThisMonth: 1234,
    followerChange: 1234,
    followerChangePercent: 3.8,
    engagementRate: 8.3,
    engagementRateChange: 0.5,
    weeklyReach: 34200,
    avgLikesPerPost: 2341,
    avgCommentsPerPost: 145,
  },
};

function MetricCard({ 
  label, 
  value, 
  change, 
  icon: Icon 
}: { 
  label: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
}) {
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

export default function InstagramPlatformPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<InstagramMetrics>(MOCK_DATA);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(new Date(Date.now() - 2 * 60 * 60 * 1000));

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      // TODO: Call API endpoint to sync Instagram data
      // await fetch('/api/integrations/instagram/sync', { method: 'POST' });
      
      // Simulate sync delay
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
      {/* Header with Back Button */}
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
            <h1 className="text-3xl font-bold tracking-tight">Instagram Analytics</h1>
            <p className="text-muted-foreground">@{data.profile.username}</p>
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

      {/* Profile Overview Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-6 items-start">
            <img
              src={data.profile.profilePictureUrl}
              alt={data.profile.username}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{data.profile.username}</h2>
              <p className="text-muted-foreground text-sm mt-1">{data.profile.bio}</p>
              {data.profile.website && (
                <a
                  href={data.profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline mt-2 inline-block"
                >
                  {data.profile.website}
                </a>
              )}
              
              <div className="flex gap-6 mt-4">
                <div>
                  <p className="text-xs text-muted-foreground">Followers</p>
                  <p className="text-xl font-bold">
                    {(data.profile.followerCount / 1000).toFixed(1)}K
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Posts</p>
                  <p className="text-xl font-bold">{data.profile.postCount}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge>Business Account</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Followers This Month"
          value={(data.metrics.followersThisMonth / 1000).toFixed(2) + 'K'}
          change={data.metrics.followerChangePercent}
          icon={<Users className="w-5 h-5" />}
        />
        <MetricCard
          label="Engagement Rate"
          value={data.metrics.engagementRate.toFixed(1) + '%'}
          change={data.metrics.engagementRateChange}
          icon={<Heart className="w-5 h-5 text-red-500" />}
        />
        <MetricCard
          label="Avg Likes Per Post"
          value={data.metrics.avgLikesPerPost.toLocaleString()}
          change={8.5}
          icon={<Heart className="w-5 h-5" />}
        />
        <MetricCard
          label="Weekly Reach"
          value={(data.metrics.weeklyReach / 1000).toFixed(1) + 'K'}
          change={12.3}
          icon={<Share2 className="w-5 h-5" />}
        />
      </div>

      {/* Placeholder Sections */}
      <Card>
        <CardHeader>
          <CardTitle>Follower Growth (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center bg-muted/50 rounded">
          <p className="text-muted-foreground">Chart will be rendered here</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Engagement Trends</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center bg-muted/50 rounded">
          <p className="text-muted-foreground">Chart will be rendered here</p>
        </CardContent>
      </Card>

      {/* Sync Footer */}
      <div className="text-sm text-muted-foreground text-center border-t pt-4">
        Last synced: {formatTimeAgo(lastSync)}
      </div>
    </div>
  );
}
