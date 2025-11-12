/**
 * YouTube Analytics Service
 * 
 * Provides mock and real YouTube analytics data for artist/creator channels.
 * Integrates with YouTube Data API for actual metrics.
 */

import axios from 'axios';

/**
 * YouTube Channel Profile Information
 */
export interface YouTubeProfile {
  channelId: string;
  channelTitle: string;
  channelDescription: string;
  profileImageUrl: string;
  bannerId: string;
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
  customUrl?: string;
  verifiedBadge: boolean;
}

/**
 * YouTube Channel Metrics
 */
export interface YouTubeMetrics {
  totalViews: number;
  totalWatchTimeHours: number;
  subscribersGained: number;
  subscribersGainedThisMonth: number;
  averageViewDuration: number;
  averageEngagementRate: number;
  commentCount: number;
  likeCount: number;
  shareCount: number;
}

/**
 * Complete YouTube Analytics Data
 */
export interface YouTubeAnalytics {
  profile: YouTubeProfile;
  metrics: YouTubeMetrics;
  lastUpdated: Date;
}

/**
 * YouTube Video Data
 */
export interface YouTubeVideo {
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: Date;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagement: number;
  averageViewDuration: number;
  impressions: number;
  clickThroughRate: number;
}

/**
 * Traffic Source Data
 */
export interface TrafficSource {
  source: string;
  views: number;
  percentage: number;
}

/**
 * Audience Demographics
 */
export interface AudienceDemographics {
  topCountries: Array<{ country: string; percentage: number }>;
  genderDistribution: { male: number; female: number; other: number };
  ageGroups: Array<{ ageRange: string; percentage: number }>;
  topInterests: Array<{ interest: string; percentage: number }>;
}

/**
 * Get mock YouTube analytics for testing/demo
 */
export function getMockYouTubeAnalytics(channelTitle: string = 'Artist Channel'): YouTubeAnalytics {
  return {
    profile: {
      channelId: 'UCxxx123456789xxx',
      channelTitle,
      channelDescription: 'Music, creativity, and behind-the-scenes content',
      profileImageUrl: 'https://via.placeholder.com/150',
      bannerId: 'banner_001',
      subscriberCount: 234500,
      videoCount: 287,
      viewCount: 12300000,
      customUrl: '/c/artistchannel',
      verifiedBadge: true,
    },
    metrics: {
      totalViews: 12300000,
      totalWatchTimeHours: 234000,
      subscribersGained: 2345,
      subscribersGainedThisMonth: 523,
      averageViewDuration: 4.2, // minutes
      averageEngagementRate: 6.8,
      commentCount: 45000,
      likeCount: 234000,
      shareCount: 12300,
    },
    lastUpdated: new Date(),
  };
}

/**
 * Get subscriber growth trend data
 */
export function getSubscriberGrowthTrend(daysBack: number = 90): Array<{ date: string; subscribers: number }> {
  const data: Array<{ date: string; subscribers: number }> = [];
  const today = new Date();
  const baseSubscribers = 230000;

  for (let i = daysBack; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const growth = Math.floor((daysBack - i) * (4500 / daysBack) + Math.random() * 300);
    data.push({
      date: date.toISOString().split('T')[0],
      subscribers: baseSubscribers + growth,
    });
  }

  return data;
}

/**
 * Get views and watch time trend data
 */
export function getViewsTrend(daysBack: number = 90): Array<{ date: string; views: number; watchTime: number }> {
  const data: Array<{ date: string; views: number; watchTime: number }> = [];
  const today = new Date();

  for (let i = daysBack; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const views = Math.floor(Math.random() * 80000 + 40000);
    data.push({
      date: date.toISOString().split('T')[0],
      views,
      watchTime: Math.floor(views * 4.5 / 60), // Convert to hours
    });
  }

  return data;
}

/**
 * Get top performing videos
 */
export function getTopVideos(limit: number = 10): YouTubeVideo[] {
  const videos: YouTubeVideo[] = [];
  const today = new Date();

  for (let i = 0; i < Math.min(limit, 30); i++) {
    const daysAgo = Math.floor(Math.random() * 180);
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    
    const views = Math.floor(Math.random() * 500000 + 50000);
    const engagement = Math.random() * 0.12 + 0.04;
    
    videos.push({
      videoId: `vid_${i}`,
      title: `Video Title ${i + 1} - Amazing Music & Content`,
      description: 'Check out this amazing video! New music release, behind-the-scenes, and more!',
      thumbnailUrl: `https://via.placeholder.com/320x180?text=Video+${i + 1}`,
      publishedAt: date,
      views,
      likes: Math.floor(views * engagement * 0.7),
      comments: Math.floor(views * engagement * 0.3),
      shares: Math.floor(views * engagement * 0.1),
      engagement: engagement * 100,
      averageViewDuration: Math.random() * 8 + 2,
      impressions: Math.floor(views / 0.7),
      clickThroughRate: Math.random() * 8 + 2,
    });
  }

  return videos.sort((a, b) => b.views - a.views).slice(0, limit);
}

/**
 * Get traffic source data
 */
export function getTrafficSources(): TrafficSource[] {
  const sources = [
    { source: 'YouTube Search', views: Math.floor(Math.random() * 300000 + 200000) },
    { source: 'YouTube Suggested', views: Math.floor(Math.random() * 400000 + 250000) },
    { source: 'External Websites', views: Math.floor(Math.random() * 150000 + 80000) },
    { source: 'Direct URL', views: Math.floor(Math.random() * 100000 + 50000) },
    { source: 'YouTube Playlist', views: Math.floor(Math.random() * 120000 + 60000) },
    { source: 'Other', views: Math.floor(Math.random() * 80000 + 30000) },
  ];

  const totalViews = sources.reduce((sum, s) => sum + s.views, 0);
  return sources.map(source => ({
    ...source,
    percentage: Math.round((source.views / totalViews) * 100),
  }));
}

/**
 * Get audience demographic data
 */
export function getAudienceDemographics(): AudienceDemographics {
  return {
    topCountries: [
      { country: 'United States', percentage: 32 },
      { country: 'United Kingdom', percentage: 11 },
      { country: 'Canada', percentage: 8 },
      { country: 'Australia', percentage: 7 },
      { country: 'Germany', percentage: 6 },
      { country: 'France', percentage: 5 },
      { country: 'India', percentage: 5 },
      { country: 'Brazil', percentage: 4 },
      { country: 'Mexico', percentage: 3 },
      { country: 'Netherlands', percentage: 3 },
      { country: 'Other', percentage: 13 },
    ],
    genderDistribution: {
      male: 42,
      female: 55,
      other: 3,
    },
    ageGroups: [
      { ageRange: '13-17', percentage: 12 },
      { ageRange: '18-24', percentage: 32 },
      { ageRange: '25-34', percentage: 30 },
      { ageRange: '35-44', percentage: 16 },
      { ageRange: '45-54', percentage: 7 },
      { ageRange: '55+', percentage: 3 },
    ],
    topInterests: [
      { interest: 'Music', percentage: 45 },
      { interest: 'Entertainment', percentage: 28 },
      { interest: 'Lifestyle', percentage: 18 },
      { interest: 'Gaming', percentage: 12 },
      { interest: 'Education', percentage: 8 },
    ],
  };
}

/**
 * Fetch YouTube analytics (currently returns mock data)
 * 
 * TODO: Implement real YouTube Data API integration
 * - Use YouTube API client library
 * - Fetch channel statistics, analytics reports
 * - Cache results with Redis for performance
 * - Handle authentication and token refresh
 */
export async function getYouTubeAnalytics(accessToken: string, channelTitle: string = 'Artist Channel'): Promise<YouTubeAnalytics> {
  try {
    // TODO: Replace with real API call using YouTube Data API v3
    // const response = await axios.get(
    //   'https://www.googleapis.com/youtube/v3/channels',
    //   { params: { access_token: accessToken, part: 'snippet,statistics', mine: true } }
    // );
    // return transformYouTubeChannel(response.data);
    
    // For now, return mock data
    return getMockYouTubeAnalytics(channelTitle);
  } catch (error) {
    console.error('[youtube] Failed to fetch analytics:', error);
    // Fallback to mock data on error
    return getMockYouTubeAnalytics(channelTitle);
  }
}

/**
 * Get engagement metrics over time
 */
export function getEngagementMetrics(daysBack: number = 30): Array<{ date: string; likes: number; comments: number; shares: number }> {
  const data: Array<{ date: string; likes: number; comments: number; shares: number }> = [];
  const today = new Date();

  for (let i = daysBack; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      likes: Math.floor(Math.random() * 3500 + 1500),
      comments: Math.floor(Math.random() * 800 + 200),
      shares: Math.floor(Math.random() * 250 + 50),
    });
  }

  return data;
}

/**
 * Get audience retention data for a video
 */
export function getAudienceRetention(durationMinutes: number = 10): Array<{ timePercent: number; retention: number }> {
  const data: Array<{ timePercent: number; retention: number }> = [];
  
  for (let i = 0; i <= 100; i += 10) {
    const decline = (i / 100) * 40; // Simulate 40% drop-off by end
    data.push({
      timePercent: i,
      retention: 100 - decline - Math.random() * 5,
    });
  }

  return data;
}

/**
 * Get playlist performance data
 */
export function getPlaylistPerformance(limit: number = 10): Array<{ playlist: string; views: number; addToPlaylist: number }> {
  const playlists = [
    'New Releases',
    'Summer Hits',
    'Workout Mix',
    'Chill Vibes',
    'Chart Toppers',
    'Fan Favorites',
    'Latest Videos',
    'Behind the Scenes',
    'Music Videos',
    'Live Performances',
  ];

  return playlists
    .slice(0, limit)
    .map((playlist, i) => ({
      playlist,
      views: Math.floor(Math.random() * 100000 + 20000),
      addToPlaylist: Math.floor(Math.random() * 5000 + 1000),
    }))
    .sort((a, b) => b.views - a.views);
}
