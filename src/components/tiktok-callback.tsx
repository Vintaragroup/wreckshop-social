import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Card, CardContent } from './ui/card'
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from './ui/button'
import { appPath } from '../lib/routes'

export function TikTokCallbackHandler() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    handleCallback()
  }, [])

  const handleCallback = async () => {
    try {
      const accessToken = searchParams.get('access_token')
      const error = searchParams.get('error')

      if (error) {
        setStatus('error')
        setMessage(`TikTok authorization failed: ${error}`)
        return
      }

      if (!accessToken) {
        setStatus('error')
        setMessage('No access token received from TikTok')
        return
      }

      // Get the userId from sessionStorage (set during connect initiation)
      const userId = sessionStorage.getItem('tiktok_user_id')
      if (!userId) {
        setStatus('error')
        setMessage('User ID not found. Please try connecting again.')
        return
      }

      // Get user info from callback parameters
      const creatorId = searchParams.get('creator_id')
      const username = searchParams.get('username')
      const avatarUrl = searchParams.get('avatar_url')
      const followerCount = searchParams.get('follower_count')
      const refreshToken = searchParams.get('refresh_token')
      const expiresIn = searchParams.get('expires_in')

      // Validate required fields
      if (!creatorId || !username) {
        setStatus('error')
        setMessage('Missing TikTok user information from callback')
        return
      }

      // Save the connection to our backend
      const saveResponse = await fetch('/api/integrations/tiktok', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          userId,
          creatorId,
          username,
          accessToken,
          refreshToken: refreshToken || undefined,
          avatarUrl: avatarUrl || undefined,
          followers: followerCount ? parseInt(followerCount) : 0,
          expiresIn: expiresIn ? parseInt(expiresIn) : 2592000, // 30 days default
        }),
      })

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json()
        throw new Error(errorData.message || 'Failed to save TikTok connection')
      }

      const saveData = await saveResponse.json()

      if (!saveData.ok) {
        setStatus('error')
        setMessage(saveData.error || 'Failed to save TikTok connection')
        return
      }

      setStatus('success')
      setMessage(`Successfully connected to TikTok account @${username}`)

      // Clean up
      sessionStorage.removeItem('tiktok_user_id')

      // Redirect to integrations page after 2 seconds
      setTimeout(() => {
        navigate(appPath('/integrations'))
      }, 2000)
    } catch (err: any) {
      console.error('TikTok callback error:', err)
      setStatus('error')
      setMessage(err.message || 'An unexpected error occurred')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/10 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 pt-8">
          <div className="space-y-4">
            {status === 'loading' && (
              <>
                <div className="flex justify-center">
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                </div>
                <div className="text-center">
                  <h2 className="text-lg font-semibold mb-2">Connecting TikTok</h2>
                  <p className="text-sm text-muted-foreground">
                    Please wait while we complete the connection...
                  </p>
                </div>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="flex justify-center">
                  <CheckCircle className="w-12 h-12 text-accent" />
                </div>
                <div className="text-center">
                  <h2 className="text-lg font-semibold mb-2 text-accent">Success!</h2>
                  <p className="text-sm text-muted-foreground mb-4">{message}</p>
                  <p className="text-xs text-muted-foreground">
                    Redirecting to integrations...
                  </p>
                </div>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="flex justify-center">
                  <AlertCircle className="w-12 h-12 text-destructive" />
                </div>
                <div className="text-center">
                  <h2 className="text-lg font-semibold mb-2 text-destructive">Connection Failed</h2>
                  <p className="text-sm text-muted-foreground mb-4">{message}</p>
                  <Button
                  onClick={() => navigate(appPath('/integrations'))}
                    className="w-full"
                  >
                    Return to Integrations
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
