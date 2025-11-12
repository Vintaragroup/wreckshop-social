import { Router } from 'express'
import { exchangeCodeForToken } from '../../providers/spotify.oauth'
import { enrichSpotifyProfile } from '../../services/spotify/enrichment.service'
import { env } from '../../env'

export const spotifyAuth = Router()

// GET /auth/spotify/callback?code=...&state=...
spotifyAuth.get('/spotify/callback', async (req, res) => {
  const { code, error } = req.query as { code?: string; error?: string }
  if (error) {
    return res.redirect(`http://localhost:5176/integrations?error=${error}`)
  }
  if (!code) {
    return res.redirect(`http://localhost:5176/integrations?error=missing_code`)
  }

  try {
    const tokens = await exchangeCodeForToken(code, env.SPOTIFY_REDIRECT_URI)
    
    // Store in session/cookie for the frontend to retrieve
    // For now, redirect with token in URL (not ideal but works for demo)
    const accessToken = tokens.access_token
    const refreshToken = tokens.refresh_token || ''
    
    // Redirect back to frontend with tokens as query params
    return res.redirect(`http://localhost:5176/integrations?spotify_token=${accessToken}&spotify_refresh=${refreshToken}`)
  } catch (err: any) {
    const message = err?.message || 'spotify auth failed'
    return res.redirect(`http://localhost:5176/integrations?error=${encodeURIComponent(message)}`)
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

