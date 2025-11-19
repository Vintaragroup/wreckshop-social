import { Router } from 'express'
import { exchangeCodeForToken } from '../../providers/spotify.oauth'
import { env } from '../../env'
import { authenticateJWT } from '../../lib/middleware/auth.middleware'
import {
  createIntegrationState,
  verifyIntegrationState,
} from '../../lib/integration-tokens'
import { upsertSpotifyIntegration } from '../../services/spotify/integration.service'
import { enrichSpotifyProfile } from '../../services/spotify/enrichment.service'
import type { IntegrationStatePayload } from '../../lib/integration-tokens'

export const spotifyAuth = Router()

const SPOTIFY_SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-top-read',
  'playlist-read-private',
  'user-follow-read',
]

const DEFAULT_REDIRECT_PATH = '/app/integrations'

spotifyAuth.get('/spotify/start', authenticateJWT, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ ok: false, error: 'Unauthorized' })
    }

    const { artistId, redirectPath } = req.query as {
      artistId?: string
      redirectPath?: string
    }

    const targetArtistId = artistId || req.user.id
    if (targetArtistId !== req.user.id) {
      return res.status(403).json({
        ok: false,
        error: 'You can only connect accounts you own today',
      })
    }

    const state = createIntegrationState({
      artistId: targetArtistId,
      userId: req.user.id,
      redirectPath,
    })

    const authUrl = new URL('https://accounts.spotify.com/authorize')
    authUrl.searchParams.set('client_id', env.SPOTIFY_CLIENT_ID)
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('redirect_uri', env.SPOTIFY_REDIRECT_URI)
    authUrl.searchParams.set('scope', SPOTIFY_SCOPES.join(' '))
    authUrl.searchParams.set('state', state)

    return res.json({
      ok: true,
      authUrl: authUrl.toString(),
      state,
      scopes: SPOTIFY_SCOPES,
    })
  } catch (error: any) {
    console.error('Spotify start error:', error)
    return res.status(500).json({ ok: false, error: error.message })
  }
})

// GET /auth/spotify/callback?code=...&state=...
spotifyAuth.get('/spotify/callback', async (req, res) => {
  const { code, error, state } = req.query as {
    code?: string
    error?: string
    state?: string
  }

  const redirectWithStatus = (
    status: 'connected' | 'error',
    message?: string,
    statePayload?: IntegrationStatePayload
  ) => {
    const path = statePayload?.redirectPath?.startsWith('/')
      ? statePayload.redirectPath
      : DEFAULT_REDIRECT_PATH
    const url = new URL(path, env.FRONTEND_URL)
    url.searchParams.set('provider', 'spotify')
    url.searchParams.set('status', status)
    if (message) {
      url.searchParams.set('message', message)
    }
    return url.toString()
  }

  if (error) {
    return res.redirect(redirectWithStatus('error', error))
  }

  if (!code || !state) {
    return res.redirect(redirectWithStatus('error', 'Missing authorization details'))
  }

  let statePayload: IntegrationStatePayload
  try {
    statePayload = verifyIntegrationState(state)
  } catch (err: any) {
    return res.redirect(redirectWithStatus('error', err?.message || 'Invalid state token'))
  }

  try {
    const tokenResponse = await exchangeCodeForToken(code, env.SPOTIFY_REDIRECT_URI)
    const scopes = tokenResponse.scope
      ? tokenResponse.scope.split(' ').filter(Boolean)
      : SPOTIFY_SCOPES

    await upsertSpotifyIntegration({
      artistId: statePayload.artistId,
      tokens: {
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
        expiresIn: tokenResponse.expires_in,
        scopes,
      },
    })

    return res.redirect(redirectWithStatus('connected', undefined, statePayload))
  } catch (err: any) {
    console.error('Spotify callback error:', err)
    return res.redirect(
      redirectWithStatus('error', err?.message || 'Spotify auth failed', statePayload)
    )
  }
})

// POST /auth/spotify/connect
// Body: { accessToken: string }
// Enriches Spotify profile with user data
spotifyAuth.post('/spotify/connect', async (req, res) => {
  const { accessToken } = req.body as { accessToken?: string }
  if (!accessToken) {
    return res.status(400).json({ ok: false, error: 'accessToken is required' })
  }

  try {
    const enrichedData = await enrichSpotifyProfile(accessToken)
    
    // TODO: Store enrichedData in database linked to user/profile
    // For now, return the enriched data
    
    return res.json({
      ok: true,
      data: enrichedData,
      message: 'Spotify profile enriched successfully',
    })
  } catch (err: any) {
    const message = err?.message || 'Profile enrichment failed'
    return res.status(400).json({ ok: false, error: message })
  }
})

