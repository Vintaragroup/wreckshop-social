import { Router, Request, Response } from 'express';
import {
  getMockTikTokAnalytics,
  getFollowerGrowthTrend,
  getVideoPerformanceTrend,
  getTopVideos,
  getTrendingSounds,
  getAudienceDemographics,
  getEngagementMetrics,
  getHashtagPerformance,
} from '../../services/tiktok/analytics.service';

export const tiktokAnalyticsRouter = Router();

/**
 * GET /api/integrations/tiktok/analytics
 * Returns comprehensive TikTok analytics
 */
tiktokAnalyticsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { username, includeCharts = 'true', includeDemographics = 'true' } = req.query;
    const targetUsername = (username as string) || 'artist_creator';
    const analytics = getMockTikTokAnalytics(targetUsername);

    const response: any = {
      ok: true,
      analytics,
    };

    if (includeCharts === 'true') {
      response.charts = {
        followerGrowth: getFollowerGrowthTrend(30),
        videoPerformance: getVideoPerformanceTrend(30),
        engagement: getEngagementMetrics(30),
      };
    }

    response.topVideos = getTopVideos(10);
    response.sounds = getTrendingSounds(15);
    response.hashtags = getHashtagPerformance(15);

    if (includeDemographics === 'true') {
      response.demographics = getAudienceDemographics();
    }

    return res.json(response);
  } catch (error: any) {
    console.error('TikTok analytics error:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to fetch TikTok analytics',
      message: error.message,
    });
  }
});

/**
 * GET /api/integrations/tiktok/analytics/followers
 */
tiktokAnalyticsRouter.get('/followers', async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const trend = getFollowerGrowthTrend(days);
    return res.json({ ok: true, trend });
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

/**
 * GET /api/integrations/tiktok/analytics/videos
 */
tiktokAnalyticsRouter.get('/videos', async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const trend = getVideoPerformanceTrend(days);
    return res.json({ ok: true, trend });
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

/**
 * GET /api/integrations/tiktok/analytics/top-videos
 */
tiktokAnalyticsRouter.get('/top-videos', async (req: Request, res: Response) => {
  try {
    let limit = parseInt(req.query.limit as string) || 10;
    limit = Math.min(Math.max(limit, 1), 50);
    const videos = getTopVideos(limit);
    return res.json({ ok: true, videos, total: videos.length });
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

/**
 * GET /api/integrations/tiktok/analytics/sounds
 */
tiktokAnalyticsRouter.get('/sounds', async (req: Request, res: Response) => {
  try {
    let limit = parseInt(req.query.limit as string) || 15;
    limit = Math.min(Math.max(limit, 1), 50);
    const sounds = getTrendingSounds(limit);
    return res.json({ ok: true, sounds, total: sounds.length });
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

/**
 * GET /api/integrations/tiktok/analytics/demographics
 */
tiktokAnalyticsRouter.get('/demographics', async (req: Request, res: Response) => {
  try {
    const demographics = getAudienceDemographics();
    return res.json({ ok: true, demographics });
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message });
  }
});
