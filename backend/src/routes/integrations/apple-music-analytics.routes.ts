import { Router, Request, Response } from 'express';
import {
  getAppleMusicAnalytics,
  getMonthlyStreamsTrend,
  getPlaylistPerformanceTrend,
  getEngagementTrend,
  getTopTracks,
  getTopAlbums,
  getPlaylistMetrics,
  getAudienceDemographics,
} from '../../services/apple-music/analytics.service';

const appleMusicAnalyticsRouter = Router();

// GET /api/integrations/apple-music/analytics
// Main analytics endpoint with all data
appleMusicAnalyticsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const includeCharts = req.query.includeCharts === 'true';
    const analytics = await getAppleMusicAnalytics('token_placeholder', 'Artist Creator');

    if (includeCharts) {
      return res.json({
        ok: true,
        analytics: {
          ...analytics,
          charts: {
            monthlyStreams: getMonthlyStreamsTrend(),
            playlistPerformance: getPlaylistPerformanceTrend(),
            engagement: getEngagementTrend(),
          },
        },
      });
    }

    res.json({
      ok: true,
      analytics: {
        profile: analytics.profile,
        metrics: analytics.metrics,
      },
    });
  } catch (error) {
    console.error('Error fetching Apple Music analytics:', error);
    res.status(500).json({ ok: false, error: 'Failed to fetch Apple Music analytics' });
  }
});

// GET /api/integrations/apple-music/analytics/streams
// Monthly streaming trends
appleMusicAnalyticsRouter.get('/streams', async (req: Request, res: Response) => {
  try {
    const daysBack = parseInt(req.query.days as string) || 90;
    const data = getMonthlyStreamsTrend(daysBack);

    res.json({
      ok: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching monthly streams:', error);
    res.status(500).json({ ok: false, error: 'Failed to fetch monthly streams' });
  }
});

// GET /api/integrations/apple-music/analytics/playlists
// Playlist performance trends
appleMusicAnalyticsRouter.get('/playlists', async (req: Request, res: Response) => {
  try {
    const daysBack = parseInt(req.query.days as string) || 30;
    const data = getPlaylistPerformanceTrend(daysBack);

    res.json({
      ok: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching playlist performance:', error);
    res.status(500).json({ ok: false, error: 'Failed to fetch playlist performance' });
  }
});

// GET /api/integrations/apple-music/analytics/engagement
// Engagement metrics trends
appleMusicAnalyticsRouter.get('/engagement', async (req: Request, res: Response) => {
  try {
    const daysBack = parseInt(req.query.days as string) || 30;
    const data = getEngagementTrend(daysBack);

    res.json({
      ok: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching engagement data:', error);
    res.status(500).json({ ok: false, error: 'Failed to fetch engagement data' });
  }
});

// GET /api/integrations/apple-music/analytics/top-tracks
// Top performing tracks
appleMusicAnalyticsRouter.get('/top-tracks', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const data = getTopTracks(limit);

    res.json({
      ok: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching top tracks:', error);
    res.status(500).json({ ok: false, error: 'Failed to fetch top tracks' });
  }
});

// GET /api/integrations/apple-music/analytics/top-albums
// Top performing albums
appleMusicAnalyticsRouter.get('/top-albums', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 5;
    const data = getTopAlbums(limit);

    res.json({
      ok: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching top albums:', error);
    res.status(500).json({ ok: false, error: 'Failed to fetch top albums' });
  }
});

// GET /api/integrations/apple-music/analytics/playlists-list
// Playlist inclusion metrics
appleMusicAnalyticsRouter.get('/playlists-list', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const data = getPlaylistMetrics(limit);

    res.json({
      ok: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching playlist metrics:', error);
    res.status(500).json({ ok: false, error: 'Failed to fetch playlist metrics' });
  }
});

// GET /api/integrations/apple-music/analytics/demographics
// Audience demographics
appleMusicAnalyticsRouter.get('/demographics', async (req: Request, res: Response) => {
  try {
    const data = getAudienceDemographics();

    res.json({
      ok: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching demographics:', error);
    res.status(500).json({ ok: false, error: 'Failed to fetch demographics' });
  }
});

export { appleMusicAnalyticsRouter };
