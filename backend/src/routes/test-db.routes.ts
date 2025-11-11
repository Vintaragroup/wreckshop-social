/**
 * Database Test Routes
 * 
 * Test endpoints to verify Prisma can connect to the database
 * and perform basic CRUD operations
 */

import express, { Request, Response } from 'express';
import prisma from '../lib/prisma.js';

const router = express.Router();

/**
 * GET /api/test/db-health
 * 
 * Check if Prisma can connect to PostgreSQL database
 * Returns table counts and database info
 */
router.get('/db-health', async (req: Request, res: Response) => {
  try {
    const artistCount = await prisma.artist.count();
    const managerCount = await prisma.managerArtist.count();

    res.json({
      success: true,
      message: 'Database connected successfully',
      counts: {
        artists: artistCount,
        managerArtists: managerCount,
      },
      tables: [
        'Artist',
        'ManagerArtist',
        'SpotifyIntegration',
        'InstagramIntegration',
        'YoutubeIntegration',
        'TikTokIntegration',
        'AuditLog',
      ],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Database health check failed:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/test/create-artist
 * 
 * Test creating an artist
 * 
 * Body:
 * {
 *   "stackAuthUserId": "user_123",
 *   "email": "test@example.com",
 *   "stageName": "Test Artist"
 * }
 */
router.post('/create-artist', async (req: Request, res: Response) => {
  try {
    const { stackAuthUserId, email, stageName } = req.body;

    if (!stackAuthUserId || !email || !stageName) {
      return res.status(400).json({
        error: 'Missing required fields: stackAuthUserId, email, stageName',
      });
    }

    const artist = await prisma.artist.create({
      data: {
        stackAuthUserId,
        email,
        stageName,
      },
    });

    res.json({
      success: true,
      message: 'Artist created successfully',
      artist: {
        id: artist.id,
        email: artist.email,
        stageName: artist.stageName,
        createdAt: artist.createdAt,
      },
    });
  } catch (error) {
    console.error('Create artist failed:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/test/artists
 * 
 * Get all artists from database
 */
router.get('/artists', async (req: Request, res: Response) => {
  try {
    const artists = await prisma.artist.findMany({
      select: {
        id: true,
        email: true,
        stageName: true,
        fullName: true,
        createdAt: true,
      },
    });

    res.json({
      success: true,
      count: artists.length,
      artists,
    });
  } catch (error) {
    console.error('Get artists failed:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
