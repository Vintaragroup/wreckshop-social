# Platform Analytics Architecture

## Overview

The platform analytics system provides artists with detailed insights into their performance across multiple social and streaming platforms. Users can view:
1. **Snapshot/Overview Dashboard** - All platforms at a glance
2. **Individual Platform Pages** - Deep-dive analytics for each platform

---

## 1. Snapshot/Overview Page
**Route:** `/analytics/platforms`

### Purpose
Central hub showing all connected platforms in a unified view. Quick stats, connection status, and navigation to platform details.

### Layout
```
┌─────────────────────────────────────────────┐
│  Platform Analytics Snapshot                 │
│  Last updated: 2 hours ago                   │
└─────────────────────────────────────────────┘

┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ Instagram        │ │ Spotify          │ │ YouTube          │
│ Connected ✓      │ │ Connected ✓      │ │ Not Connected    │
│ 45.2K followers  │ │ 123K listeners   │ │ Connect →        │
│ 8.3% engagement  │ │ 2.1M streams     │ │                  │
│                  │ │ Last sync: 1h    │ │ View Details →   │
│ View Details →   │ │ View Details →   │ │                  │
└──────────────────┘ └──────────────────┘ └──────────────────┘

┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ TikTok           │ │ Apple Music      │ │ Facebook         │
│ Connected ✓      │ │ Connected ✓      │ │ Connected ✓      │
│ 128K followers   │ │ 456K plays       │ │ 32.1K likes      │
│ 12.5% engagement │ │ 5.2K sales       │ │ 2.1% engagement  │
│                  │ │ Last sync: 3h    │ │ Last sync: 4h    │
│ View Details →   │ │ View Details →   │ │ View Details →   │
└──────────────────┘ └──────────────────┘ └──────────────────┘

Sync All Now ↻ | Last Full Sync: 45 minutes ago
```

### Component Structure
```
PlatformAnalyticsPage
├── PageHeader (title, last sync time, sync button)
├── PlatformGrid
│   ├── PlatformCard (Instagram)
│   │   ├── PlatformIcon
│   │   ├── ConnectionStatus
│   │   ├── QuickStats (followers, engagement, etc)
│   │   └── ViewDetailsButton
│   ├── PlatformCard (Spotify)
│   ├── PlatformCard (YouTube)
│   ├── PlatformCard (TikTok)
│   ├── PlatformCard (Apple Music)
│   └── PlatformCard (Facebook)
└── SyncStatusFooter
```

### Data Requirements
```typescript
interface PlatformSnapshot {
  platform: 'instagram' | 'spotify' | 'youtube' | 'tiktok' | 'apple-music' | 'facebook';
  isConnected: boolean;
  lastSyncTime: Date;
  stats: {
    // Common fields
    followers?: number;
    followerChange?: number;
    engagement?: number; // percentage
    
    // Platform-specific
    streams?: number;      // Spotify
    monthlyListeners?: number; // Spotify
    subscribers?: number;  // YouTube
    videoCount?: number;   // YouTube, TikTok
    plays?: number;        // Apple Music
    sales?: number;        // Apple Music
  };
}
```

### API Endpoints (New)
- `GET /api/analytics/platforms` - Get all platform snapshots
- `POST /api/analytics/platforms/sync` - Trigger manual sync of all platforms

---

## 2. Individual Platform Pages

### 2.1 Instagram Platform Page
**Route:** `/integrations/instagram`

#### Purpose
Deep-dive analytics for Instagram business account. Show follower growth, engagement, top posts, hashtag performance, audience insights.

#### Layout
```
┌──────────────────────────────────────────────────────────┐
│ Instagram Analytics                                       │
│ @artistname • Business Account                           │
└──────────────────────────────────────────────────────────┘

┌─ Profile Overview ────────────────────────────────────────┐
│ Profile Picture | 45.2K Followers | 2.3K Posts | 8.3% Eng │
│ Bio: [Artist bio...]                                      │
│ Website: [link]                                           │
│ Connected: 2 days ago                                     │
└───────────────────────────────────────────────────────────┘

┌─ Key Metrics ─────────────────────────────────────────────┐
│ Followers This Month        Engagement Rate    Reach/Week │
│ ↑ +1,234 (+3.8%)           ↑ 8.3% (+0.5%)     ↑ 34.2K    │
│                                                            │
│ Avg. Likes/Post            Avg. Comments/Post Saves/Week │
│ 2,341                      145                1,234       │
└───────────────────────────────────────────────────────────┘

┌─ Follower Growth (Last 30 Days) ──────────────────────────┐
│ [Line Chart: Daily follower count]                        │
└───────────────────────────────────────────────────────────┘

┌─ Engagement Trends ──────────────────────────────────────┐
│ [Bar Chart: Daily likes, comments, shares]               │
└───────────────────────────────────────────────────────────┘

┌─ Top Posts ───────────────────────────────────────────────┐
│ Post 1              Post 2              Post 3            │
│ [Thumbnail]         [Thumbnail]         [Thumbnail]      │
│ 5.2K likes          3.8K likes          2.9K likes       │
│ 342 comments        215 comments        187 comments     │
│ 8.2% engagement     6.7% engagement     5.1% engagement  │
└───────────────────────────────────────────────────────────┘

┌─ Hashtag Performance ────────────────────────────────────┐
│ Hashtag              Posts  Avg Reach  Engagement       │
│ #independent         12     45.2K      8.3%            │
│ #newmusic            8      32.1K      6.7%            │
│ #artistcommunity     15     28.5K      5.2%            │
└───────────────────────────────────────────────────────────┘

┌─ Audience Insights ──────────────────────────────────────┐
│ Top Locations: US (45%), UK (12%), CA (8%), AU (6%)    │
│ Age Groups: 18-24 (45%), 25-34 (35%), 35-44 (15%)     │
│ Gender: Female (60%), Male (40%)                       │
│ Most Active Times: Fri-Sat 8-11pm EST                  │
└───────────────────────────────────────────────────────────┘

Last Sync: 2 hours ago | Sync Now ↻
```

#### Component Structure
```
InstagramPlatformPage
├── PageHeader
├── ProfileOverview
├── KeyMetricsGrid
├── FollowerGrowthChart
├── EngagementTrendsChart
├── TopPostsSection
│   └── PostCard[] (carousel/grid)
├── HashtagPerformanceTable
├── AudienceInsightsSection
└── SyncFooter
```

#### Data Requirements
```typescript
interface InstagramAnalytics {
  profile: {
    username: string;
    profilePictureUrl: string;
    bio: string;
    website?: string;
    followerCount: number;
    postCount: number;
    followingCount: number;
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
    weeklySaves: number;
  };
  dailyFollowerHistory: Array<{
    date: Date;
    followers: number;
  }>;
  engagementHistory: Array<{
    date: Date;
    likes: number;
    comments: number;
    shares: number;
  }>;
  topPosts: Array<{
    postId: string;
    caption: string;
    mediaUrl: string;
    postedAt: Date;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    engagementRate: number;
  }>;
  hashtags: Array<{
    hashtag: string;
    postCount: number;
    avgReach: number;
    engagementRate: number;
  }>;
  audienceInsights: {
    topLocations: Array<{
      location: string;
      percentage: number;
    }>;
    ageGroups: Array<{
      ageRange: string;
      percentage: number;
    }>;
    gender: {
      female: number;
      male: number;
      other: number;
    };
    mostActiveTimes: string[];
  };
}
```

### API Endpoints (New)
- `GET /api/integrations/instagram/analytics` - Get full Instagram analytics
- `GET /api/integrations/instagram/profile` - Get profile overview
- `GET /api/integrations/instagram/metrics` - Get key metrics
- `GET /api/integrations/instagram/follower-history` - Get historical follower data
- `GET /api/integrations/instagram/engagement-history` - Get engagement history
- `GET /api/integrations/instagram/top-posts` - Get top performing posts
- `GET /api/integrations/instagram/hashtag-performance` - Get hashtag analytics
- `GET /api/integrations/instagram/audience-insights` - Get audience demographics
- `POST /api/integrations/instagram/sync` - Trigger sync

---

### 2.2 Spotify Platform Page
**Route:** `/integrations/spotify`

#### Purpose
Deep-dive analytics for Spotify artist account. Show listener metrics, streaming trends, top tracks, demographics, playlist placements.

#### Layout
```
┌──────────────────────────────────────────────────────────┐
│ Spotify Analytics                                         │
│ Artist Name • Verified Artist                            │
└──────────────────────────────────────────────────────────┘

┌─ Profile Overview ────────────────────────────────────────┐
│ [Profile Image] | 123K Monthly Listeners | 2.1M Total Streams │
│ 45 Total Releases | 234 Followers                        │
│ Top Genre: Hip-Hop                                       │
└───────────────────────────────────────────────────────────┘

┌─ Key Metrics (Last 30 Days) ──────────────────────────────┐
│ Streams              Listeners       Followers    Saves    │
│ ↑ 234.5K            ↑ 123.4K        ↑ 2.3K      ↑ 5.6K   │
│ +12.5%              +8.3%           +1.2%       +3.2%    │
│                                                            │
│ Skip Rate            Total Playlists  Playlist Reach      │
│ 22.3%               2,345            45.2K               │
└───────────────────────────────────────────────────────────┘

┌─ Streaming Trends (Last 90 Days) ─────────────────────────┐
│ [Line Chart: Daily streams]                              │
└───────────────────────────────────────────────────────────┘

┌─ Monthly Listeners Trend (Last 6 Months) ──────────────────┐
│ [Bar Chart: Monthly listeners over time]                  │
└───────────────────────────────────────────────────────────┘

┌─ Top 10 Tracks (Last 30 Days) ────────────────────────────┐
│ Rank | Track Name             Streams    Listeners  Saves │
│ 1    | Song Title             45.2K      23.1K     4.5K  │
│ 2    | Another Track          38.9K      19.2K     3.2K  │
│ 3    | Popular Hit            34.5K      17.8K     2.9K  │
│ ... (10 tracks total)                                     │
└───────────────────────────────────────────────────────────┘

┌─ Listener Demographics ───────────────────────────────────┐
│ Top Countries: US (35%), UK (12%), CA (8%), AU (6%)    │
│ Age Groups: 18-24 (45%), 25-34 (35%), 35-44 (15%)     │
│ Gender: Male (65%), Female (35%)                       │
│ Top Cities: Los Angeles, New York, London, Toronto     │
└───────────────────────────────────────────────────────────┘

┌─ Playlist Placements ────────────────────────────────────┐
│ Playlist Name                 Platform    Position Reach │
│ RapCaviar                    Spotify      #3       500K  │
│ New Music Daily              Spotify      #5       450K  │
│ Your Discover Weekly         User         #1       45K   │
│ [Show more...] (2,345 total playlists)                   │
└───────────────────────────────────────────────────────────┘

┌─ Save/Skip Ratio ────────────────────────────────────────┐
│ [Pie Chart: Saves vs Skips vs Plays]                    │
│ Saves: 12.3% | Full Plays: 65.4% | Skips: 22.3%       │
└───────────────────────────────────────────────────────────┘

Last Sync: 1 hour ago | Sync Now ↻
```

#### Component Structure
```
SpotifyPlatformPage
├── PageHeader
├── ProfileOverview
├── KeyMetricsGrid
├── StreamingTrendsChart
├── MonthlyListenersChart
├── TopTracksTable
├── ListenerDemographicsSection
├── PlaylistPlacementsSection
├── SaveSkipRatioChart
└── SyncFooter
```

#### Data Requirements
```typescript
interface SpotifyAnalytics {
  profile: {
    artistId: string;
    artistName: string;
    profileImageUrl: string;
    isVerified: boolean;
    followerCount: number;
    totalReleases: number;
    topGenres: string[];
    externalUrl: string;
  };
  metrics: {
    monthlyListeners: number;
    totalStreams: number;
    streamsThisMonth: number;
    streamsChange: number;
    listenersChange: number;
    followerChange: number;
    savesThisMonth: number;
    savesChange: number;
    skipRate: number;
    totalPlaylists: number;
    playlistReach: number;
  };
  dailyStreams: Array<{
    date: Date;
    streams: number;
  }>;
  monthlyListeners: Array<{
    month: Date;
    listeners: number;
  }>;
  topTracks: Array<{
    trackId: string;
    trackName: string;
    artistName: string;
    streams: number;
    listeners: number;
    saves: number;
    releaseDate: Date;
  }>;
  demographics: {
    topCountries: Array<{
      country: string;
      percentage: number;
    }>;
    ageGroups: Array<{
      ageRange: string;
      percentage: number;
    }>;
    gender: {
      male: number;
      female: number;
    };
    topCities: string[];
  };
  playlistPlacements: Array<{
    playlistId: string;
    playlistName: string;
    platform: 'spotify' | 'user'; // Spotify official or user-generated
    position?: number;
    reach: number;
    addedDate: Date;
  }>;
  saveSkipRatio: {
    saves: number;
    fullPlays: number;
    skips: number;
  };
}
```

### API Endpoints (New)
- `GET /api/integrations/spotify/analytics` - Get full Spotify analytics
- `GET /api/integrations/spotify/profile` - Get profile overview
- `GET /api/integrations/spotify/metrics` - Get key metrics
- `GET /api/integrations/spotify/daily-streams` - Get streaming history
- `GET /api/integrations/spotify/monthly-listeners` - Get listener trends
- `GET /api/integrations/spotify/top-tracks` - Get top tracks
- `GET /api/integrations/spotify/demographics` - Get listener demographics
- `GET /api/integrations/spotify/playlists` - Get playlist placements
- `GET /api/integrations/spotify/save-skip-ratio` - Get save/skip data
- `POST /api/integrations/spotify/sync` - Trigger sync

---

### 2.3 YouTube Platform Page
**Route:** `/integrations/youtube`

#### Purpose
Deep-dive analytics for YouTube channel. Show subscriber growth, view trends, top videos, engagement, traffic sources, retention metrics.

#### Layout
```
┌──────────────────────────────────────────────────────────┐
│ YouTube Analytics                                         │
│ Channel Name • 234K Subscribers                          │
└──────────────────────────────────────────────────────────┘

┌─ Profile Overview ────────────────────────────────────────┐
│ [Channel Banner] | 234K Subscribers | 12.3M Total Views │
│ 456 Videos | 45.2K Comments Last Month                   │
└───────────────────────────────────────────────────────────┘

┌─ Key Metrics (Last 30 Days) ──────────────────────────────┐
│ Views               Subscribers    Watch Time   Engagement │
│ ↑ 123.4K           ↑ 2.3K         ↑ 34.5K hrs  ↑ 8.2%    │
│ +5.2%              +0.8%          +12.3%       +1.5%     │
│                                                            │
│ Clicks             Impressions    CTR          Avg Duration │
│ 45.2K             234.5K         19.2%        4min 32sec  │
└───────────────────────────────────────────────────────────┘

┌─ Views & Growth (Last 60 Days) ───────────────────────────┐
│ [Line Chart: Daily views]                                │
└───────────────────────────────────────────────────────────┘

┌─ Subscriber Growth (Last 6 Months) ────────────────────────┐
│ [Area Chart: Monthly subscribers]                         │
└───────────────────────────────────────────────────────────┘

┌─ Top Videos (Last 30 Days) ───────────────────────────────┐
│ Video Title                    Views    Comments  Likes   │
│ 1. Most Popular Video         45.2K    234      5.2K     │
│ 2. Another Great Video        38.9K    189      4.1K     │
│ 3. Recent Upload              34.5K    145      3.8K     │
│ ... (show top 10)                                         │
└───────────────────────────────────────────────────────────┘

┌─ Traffic Sources ────────────────────────────────────────┐
│ YouTube Search      45.2%  (123.4K views)               │
│ Suggested Videos    32.1%  (87.5K views)                │
│ External Sites      15.3%  (41.8K views)                │
│ Direct/Unknown       7.4%  (20.2K views)                │
└───────────────────────────────────────────────────────────┘

┌─ Audience Insights ───────────────────────────────────────┐
│ Top Countries: US (45%), UK (12%), CA (8%), AU (6%)    │
│ Age Groups: 13-17 (15%), 18-24 (45%), 25-34 (30%)     │
│ Gender: Male (65%), Female (35%)                       │
└───────────────────────────────────────────────────────────┘

┌─ Audience Retention ─────────────────────────────────────┐
│ [Line Chart: % of audience retained over video duration] │
│ Average Retention: 45%                                   │
└───────────────────────────────────────────────────────────┘

Last Sync: 1 hour ago | Sync Now ↻
```

#### Component Structure
```
YouTubePlatformPage
├── PageHeader
├── ProfileOverview
├── KeyMetricsGrid
├── ViewsGrowthChart
├── SubscriberGrowthChart
├── TopVideosTable
├── TrafficSourcesChart
├── AudienceInsightsSection
├── AudienceRetentionChart
└── SyncFooter
```

#### Data Requirements
```typescript
interface YouTubeAnalytics {
  profile: {
    channelId: string;
    channelName: string;
    profileImageUrl: string;
    bannerUrl: string;
    subscriberCount: number;
    totalViews: number;
    videoCount: number;
  };
  metrics: {
    viewsThisMonth: number;
    viewsChange: number;
    subscribersThisMonth: number;
    subscribersChange: number;
    watchTimeHours: number;
    watchTimeChange: number;
    engagementRate: number;
    engagementChange: number;
    clicks: number;
    impressions: number;
    ctr: number;
    avgWatchDuration: string; // "4min 32sec"
  };
  dailyViews: Array<{
    date: Date;
    views: number;
  }>;
  monthlySubscribers: Array<{
    month: Date;
    subscribers: number;
  }>;
  topVideos: Array<{
    videoId: string;
    title: string;
    views: number;
    likes: number;
    comments: number;
    watchTime: number;
    uploadDate: Date;
    thumbnail: string;
  }>;
  trafficSources: Array<{
    source: string;
    views: number;
    percentage: number;
  }>;
  audienceInsights: {
    topCountries: Array<{
      country: string;
      percentage: number;
    }>;
    ageGroups: Array<{
      ageRange: string;
      percentage: number;
    }>;
    gender: {
      male: number;
      female: number;
    };
  };
  audienceRetention: Array<{
    percentageOfVideo: number;
    retentionRate: number;
  }>;
}
```

### API Endpoints (New)
- `GET /api/integrations/youtube/analytics` - Get full YouTube analytics
- `GET /api/integrations/youtube/profile` - Get channel overview
- `GET /api/integrations/youtube/metrics` - Get key metrics
- `GET /api/integrations/youtube/daily-views` - Get views history
- `GET /api/integrations/youtube/subscribers` - Get subscriber trends
- `GET /api/integrations/youtube/top-videos` - Get top videos
- `GET /api/integrations/youtube/traffic-sources` - Get traffic source breakdown
- `GET /api/integrations/youtube/audience-insights` - Get demographic data
- `GET /api/integrations/youtube/retention` - Get audience retention data
- `POST /api/integrations/youtube/sync` - Trigger sync

---

### 2.4 TikTok Platform Page
**Route:** `/integrations/tiktok`

#### Purpose
Deep-dive analytics for TikTok creator account. Show follower growth, video performance, trending sounds, engagement rates, audience demographics.

#### Layout
```
┌──────────────────────────────────────────────────────────┐
│ TikTok Analytics                                          │
│ @artisthandle • Creator Account                          │
└──────────────────────────────────────────────────────────┘

┌─ Profile Overview ────────────────────────────────────────┐
│ [Avatar] | 128K Followers | 3.2M Total Likes           │
│ 234 Videos | 2.1M Profile Views This Month              │
└───────────────────────────────────────────────────────────┘

┌─ Key Metrics (Last 30 Days) ──────────────────────────────┐
│ Followers          Profile Views     Video Views  Likes   │
│ ↑ +8.2K (+6.8%)   ↑ 234.5K (+12%)  ↑ 456.7K    ↑ 45.2K  │
│                                                            │
│ Comments           Shares            Avg Eng Rate       │
│ ↑ 12.3K           ↑ 34.5K            ↑ 12.5%            │
└───────────────────────────────────────────────────────────┘

┌─ Follower Growth (Last 30 Days) ──────────────────────────┐
│ [Line Chart: Daily followers]                            │
└───────────────────────────────────────────────────────────┘

┌─ Video Performance Trends ────────────────────────────────┐
│ [Bar Chart: Video views, likes, shares over time]        │
└───────────────────────────────────────────────────────────┘

┌─ Top Videos (Last 30 Days) ───────────────────────────────┐
│ Video               Views    Likes    Comments  Shares   │
│ 1. [Video Title]   345.2K   45.2K    12.3K    8.9K     │
│ 2. [Video Title]   289.5K   38.9K    10.1K    7.2K     │
│ 3. [Video Title]   234.1K   32.5K     8.7K    5.8K     │
│ ... (show top 10)                                         │
└───────────────────────────────────────────────────────────┘

┌─ Trending Sounds Used ────────────────────────────────────┐
│ Sound Name                     Usage  Avg Views  Eng Rate │
│ 1. Popular TikTok Sound        12x    234.5K    12.3%   │
│ 2. Chart-Topping Track         8x     189.2K    10.1%   │
│ 3. Viral Audio Clip            6x     145.8K     8.9%   │
│ ... (show top 10)                                         │
└───────────────────────────────────────────────────────────┘

┌─ Audience Demographics ───────────────────────────────────┐
│ Top Countries: US (45%), UK (12%), CA (8%), AU (6%)    │
│ Age Groups: 13-17 (25%), 18-24 (45%), 25-34 (25%)     │
│ Gender: Female (60%), Male (40%)                       │
└───────────────────────────────────────────────────────────┘

┌─ Engagement Analysis ────────────────────────────────────┐
│ Avg Engagement Rate: 12.5% (excellent)                  │
│ Most Engaging Time: Fri-Sat 7-9pm EST                  │
│ Top Hashtags: #indiemusic, #newmusic, #artistlife     │
└───────────────────────────────────────────────────────────┘

Last Sync: 2 hours ago | Sync Now ↻
```

#### Component Structure
```
TikTokPlatformPage
├── PageHeader
├── ProfileOverview
├── KeyMetricsGrid
├── FollowerGrowthChart
├── VideoPerformanceChart
├── TopVideosTable
├── TrendingSoundsTable
├── AudienceDemographicsSection
├── EngagementAnalysisSection
└── SyncFooter
```

#### Data Requirements
```typescript
interface TikTokAnalytics {
  profile: {
    userId: string;
    username: string;
    displayName: string;
    profilePictureUrl: string;
    bio: string;
    followerCount: number;
    followingCount: number;
    videoCount: number;
    totalLikes: number;
  };
  metrics: {
    followersThisMonth: number;
    followerChange: number;
    profileViewsThisMonth: number;
    profileViewsChange: number;
    videoViewsThisMonth: number;
    videoViewsChange: number;
    likesThisMonth: number;
    likesChange: number;
    commentsThisMonth: number;
    sharesThisMonth: number;
    avgEngagementRate: number;
  };
  dailyFollowers: Array<{
    date: Date;
    followers: number;
  }>;
  videoPerformance: Array<{
    date: Date;
    views: number;
    likes: number;
    shares: number;
  }>;
  topVideos: Array<{
    videoId: string;
    videoUrl: string;
    views: number;
    likes: number;
    comments: number;
    shares: number;
    engagementRate: number;
    createdAt: Date;
  }>;
  trendingSounds: Array<{
    soundId: string;
    soundName: string;
    timesUsed: number;
    avgViews: number;
    engagementRate: number;
  }>;
  demographics: {
    topCountries: Array<{
      country: string;
      percentage: number;
    }>;
    ageGroups: Array<{
      ageRange: string;
      percentage: number;
    }>;
    gender: {
      male: number;
      female: number;
    };
  };
  engagement: {
    averageEngagementRate: number;
    mostActiveTime: string;
    topHashtags: string[];
  };
}
```

### API Endpoints (New)
- `GET /api/integrations/tiktok/analytics` - Get full TikTok analytics
- `GET /api/integrations/tiktok/profile` - Get profile overview
- `GET /api/integrations/tiktok/metrics` - Get key metrics
- `GET /api/integrations/tiktok/follower-history` - Get follower trends
- `GET /api/integrations/tiktok/video-performance` - Get video trends
- `GET /api/integrations/tiktok/top-videos` - Get top performing videos
- `GET /api/integrations/tiktok/trending-sounds` - Get trending sound usage
- `GET /api/integrations/tiktok/demographics` - Get audience demographics
- `GET /api/integrations/tiktok/engagement` - Get engagement analysis
- `POST /api/integrations/tiktok/sync` - Trigger sync

---

### 2.5 Apple Music Platform Page
**Route:** `/integrations/apple-music`

#### Purpose
Deep-dive analytics for Apple Music artist. Show play counts, sales metrics, chart performance, listener locations, playlist placements.

#### Layout
```
┌──────────────────────────────────────────────────────────┐
│ Apple Music Analytics                                     │
│ Artist Name • 456K Listeners                             │
└──────────────────────────────────────────────────────────┘

┌─ Profile Overview ────────────────────────────────────────┐
│ [Artist Image] | 456K Listeners | 5.2M Total Plays    │
│ 34 Releases | $23.5K Total Revenue                       │
└───────────────────────────────────────────────────────────┘

┌─ Key Metrics (Last 30 Days) ──────────────────────────────┐
│ Plays              Sales           Revenue       Listeners │
│ ↑ 234.5K          ↑ 456 units     ↑ $2.3K      ↑ 45.2K  │
│ +12.5%            +8.3%           +15.2%       +9.1%    │
│                                                            │
│ Total Playlists    Top Chart Position  Countries        │
│ 2,345             #12 (Pop)           45                │
└───────────────────────────────────────────────────────────┘

┌─ Plays & Sales Trend (Last 90 Days) ──────────────────────┐
│ [Line Chart: Daily plays (blue), sales (green)]          │
└───────────────────────────────────────────────────────────┘

┌─ Top Tracks (Last 30 Days) ───────────────────────────────┐
│ Track                          Plays    Sales   Revenue   │
│ 1. Latest Single             45.2K    234     $1.2K     │
│ 2. Popular Track             38.9K    189     $0.95K    │
│ 3. Evergreen Song            34.5K    145     $0.73K    │
│ ... (show top 10)                                         │
└───────────────────────────────────────────────────────────┘

┌─ Chart Performance ───────────────────────────────────────┐
│ Chart                  Peak Position  Current Position  │
│ Top Charts             #12            #18               │
│ Pop                    #5             #8                │
│ Independent           #1             #2                │
│ Breakthrough Artists   #3             #5                │
└───────────────────────────────────────────────────────────┘

┌─ Geographic Distribution ────────────────────────────────┐
│ [Map or Table showing top listener countries]           │
│ US: 45% | UK: 12% | CA: 8% | AU: 6% | DE: 5% ...     │
└───────────────────────────────────────────────────────────┘

┌─ Playlist Placements ────────────────────────────────────┐
│ Playlist Name                     Platform   Position Reach │
│ Pop Rising                        Apple      #3       500K  │
│ New Music Daily                   Apple      #7       450K  │
│ User Playlist                     User       #1       45K   │
│ ... (2,345 total playlists)                                │
└───────────────────────────────────────────────────────────┘

Last Sync: 3 hours ago | Sync Now ↻
```

#### Component Structure
```
AppleMusicPlatformPage
├── PageHeader
├── ProfileOverview
├── KeyMetricsGrid
├── PlaysAndSalesTrendChart
├── TopTracksTable
├── ChartPerformanceSection
├── GeographicDistributionMap
├── PlaylistPlacementsSection
└── SyncFooter
```

#### Data Requirements
```typescript
interface AppleMusicAnalytics {
  profile: {
    artistId: string;
    artistName: string;
    profileImageUrl: string;
    listenerCount: number;
    totalPlays: number;
    totalReleases: number;
    totalRevenue: number;
  };
  metrics: {
    playsThisMonth: number;
    playsChange: number;
    salesThisMonth: number;
    salesChange: number;
    revenueThisMonth: number;
    revenueChange: number;
    listenersThisMonth: number;
    listenersChange: number;
    totalPlaylists: number;
    topChartPosition?: number;
    topChartName?: string;
    countries: number;
  };
  dailyPlaysAndSales: Array<{
    date: Date;
    plays: number;
    sales: number;
  }>;
  topTracks: Array<{
    trackId: string;
    trackName: string;
    plays: number;
    sales: number;
    revenue: number;
    releaseDate: Date;
  }>;
  chartPerformance: Array<{
    chartName: string;
    peakPosition: number;
    currentPosition: number;
  }>;
  geographicDistribution: Array<{
    country: string;
    percentage: number;
    plays: number;
  }>;
  playlistPlacements: Array<{
    playlistId: string;
    playlistName: string;
    platform: 'apple' | 'user';
    position?: number;
    reach: number;
    addedDate: Date;
  }>;
}
```

### API Endpoints (New)
- `GET /api/integrations/apple-music/analytics` - Get full Apple Music analytics
- `GET /api/integrations/apple-music/profile` - Get artist profile
- `GET /api/integrations/apple-music/metrics` - Get key metrics
- `GET /api/integrations/apple-music/plays-sales` - Get plays and sales history
- `GET /api/integrations/apple-music/top-tracks` - Get top tracks
- `GET /api/integrations/apple-music/charts` - Get chart performance
- `GET /api/integrations/apple-music/geographic-distribution` - Get geographic data
- `GET /api/integrations/apple-music/playlists` - Get playlist placements
- `POST /api/integrations/apple-music/sync` - Trigger sync

---

## 3. Navigation & Routing

### Updated Router Structure
```
/analytics
  /analytics/platforms (new - snapshot page)
  /integrations
    /integrations/instagram (new - detail page)
    /integrations/spotify (new - detail page)
    /integrations/youtube (new - detail page)
    /integrations/tiktok (new - detail page)
    /integrations/apple-music (new - detail page)
    /integrations (existing - connection management)
```

### Navigation Updates
- **Analytics sidebar**: Add "Platforms" option linking to `/analytics/platforms`
- **Integration cards**: Add "View Analytics" button that routes to platform detail page
- **Platform detail pages**: Show link back to platforms snapshot

---

## 4. Implementation Phases

### Phase 1: UI Foundation (Week 1)
- Create platform snapshot page with mock data
- Create individual platform page templates with static layouts
- Set up routing for all new pages
- Create reusable chart components

### Phase 2: Instagram Integration (Week 1-2)
- Build Instagram detail page with real data
- Connect Instagram OAuth
- Implement Instagram API endpoints
- Add sync functionality

### Phase 3: Spotify Integration (Week 2)
- Build Spotify detail page with real data
- Connect Spotify OAuth
- Implement Spotify API endpoints
- Add sync functionality

### Phase 4: YouTube & TikTok (Week 3)
- Build YouTube detail page
- Build TikTok detail page
- Implement API endpoints for both
- Add sync functionality

### Phase 5: Apple Music & Polish (Week 3-4)
- Build Apple Music detail page
- Implement API endpoints
- Polish all pages
- Performance optimization

---

## 5. Component Hierarchy

### Shared Components
```
AnalyticsChartBase
├── LineChart (for trends)
├── BarChart (for comparisons)
├── PieChart (for distributions)
├── AreaChart (for accumulated data)
└── GaugeChart (for metrics)

PlatformCard (reusable)
├── Platform icon/logo
├── Connection status badge
├── Quick stats
├── Last sync indicator
└── Action button (View/Connect)

MetricsGrid (reusable)
├── MetricCard[]
│   ├── Label
│   ├── Value
│   ├── Change indicator (+/-)
│   └── Change percentage

StatsSection (reusable)
├── Section title
├── Key metrics in 2x3 grid
└── Visual indicators

DemographicsSection (reusable)
├── Pie chart (gender)
├── Bar chart (age groups)
├── List (top countries/cities)
└── Heat map (if applicable)
```

---

## 6. Data Sync Strategy

### Sync Triggers
1. **Manual**: User clicks "Sync Now" button
2. **On Connection**: When user connects a platform
3. **Scheduled**: Daily/hourly background sync (future)
4. **On Visit**: Refresh data when user visits analytics page

### Sync States
- **Not Connected**: Show connection CTA
- **Connected, No Data**: Show "Waiting for first sync" message
- **Syncing**: Show loading state, disable refresh
- **Synced**: Show data with last sync timestamp
- **Error**: Show error message with retry button

---

## 7. Future Enhancements

1. **Comparative Analytics**: Compare performance across platforms
2. **AI Insights**: ML-powered recommendations
3. **Export Reports**: PDF/CSV download of analytics
4. **Custom Dashboards**: Users drag/drop widgets
5. **Alerts**: Notify users of milestones or drops
6. **Team Analytics**: Aggregate data for team accounts

---

## API Base Structure

All analytics endpoints follow the pattern:
```
GET /api/integrations/{platform}/analytics
GET /api/integrations/{platform}/profile
GET /api/integrations/{platform}/metrics
GET /api/integrations/{platform}/*
POST /api/integrations/{platform}/sync
```

Error responses:
```json
{
  "error": "Platform not connected",
  "code": "PLATFORM_NOT_CONNECTED"
}
```

Success responses include metadata:
```json
{
  "data": {...},
  "meta": {
    "lastSyncTime": "2025-11-12T15:30:00Z",
    "syncDuration": 1234,
    "dataAgeMinutes": 45
  }
}
```

