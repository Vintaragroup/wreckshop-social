import { Router, Request, Response } from 'express';
import prisma from '../../lib/prisma';
import {
  getMockSpotifyAnalytics,
  getSpotifyAnalytics,
  getStreamingTrends,
  getMonthlyListenersTrend,
  getTopTracks,
  getPlaylistPlacements,
  getListenerDemographics,
} from '../../services/spotify/analytics.service';

export const spotifyAnalyticsRouter = Router();

/**
 * GET /api/integrations/spotify/analytics
 * Returns comprehensive Spotify analytics for the authenticated user
 * Query params:
 *   - artistId: The Spotify artist ID (optional, uses authenticated user's artist profile if not provided)
 *   - includeCharts: Whether to include chart data (default: true)
 *   - includeDemographics: Whether to include demographic data (default: true)
 */
spotifyAnalyticsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { artistId, includeCharts = 'true', includeDemographics = 'true' } = req.query;

    // Get the artist ID from authenticated user or use provided one
    // Using Drake's artist ID by default for demo
    const targetArtistId = (artistId as string) || '6l3HvQ5sFLRc6mFBixwBKt';

    // Fetch real Spotify analytics using client credentials
    console.log(`[Spotify Analytics] Fetching data for artist: ${targetArtistId}`);
    const analytics = await getSpotifyAnalytics(null, targetArtistId);
    console.log(`[Spotify Analytics] Got artist: ${analytics.profile.artistName}`);

    // Build response based on requested data
    const response: any = {
      ok: true,
      analytics,
    };

    // Add chart data if requested
    if (includeCharts === 'true') {
      response.charts = {
        streamingTrends: getStreamingTrends(90),
        monthlyListenersTrend: getMonthlyListenersTrend(6),
        playlistPlacements: getPlaylistPlacements(),
      };
    }

    // Add demographic data if requested
    if (includeDemographics === 'true') {
      response.demographics = getListenerDemographics();
    }

    return res.json(response);
  } catch (error: any) {
    console.error('[Spotify Analytics] Error:', error.message);
    res.status(500).json({
      ok: false,
      error: 'Failed to fetch Spotify analytics',
      message: error.message,
    });
  }
});

/**
 * GET /api/integrations/spotify/analytics/trends
 * Returns streaming trends for charts
 * Query params:
 *   - days: Number of days to look back (default: 90)
 */
spotifyAnalyticsRouter.get('/trends', async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 90;
    const trends = getStreamingTrends(days);

    return res.json({
      ok: true,
      trends,
    });
  } catch (error: any) {
    console.error('Spotify trends error:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to fetch streaming trends',
      message: error.message,
    });
  }
});

/**
 * GET /api/integrations/spotify/analytics/monthly-listeners
 * Returns monthly listener progression
 * Query params:
 *   - months: Number of months to look back (default: 6)
 */
spotifyAnalyticsRouter.get('/monthly-listeners', async (req: Request, res: Response) => {
  try {
    const months = parseInt(req.query.months as string) || 6;
    const trend = getMonthlyListenersTrend(months);

    return res.json({
      ok: true,
      trend,
    });
  } catch (error: any) {
    console.error('Monthly listeners error:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to fetch monthly listeners trend',
      message: error.message,
    });
  }
});

/**
 * GET /api/integrations/spotify/analytics/top-tracks
 * Returns top tracks by streams
 * Query params:
 *   - limit: Number of tracks to return (default: 10, max: 50)
 */
spotifyAnalyticsRouter.get('/top-tracks', async (req: Request, res: Response) => {
  try {
    let limit = parseInt(req.query.limit as string) || 10;
    limit = Math.min(Math.max(limit, 1), 50); // Clamp between 1 and 50

    // For now, use mock top tracks since user token storage needs to be implemented
    // TODO: Fetch user's Spotify integration to get access token
    // const topTracks = await getTopTracks(accessToken, limit);
    
    const mockTracks = [
      {
        id: 'track-1',
        name: 'Top Track 1',
        streams: 1500000,
        saves: 45000,
        skipRate: 12.5,
        duration: 210000,
        releaseDate: new Date('2024-06-15'),
        artistNames: 'Artist Name',
        albumName: 'Album Name',
        imageUrl: 'https://via.placeholder.com/200',
        externalUrl: 'https://open.spotify.com/track/1',
      },
      {
        id: 'track-2',
        name: 'Top Track 2',
        streams: 1200000,
        saves: 38000,
        skipRate: 14.2,
        duration: 195000,
        releaseDate: new Date('2024-07-20'),
        artistNames: 'Artist Name',
        albumName: 'Album Name',
        imageUrl: 'https://via.placeholder.com/200',
        externalUrl: 'https://open.spotify.com/track/2',
      },
    ];

    return res.json({
      ok: true,
      tracks: mockTracks,
      total: mockTracks.length,
    });
  } catch (error: any) {
    console.error('Top tracks error:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to fetch top tracks',
      message: error.message,
    });
  }
});

/**
 * GET /api/integrations/spotify/analytics/demographics
 * Returns listener demographic information
 */
spotifyAnalyticsRouter.get('/demographics', async (req: Request, res: Response) => {
  try {
    const demographics = getListenerDemographics();

    return res.json({
      ok: true,
      demographics,
    });
  } catch (error: any) {
    console.error('Demographics error:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to fetch listener demographics',
      message: error.message,
    });
  }
});
