import { Router, Request, Response } from 'express';
import { appleMusicAnalyticsRouter } from './apple-music-analytics.routes';

const appleMusicIntegrationRouter = Router();

// Mount analytics routes first (before generic routes to prevent catch-all matching)
appleMusicIntegrationRouter.use('/apple-music/analytics', appleMusicAnalyticsRouter);

// POST /api/integrations/apple-music
// Connect Apple Music account
appleMusicIntegrationRouter.post('/apple-music', async (req: Request, res: Response) => {
  try {
    const { artistName, accessToken } = req.body;

    if (!artistName || !accessToken) {
      return res.status(400).json({ ok: false, error: 'Artist name and access token are required' });
    }

    // TODO: Validate token with Apple Music API
    // TODO: Save integration to database with: userId, artistName, accessToken, connectedAt

    res.json({
      ok: true,
      message: 'Apple Music account connected successfully',
      integration: {
        platform: 'apple-music',
        artistName,
        connectedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Error connecting Apple Music account:', error);
    res.status(500).json({ ok: false, error: 'Failed to connect Apple Music account' });
  }
});

// GET /api/integrations/apple-music/:artistId
// Get Apple Music integration details
appleMusicIntegrationRouter.get('/apple-music/:artistId', async (req: Request, res: Response) => {
  try {
    const { artistId } = req.params;

    // TODO: Fetch from database: SELECT * FROM "IntegrationAppleMusic" WHERE "artistId" = $1

    res.json({
      ok: true,
      integration: {
        platform: 'apple-music',
        artistId,
        artistName: 'Artist Creator',
        isConnected: true,
        connectedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    });
  } catch (error) {
    console.error('Error fetching Apple Music integration:', error);
    res.status(500).json({ ok: false, error: 'Failed to fetch Apple Music integration' });
  }
});

// DELETE /api/integrations/apple-music/:artistId
// Disconnect Apple Music account
appleMusicIntegrationRouter.delete('/apple-music/:artistId', async (req: Request, res: Response) => {
  try {
    const { artistId } = req.params;

    // TODO: Delete from database: DELETE FROM "IntegrationAppleMusic" WHERE "artistId" = $1

    res.json({
      ok: true,
      message: 'Apple Music account disconnected successfully',
    });
  } catch (error) {
    console.error('Error disconnecting Apple Music account:', error);
    res.status(500).json({ ok: false, error: 'Failed to disconnect Apple Music account' });
  }
});

export { appleMusicIntegrationRouter };
