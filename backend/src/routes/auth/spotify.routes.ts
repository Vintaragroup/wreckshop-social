import { Router } from 'express'
import { exchangeCodeForToken } from '../../providers/spotify.oauth'
import { enrichSpotifyProfile } from '../../services/spotify/enrichment.service'
import { env } from '../../env'

export const spotifyAuth = Router()

// GET /auth/spotify/callback?code=...&state=...
spotifyAuth.get('/spotify/callback', async (req, res) => {
  const { code, error } = req.query as { code?: string; error?: string }
  if (error) return res.status(400).json({ ok: false, error })
  if (!code) return res.status(400).json({ ok: false, error: 'missing code' })

  try {
    const tokens = await exchangeCodeForToken(code, env.SPOTIFY_REDIRECT_URI)
    return res.json({ ok: true, tokens })
  } catch (err: any) {
    const message = err?.message || 'spotify auth failed'
    return res.status(400).json({ ok: false, error: message })
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

