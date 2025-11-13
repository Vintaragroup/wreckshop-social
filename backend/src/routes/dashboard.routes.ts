/**
 * Dashboard Routes
 * 
 * Routes for:
 * - Manager dashboards showing aggregate metrics
 * - Artist leaderboards
 * - Public discovery and trending
 * 
 * All endpoints support caching for performance
 */

import { Router, Request, Response } from 'express';
import { authenticateJWT, optionalAuth } from '../lib/middleware/auth.middleware';
import { getFromCache, setInCache, cacheKeys, cacheTTL } from '../lib/cache';
import { prisma } from '../lib/prisma';

export const dashboardRoutes = Router();

// ============================================
// Manager Dashboard Endpoints
// ============================================

/**
 * GET /api/dashboard/manager
 * 
 * Get manager dashboard overview with aggregate metrics for all managed artists
 * Requires authentication
 * 
 * Response:
 * {
 *   ok: true,
 *   data: {
 *     totalArtistsManaged: number,
 *     totalFollowers: number,
 *     totalEngagementRate: number,
 *     topArtist: { id, stageName, followers },
 *     recentActivity: [{ artist, action, timestamp }],
 *     byStatus: { ACTIVE, PENDING, INACTIVE, REJECTED }
 *   }
 * }
 */
dashboardRoutes.get('/dashboard/manager', authenticateJWT, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const cacheKey = cacheKeys.managerOverview(req.user.id);
    const cached = await getFromCache(cacheKey);
    if (cached) {
      return res.json({ ok: true, data: cached });
    }

    // Get all managed artists
    const managedArtists = await prisma.managerArtist.findMany({
      where: { managerId: req.user.id },
      include: {
        artist: {
          select: {
            id: true,
            stageName: true,
            email: true,
            leaderboardScore: true,
          },
        },
      },
    });

    // Calculate aggregate metrics
    const byStatus = {
      ACTIVE: managedArtists.filter((m: any) => m.status === 'ACTIVE').length,
      PENDING: managedArtists.filter((m: any) => m.status === 'PENDING').length,
      INACTIVE: managedArtists.filter((m: any) => m.status === 'INACTIVE').length,
      REJECTED: managedArtists.filter((m: any) => m.status === 'REJECTED').length,
    };

    // Get top artist by leaderboard score
    const topArtist =
      managedArtists.length > 0
        ? managedArtists.reduce((prev: any, current: any) =>
            (current.artist.leaderboardScore || 0) > (prev.artist.leaderboardScore || 0)
              ? current
              : prev
          ).artist
        : null;

    const data = {
      totalArtistsManaged: managedArtists.length,
      totalFollowers: 0, // Would aggregate from integrations
      totalEngagementRate: 0, // Would aggregate from integrations
      topArtist,
      recentActivity: [], // Would come from audit logs
      byStatus,
    };

    // Cache for 5 minutes
    await setInCache(cacheKey, data, cacheTTL.ARTIST_STATS);

    res.json({ ok: true, data });
  } catch (error) {
    console.error('[dashboard] Error fetching manager overview:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// Leaderboard Endpoints
// ============================================

/**
 * GET /api/dashboard/leaderboard
 * 
 * Get artist leaderboard by various metrics
 * Public endpoint
 * 
 * Query params:
 * - metric: "followers" | "engagement" | "monthlyListeners" | "leaderboardScore" (default)
 * - genre: filter by genre (optional)
 * - limit: max results (default 50, max 100)
 * - timeframe: "all-time" | "month" | "week" (default all-time)
 * 
 * Response:
 * {
 *   ok: true,
 *   data: [
 *     {
 *       rank: number,
 *       id: string,
 *       stageName: string,
 *       metric: number,
 *       genres: string[]
 *     }
 *   ]
 * }
 */
dashboardRoutes.get('/dashboard/leaderboard', optionalAuth, async (req: Request, res: Response) => {
  try {
    const metric = (req.query.metric as string) || 'leaderboardScore';
    const genre = req.query.genre as string | undefined;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const timeframe = (req.query.timeframe as string) || 'all-time';

    // Build cache key
    const cacheKey = genre
      ? cacheKeys.leaderboardByGenre(metric, genre, limit)
      : cacheKeys.leaderboard(metric, limit);

    const cached = await getFromCache(cacheKey);
    if (cached) {
      return res.json({ ok: true, data: cached });
    }

    // Build query
    const where: any = { isVerified: true };
    if (genre) {
      where.genres = { has: genre };
    }

    // Get artists sorted by metric
    const artists = await prisma.artist.findMany({
      where,
      select: {
        id: true,
        stageName: true,
        leaderboardScore: true,
        leaderboardRank: true,
        genres: true,
      },
      orderBy: { leaderboardScore: 'desc' },
      take: limit,
    });

    // Format response with ranks
    const data = artists.map((artist: any, index: number) => ({
      rank: index + 1,
      id: artist.id,
      stageName: artist.stageName,
      score: artist.leaderboardScore,
      genres: artist.genres,
    }));

    // Cache for 1 hour
    await setInCache(cacheKey, data, cacheTTL.LEADERBOARD);

    res.json({ ok: true, data });
  } catch (error) {
    console.error('[dashboard] Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// Discovery & Trending Endpoints
// ============================================

/**
 * GET /api/dashboard/trending
 * 
 * Get trending artists
 * Public endpoint
 * 
 * Query params:
 * - timeframe: "week" | "month" | "all-time" (default: week)
 * - limit: max results (default 20, max 50)
 * 
 * Response:
 * {
 *   ok: true,
 *   data: [
 *     {
 *       id: string,
 *       stageName: string,
 *       genres: string[],
 *       score: number,
 *       trend: "up" | "down" | "stable"
 *     }
 *   ]
 * }
 */
dashboardRoutes.get('/dashboard/trending', optionalAuth, async (req: Request, res: Response) => {
  try {
    const timeframe = (req.query.timeframe as string) || 'week';
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);

    const cacheKey = cacheKeys.trending(timeframe);
    const cached = await getFromCache(cacheKey);
    if (cached) {
      return res.json({ ok: true, data: cached });
    }

    // Get recently verified/updated artists
    const artists = await prisma.artist.findMany({
      where: { isVerified: true },
      select: {
        id: true,
        stageName: true,
        genres: true,
        leaderboardScore: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
      take: limit,
    });

    const data = artists.map((artist: any) => ({
      id: artist.id,
      stageName: artist.stageName,
      genres: artist.genres,
      score: artist.leaderboardScore,
      trend: 'up' as const, // Would calculate from historical data
    }));

    // Cache for 30 minutes
    await setInCache(cacheKey, data, cacheTTL.TRENDING);

    res.json({ ok: true, data });
  } catch (error) {
    console.error('[dashboard] Error fetching trending:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/dashboard/discover
 * 
 * Discover artists by genre or other filters
 * Public endpoint
 * 
 * Query params:
 * - genre: genre to filter by (required)
 * - limit: max results (default 20, max 100)
 * - page: pagination (default 0)
 * 
 * Response:
 * {
 *   ok: true,
 *   data: [
 *     {
 *       id: string,
 *       stageName: string,
 *       genres: string[],
 *       regions: string[],
 *       score: number
 *     }
 *   ],
 *   total: number
 * }
 */
dashboardRoutes.get('/dashboard/discover', optionalAuth, async (req: Request, res: Response) => {
  try {
    const genre = req.query.genre as string | undefined;
    if (!genre) {
      return res.status(400).json({
        error: 'Bad request',
        message: 'genre query parameter required',
      });
    }

    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const page = parseInt(req.query.page as string) || 0;

    const cacheKey = cacheKeys.byGenre(genre, limit);
    const cached = await getFromCache<{ data: any[]; total: number }>(cacheKey);
    if (cached) {
      return res.json({ ok: true, data: cached.data, total: cached.total });
    }

    // Get artists by genre
    const [artists, total] = await Promise.all([
      prisma.artist.findMany({
        where: {
          genres: { has: genre },
          isVerified: true,
        },
        select: {
          id: true,
          stageName: true,
          genres: true,
          region: true,
          leaderboardScore: true,
        },
        orderBy: { leaderboardScore: 'desc' },
        take: limit,
        skip: page * limit,
      }),
      prisma.artist.count({
        where: {
          genres: { has: genre },
          isVerified: true,
        },
      }),
    ]);

    const data = artists.map((artist: any) => ({
      id: artist.id,
      stageName: artist.stageName,
      genres: artist.genres,
      region: artist.region,
      score: artist.leaderboardScore,
    }));

    const result = { data, total };
    await setInCache(cacheKey, result, cacheTTL.DISCOVERY);

    res.json({ ok: true, data, total });
  } catch (error) {
    console.error('[dashboard] Error discovering artists:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// Public Artist Profile Endpoints
// ============================================

/**
 * GET /api/dashboard/artists/:artistId
 * 
 * Get public artist profile
 * Public endpoint (cached)
 * 
 * Response:
 * {
 *   ok: true,
 *   data: {
 *     id: string,
 *     stageName: string,
 *     bio?: string,
 *     genres: string[],
 *     niches: string[],
 *     region?: string,
 *     leaderboardScore: number,
 *     leaderboardRank?: number,
 *     isVerified: boolean,
 *     profilePictureUrl?: string,
 *     integrations: {
 *       spotify?: { followers, monthlyListeners },
 *       instagram?: { followers, engagementRate },
 *       youtube?: { subscribers, totalViews },
 *       tiktok?: { followers }
 *     }
 *   }
 * }
 */
dashboardRoutes.get(
  '/dashboard/artists/:artistId',
  optionalAuth,
  async (req: Request, res: Response) => {
    try {
      const { artistId } = req.params;

      const cacheKey = cacheKeys.artistProfile(artistId);
      const cached = await getFromCache(cacheKey);
      if (cached) {
        return res.json({ ok: true, data: cached });
      }

      // Get artist with integrations
      const [artist, spotify, instagram, youtube, tiktok] = await Promise.all([
        prisma.artist.findUnique({
          where: { id: artistId },
          select: {
            id: true,
            stageName: true,
            bio: true,
            genres: true,
            niches: true,
            region: true,
            leaderboardScore: true,
            leaderboardRank: true,
            isVerified: true,
            profilePictureUrl: true,
          },
        }),
        prisma.spotifyIntegration.findFirst({
          where: { artistId },
          select: { followers: true, monthlyListeners: true },
        }),
        prisma.instagramIntegration.findFirst({
          where: { artistId },
          select: { followers: true, engagementRate: true },
        }),
        prisma.youtubeIntegration.findFirst({
          where: { artistId },
          select: { subscribers: true, totalViews: true },
        }),
        prisma.tikTokIntegration.findFirst({
          where: { artistId },
          select: { followers: true },
        }),
      ]);

      if (!artist) {
        return res.status(404).json({ error: 'Artist not found' });
      }

      const data: any = { ...artist };
      data.integrations = {};
      if (spotify) data.integrations.spotify = spotify;
      if (instagram) data.integrations.instagram = instagram;
      if (youtube) data.integrations.youtube = youtube;
      if (tiktok) data.integrations.tiktok = tiktok;

      // Cache for 10 minutes
      await setInCache(cacheKey, data, cacheTTL.ARTIST_PROFILE);

      res.json({ ok: true, data });
    } catch (error) {
      console.error('[dashboard] Error fetching artist profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * GET /api/dashboard/artists/search
 * 
 * Search for artists by name
 * Public endpoint
 * 
 * Query params:
 * - q: search query (required, min 2 chars)
 * - limit: max results (default 20, max 50)
 * 
 * Response:
 * {
 *   ok: true,
 *   data: [
 *     {
 *       id: string,
 *       stageName: string,
 *       genres: string[],
 *       isVerified: boolean,
 *       leaderboardScore: number
 *     }
 *   ]
 * }
 */
dashboardRoutes.get(
  '/dashboard/artists/search',
  optionalAuth,
  async (req: Request, res: Response) => {
    try {
      const query = (req.query.q as string)?.trim();
      if (!query || query.length < 2) {
        return res.status(400).json({
          error: 'Bad request',
          message: 'Search query must be at least 2 characters',
        });
      }

      const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);

      const cacheKey = cacheKeys.artistSearch(query, limit);
      const cached = await getFromCache(cacheKey);
      if (cached) {
        return res.json({ ok: true, data: cached });
      }

      // Search for artists
      const artists = await prisma.artist.findMany({
        where: {
          OR: [
            { stageName: { contains: query, mode: 'insensitive' } },
            { fullName: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          stageName: true,
          genres: true,
          isVerified: true,
          leaderboardScore: true,
        },
        take: limit,
      });

      const data = artists.map((artist) => ({
        id: artist.id,
        stageName: artist.stageName,
        genres: artist.genres,
        isVerified: artist.isVerified,
        score: artist.leaderboardScore,
      }));

      // Cache for 5 minutes
      await setInCache(cacheKey, data, cacheTTL.SEARCH);

      res.json({ ok: true, data });
    } catch (error) {
      console.error('[dashboard] Error searching artists:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default dashboardRoutes;

// ============================================
// Artist Engagement Time Series (Authenticated)
// ============================================

/**
 * GET /api/dashboard/artists/:artistId/engagement
 * 
 * Return a simple engagement time series for the given artist.
 * Auth required. Allows the artist themselves or an ACTIVE manager for that artist.
 * 
 * Query params:
 * - window: "7d" | "30d" (default: 7d)
 * 
 * Response:
 * {
 *   ok: true,
 *   data: Array<{ date: string; emails: number; sms: number; streams: number; tickets: number }>
 * }
 */
dashboardRoutes.get(
  '/dashboard/artists/:artistId/engagement',
  authenticateJWT,
  async (req: Request, res: Response) => {
    try {
      const { artistId } = req.params as { artistId: string };
      const windowParam = (req.query.window as string) || '7d';

      if (!req.user) return res.status(401).json({ ok: false, error: 'Unauthorized' });

      // Authorization: allow if requesting own artist data OR manager with ACTIVE relation
      if (req.user.id !== artistId) {
        const relation = await prisma.managerArtist.findFirst({
          where: { managerId: req.user.id, artistId, status: 'ACTIVE' },
        });
        if (!relation) {
          return res.status(403).json({ ok: false, error: 'Forbidden' });
        }
      }

      // Determine number of days
      const days = windowParam === '30d' ? 30 : 7;
      const today = new Date();

      // Generate simple synthetic series for now
      const base = {
        emails: 12000,
        sms: 3000,
        streams: 8500,
        tickets: 400,
      };

      const data = Array.from({ length: days }).map((_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() - (days - 1 - i));

        // Add small variability
        const variance = (seed: number) => Math.floor(seed * (1 + (Math.sin(i / 2) * 0.05)));
        return {
          date: d.toISOString().slice(0, 10),
          emails: variance(base.emails + i * 150),
          sms: variance(base.sms + i * 40),
          streams: variance(base.streams + i * 220),
          tickets: Math.max(0, Math.floor(base.tickets + i * 12 + Math.sin(i) * 10)),
        };
      });

      res.json({ ok: true, data });
    } catch (error) {
      console.error('[dashboard] Error fetching engagement series:', error);
      res.status(500).json({ ok: false, error: 'Internal server error' });
    }
  }
);
