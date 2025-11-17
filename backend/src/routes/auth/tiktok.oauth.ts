import { Router, Request, Response } from 'express'
import axios from 'axios'
import { env } from '../../env'

const router = Router()

const TIKTOK_CLIENT_KEY = env.TIKTOK_CLIENT_KEY || ''
const TIKTOK_CLIENT_SECRET = env.TIKTOK_CLIENT_SECRET || ''
const TIKTOK_REDIRECT_URI = env.TIKTOK_REDIRECT_URI || 'http://localhost:4002/auth/tiktok/callback'
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5176'

// Simple in-memory state store for CSRF protection (in production, use Redis or database)
const stateStore = new Map<string, { state: string; timestamp: number }>()

// Clean up expired states every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of stateStore.entries()) {
    if (now - value.timestamp > 10 * 60 * 1000) { // 10 minute expiry
      stateStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

/**
 * GET /auth/tiktok/login
 * Initiates TikTok OAuth flow by redirecting to TikTok authorization endpoint
 */
router.get('/tiktok/login', (req: Request, res: Response) => {
  try {
    const state = Math.random().toString(36).substring(7)
    const scope = ['user.info.basic', 'creator.info.read']
    
    // Store state for CSRF protection
    stateStore.set(state, { state, timestamp: Date.now() })

    const authUrl = new URL('https://www.tiktok.com/v1/oauth/authorize/')
    authUrl.searchParams.set('client_key', TIKTOK_CLIENT_KEY)
    authUrl.searchParams.set('scope', scope.join(','))
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('redirect_uri', TIKTOK_REDIRECT_URI)
    authUrl.searchParams.set('state', state)

    res.redirect(authUrl.toString())
  } catch (error: any) {
    console.error('[tiktok] Login error:', error)
    res.status(500).json({
      ok: false,
      error: 'TikTok login failed',
      message: error.message,
    })
  }
})

/**
 * GET /auth/tiktok/callback
 * Handles TikTok OAuth callback after user authorization
 */
router.get('/tiktok/callback', async (req: Request, res: Response) => {
  try {
    const { code, state } = req.query

    // Verify state parameter for CSRF protection
    if (!state || !stateStore.has(String(state))) {
      return res.status(400).json({
        ok: false,
        error: 'Invalid state parameter',
      })
    }

    // Remove state to prevent reuse
    stateStore.delete(String(state))

    if (!code || typeof code !== 'string') {
      return res.status(400).json({
        ok: false,
        error: 'No authorization code provided',
      })
    }

    // Exchange code for access token
    const tokenResponse = await axios.post(
      'https://open.tiktokapi.com/v1/oauth/token/',
      {
        client_key: TIKTOK_CLIENT_KEY,
        client_secret: TIKTOK_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: TIKTOK_REDIRECT_URI,
      }
    )

    const { access_token, refresh_token, expires_in } = tokenResponse.data

    if (!access_token) {
      return res.status(400).json({
        ok: false,
        error: 'Failed to get access token',
      })
    }

    // Fetch user info from TikTok
    const userResponse = await axios.get(
      'https://open.tiktokapi.com/v1/user/info/',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        params: {
          fields: 'open_id,union_id,avatar_url,display_name,bio_description,follower_count',
        },
      }
    )

    const userData = userResponse.data?.data || {}

    // Redirect to frontend with tokens
    const redirectUrl = new URL(`${FRONTEND_URL}/auth/tiktok-callback`)
    redirectUrl.searchParams.set('access_token', access_token)
    if (refresh_token) {
      redirectUrl.searchParams.set('refresh_token', refresh_token)
    }
    redirectUrl.searchParams.set('expires_in', String(expires_in || 2592000)) // 30 days default
    redirectUrl.searchParams.set('creator_id', userData.open_id || '')
    redirectUrl.searchParams.set('username', userData.display_name || '')
    redirectUrl.searchParams.set('avatar_url', userData.avatar_url || '')
    redirectUrl.searchParams.set('follower_count', String(userData.follower_count || 0))

    res.redirect(redirectUrl.toString())
  } catch (error: any) {
    console.error('[tiktok] Callback error:', error)
    const redirectUrl = new URL(`${FRONTEND_URL}/auth/tiktok-callback`)
    redirectUrl.searchParams.set('error', error.message || 'TikTok authentication failed')
    res.redirect(redirectUrl.toString())
  }
})

/**
 * POST /auth/tiktok/refresh
 * Refreshes TikTok access token using refresh token
 */
router.post('/tiktok/refresh', async (req: Request, res: Response) => {
  try {
    const { refresh_token } = req.body

    if (!refresh_token) {
      return res.status(400).json({
        ok: false,
        error: 'Refresh token required',
      })
    }

    const tokenResponse = await axios.post(
      'https://open.tiktokapi.com/v1/oauth/token/',
      {
        client_key: TIKTOK_CLIENT_KEY,
        client_secret: TIKTOK_CLIENT_SECRET,
        refresh_token,
        grant_type: 'refresh_token',
      }
    )

    const { access_token, refresh_token: new_refresh_token, expires_in } = tokenResponse.data

    return res.json({
      ok: true,
      access_token,
      refresh_token: new_refresh_token || refresh_token,
      expires_in: expires_in || 2592000,
    })
  } catch (error: any) {
    console.error('[tiktok] Refresh error:', error)
    res.status(500).json({
      ok: false,
      error: 'Failed to refresh token',
      message: error.message,
    })
  }
})

/**
 * POST /auth/tiktok/validate
 * Validates TikTok access token and returns user info
 */
router.post('/tiktok/validate', async (req: Request, res: Response) => {
  try {
    const { access_token } = req.body

    if (!access_token) {
      return res.status(400).json({
        ok: false,
        error: 'Access token required',
      })
    }

    const userResponse = await axios.get(
      'https://open.tiktokapi.com/v1/user/info/',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        params: {
          fields: 'open_id,union_id,avatar_url,display_name,bio_description,follower_count',
        },
      }
    )

    const userData = userResponse.data?.data || {}

    return res.json({
      ok: true,
      user: {
        creator_id: userData.open_id,
        username: userData.display_name,
        avatar_url: userData.avatar_url,
        bio: userData.bio_description,
        follower_count: userData.follower_count,
      },
    })
  } catch (error: any) {
    console.error('[tiktok] Validate error:', error)
    res.status(401).json({
      ok: false,
      error: 'Invalid or expired access token',
      message: error.message,
    })
  }
})

export default router
