import { env } from '../env'

export type SpotifyTokenResponse = {
  access_token: string
  token_type: 'Bearer'
  scope?: string
  expires_in: number
  refresh_token?: string
}

function basicAuthHeader(clientId: string, clientSecret: string) {
  const creds = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  return `Basic ${creds}`
}

export async function exchangeCodeForToken(code: string, redirectUri?: string): Promise<SpotifyTokenResponse> {
  const body = new URLSearchParams()
  body.set('grant_type', 'authorization_code')
  body.set('code', code)
  body.set('redirect_uri', redirectUri ?? env.SPOTIFY_REDIRECT_URI)

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: basicAuthHeader(env.SPOTIFY_CLIENT_ID, env.SPOTIFY_CLIENT_SECRET),
    },
    body,
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`spotify token exchange failed: ${res.status} ${res.statusText} ${text}`)
  }
  const json = (await res.json()) as SpotifyTokenResponse
  return json
}
