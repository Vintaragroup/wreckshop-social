import { Router, Request, Response } from 'express';
import { env } from '../../env';

const router = Router();

/**
 * Instagram OAuth Flow for Business/Creator Accounts
 * Uses Instagram Graph API v20.0+
 * 
 * Scope: instagram_business_basic, instagram_business_content_publish, instagram_business_manage_messages
 */

interface InstagramTokenResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
}

interface InstagramUserResponse {
  id: string;
  username: string;
  name: string;
  ig_id?: string;
  profile_picture_url?: string;
  biography?: string;
  website?: string;
  followers_count?: number;
  follows_count?: number;
  media_count?: number;
}

/**
 * GET /auth/instagram/login
 * Initiates Instagram OAuth flow
 */
router.get('/instagram/login', (req: Request, res: Response) => {
  if (!env.INSTAGRAM_APP_ID || !env.INSTAGRAM_REDIRECT_URI) {
    return res.status(500).json({
      error: 'Instagram OAuth not configured',
      message: 'INSTAGRAM_APP_ID and INSTAGRAM_REDIRECT_URI must be set'
    });
  }

  const scopes = [
    'instagram_business_basic',
    'instagram_business_content_publish',
    'instagram_business_manage_messages'
  ];

  const params = new URLSearchParams({
    client_id: env.INSTAGRAM_APP_ID,
    redirect_uri: env.INSTAGRAM_REDIRECT_URI,
    scope: scopes.join(','),
    response_type: 'code',
    state: Math.random().toString(36).substring(7) // CSRF token
  });

  const authUrl = `https://api.instagram.com/oauth/authorize?${params.toString()}`;
  res.json({ authUrl, redirectTo: authUrl });
});

/**
 * GET /auth/instagram/callback
 * Handles OAuth callback from Instagram
 */
router.get('/instagram/callback', async (req: Request, res: Response) => {
  try {
    const { code, error, error_reason, error_description } = req.query;

    // Check for errors
    if (error) {
      return res.status(400).json({
        ok: false,
        error: error || 'Authentication failed',
        reason: error_reason,
        description: error_description
      });
    }

    if (!code) {
      return res.status(400).json({
        ok: false,
        error: 'No authorization code received'
      });
    }

    if (!env.INSTAGRAM_APP_ID || !env.INSTAGRAM_APP_SECRET || !env.INSTAGRAM_REDIRECT_URI) {
      return res.status(500).json({
        ok: false,
        error: 'Instagram OAuth not configured'
      });
    }

    // Exchange code for short-lived token
    const shortTokenResponse = await fetch(
      'https://graph.instagram.com/v20.0/oauth/access_token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          client_id: env.INSTAGRAM_APP_ID,
          client_secret: env.INSTAGRAM_APP_SECRET,
          grant_type: 'authorization_code',
          redirect_uri: env.INSTAGRAM_REDIRECT_URI,
          code: code as string
        }).toString()
      }
    );

    if (!shortTokenResponse.ok) {
      const errorData = await shortTokenResponse.json();
      throw new Error(errorData.error?.message || 'Failed to exchange code for token');
    }

    const shortTokenData = await shortTokenResponse.json();
    const shortAccessToken = shortTokenData.access_token;
    const userId = shortTokenData.user_id;

    // Exchange short-lived token for long-lived token (valid for 60 days)
    // Build query params for long token exchange
    const longTokenParams = new URLSearchParams({
      grant_type: 'ig_exchange_token',
      client_secret: env.INSTAGRAM_APP_SECRET,
      access_token: shortAccessToken
    });

    const longTokenResponse = await fetch(
      `https://graph.instagram.com/v20.0/access_token?${longTokenParams.toString()}`,
      { method: 'GET' }
    );

    if (!longTokenResponse.ok) {
      const errorData = await longTokenResponse.json();
      throw new Error(errorData.error?.message || 'Failed to exchange for long-lived token');
    }

    const longTokenData = await longTokenResponse.json();
    const longAccessToken = longTokenData.access_token;
    const expiresIn = longTokenData.expires_in;

    // Get user details
    const userParams = new URLSearchParams({
      fields: 'id,username,name,ig_id,profile_picture_url,biography,website,followers_count,follows_count,media_count',
      access_token: longAccessToken
    });

    const userResponse = await fetch(
      `https://graph.instagram.com/v20.0/${userId}?${userParams.toString()}`,
      { method: 'GET' }
    );

    if (!userResponse.ok) {
      const errorData = await userResponse.json();
      throw new Error(errorData.error?.message || 'Failed to fetch user data');
    }

    const userData = await userResponse.json();

    // Return token and user data
    res.json({
      ok: true,
      access_token: longAccessToken,
      user_id: userId,
      expires_in: expiresIn,
      user: {
        id: userData.id,
        username: userData.username,
        name: userData.name,
        profile_picture_url: userData.profile_picture_url,
        biography: userData.biography,
        website: userData.website,
        followers_count: userData.followers_count,
        follows_count: userData.follows_count,
        media_count: userData.media_count
      }
    });
  } catch (error: any) {
    console.error('Instagram OAuth callback error:', error.response?.data || error.message);
    res.status(400).json({
      ok: false,
      error: 'OAuth callback failed',
      message: error.response?.data?.error?.message || error.message
    });
  }
});

/**
 * POST /auth/instagram/refresh
 * Refreshes long-lived token before 60-day expiration
 */
router.post('/instagram/refresh', async (req: Request, res: Response) => {
  try {
    const { access_token } = req.body;

    if (!access_token) {
      return res.status(400).json({
        ok: false,
        error: 'access_token required'
      });
    }

    if (!env.INSTAGRAM_APP_SECRET) {
      return res.status(500).json({
        ok: false,
        error: 'Instagram configuration missing'
      });
    }

    // Refresh the long-lived token
    const params = new URLSearchParams({
      grant_type: 'ig_refresh_token',
      access_token,
      client_secret: env.INSTAGRAM_APP_SECRET
    });

    const response = await fetch(
      `https://graph.instagram.com/v20.0/refresh_access_token?${params.toString()}`,
      { method: 'GET' }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to refresh token');
    }

    const responseData = await response.json();

    res.json({
      ok: true,
      access_token: responseData.access_token,
      expires_in: responseData.expires_in
    });
  } catch (error: any) {
    console.error('Instagram token refresh error:', error.response?.data || error.message);
    res.status(400).json({
      ok: false,
      error: 'Token refresh failed',
      message: error.response?.data?.error?.message || error.message
    });
  }
});

/**
 * POST /auth/instagram/validate
 * Validate and get info about current access token
 */
router.post('/instagram/validate', async (req: Request, res: Response) => {
  try {
    const { access_token } = req.body;

    if (!access_token) {
      return res.status(400).json({
        ok: false,
        error: 'access_token required'
      });
    }

    // Get token debug info
    const debugParams = new URLSearchParams({
      input_token: access_token,
      access_token
    });

    const debugResponse = await fetch(
      `https://graph.instagram.com/v20.0/debug_token?${debugParams.toString()}`,
      { method: 'GET' }
    );

    if (!debugResponse.ok) {
      const errorData = await debugResponse.json();
      throw new Error(errorData.error?.message || 'Failed to validate token');
    }

    const debugData = await debugResponse.json();
    const tokenData = debugData.data;

    res.json({
      ok: true,
      valid: tokenData.is_valid,
      app_id: tokenData.app_id,
      user_id: tokenData.user_id,
      issued_at: new Date(tokenData.issued_at * 1000).toISOString(),
      expires_at: new Date(tokenData.expires_at * 1000).toISOString(),
      scopes: tokenData.scopes
    });
  } catch (error: any) {
    console.error('Instagram token validation error:', error.response?.data || error.message);
    res.status(400).json({
      ok: false,
      error: 'Token validation failed',
      message: error.response?.data?.error?.message || error.message
    });
  }
});

export default router;
