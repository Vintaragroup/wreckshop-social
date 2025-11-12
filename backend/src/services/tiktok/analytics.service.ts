/**
 * TikTok Analytics Service
 * 
 * Provides mock and real TikTok analytics data for creator profiles.
 * Integrates with TikTok Research API or Business API for actual metrics.
 */

/**
 * TikTok Creator Profile Information
 */
export interface TikTokProfile {
  creatorId: string;
  username: string;
  displayName: string;
  profileImageUrl: string;
  biography: string;
  verifiedBadge: boolean;
  followerCount: number;
  followingCount: number;
  videoCount: number;
  totalLikes: number;
  profileUrl: string;
}

/**
 * TikTok Engagement Metrics
 */
export interface TikTokMetrics {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  averageEngagementRate: number;
  followerGainThisMonth: number;
  videoViewsThisMonth: number;
  shareRateThisMonth: number;
}

/**
 * Complete TikTok Analytics Data
 */
export interface TikTokAnalytics {
  profile: TikTokProfile;
  metrics: TikTokMetrics;
  lastUpdated: Date;
}

/**
 * TikTok Video Data
 */
export interface TikTokVideo {
  videoId: string;
  description: string;
  videoUrl: string;
  coverImageUrl: string;
  createdAt: Date;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagement: number;
  trendingScore: number;
}

/**
 * Sound/Music Data
 */
export interface TrendingSound {
  soundId: string;
  soundName: string;
  artist: string;
  usageCount: number;
  popularity: number;
  engagement: number;
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
 * Get mock TikTok analytics for testing/demo
 */
export function getMockTikTokAnalytics(username: string = 'artist_creator'): TikTokAnalytics {
  return {
    profile: {
      creatorId: 'tt_creator_123456',
      username,
      displayName: 'Artist Creator',
      profileImageUrl: 'https://via.placeholder.com/150',
      biography: 'Music creator | Dancer | Original sounds 🎵🎬',
      verifiedBadge: true,
      followerCount: 128500,
      followingCount: 456,
      videoCount: 342,
      totalLikes: 3200000,
      profileUrl: `https://www.tiktok.com/@${username}`,
    },
    metrics: {
      totalViews: 45600000,
      totalLikes: 3200000,
      totalComments: 234000,
      totalShares: 89000,
      averageEngagementRate: 7.8,
      followerGainThisMonth: 3450,
      videoViewsThisMonth: 1230000,
      shareRateThisMonth: 2.1,
    },
    lastUpdated: new Date(),
  };
}

/**
 * Get follower growth trend data
 */
export function getFollowerGrowthTrend(daysBack: number = 30): Array<{ date: string; followers: number }> {
  const data: Array<{ date: string; followers: number }> = [];
  const today = new Date();
  const baseFollowers = 123000;

  for (let i = daysBack; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const growth = Math.floor((daysBack - i) * (5500 / daysBack) + Math.random() * 300);
    data.push({
      date: date.toISOString().split('T')[0],
      followers: baseFollowers + growth,
    });
  }

  return data;
}

/**
 * Get video performance trend data
 */
export function getVideoPerformanceTrend(daysBack: number = 30): Array<{ date: string; views: number; likes: number; shares: number }> {
  const data: Array<{ date: string; views: number; likes: number; shares: number }> = [];
  const today = new Date();

  for (let i = daysBack; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const views = Math.floor(Math.random() * 120000 + 30000);
    data.push({
      date: date.toISOString().split('T')[0],
      views,
      likes: Math.floor(views * 0.08),
      shares: Math.floor(views * 0.02),
    });
  }

  return data;
}

/**
 * Get top performing videos
 */
export function getTopVideos(limit: number = 10): TikTokVideo[] {
  const videos: TikTokVideo[] = [];
  const today = new Date();

  for (let i = 0; i < Math.min(limit, 30); i++) {
    const daysAgo = Math.floor(Math.random() * 60);
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    
    const views = Math.floor(Math.random() * 800000 + 50000);
    const engagement = Math.random() * 0.12 + 0.05;
    
    videos.push({
      videoId: `tiktok_${i}`,
      description: `Amazing TikTok content! 🎵 Check out this viral video #FYP #ForYouPage #Trending`,
      videoUrl: `https://www.tiktok.com/@creator/video/${i}`,
      coverImageUrl: `https://via.placeholder.com/300x500?text=Video+${i + 1}`,
      createdAt: date,
      views,
      likes: Math.floor(views * engagement * 0.7),
      comments: Math.floor(views * engagement * 0.2),
      shares: Math.floor(views * engagement * 0.1),
      engagement: engagement * 100,
      trendingScore: Math.random() * 95 + 5,
    });
  }

  return videos.sort((a, b) => b.views - a.views).slice(0, limit);
}

/**
 * Get trending sounds used by creator
 */
export function getTrendingSounds(limit: number = 15): TrendingSound[] {
  const sounds = [
    { name: 'Original Sound #1', artist: 'Creator' },
    { name: 'Trending Beat 2024', artist: 'Producer' },
    { name: 'Viral Hook', artist: 'Musician' },
    { name: 'Epic Drop', artist: 'Creator' },
    { name: 'Summer Vibes', artist: 'Artist' },
    { name: 'Dance Rhythm', artist: 'Creator' },
    { name: 'Chill Beats', artist: 'Producer' },
    { name: 'Hype Music', artist: 'Creator' },
    { name: 'Smooth Jazz', artist: 'Musician' },
    { name: 'Pop Hit', artist: 'Artist' },
    { name: 'Trap Beat', artist: 'Producer' },
    { name: 'Lo-Fi Hip Hop', artist: 'Creator' },
    { name: 'Ambient Sound', artist: 'Musician' },
    { name: 'EDM Track', artist: 'Producer' },
    { name: 'Indie Song', artist: 'Artist' },
  ];

  return sounds
    .slice(0, limit)
    .map((sound, i) => ({
      soundId: `sound_${i}`,
      soundName: sound.name,
      artist: sound.artist,
      usageCount: Math.floor(Math.random() * 500 + 50),
      popularity: Math.random() * 95 + 5,
      engagement: Math.random() * 12 + 3,
    }))
    .sort((a, b) => b.usageCount - a.usageCount);
}

/**
 * Get audience demographic data
 */
export function getAudienceDemographics(): AudienceDemographics {
  return {
    topCountries: [
      { country: 'United States', percentage: 28 },
      { country: 'India', percentage: 18 },
      { country: 'United Kingdom', percentage: 10 },
      { country: 'Canada', percentage: 8 },
      { country: 'Brazil', percentage: 7 },
      { country: 'Mexico', percentage: 6 },
      { country: 'Philippines', percentage: 5 },
      { country: 'Australia', percentage: 4 },
      { country: 'Germany', percentage: 3 },
      { country: 'France', percentage: 3 },
      { country: 'Other', percentage: 10 },
    ],
    genderDistribution: {
      male: 38,
      female: 59,
      other: 3,
    },
    ageGroups: [
      { ageRange: '13-17', percentage: 25 },
      { ageRange: '18-24', percentage: 38 },
      { ageRange: '25-34', percentage: 22 },
      { ageRange: '35-44', percentage: 10 },
      { ageRange: '45-54', percentage: 4 },
      { ageRange: '55+', percentage: 1 },
    ],
    topInterests: [
      { interest: 'Music & Dance', percentage: 42 },
      { interest: 'Entertainment', percentage: 28 },
      { interest: 'Fashion', percentage: 18 },
      { interest: 'Comedy', percentage: 15 },
      { interest: 'Gaming', percentage: 10 },
      { interest: 'Education', percentage: 8 },
    ],
  };
}

/**
 * Fetch TikTok analytics (currently returns mock data)
 * 
 * TODO: Implement real TikTok Research/Business API integration
 * - Use TikTok Research API or TikTok Advertiser API
 * - Fetch creator metrics, video analytics
 * - Cache results with Redis for performance
 * - Handle authentication and token refresh
 */
export async function getTikTokAnalytics(accessToken: string, username: string = 'artist_creator'): Promise<TikTokAnalytics> {
  try {
    // TODO: Replace with real API call
    // const response = await axios.get(
    //   'https://open.tiktokapis.com/v1/creator_info/user/',
    //   { headers: { Authorization: `Bearer ${accessToken}` } }
    // );
    // return transformTikTokProfile(response.data);
    
    // For now, return mock data
    return getMockTikTokAnalytics(username);
  } catch (error) {
    console.error('[tiktok] Failed to fetch analytics:', error);
    // Fallback to mock data on error
    return getMockTikTokAnalytics(username);
  }
}

/**
 * Get engagement metrics over time
 */
export function getEngagementMetrics(daysBack: number = 30): Array<{ date: string; engagement: number; reach: number }> {
  const data: Array<{ date: string; engagement: number; reach: number }> = [];
  const today = new Date();

  for (let i = daysBack; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const reach = Math.floor(Math.random() * 500000 + 200000);
    data.push({
      date: date.toISOString().split('T')[0],
      engagement: Math.random() * 10 + 5,
      reach,
    });
  }

  return data;
}

/**
 * Get hashtag performance data
 */
export function getHashtagPerformance(limit: number = 15): Array<{ hashtag: string; usageCount: number; reach: number; engagement: number }> {
  const hashtags = [
    'FYP', 'ForYouPage', 'Trending', 'MusicProducer', 'Creator',
    'TikTokArtist', 'OriginalSound', 'DanceChallenge', 'MusicChallenge', 'Viral',
    'NewMusic', 'Entertainment', 'DanceWithMe', 'ContentCreator', 'Musician',
  ];

  return hashtags
    .slice(0, limit)
    .map((tag, i) => ({
      hashtag: `#${tag}`,
      usageCount: Math.floor(Math.random() * 300 + 50),
      reach: Math.floor(Math.random() * 2000000 + 500000),
      engagement: Math.random() * 10 + 3,
    }))
    .sort((a, b) => b.reach - a.reach);
}
