import { Router, Request, Response } from 'express';
import {
  getMockYouTubeAnalytics,
  getSubscriberGrowthTrend,
  getViewsTrend,
  getTopVideos,
  getTrafficSources,
  getAudienceDemographics,
  getEngagementMetrics,
  getAudienceRetention,
  getPlaylistPerformance,
} from '../../services/youtube/analytics.service';

export const youtubeAnalyticsRouter = Router();

/**
 * GET /api/integrations/youtube/analytics
 * Returns comprehensive YouTube analytics for the authenticated user's channel
 * Query params:
 *   - channelTitle: The YouTube channel title (optional, uses default if not provided)
 *   - includeCharts: Whether to include chart data (default: true)
 *   - includeDemographics: Whether to include demographic data (default: true)
 */
youtubeAnalyticsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { channelTitle, includeCharts = 'true', includeDemographics = 'true' } = req.query;

    // For now, use a default channel title or from query
    // In production, this would come from the authenticated user's YouTube connection
    const targetChannelTitle = (channelTitle as string) || 'Artist Channel';

    // Get basic profile and metrics
    const analytics = getMockYouTubeAnalytics(targetChannelTitle);

    // Build response based on requested data
    const response: any = {
      ok: true,
      analytics,
    };

    // Add chart data if requested
    if (includeCharts === 'true') {
      response.charts = {
        subscriberGrowth: getSubscriberGrowthTrend(90),
        viewsTrend: getViewsTrend(90),
        engagementMetrics: getEngagementMetrics(30),
      };
    }

    // Add video data
    response.topVideos = getTopVideos(10);
    response.trafficSources = getTrafficSources();
    response.playlists = getPlaylistPerformance(10);

    // Add demographic data if requested
    if (includeDemographics === 'true') {
      response.demographics = getAudienceDemographics();
    }

    return res.json(response);
  } catch (error: any) {
    console.error('YouTube analytics error:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to fetch YouTube analytics',
      message: error.message,
    });
  }
});

/**
 * GET /api/integrations/youtube/analytics/subscribers
 * Returns subscriber growth trend data
 * Query params:
 *   - days: Number of days to look back (default: 90)
 */
youtubeAnalyticsRouter.get('/subscribers', async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 90;
    const trend = getSubscriberGrowthTrend(days);

    return res.json({
      ok: true,
      trend,
    });
  } catch (error: any) {
    console.error('Subscriber growth error:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to fetch subscriber growth data',
      message: error.message,
    });
  }
});

/**
 * GET /api/integrations/youtube/analytics/views
 * Returns views and watch time trend data
 * Query params:
 *   - days: Number of days to look back (default: 90)
 */
youtubeAnalyticsRouter.get('/views', async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 90;
    const trend = getViewsTrend(days);

    return res.json({
      ok: true,
      trend,
    });
  } catch (error: any) {
    console.error('Views trend error:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to fetch views trend data',
      message: error.message,
    });
  }
});

/**
 * GET /api/integrations/youtube/analytics/top-videos
 * Returns top performing videos by views
 * Query params:
 *   - limit: Number of videos to return (default: 10, max: 50)
 */
youtubeAnalyticsRouter.get('/top-videos', async (req: Request, res: Response) => {
  try {
    let limit = parseInt(req.query.limit as string) || 10;
    limit = Math.min(Math.max(limit, 1), 50);

    const videos = getTopVideos(limit);

    return res.json({
      ok: true,
      videos,
      total: videos.length,
    });
  } catch (error: any) {
    console.error('Top videos error:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to fetch top videos',
      message: error.message,
    });
  }
});

/**
 * GET /api/integrations/youtube/analytics/traffic
 * Returns traffic source data
 */
youtubeAnalyticsRouter.get('/traffic', async (req: Request, res: Response) => {
  try {
    const sources = getTrafficSources();

    return res.json({
      ok: true,
      sources,
    });
  } catch (error: any) {
    console.error('Traffic sources error:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to fetch traffic source data',
      message: error.message,
    });
  }
});

/**
 * GET /api/integrations/youtube/analytics/engagement
 * Returns engagement metrics (likes, comments, shares)
 * Query params:
 *   - days: Number of days to look back (default: 30)
 */
youtubeAnalyticsRouter.get('/engagement', async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const metrics = getEngagementMetrics(days);

    return res.json({
      ok: true,
      metrics,
    });
  } catch (error: any) {
    console.error('Engagement metrics error:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to fetch engagement metrics',
      message: error.message,
    });
  }
});

/**
 * GET /api/integrations/youtube/analytics/retention
 * Returns audience retention data for videos
 * Query params:
 *   - duration: Video duration in minutes (default: 10)
 */
youtubeAnalyticsRouter.get('/retention', async (req: Request, res: Response) => {
  try {
    const duration = parseInt(req.query.duration as string) || 10;
    const retention = getAudienceRetention(duration);

    return res.json({
      ok: true,
      retention,
    });
  } catch (error: any) {
    console.error('Audience retention error:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to fetch audience retention data',
      message: error.message,
    });
  }
});

/**
 * GET /api/integrations/youtube/analytics/playlists
 * Returns playlist performance data
 * Query params:
 *   - limit: Number of playlists to return (default: 10, max: 50)
 */
youtubeAnalyticsRouter.get('/playlists', async (req: Request, res: Response) => {
  try {
    let limit = parseInt(req.query.limit as string) || 10;
    limit = Math.min(Math.max(limit, 1), 50);

    const playlists = getPlaylistPerformance(limit);

    return res.json({
      ok: true,
      playlists,
      total: playlists.length,
    });
  } catch (error: any) {
    console.error('Playlists error:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to fetch playlist performance',
      message: error.message,
    });
  }
});

/**
 * GET /api/integrations/youtube/analytics/demographics
 * Returns audience demographic information
 */
youtubeAnalyticsRouter.get('/demographics', async (req: Request, res: Response) => {
  try {
    const demographics = getAudienceDemographics();

    return res.json({
      ok: true,
      demographics,
    });
  } catch (error: any) {
    console.error('Demographics error:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to fetch audience demographics',
      message: error.message,
    });
  }
});
