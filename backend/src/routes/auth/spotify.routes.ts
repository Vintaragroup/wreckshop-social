import { Router } from 'express'
import { exchangeCodeForToken } from '../../providers/spotify.oauth'
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
