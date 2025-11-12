import { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, TrendingUp, TrendingDown, Music } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../../components/ui/badge';
import { LineChartWrapper, BarChartWrapper, type ChartDataPoint } from '../../components/charts';

const MOCK_DATA = {
  profile: {
    artistName: 'Artist Name',
    profileImageUrl: 'https://via.placeholder.com/200',
    listenerCount: 456000,
    totalRevenue: 23500,
  },
  metrics: {
    playsThisMonth: 234500,
    playsChange: 12.5,
    salesThisMonth: 456,
    salesChange: 8.3,
    revenueThisMonth: 2300,
    revenueChange: 15.2,
    listenersChange: 9.1,
  },
};

// Mock plays and sales data
const PLAYS_SALES_DATA: ChartDataPoint[] = [
  { name: 'Week 1', plays: 45000, sales: 85 },
  { name: 'Week 2', plays: 52000, sales: 95 },
  { name: 'Week 3', plays: 68000, sales: 125 },
  { name: 'Week 4', plays: 69500, sales: 151 },
];

// Mock top tracks data
const TOP_TRACKS_DATA: ChartDataPoint[] = [
  { name: 'Track 1', plays: 45000, revenue: 450 },
  { name: 'Track 2', plays: 32000, revenue: 320 },
  { name: 'Track 3', plays: 28000, revenue: 280 },
  { name: 'Track 4', plays: 22500, revenue: 225 },
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

export default function AppleMusicPlatformPage() {
  const navigate = useNavigate();
  const [data, setData] = useState(MOCK_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(new Date(Date.now() - 4 * 60 * 60 * 1000));
  const [playsSalesData, setPlaysSalesData] = useState<ChartDataPoint[]>(PLAYS_SALES_DATA);
  const [topTracksData, setTopTracksData] = useState<ChartDataPoint[]>(TOP_TRACKS_DATA);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/integrations/apple-music/analytics?includeCharts=true');
        const result = await response.json();

        if (result.ok && result.analytics) {
          const apiData = result.analytics;
          setData({
            profile: {
              artistName: apiData.profile.name,
              profileImageUrl: apiData.profile.profileImageUrl,
              listenerCount: apiData.metrics.uniqueListeners,
              totalRevenue: Math.floor(apiData.metrics.monthlyPlays * 0.003),
            },
            metrics: {
              playsThisMonth: apiData.metrics.monthlyPlays,
              playsChange: 12.5,
              salesThisMonth: Math.floor(apiData.metrics.monthlyPlaylistAdds * 1.5),
              salesChange: 8.3,
              revenueThisMonth: Math.floor(apiData.metrics.monthlyPlays * 0.003),
              revenueChange: 15.2,
              listenersChange: 9.1,
            },
          });

          if (result.charts?.monthlyStreams) {
            setPlaysSalesData(
              result.charts.monthlyStreams.map((item: any) => ({
                name: item.month,
                plays: item.streams,
                sales: Math.floor(item.streams * 0.002),
              }))
            );
          }

          if (result.topTracks) {
            setTopTracksData(
              result.topTracks.slice(0, 4).map((track: any) => ({
                name: track.title,
                plays: track.plays,
                revenue: Math.floor(track.plays * 0.003),
              }))
            );
          }
        }
      } catch (error) {
        console.error('Failed to fetch Apple Music analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

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
            <h1 className="text-3xl font-bold tracking-tight">Apple Music Analytics</h1>
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
              <h2 className="text-2xl font-bold">{data.profile.artistName}</h2>
              <Badge className="mt-2">Official Artist</Badge>
              
              <div className="flex gap-6 mt-4">
                <div>
                  <p className="text-xs text-muted-foreground">Listeners</p>
                  <p className="text-xl font-bold">
                    {(data.profile.listenerCount / 1000).toFixed(0)}K
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Revenue</p>
                  <p className="text-xl font-bold">
                    ${data.profile.totalRevenue.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Plays This Month"
          value={`${(data.metrics.playsThisMonth / 1000).toFixed(0)}K`}
          change={data.metrics.playsChange}
          icon={<Music className="w-5 h-5 text-blue-500" />}
        />
        <MetricCard
          label="Sales This Month"
          value={data.metrics.salesThisMonth}
          change={data.metrics.salesChange}
          icon={<Music className="w-5 h-5" />}
        />
        <MetricCard
          label="Revenue This Month"
          value={`$${data.metrics.revenueThisMonth.toLocaleString()}`}
          change={data.metrics.revenueChange}
          icon={<Music className="w-5 h-5" />}
        />
        <MetricCard
          label="Listener Growth"
          value={`+${data.metrics.listenersChange}%`}
          change={data.metrics.listenersChange}
          icon={<Music className="w-5 h-5" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Plays & Sales Trend (Last 90 Days)</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Loading analytics...
            </div>
          ) : (
            <BarChartWrapper
              data={playsSalesData}
              bars={[
                {
                  dataKey: 'plays',
                  fill: '#ef4444',
                  name: 'Plays',
                },
                {
                  dataKey: 'sales',
                  fill: '#10b981',
                  name: 'Sales',
                },
              ]}
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Tracks by Plays</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Loading analytics...
            </div>
          ) : (
            <BarChartWrapper
              data={topTracksData}
              bars={[
                {
                  dataKey: 'plays',
                  fill: '#8b5cf6',
                  name: 'Plays',
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
