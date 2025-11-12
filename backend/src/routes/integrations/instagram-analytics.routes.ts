import { Router, Request, Response } from 'express';
import {
  getMockInstagramAnalytics,
  getFollowerGrowthTrend,
  getEngagementTrend,
  getTopPosts,
  getHashtagPerformance,
  getAudienceDemographics,
  getReachInsights,
  getStoryPerformance,
} from '../../services/instagram/analytics.service';

export const instagramAnalyticsRouter = Router();

/**
 * GET /api/integrations/instagram/analytics
 * Returns comprehensive Instagram analytics for the authenticated user
 * Query params:
 *   - username: The Instagram username (optional, uses authenticated user's profile if not provided)
 *   - includeCharts: Whether to include chart data (default: true)
 *   - includeDemographics: Whether to include demographic data (default: true)
 */
instagramAnalyticsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { username, includeCharts = 'true', includeDemographics = 'true' } = req.query;

    // For now, use a default username or from query
    // In production, this would come from the authenticated user's Instagram connection
    const targetUsername = (username as string) || 'artist_profile';

    // Get basic profile and metrics
    const analytics = getMockInstagramAnalytics(targetUsername);

    // Build response based on requested data
    const response: any = {
      ok: true,
      analytics,
    };

    // Add chart data if requested
    if (includeCharts === 'true') {
      response.charts = {
        followerGrowth: getFollowerGrowthTrend(30),
        engagementTrend: getEngagementTrend(30),
        reachInsights: getReachInsights(30),
        storyPerformance: getStoryPerformance(7),
      };
    }

    // Add post data if requested
    response.topPosts = getTopPosts(10);
    response.hashtags = getHashtagPerformance(15);

    // Add demographic data if requested
    if (includeDemographics === 'true') {
      response.demographics = getAudienceDemographics();
    }

    return res.json(response);
  } catch (error: any) {
    console.error('Instagram analytics error:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to fetch Instagram analytics',
      message: error.message,
    });
  }
});

/**
 * GET /api/integrations/instagram/analytics/follower-growth
 * Returns follower growth trend data
 * Query params:
 *   - days: Number of days to look back (default: 30)
 */
instagramAnalyticsRouter.get('/follower-growth', async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const trend = getFollowerGrowthTrend(days);

    return res.json({
      ok: true,
      trend,
    });
  } catch (error: any) {
    console.error('Follower growth error:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to fetch follower growth data',
      message: error.message,
    });
  }
});

/**
 * GET /api/integrations/instagram/analytics/engagement
 * Returns engagement trend data (likes, comments, shares)
 * Query params:
 *   - days: Number of days to look back (default: 30)
 */
instagramAnalyticsRouter.get('/engagement', async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const trend = getEngagementTrend(days);

    return res.json({
      ok: true,
      trend,
    });
  } catch (error: any) {
    console.error('Engagement trend error:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to fetch engagement data',
      message: error.message,
    });
  }
});

/**
 * GET /api/integrations/instagram/analytics/top-posts
 * Returns top performing posts by engagement
 * Query params:
 *   - limit: Number of posts to return (default: 10, max: 50)
 */
instagramAnalyticsRouter.get('/top-posts', async (req: Request, res: Response) => {
  try {
    let limit = parseInt(req.query.limit as string) || 10;
    limit = Math.min(Math.max(limit, 1), 50); // Clamp between 1 and 50

    const posts = getTopPosts(limit);

    return res.json({
      ok: true,
      posts,
      total: posts.length,
    });
  } catch (error: any) {
    console.error('Top posts error:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to fetch top posts',
      message: error.message,
    });
  }
});

/**
 * GET /api/integrations/instagram/analytics/hashtags
 * Returns hashtag performance data
 * Query params:
 *   - limit: Number of hashtags to return (default: 15, max: 50)
 */
instagramAnalyticsRouter.get('/hashtags', async (req: Request, res: Response) => {
  try {
    let limit = parseInt(req.query.limit as string) || 15;
    limit = Math.min(Math.max(limit, 1), 50);

    const hashtags = getHashtagPerformance(limit);

    return res.json({
      ok: true,
      hashtags,
      total: hashtags.length,
    });
  } catch (error: any) {
    console.error('Hashtags error:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to fetch hashtag performance',
      message: error.message,
    });
  }
});

/**
 * GET /api/integrations/instagram/analytics/reach
 * Returns reach and impressions insights
 * Query params:
 *   - days: Number of days to look back (default: 30)
 */
instagramAnalyticsRouter.get('/reach', async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const insights = getReachInsights(days);

    return res.json({
      ok: true,
      insights,
    });
  } catch (error: any) {
    console.error('Reach insights error:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to fetch reach insights',
      message: error.message,
    });
  }
});

/**
 * GET /api/integrations/instagram/analytics/stories
 * Returns story performance data
 * Query params:
 *   - days: Number of days to look back (default: 7)
 */
instagramAnalyticsRouter.get('/stories', async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 7;
    const performance = getStoryPerformance(days);

    return res.json({
      ok: true,
      performance,
    });
  } catch (error: any) {
    console.error('Stories error:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to fetch story performance',
      message: error.message,
    });
  }
});

/**
 * GET /api/integrations/instagram/analytics/demographics
 * Returns audience demographic information
 */
instagramAnalyticsRouter.get('/demographics', async (req: Request, res: Response) => {
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
