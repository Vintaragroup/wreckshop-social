import { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, TrendingUp, TrendingDown, Music } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../../components/ui/badge';
import { LineChartWrapper, AreaChartWrapper, type ChartDataPoint } from '../../components/charts';
import { apiUrl } from '../../lib/api';

const DEFAULT_MOCK_DATA = {
  profile: {
    artistName: 'Artist Name',
    profileImageUrl: 'https://via.placeholder.com/200',
    isVerified: true,
    followerCount: 5200,
    monthlyListeners: 123400,
  },
  metrics: {
    streamsThisMonth: 234500,
    streamsChange: 12.5,
    listenersChange: 8.3,
    savesThisMonth: 5600,
    savesChange: 3.2,
    skipRate: 22.3,
    totalPlaylists: 2345,
  },
};

// Default chart data
const DEFAULT_STREAMING_TRENDS_DATA: ChartDataPoint[] = [
  { name: 'Week 1', streams: 45000, listeners: 18000 },
  { name: 'Week 2', streams: 52000, listeners: 21000 },
  { name: 'Week 3', streams: 58000, listeners: 24000 },
  { name: 'Week 4', streams: 79500, listeners: 60000 },
];

const DEFAULT_MONTHLY_LISTENERS_DATA: ChartDataPoint[] = [
  { name: 'Month 1', listeners: 98000 },
  { name: 'Month 2', listeners: 105000 },
  { name: 'Month 3', listeners: 112000 },
  { name: 'Month 4', listeners: 118000 },
  { name: 'Month 5', listeners: 120000 },
  { name: 'Month 6', listeners: 123400 },
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

export default function SpotifyPlatformPage() {
  const navigate = useNavigate();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(new Date(Date.now() - 1 * 60 * 60 * 1000));
  const [data, setData] = useState(DEFAULT_MOCK_DATA);
  const [streamingTrends, setStreamingTrends] = useState<ChartDataPoint[]>(DEFAULT_STREAMING_TRENDS_DATA);
  const [monthlyListeners, setMonthlyListeners] = useState<ChartDataPoint[]>(DEFAULT_MONTHLY_LISTENERS_DATA);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch analytics data from backend
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        // Attach Authorization and use normalized API URL
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        const response = await fetch(
          apiUrl('/integrations/spotify/analytics?includeCharts=true'),
          {
            credentials: 'include',
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );
        const result = await response.json();

        if (result.ok && result.analytics) {
          setData(result.analytics);
          
          // Convert API trends data to chart format
          if (result.charts?.streamingTrends) {
            const trends = result.charts.streamingTrends.map((item: any) => ({
              name: item.date,
              streams: item.streams,
              listeners: item.listeners,
            }));
            setStreamingTrends(trends);
          }

          if (result.charts?.monthlyListenersTrend) {
            const listeners = result.charts.monthlyListenersTrend.map((item: any) => ({
              name: item.month,
              listeners: item.listeners,
            }));
            setMonthlyListeners(listeners);
          }
        }
      } catch (error) {
        console.error('Failed to fetch Spotify analytics:', error);
        // Fall back to default mock data
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      // TODO: Implement actual sync endpoint
      // const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      // await fetch(apiUrl('/integrations/spotify/sync'), { method: 'POST', credentials: 'include', headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
      
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
            <h1 className="text-3xl font-bold tracking-tight">Spotify Analytics</h1>
            <p className="text-muted-foreground">{data.profile.artistName}</p>
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
              src={data.profile.profileImageUrl}
              alt={data.profile.artistName}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{data.profile.artistName}</h2>
                {data.profile.isVerified && (
                  <Badge variant="default">Verified</Badge>
                )}
              </div>
              
              <div className="flex gap-6 mt-4">
                <div>
                  <p className="text-xs text-muted-foreground">Monthly Listeners</p>
                  <p className="text-xl font-bold">
                    {(data.profile.monthlyListeners / 1000).toFixed(0)}K
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Followers</p>
                  <p className="text-xl font-bold">
                    {(data.profile.followerCount / 1000).toFixed(1)}K
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Streams This Month"
          value={(data.metrics.streamsThisMonth / 1000).toFixed(0) + 'K'}
          change={data.metrics.streamsChange}
          icon={<Music className="w-5 h-5 text-green-500" />}
        />
        <MetricCard
          label="Listener Growth"
          value="+123.4K"
          change={data.metrics.listenersChange}
          icon={<Music className="w-5 h-5" />}
        />
        <MetricCard
          label="Saves This Month"
          value={(data.metrics.savesThisMonth / 1000).toFixed(1) + 'K'}
          change={data.metrics.savesChange}
          icon={<Music className="w-5 h-5" />}
        />
        <MetricCard
          label="Skip Rate"
          value={data.metrics.skipRate.toFixed(1) + '%'}
          change={-2.1}
          icon={<Music className="w-5 h-5" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Streaming Trends (Last 90 Days)</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : (
            <AreaChartWrapper
              data={streamingTrends}
              areas={[
                {
                  dataKey: 'streams',
                  fill: '#10b981',
                  stroke: '#10b981',
                  name: 'Streams',
                },
                {
                  dataKey: 'listeners',
                  fill: '#3b82f6',
                  stroke: '#3b82f6',
                  name: 'Listeners',
                },
              ]}
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Listeners Trend (Last 6 Months)</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : (
            <LineChartWrapper
              data={monthlyListeners}
              lines={[
                {
                  dataKey: 'listeners',
                  stroke: '#8b5cf6',
                  name: 'Monthly Listeners',
                },
              ]}
            />
          )}
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground text-center border-t pt-4">
        Last synced: {formatTimeAgo(lastSync)}
      </div>
    </div>
  );
}
