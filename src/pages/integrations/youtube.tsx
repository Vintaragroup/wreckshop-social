import { useState } from 'react';
import { ArrowLeft, RefreshCw, TrendingUp, TrendingDown, Play } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../../components/ui/badge';
import { LineChartWrapper, BarChartWrapper, type ChartDataPoint } from '../../components/charts';

const MOCK_DATA = {
  profile: {
    channelName: 'Channel Name',
    profileImageUrl: 'https://via.placeholder.com/200',
    subscriberCount: 234000,
    totalViews: 12300000,
  },
  metrics: {
    viewsThisMonth: 123400,
    viewsChange: 5.2,
    subscribersThisMonth: 2300,
    subscribersChange: 0.8,
    watchTimeHours: 34500,
    watchTimeChange: 12.3,
    engagementRate: 8.2,
    avgWatchDuration: '4m 32s',
  },
};

// Mock views and growth data
const VIEWS_GROWTH_DATA: ChartDataPoint[] = [
  { name: 'Week 1', views: 18000, subscribers: 400 },
  { name: 'Week 2', views: 22000, subscribers: 520 },
  { name: 'Week 3', views: 28000, subscribers: 620 },
  { name: 'Week 4', views: 55400, subscribers: 760 },
];

// Mock subscriber growth data
const SUBSCRIBER_GROWTH_DATA: ChartDataPoint[] = [
  { name: 'Month 1', subscribers: 195000 },
  { name: 'Month 2', subscribers: 205000 },
  { name: 'Month 3', subscribers: 215000 },
  { name: 'Month 4', subscribers: 222000 },
  { name: 'Month 5', subscribers: 228000 },
  { name: 'Month 6', subscribers: 234000 },
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

export default function YouTubePlatformPage() {
  const navigate = useNavigate();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(new Date(Date.now() - 1 * 60 * 60 * 1000));

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
            <h1 className="text-3xl font-bold tracking-tight">YouTube Analytics</h1>
            <p className="text-muted-foreground">{MOCK_DATA.profile.channelName}</p>
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
              alt={MOCK_DATA.profile.channelName}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{MOCK_DATA.profile.channelName}</h2>
              
              <div className="flex gap-6 mt-4">
                <div>
                  <p className="text-xs text-muted-foreground">Subscribers</p>
                  <p className="text-xl font-bold">
                    {(MOCK_DATA.profile.subscriberCount / 1000).toFixed(0)}K
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Views</p>
                  <p className="text-xl font-bold">
                    {(MOCK_DATA.profile.totalViews / 1000000).toFixed(1)}M
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Views This Month"
          value={(MOCK_DATA.metrics.viewsThisMonth / 1000).toFixed(0) + 'K'}
          change={MOCK_DATA.metrics.viewsChange}
          icon={<Play className="w-5 h-5 text-red-500" />}
        />
        <MetricCard
          label="New Subscribers"
          value={MOCK_DATA.metrics.subscribersThisMonth.toLocaleString()}
          change={MOCK_DATA.metrics.subscribersChange}
          icon={<Play className="w-5 h-5" />}
        />
        <MetricCard
          label="Watch Time (Hours)"
          value={(MOCK_DATA.metrics.watchTimeHours / 1000).toFixed(1) + 'K'}
          change={MOCK_DATA.metrics.watchTimeChange}
          icon={<Play className="w-5 h-5" />}
        />
        <MetricCard
          label="Avg Watch Duration"
          value={MOCK_DATA.metrics.avgWatchDuration}
          change={3.2}
          icon={<Play className="w-5 h-5" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Views & Growth (Last 60 Days)</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <BarChartWrapper
            data={VIEWS_GROWTH_DATA}
            bars={[
              {
                dataKey: 'views',
                fill: '#ef4444',
                name: 'Views',
              },
              {
                dataKey: 'subscribers',
                fill: '#3b82f6',
                name: 'New Subscribers',
              },
            ]}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscriber Growth (Last 6 Months)</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <LineChartWrapper
            data={SUBSCRIBER_GROWTH_DATA}
            lines={[
              {
                dataKey: 'subscribers',
                stroke: '#3b82f6',
                name: 'Subscribers',
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
