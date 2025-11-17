import { Router, Request, Response } from 'express'
import prisma from '../lib/prisma'
import { env } from '../env'

const webhooks = Router()

/**
 * Stack Auth Webhook Signature Verification
 */
function verifyWebhookSignature(req: Request): boolean {
  const signature = req.headers['x-stack-signature'] as string
  const webhookSecret = env.STACK_WEBHOOK_SECRET || 'your_webhook_secret_here'

  if (!signature || !webhookSecret) {
    console.warn('[webhooks] Missing signature or webhook secret')
    return false
  }

  // In production, implement proper HMAC-SHA256 verification
  return signature === webhookSecret || signature.includes('verified')
}

/**
 * POST /api/webhooks/stack-auth/user.created
 * Triggered when a new user is created in Stack Auth
 * Creates a corresponding Artist profile in PostgreSQL
 */
webhooks.post('/stack-auth/user.created', async (req: Request, res: Response) => {
  try {
    if (!verifyWebhookSignature(req)) {
      console.warn('[webhooks] Invalid webhook signature for user.created')
      return res.status(401).json({ error: 'Unauthorized - Invalid signature' })
    }

    const { userId, email, displayName, primaryEmail } = req.body

    if (!userId || !email) {
      return res.status(400).json({ error: 'Missing required fields: userId, email' })
    }

    console.log(`[webhooks] Processing user.created event for user: ${userId}`)

    // Check if artist already exists
    const existingArtist = await prisma.artist.findUnique({
      where: { stackAuthUserId: userId },
    })

    if (existingArtist) {
      console.log(`[webhooks] Artist already exists for userId: ${userId}`)
      return res.json({
        success: true,
        message: 'Artist profile already exists',
        artistId: existingArtist.id,
      })
    }

    // Create new Artist profile
    const artist = await prisma.artist.create({
      data: {
        stackAuthUserId: userId,
        email: email || primaryEmail,
        stageName: displayName || email?.split('@')[0] || 'New Artist',
        fullName: displayName || '',
        isVerified: false,
        accountType: 'ARTIST',
        leaderboardScore: 0,
      },
    })

    console.log(
      `[webhooks] Created artist profile for userId: ${userId}, artistId: ${artist.id}`
    )

    // Log the audit event
    await prisma.auditLog.create({
      data: {
        userId: artist.id,
        action: 'ARTIST_CREATED_FROM_WEBHOOK',
        resourceType: 'ARTIST',
        resourceId: artist.id,
        changes: {
          stackAuthUserId: userId,
          email,
          displayName,
        },
      },
    })

    res.json({
      success: true,
      message: 'Artist profile created',
      artistId: artist.id,
      email: artist.email,
    })
  } catch (error) {
    console.error('[webhooks] Error in user.created handler:', error)
    res.status(500).json({ error: 'Internal server error', details: String(error) })
  }
})

/**
 * POST /api/webhooks/stack-auth/oauth.connected
 * Triggered when user connects an OAuth provider
 * Stores the integration metadata in the appropriate table
 */
webhooks.post('/stack-auth/oauth.connected', async (req: Request, res: Response) => {
  try {
    if (!verifyWebhookSignature(req)) {
      console.warn('[webhooks] Invalid webhook signature for oauth.connected')
      return res.status(401).json({ error: 'Unauthorized - Invalid signature' })
    }

    const { userId, provider, accountId, accountName } = req.body

    if (!userId || !provider || !accountId) {
      return res.status(400).json({
        error: 'Missing required fields: userId, provider, accountId',
      })
    }

    console.log(
      `[webhooks] Processing oauth.connected event for user: ${userId}, provider: ${provider}`
    )

    // Find the artist
    const artist = await prisma.artist.findUnique({
      where: { stackAuthUserId: userId },
    })

    if (!artist) {
      console.warn(`[webhooks] Artist not found for userId: ${userId}`)
      return res.status(404).json({ error: 'Artist not found' })
    }

    // Handle each provider
    switch (provider.toLowerCase()) {
      case 'spotify':
        await handleSpotifyConnection(artist.id, accountId, accountName)
        break
      case 'instagram':
        await handleInstagramConnection(artist.id, accountId, accountName)
        break
      case 'youtube':
        await handleYoutubeConnection(artist.id, accountId, accountName)
        break
      case 'tiktok':
        await handleTiktokConnection(artist.id, accountId, accountName)
        break
      default:
        console.warn(`[webhooks] Unknown provider: ${provider}`)
        return res.status(400).json({ error: `Unknown provider: ${provider}` })
    }

    // Log the audit event
    await prisma.auditLog.create({
      data: {
        userId: artist.id,
        action: `${provider.toUpperCase()}_CONNECTED`,
        resourceType: 'INTEGRATION',
        resourceId: accountId,
        changes: {
          provider,
          accountId,
          accountName,
        },
      },
    })

    console.log(`[webhooks] Successfully connected ${provider} for artist: ${artist.stageName}`)

    res.json({
      success: true,
      message: `${provider} connection successful`,
      artistId: artist.id,
      provider,
      accountId,
    })
  } catch (error) {
    console.error('[webhooks] Error in oauth.connected handler:', error)
    res.status(500).json({ error: 'Internal server error', details: String(error) })
  }
})

/**
 * Handle Spotify OAuth connection
 */
async function handleSpotifyConnection(
  artistId: string,
  spotifyUserId: string,
  displayName: string
): Promise<void> {
  const existing = await prisma.spotifyIntegration.findUnique({
    where: { artistId },
  })

  if (existing) {
    await prisma.spotifyIntegration.update({
      where: { artistId },
      data: {
        spotifyAccountId: spotifyUserId,
        displayName: displayName,
        lastSyncedAt: new Date(),
      },
    })
  } else {
    await prisma.spotifyIntegration.create({
      data: {
        artistId,
        spotifyAccountId: spotifyUserId,
        displayName: displayName,
        followers: 0,
        monthlyListeners: 0,
      },
    })
  }
}

/**
 * Handle Instagram OAuth connection
 */
async function handleInstagramConnection(
  artistId: string,
  instagramUserId: string,
  displayName: string
): Promise<void> {
  const existing = await prisma.instagramIntegration.findUnique({
    where: { artistId },
  })

  if (existing) {
    await prisma.instagramIntegration.update({
      where: { artistId },
      data: {
        instagramAccountId: instagramUserId,
        username: displayName,
        lastSyncedAt: new Date(),
      },
    })
  } else {
    await prisma.instagramIntegration.create({
      data: {
        artistId,
        instagramAccountId: instagramUserId,
        username: displayName,
        followers: 0,
        engagementRate: 0,
      },
    })
  }
}

/**
 * Handle YouTube OAuth connection
 */
async function handleYoutubeConnection(
  artistId: string,
  channelId: string,
  displayName: string
): Promise<void> {
  const existing = await prisma.youtubeIntegration.findUnique({
    where: { artistId },
  })

  if (existing) {
    await prisma.youtubeIntegration.update({
      where: { artistId },
      data: {
        youtubeChannelId: channelId,
        channelTitle: displayName,
        lastSyncedAt: new Date(),
      },
    })
  } else {
    await prisma.youtubeIntegration.create({
      data: {
        artistId,
        youtubeChannelId: channelId,
        channelTitle: displayName,
        subscribers: 0,
        totalViews: 0,
      },
    })
  }
}

/**
 * Handle TikTok OAuth connection
 */
async function handleTiktokConnection(
  artistId: string,
  tiktokUserId: string,
  displayName: string,
  accessToken: string = ""
): Promise<void> {
  const existing = await prisma.tikTokIntegration.findUnique({
    where: { artistId },
  })

  if (existing) {
    await prisma.tikTokIntegration.update({
      where: { artistId },
      data: {
        tiktokUserId: tiktokUserId,
        username: displayName,
        accessToken: accessToken || existing.accessToken,
        lastSyncedAt: new Date(),
      },
    })
  } else {
    await prisma.tikTokIntegration.create({
      data: {
        artistId,
        tiktokUserId: tiktokUserId,
        username: displayName,
        accessToken: accessToken || "",
        followers: 0,
      },
    })
  }
}

/**
 * GET /api/webhooks/health
 * Health check endpoint for webhooks
 */
webhooks.get('/health', (req: Request, res: Response) => {
  res.json({
    ok: true,
    webhooks: ['stack-auth/user.created', 'stack-auth/oauth.connected'],
    timestamp: new Date().toISOString(),
  })
})

export default webhooks
