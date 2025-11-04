import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2, CheckCircle, AlertCircle, Music } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4002'

export default function SpotifyCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Connecting to Spotify...')

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code')
      const error = searchParams.get('error')

      if (error) {
        setStatus('error')
        setMessage(`Connection failed: ${error}`)
        setTimeout(() => navigate('/integrations'), 3000)
        return
      }

      if (!code) {
        setStatus('error')
        setMessage('No authorization code received')
        setTimeout(() => navigate('/integrations'), 3000)
        return
      }

      try {
        // Exchange code for token via backend
        const response = await fetch(`${BACKEND_URL}/auth/spotify/callback?code=${code}`, {
          method: 'GET',
          credentials: 'include',
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
          throw new Error(errorData.error || 'Token exchange failed')
        }

        const data = await response.json()
        const accessToken = data.tokens?.access_token

        if (!accessToken) {
          throw new Error('No access token received')
        }

        // Store token
        sessionStorage.setItem('spotify_access_token', accessToken)
        if (data.tokens?.refresh_token) {
          sessionStorage.setItem('spotify_refresh_token', data.tokens.refresh_token)
        }

        // Fetch user info to confirm
        const userRes = await fetch('https://api.spotify.com/v1/me', {
          headers: { Authorization: `Bearer ${accessToken}` },
        })

        if (!userRes.ok) {
          throw new Error('Failed to fetch user info')
        }

        const userData = await userRes.json()
        
        // Send token to backend for profile enrichment
        try {
          const enrichResponse = await fetch(`${BACKEND_URL}/auth/spotify/connect`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accessToken }),
          })

          if (enrichResponse.ok) {
            const enrichData = await enrichResponse.json()
            console.log('Profile enriched:', enrichData.data)
          } else {
            console.warn('Profile enrichment failed (non-critical)')
          }
        } catch (enrichErr) {
          console.warn('Profile enrichment error (non-critical):', enrichErr)
        }

        setStatus('success')
        setMessage(`Connected as ${userData.display_name || userData.email}`)

        // Redirect back to integrations
        setTimeout(() => navigate('/integrations'), 2000)
      } catch (err: any) {
        setStatus('error')
        setMessage(err.message || 'Connection failed')
        setTimeout(() => navigate('/integrations'), 3000)
      }
    }

    handleCallback()
  }, [searchParams, navigate])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5 text-green-500" />
            Spotify Connection
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {status === 'loading' && (
            <div className="flex flex-col items-center justify-center py-8 space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-green-500" />
              <p className="text-sm text-gray-300">{message}</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center justify-center py-8 space-y-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <p className="text-sm text-gray-300 text-center">{message}</p>
              <p className="text-xs text-gray-400">Redirecting...</p>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center justify-center py-8 space-y-3">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <p className="text-sm text-red-300 text-center">{message}</p>
              <p className="text-xs text-gray-400">Redirecting...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
