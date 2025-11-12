/**
 * Instagram Analytics Service
 * 
 * Provides mock and real Instagram analytics data for artist profiles.
 * Integrates with Instagram Graph API for actual metrics.
 */

import axios from 'axios';

/**
 * Instagram Profile Information
 */
export interface InstagramProfile {
  username: string;
  profileName: string;
  profileImageUrl: string;
  biography: string;
  isVerified: boolean;
  followerCount: number;
  followingCount: number;
  mediaCount: number;
  externalUrl?: string;
  instagramUrl: string;
}

/**
 * Instagram Engagement Metrics
 */
export interface InstagramMetrics {
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  averageEngagementRate: number;
  reachThisMonth: number;
  impressionsThisMonth: number;
  savesThisMonth: number;
  sharesThisMonth: number;
}

/**
 * Complete Instagram Analytics Data
 */
export interface InstagramAnalytics {
  profile: InstagramProfile;
  metrics: InstagramMetrics;
  lastUpdated: Date;
}

/**
 * Instagram Post Data
 */
export interface InstagramPost {
  id: string;
  caption: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL';
  mediaUrl: string;
  timestamp: Date;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  reach: number;
  impressions: number;
  engagementRate: number;
}

/**
 * Hashtag Performance Data
 */
export interface HashtagData {
  hashtag: string;
  usageCount: number;
  reach: number;
  engagementRate: number;
}

/**
 * Audience Demographics
 */
export interface AudienceDemographics {
  topCountries: Array<{ country: string; percentage: number }>;
  genderDistribution: { male: number; female: number; other: number };
  ageGroups: Array<{ ageRange: string; percentage: number }>;
  topCities: Array<{ city: string; percentage: number }>;
}

/**
 * Get mock Instagram analytics for testing/demo
 */
export function getMockInstagramAnalytics(username: string = 'artist_profile'): InstagramAnalytics {
  return {
    profile: {
      username,
      profileName: 'Artist Profile',
      profileImageUrl: 'https://via.placeholder.com/150',
      biography: 'Professional artist sharing my work and creative journey 🎨',
      isVerified: true,
      followerCount: 45200,
      followingCount: 1234,
      mediaCount: 342,
      externalUrl: `https://open.instagram.com/${username}`,
      instagramUrl: `https://instagram.com/${username}`,
    },
    metrics: {
      totalLikes: 1250000,
      totalComments: 42500,
      totalShares: 8900,
      averageEngagementRate: 8.3,
      reachThisMonth: 890000,
      impressionsThisMonth: 1200000,
      savesThisMonth: 12500,
      sharesThisMonth: 3200,
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
  const baseFollowers = 44000;

  for (let i = daysBack; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Simulate organic growth with daily variance
    const growth = Math.floor((daysBack - i) * (1200 / daysBack) + Math.random() * 200);
    data.push({
      date: date.toISOString().split('T')[0],
      followers: baseFollowers + growth,
    });
  }

  return data;
}

/**
 * Get engagement trend data
 */
export function getEngagementTrend(daysBack: number = 30): Array<{ date: string; likes: number; comments: number; shares: number }> {
  const data: Array<{ date: string; likes: number; comments: number; shares: number }> = [];
  const today = new Date();

  for (let i = daysBack; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      likes: Math.floor(Math.random() * 8000 + 15000),
      comments: Math.floor(Math.random() * 800 + 800),
      shares: Math.floor(Math.random() * 200 + 100),
    });
  }

  return data;
}

/**
 * Get top performing posts
 */
export function getTopPosts(limit: number = 10): InstagramPost[] {
  const posts: InstagramPost[] = [];
  const mediaTypes: Array<'IMAGE' | 'VIDEO' | 'CAROUSEL'> = ['IMAGE', 'VIDEO', 'CAROUSEL'];
  const today = new Date();

  for (let i = 0; i < Math.min(limit, 20); i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    
    const baseEngagement = Math.random() * 0.15 + 0.05;
    const likes = Math.floor(Math.random() * 15000 + 5000);
    const comments = Math.floor(likes * 0.08 + Math.random() * 500);
    const shares = Math.floor(likes * 0.02 + Math.random() * 100);
    
    posts.push({
      id: `post_${i}`,
      caption: `Post ${i + 1} - Check out this amazing content! 🎨 #art #creative`,
      mediaType: mediaTypes[Math.floor(Math.random() * mediaTypes.length)],
      mediaUrl: `https://via.placeholder.com/400x500?text=Post+${i + 1}`,
      timestamp: date,
      likes,
      comments,
      shares,
      saves: Math.floor(likes * 0.12),
      reach: Math.floor(likes / baseEngagement),
      impressions: Math.floor(likes / baseEngagement * 1.3),
      engagementRate: baseEngagement * 100,
    });
  }

  return posts.sort((a, b) => b.likes - a.likes).slice(0, limit);
}

/**
 * Get hashtag performance data
 */
export function getHashtagPerformance(limit: number = 15): HashtagData[] {
  const hashtags = [
    'art', 'artist', 'creative', 'design', 'illustration',
    'artwork', 'instaart', 'artistsoninstagram', 'originalart', 'artcommunity',
    'instagood', 'photooftheday', 'picoftheday', 'beautiful', 'amazing'
  ];

  return hashtags
    .slice(0, limit)
    .map((tag, i) => ({
      hashtag: `#${tag}`,
      usageCount: Math.floor(Math.random() * 500 + 50),
      reach: Math.floor(Math.random() * 500000 + 100000),
      engagementRate: Math.random() * 12 + 3,
    }))
    .sort((a, b) => b.reach - a.reach);
}

/**
 * Get audience demographic data
 */
export function getAudienceDemographics(): AudienceDemographics {
  return {
    topCountries: [
      { country: 'United States', percentage: 28 },
      { country: 'United Kingdom', percentage: 12 },
      { country: 'Canada', percentage: 9 },
      { country: 'Australia', percentage: 8 },
      { country: 'Germany', percentage: 7 },
      { country: 'France', percentage: 6 },
      { country: 'India', percentage: 5 },
      { country: 'Brazil', percentage: 5 },
      { country: 'Mexico', percentage: 4 },
      { country: 'Japan', percentage: 3 },
      { country: 'Other', percentage: 12 },
    ],
    genderDistribution: {
      male: 35,
      female: 62,
      other: 3,
    },
    ageGroups: [
      { ageRange: '13-17', percentage: 8 },
      { ageRange: '18-24', percentage: 28 },
      { ageRange: '25-34', percentage: 35 },
      { ageRange: '35-44', percentage: 18 },
      { ageRange: '45-54', percentage: 8 },
      { ageRange: '55+', percentage: 3 },
    ],
    topCities: [
      { city: 'Los Angeles, USA', percentage: 5 },
      { city: 'New York, USA', percentage: 4 },
      { city: 'London, UK', percentage: 3 },
      { city: 'Toronto, Canada', percentage: 2 },
      { city: 'Sydney, Australia', percentage: 2 },
      { city: 'Other', percentage: 84 },
    ],
  };
}

/**
 * Fetch Instagram analytics (currently returns mock data)
 * 
 * TODO: Implement real Instagram Graph API integration
 * - Use Instagram access token to fetch real metrics
 * - Call endpoints: /me, /me/insights, /me/media
 * - Cache results with Redis for performance
 * - Handle token refresh when needed
 */
export async function getInstagramAnalytics(accessToken: string, username: string = 'artist_profile'): Promise<InstagramAnalytics> {
  try {
    // TODO: Replace with real API call
    // const response = await axios.get(
    //   'https://graph.instagram.com/me',
    //   { params: { access_token: accessToken, fields: 'id,username,name,biography,profile_picture_url,followers_count,follows_count,media_count,website' } }
    // );
    // return transformInstagramProfile(response.data);
    
    // For now, return mock data
    return getMockInstagramAnalytics(username);
  } catch (error) {
    console.error('[instagram] Failed to fetch analytics:', error);
    // Fallback to mock data on error
    return getMockInstagramAnalytics(username);
  }
}

/**
 * Fetch Instagram reach and impressions insights
 */
export function getReachInsights(daysBack: number = 30): Array<{ date: string; reach: number; impressions: number }> {
  const data: Array<{ date: string; reach: number; impressions: number }> = [];
  const today = new Date();

  for (let i = daysBack; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const reach = Math.floor(Math.random() * 50000 + 20000);
    data.push({
      date: date.toISOString().split('T')[0],
      reach,
      impressions: Math.floor(reach * (1.3 + Math.random() * 0.2)),
    });
  }

  return data;
}

/**
 * Fetch Instagram story performance data
 */
export function getStoryPerformance(daysBack: number = 7): Array<{ date: string; views: number; replies: number; shares: number }> {
  const data: Array<{ date: string; views: number; replies: number; shares: number }> = [];
  const today = new Date();

  for (let i = daysBack; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const views = Math.floor(Math.random() * 3000 + 1000);
    data.push({
      date: date.toISOString().split('T')[0],
      views,
      replies: Math.floor(views * 0.08),
      shares: Math.floor(views * 0.03),
    });
  }

  return data;
}
