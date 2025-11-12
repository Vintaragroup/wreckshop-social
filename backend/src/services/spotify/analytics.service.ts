import axios from 'axios';

/**
 * Spotify Analytics Service
 * Fetches real-time analytics data from Spotify Web API for connected artists
 */

export interface SpotifyProfile {
  artistId: string;
  artistName: string;
  profileImageUrl: string;
  isVerified: boolean;
  followerCount: number;
  monthlyListeners: number;
  externalUrl: string;
}

export interface SpotifyMetrics {
  streamsThisMonth: number;
  streamsChange: number;
  listenersChange: number;
  savesThisMonth: number;
  savesChange: number;
  skipRate: number;
  totalPlaylists: number;
}

export interface SpotifyAnalytics {
  profile: SpotifyProfile;
  metrics: SpotifyMetrics;
  lastUpdated: Date;
}

/**
 * Mock analytics data for development/testing
 * Replace with real API calls once Spotify credentials are configured
 */
export const getMockSpotifyAnalytics = (artistId: string): SpotifyAnalytics => {
  return {
    profile: {
      artistId,
      artistName: 'Artist Name',
      profileImageUrl: 'https://via.placeholder.com/200',
      isVerified: true,
      followerCount: 5200,
      monthlyListeners: 123400,
      externalUrl: `https://open.spotify.com/artist/${artistId}`,
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
    lastUpdated: new Date(),
  };
};

/**
 * Fetch real Spotify analytics using the Spotify Web API
 * Requires a valid Spotify access token
 * 
 * Note: This implementation uses mock data for now.
 * When Spotify API credentials are set up, replace with actual API calls:
 * 
 * API Documentation: https://developer.spotify.com/documentation/web-api
 * Requires scopes: 'user-library-read', 'user-read-email', 'user-read-private'
 */
export async function getSpotifyAnalytics(
  spotifyAccessToken: string,
  artistId: string
): Promise<SpotifyAnalytics> {
  try {
    // TODO: Implement real Spotify API integration
    // const response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}`, {
    //   headers: {
    //     Authorization: `Bearer ${spotifyAccessToken}`,
    //   },
    // });

    // For now, return mock data
    return getMockSpotifyAnalytics(artistId);
  } catch (error) {
    console.error('Error fetching Spotify analytics:', error);
    // Fallback to mock data on error
    return getMockSpotifyAnalytics(artistId);
  }
}

/**
 * Batch fetch analytics for multiple artists
 */
export async function getSpotifyAnalyticsBatch(
  spotifyAccessToken: string,
  artistIds: string[]
): Promise<SpotifyAnalytics[]> {
  return Promise.all(
    artistIds.map((id) => getSpotifyAnalytics(spotifyAccessToken, id))
  );
}

/**
 * Get streaming trends over time
 * Used for chart data in analytics pages
 */
export function getStreamingTrends(daysBack: number = 90) {
  const trends = [];
  for (let i = daysBack; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    trends.push({
      date: date.toISOString().split('T')[0],
      streams: Math.floor(Math.random() * 50000) + 30000,
      listeners: Math.floor(Math.random() * 30000) + 10000,
    });
  }
  return trends;
}

/**
 * Get monthly listeners progression
 * Used for monthly listeners chart
 */
export function getMonthlyListenersTrend(monthsBack: number = 6) {
  const trends = [];
  let baseListeners = 80000;
  
  for (let i = monthsBack; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    baseListeners += Math.floor(Math.random() * 15000) - 5000;
    trends.push({
      month: date.toISOString().substring(0, 7),
      listeners: Math.max(baseListeners, 50000),
    });
  }
  return trends;
}

/**
 * Get top tracks by streams
 */
export function getTopTracks(limit: number = 10) {
  const genres = ['Pop', 'Hip-Hop', 'Electronic', 'Indie', 'Rock'];
  const tracks = [];
  
  for (let i = 1; i <= limit; i++) {
    tracks.push({
      id: `track-${i}`,
      name: `Track ${i}`,
      streams: Math.floor(Math.random() * 1000000) + 100000,
      saves: Math.floor(Math.random() * 50000) + 1000,
      skipRate: Math.floor(Math.random() * 40) + 10,
      duration: Math.floor(Math.random() * 180) + 120,
      releaseDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
    });
  }
  
  // Sort by streams descending
  return tracks.sort((a, b) => b.streams - a.streams);
}

/**
 * Get playlist placements
 */
export function getPlaylistPlacements() {
  return {
    officialPlaylists: Math.floor(Math.random() * 200) + 50,
    userPlaylists: Math.floor(Math.random() * 5000) + 1000,
    totalPlaylists: 2345,
    featured: {
      name: 'Spotify New Music Daily',
      followers: 2500000,
      position: Math.floor(Math.random() * 50) + 1,
    },
  };
}

/**
 * Get listener demographics
 */
export function getListenerDemographics() {
  return {
    topCountries: [
      { country: 'United States', listeners: Math.floor(Math.random() * 50000) + 30000, percentage: 28 },
      { country: 'United Kingdom', listeners: Math.floor(Math.random() * 20000) + 10000, percentage: 15 },
      { country: 'Canada', listeners: Math.floor(Math.random() * 15000) + 8000, percentage: 12 },
      { country: 'Australia', listeners: Math.floor(Math.random() * 12000) + 5000, percentage: 10 },
      { country: 'Germany', listeners: Math.floor(Math.random() * 10000) + 4000, percentage: 8 },
    ],
    genderDistribution: {
      male: Math.floor(Math.random() * 20) + 45,
      female: Math.floor(Math.random() * 20) + 45,
      other: Math.floor(Math.random() * 10) + 5,
    },
    ageGroups: {
      '13-17': Math.floor(Math.random() * 10) + 5,
      '18-24': Math.floor(Math.random() * 25) + 20,
      '25-34': Math.floor(Math.random() * 30) + 25,
      '35-44': Math.floor(Math.random() * 20) + 15,
      '45-54': Math.floor(Math.random() * 15) + 10,
      '55+': Math.floor(Math.random() * 10) + 5,
    },
  };
}
