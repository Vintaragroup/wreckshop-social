/**
 * Stack Auth Webhook Handler
 * 
 * Receives events from Stack Auth and triggers application logic:
 * - user.created → Create Artist profile in database
 * - oauth_connection.created → Store integration metadata
 * - oauth_connection.deleted → Remove integration
 * - user.deleted → Clean up artist data
 */

import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import prisma from '../../lib/prisma';
import { env } from '../../env';

const router = Router();

/**
 * Verify webhook signature
 * 
 * Stack Auth signs webhooks with HMAC-SHA256.
 * Header: X-Stack-Webhook-Signature
 */
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return signature === expectedSignature;
}

/**
 * POST /webhooks/stack-auth
 * 
 * Receives all Stack Auth events and processes them
 */
router.post('/stack-auth', async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-stack-webhook-signature'] as string;
    const secret = env.STACK_WEBHOOK_SECRET;

    if (!signature || !secret) {
      console.error('[WEBHOOK] Missing signature or secret');
      return res.status(400).json({ error: 'Missing signature' });
    }

    // Verify signature
    const payload = JSON.stringify(req.body);
    if (!verifyWebhookSignature(payload, signature, secret)) {
      console.error('[WEBHOOK] Invalid signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const event = req.body;
    const eventType = event.type;

    console.log(`[WEBHOOK] Received event: ${eventType}`, {
      userId: event.data?.user_id,
      provider: event.data?.provider,
    });

    // Handle different event types
    switch (eventType) {
      case 'user.created':
        await handleUserCreated(event);
        break;
      case 'user.updated':
        await handleUserUpdated(event);
        break;
      case 'user.deleted':
        await handleUserDeleted(event);
        break;
      case 'oauth_connection.created':
        await handleOAuthConnected(event);
        break;
      case 'oauth_connection.deleted':
        await handleOAuthDisconnected(event);
        break;
      default:
        console.log(`[WEBHOOK] Unhandled event type: ${eventType}`);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('[WEBHOOK] Error processing event:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Handle user.created event
 * 
 * When a new user signs up in Stack Auth, create an Artist profile in our database
 */
async function handleUserCreated(event: any) {
  const {
    user_id,
    primaryEmail,
    displayName,
    profileImageUrl,
  } = event.data;

  console.log(`[WEBHOOK] Creating artist for user: ${user_id}`);

  // Create artist profile linked to Stack Auth user
  const artist = await prisma.artist.upsert({
    where: { stackAuthUserId: user_id },
    update: {
      email: primaryEmail,
      profilePictureUrl: profileImageUrl,
      updatedAt: new Date(),
    },
    create: {
      stackAuthUserId: user_id,
      email: primaryEmail || 'noemail@example.com',
      stageName: displayName || primaryEmail?.split('@')[0] || 'artist',
      fullName: displayName || '',
      profilePictureUrl: profileImageUrl,
      accountType: 'ARTIST',
    },
  });

  console.log(`[WEBHOOK] Artist created: ${artist.id}`);
}

/**
 * Handle user.updated event
 * 
 * When user profile is updated in Stack Auth, sync to our database
 */
async function handleUserUpdated(event: any) {
  const {
    user_id,
    primaryEmail,
    displayName,
    profileImageUrl,
  } = event.data;

  console.log(`[WEBHOOK] Updating artist for user: ${user_id}`);

  await prisma.artist.update({
    where: { stackAuthUserId: user_id },
    data: {
      email: primaryEmail,
      fullName: displayName || '',
      profilePictureUrl: profileImageUrl,
      updatedAt: new Date(),
    },
  });

  console.log(`[WEBHOOK] Artist updated: ${user_id}`);
}

/**
 * Handle user.deleted event
 * 
 * When user deletes their account, clean up their data
 */
async function handleUserDeleted(event: any) {
  const { user_id } = event.data;

  console.log(`[WEBHOOK] Deleting artist for user: ${user_id}`);

  // Delete artist and all related data (cascades via Prisma relations)
  await prisma.artist.delete({
    where: { stackAuthUserId: user_id },
  });

  console.log(`[WEBHOOK] Artist deleted: ${user_id}`);
}

/**
 * Handle oauth_connection.created event
 * 
 * When user connects Spotify/Instagram, store integration metadata
 */
async function handleOAuthConnected(event: any) {
  const {
    user_id,
    provider,
    accountId,
    displayName,
  } = event.data;

  console.log(`[WEBHOOK] ${provider} connected for user: ${user_id}`);

  // Find artist by Stack Auth user ID
  const artist = await prisma.artist.findUnique({
    where: { stackAuthUserId: user_id },
  });

  if (!artist) {
    console.warn(`[WEBHOOK] Artist not found for user: ${user_id}`);
    return;
  }

  // Store integration metadata based on provider
  if (provider === 'spotify') {
    await prisma.spotifyIntegration.upsert({
      where: { artistId: artist.id },
      update: {
        spotifyAccountId: accountId,
        displayName: displayName || '',
        updatedAt: new Date(),
      },
      create: {
        artistId: artist.id,
        spotifyAccountId: accountId,
        displayName: displayName || '',
      },
    });
    console.log(`[WEBHOOK] Spotify integration created for artist: ${artist.id}`);
  } else if (provider === 'instagram') {
    await prisma.instagramIntegration.upsert({
      where: { artistId: artist.id },
      update: {
        instagramAccountId: accountId,
        username: displayName || '',
        updatedAt: new Date(),
      },
      create: {
        artistId: artist.id,
        instagramAccountId: accountId,
        username: displayName || '',
      },
    });
    console.log(`[WEBHOOK] Instagram integration created for artist: ${artist.id}`);
  }
}

/**
 * Handle oauth_connection.deleted event
 * 
 * When user disconnects Spotify/Instagram, remove integration
 */
async function handleOAuthDisconnected(event: any) {
  const { user_id, provider } = event.data;

  console.log(`[WEBHOOK] ${provider} disconnected for user: ${user_id}`);

  const artist = await prisma.artist.findUnique({
    where: { stackAuthUserId: user_id },
  });

  if (!artist) {
    console.warn(`[WEBHOOK] Artist not found for user: ${user_id}`);
    return;
  }

  if (provider === 'spotify') {
    await prisma.spotifyIntegration.delete({
      where: { artistId: artist.id },
    }).catch(() => {
      // Integration might not exist, that's ok
    });
    console.log(`[WEBHOOK] Spotify integration deleted for artist: ${artist.id}`);
  } else if (provider === 'instagram') {
    await prisma.instagramIntegration.delete({
      where: { artistId: artist.id },
    }).catch(() => {
      // Integration might not exist, that's ok
    });
    console.log(`[WEBHOOK] Instagram integration deleted for artist: ${artist.id}`);
  }
}

export default router;
