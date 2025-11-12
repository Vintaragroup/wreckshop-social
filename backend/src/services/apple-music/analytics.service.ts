/**
 * Apple Music Analytics Service
 * Fetches analytics data from Apple Music API for connected artists
 */

export interface AppleMusicProfile {
  artistId: string;
  name: string;
  profileImageUrl: string;
  followerCount: number;
  monthlyListeners: number;
  totalPlays: number;
  profileUrl: string;
  topGenre?: string;
  biography?: string;
}

export interface AppleMusicMetrics {
  totalStreams: number;
  totalPlays: number;
  uniqueListeners: number;
  monthlyPlays: number;
  playlistAdditions: number;
  playlistRemovalRate: number;
  averagePlayDuration: number;
  completionRate: number;
  skipRate: number;
  monthlyPlaylistAdds: number;
}

export interface AppleMusicAnalytics {
  profile: AppleMusicProfile;
  metrics: AppleMusicMetrics;
  charts: {
    monthlyStreams: Array<{ month: string; streams: number; listeners: number }>;
    playlistPerformance: Array<{ date: string; additions: number; removals: number; reach: number }>;
    engagement: Array<{ date: string; completionRate: number; skipRate: number; playDuration: number }>;
  };
  topTracks: AppleMusicTrack[];
  topAlbums: AppleMusicAlbum[];
  playlists: PlaylistMetrics[];
  demographics: AudienceDemographics;
}

export interface AppleMusicTrack {
  trackId: string;
  title: string;
  albumTitle: string;
  plays: number;
  streams: number;
  skipRate: number;
  completionRate: number;
  averagePlayDuration: number;
  addedToPlaylists: number;
  releaseDate: string;
  url: string;
}

export interface AppleMusicAlbum {
  albumId: string;
  title: string;
  artwork: string;
  trackCount: number;
  totalPlays: number;
  totalStreams: number;
  totalPlaysThisMonth: number;
  releaseDate: string;
  url: string;
}

export interface PlaylistMetrics {
  playlistId: string;
  name: string;
  curator: string;
  playlistType: 'Editorial' | 'User Generated' | 'Algorithmic';
  playlistArtwork: string;
  plays: number;
  additions: number;
  reach: number;
  skipRate: number;
  url: string;
}

export interface AudienceDemographics {
  topCountries: Array<{ country: string; percentage: number }>;
  genderDistribution: { male: number; female: number; other: number };
  ageGroups: Array<{ ageRange: string; percentage: number }>;
  topGenres: Array<{ genre: string; percentage: number }>;
  listeningTimeOfDay: Array<{ timeRange: string; percentage: number }>;
}

function getMockAppleMusicAnalytics(artistName: string = 'Artist Creator'): AppleMusicAnalytics {
  return {
    profile: {
      artistId: 'am_artist_123456',
      name: artistName,
      profileImageUrl: 'https://via.placeholder.com/150',
      followerCount: 87500,
      monthlyListeners: 142000,
      totalPlays: 8900000,
      topGenre: 'Pop',
      biography: 'Award-winning artist | Music producer | Apple Music featured artist 🎵',
      profileUrl: 'https://music.apple.com/artist/123456',
    },
    metrics: {
      totalStreams: 8900000,
      totalPlays: 8900000,
      uniqueListeners: 142000,
      monthlyPlays: 450000,
      playlistAdditions: 12500,
      playlistRemovalRate: 2.1,
      averagePlayDuration: 3.2,
      completionRate: 78.5,
      skipRate: 8.2,
      monthlyPlaylistAdds: 1850,
    },
    charts: {
      monthlyStreams: [
        { month: 'Aug', streams: 650000, listeners: 125000 },
        { month: 'Sep', streams: 720000, listeners: 135000 },
        { month: 'Oct', streams: 890000, listeners: 142000 },
        { month: 'Nov', streams: 850000, listeners: 138000 },
      ],
      playlistPerformance: Array.from({ length: 30 }, (_, i) => {
        const date = new Date(2025, 10, i + 1);
        return {
          date: date.toISOString().split('T')[0],
          additions: Math.floor(Math.random() * 200 + 50),
          removals: Math.floor(Math.random() * 30 + 5),
          reach: Math.floor(Math.random() * 50000 + 150000),
        };
      }),
      engagement: Array.from({ length: 30 }, (_, i) => {
        const date = new Date(2025, 10, i + 1);
        return {
          date: date.toISOString().split('T')[0],
          completionRate: Math.random() * 20 + 70,
          skipRate: Math.random() * 10 + 5,
          playDuration: Math.random() * 2 + 2.5,
        };
      }),
    },
    topTracks: [
      {
        trackId: 'am_track_1',
        title: 'Hit Single #1',
        albumTitle: 'Latest Album',
        plays: 1250000,
        streams: 1250000,
        skipRate: 5.2,
        completionRate: 92.1,
        averagePlayDuration: 3.45,
        addedToPlaylists: 8500,
        releaseDate: '2025-06-15',
        url: 'https://music.apple.com/track/1',
      },
      {
        trackId: 'am_track_2',
        title: 'Popular Collab',
        albumTitle: 'Collaborations',
        plays: 980000,
        streams: 980000,
        skipRate: 6.8,
        completionRate: 88.3,
        averagePlayDuration: 3.2,
        addedToPlaylists: 6200,
        releaseDate: '2025-08-22',
        url: 'https://music.apple.com/track/2',
      },
      {
        trackId: 'am_track_3',
        title: 'Rising Star Track',
        albumTitle: 'New Releases',
        plays: 750000,
        streams: 750000,
        skipRate: 7.5,
        completionRate: 85.6,
        averagePlayDuration: 3.15,
        addedToPlaylists: 4800,
        releaseDate: '2025-09-10',
        url: 'https://music.apple.com/track/3',
      },
    ],
    topAlbums: [
      {
        albumId: 'am_album_1',
        title: 'Latest Album',
        artwork: 'https://via.placeholder.com/200',
        trackCount: 12,
        totalPlays: 2500000,
        totalStreams: 2500000,
        totalPlaysThisMonth: 450000,
        releaseDate: '2025-06-01',
        url: 'https://music.apple.com/album/1',
      },
      {
        albumId: 'am_album_2',
        title: 'Previous Album',
        artwork: 'https://via.placeholder.com/200',
        trackCount: 14,
        totalPlays: 3100000,
        totalStreams: 3100000,
        totalPlaysThisMonth: 280000,
        releaseDate: '2024-11-15',
        url: 'https://music.apple.com/album/2',
      },
    ],
    playlists: [
      {
        playlistId: 'am_pl_1',
        name: 'All Hits Radio',
        curator: 'Apple Music Editorial',
        playlistType: 'Editorial',
        playlistArtwork: 'https://via.placeholder.com/200',
        plays: 1800000,
        additions: 5200,
        reach: 450000,
        skipRate: 4.2,
        url: 'https://music.apple.com/playlist/1',
      },
      {
        playlistId: 'am_pl_2',
        name: 'Breaking Pop',
        curator: 'Apple Music Editorial',
        playlistType: 'Editorial',
        playlistArtwork: 'https://via.placeholder.com/200',
        plays: 1200000,
        additions: 3800,
        reach: 320000,
        skipRate: 5.1,
        url: 'https://music.apple.com/playlist/2',
      },
      {
        playlistId: 'am_pl_3',
        name: 'New Music Daily',
        curator: 'Apple Music Editorial',
        playlistType: 'Algorithmic',
        playlistArtwork: 'https://via.placeholder.com/200',
        plays: 950000,
        additions: 2900,
        reach: 280000,
        skipRate: 6.3,
        url: 'https://music.apple.com/playlist/3',
      },
    ],
    demographics: {
      topCountries: [
        { country: 'United States', percentage: 35 },
        { country: 'United Kingdom', percentage: 12 },
        { country: 'Canada', percentage: 10 },
        { country: 'Australia', percentage: 8 },
        { country: 'Germany', percentage: 7 },
        { country: 'France', percentage: 6 },
        { country: 'Japan', percentage: 5 },
        { country: 'Mexico', percentage: 4 },
        { country: 'Brazil', percentage: 4 },
        { country: 'Other', percentage: 8 },
      ],
      genderDistribution: { male: 42, female: 55, other: 3 },
      ageGroups: [
        { ageRange: '13-17', percentage: 18 },
        { ageRange: '18-24', percentage: 35 },
        { ageRange: '25-34', percentage: 28 },
        { ageRange: '35-44', percentage: 12 },
        { ageRange: '45-54', percentage: 5 },
        { ageRange: '55+', percentage: 2 },
      ],
      topGenres: [
        { genre: 'Pop', percentage: 42 },
        { genre: 'Rock', percentage: 18 },
        { genre: 'Hip-Hop', percentage: 15 },
        { genre: 'R&B', percentage: 12 },
        { genre: 'Electronic', percentage: 8 },
        { genre: 'Other', percentage: 5 },
      ],
      listeningTimeOfDay: [
        { timeRange: '6am - 12pm', percentage: 22 },
        { timeRange: '12pm - 6pm', percentage: 28 },
        { timeRange: '6pm - 12am', percentage: 38 },
        { timeRange: '12am - 6am', percentage: 12 },
      ],
    },
  };
}

function getMonthlyStreamsTrend(daysBack: number = 90): Array<{ month: string; streams: number; listeners: number }> {
  const months = ['Aug', 'Sep', 'Oct', 'Nov'];
  return months.map((month, idx) => ({
    month,
    streams: Math.floor(Math.random() * 300000 + 600000),
    listeners: Math.floor(Math.random() * 30000 + 120000),
  }));
}

function getPlaylistPerformanceTrend(daysBack: number = 30): Array<{ date: string; additions: number; removals: number; reach: number }> {
  return Array.from({ length: daysBack }, (_, i) => {
    const date = new Date(2025, 10, Math.max(1, i + 13 - daysBack));
    return {
      date: date.toISOString().split('T')[0],
      additions: Math.floor(Math.random() * 200 + 50),
      removals: Math.floor(Math.random() * 30 + 5),
      reach: Math.floor(Math.random() * 50000 + 150000),
    };
  });
}

function getEngagementTrend(daysBack: number = 30): Array<{ date: string; completionRate: number; skipRate: number; playDuration: number }> {
  return Array.from({ length: daysBack }, (_, i) => {
    const date = new Date(2025, 10, Math.max(1, i + 13 - daysBack));
    return {
      date: date.toISOString().split('T')[0],
      completionRate: Math.random() * 20 + 70,
      skipRate: Math.random() * 10 + 5,
      playDuration: Math.random() * 2 + 2.5,
    };
  });
}

function getTopTracks(limit: number = 10): AppleMusicTrack[] {
  return Array.from({ length: Math.min(limit, 3) }, (_, i) => ({
    trackId: `am_track_${i + 1}`,
    title: `Track ${i + 1}`,
    albumTitle: 'Latest Album',
    plays: Math.floor(Math.random() * 500000 + 750000),
    streams: Math.floor(Math.random() * 500000 + 750000),
    skipRate: Math.random() * 10 + 3,
    completionRate: Math.random() * 15 + 80,
    averagePlayDuration: Math.random() * 1 + 2.8,
    addedToPlaylists: Math.floor(Math.random() * 5000 + 3000),
    releaseDate: new Date(2025, Math.floor(Math.random() * 6), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    url: `https://music.apple.com/track/${i + 1}`,
  }));
}

function getTopAlbums(limit: number = 5): AppleMusicAlbum[] {
  return Array.from({ length: Math.min(limit, 2) }, (_, i) => ({
    albumId: `am_album_${i + 1}`,
    title: `Album ${i + 1}`,
    artwork: 'https://via.placeholder.com/200',
    trackCount: Math.floor(Math.random() * 8 + 10),
    totalPlays: Math.floor(Math.random() * 1000000 + 2000000),
    totalStreams: Math.floor(Math.random() * 1000000 + 2000000),
    totalPlaysThisMonth: Math.floor(Math.random() * 300000 + 200000),
    releaseDate: new Date(2024 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    url: `https://music.apple.com/album/${i + 1}`,
  }));
}

function getPlaylistMetrics(limit: number = 10): PlaylistMetrics[] {
  const playlistTypes: Array<'Editorial' | 'User Generated' | 'Algorithmic'> = ['Editorial', 'Algorithmic', 'User Generated'];
  return Array.from({ length: Math.min(limit, 3) }, (_, i) => ({
    playlistId: `am_pl_${i + 1}`,
    name: `Playlist ${i + 1}`,
    curator: i === 0 ? 'Apple Music Editorial' : 'User Generated',
    playlistType: playlistTypes[i % 3],
    playlistArtwork: 'https://via.placeholder.com/200',
    plays: Math.floor(Math.random() * 500000 + 800000),
    additions: Math.floor(Math.random() * 3000 + 2000),
    reach: Math.floor(Math.random() * 100000 + 250000),
    skipRate: Math.random() * 8 + 2,
    url: `https://music.apple.com/playlist/${i + 1}`,
  }));
}

function getAudienceDemographics(): AudienceDemographics {
  return {
    topCountries: [
      { country: 'United States', percentage: 35 },
      { country: 'United Kingdom', percentage: 12 },
      { country: 'Canada', percentage: 10 },
      { country: 'Australia', percentage: 8 },
      { country: 'Germany', percentage: 7 },
      { country: 'France', percentage: 6 },
      { country: 'Japan', percentage: 5 },
      { country: 'Mexico', percentage: 4 },
      { country: 'Brazil', percentage: 4 },
      { country: 'Other', percentage: 8 },
    ],
    genderDistribution: { male: 42, female: 55, other: 3 },
    ageGroups: [
      { ageRange: '13-17', percentage: 18 },
      { ageRange: '18-24', percentage: 35 },
      { ageRange: '25-34', percentage: 28 },
      { ageRange: '35-44', percentage: 12 },
      { ageRange: '45-54', percentage: 5 },
      { ageRange: '55+', percentage: 2 },
    ],
    topGenres: [
      { genre: 'Pop', percentage: 42 },
      { genre: 'Rock', percentage: 18 },
      { genre: 'Hip-Hop', percentage: 15 },
      { genre: 'R&B', percentage: 12 },
      { genre: 'Electronic', percentage: 8 },
      { genre: 'Other', percentage: 5 },
    ],
    listeningTimeOfDay: [
      { timeRange: '6am - 12pm', percentage: 22 },
      { timeRange: '12pm - 6pm', percentage: 28 },
      { timeRange: '6pm - 12am', percentage: 38 },
      { timeRange: '12am - 6am', percentage: 12 },
    ],
  };
}

export async function getAppleMusicAnalytics(token: string, artistName: string = 'Artist Creator'): Promise<AppleMusicAnalytics> {
  try {
    // TODO: When real API integration is ready, replace with actual API call
    // const response = await fetch('https://api.music.apple.com/v1/...', {
    //   headers: { 'Authorization': `Bearer ${token}` }
    // });
    // const data = await response.json();
    // return transformAppleMusicResponse(data);

    return getMockAppleMusicAnalytics(artistName);
  } catch (error) {
    return getMockAppleMusicAnalytics(artistName);
  }
}

export {
  getMockAppleMusicAnalytics,
  getMonthlyStreamsTrend,
  getPlaylistPerformanceTrend,
  getEngagementTrend,
  getTopTracks,
  getTopAlbums,
  getPlaylistMetrics,
  getAudienceDemographics,
};
