import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Card, CardContent } from './ui/card'
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from './ui/button'

export function InstagramCallbackHandler() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    handleCallback()
  }, [])

  const handleCallback = async () => {
    try {
      const code = searchParams.get('code')
      const error = searchParams.get('error')
      const errorDescription = searchParams.get('error_description')

      if (error) {
        setStatus('error')
        setMessage(`Instagram authorization failed: ${errorDescription || error}`)
        return
      }

      if (!code) {
        setStatus('error')
        setMessage('No authorization code received from Instagram')
        return
      }

      // Get the userId from sessionStorage (set during connect initiation)
      const userId = sessionStorage.getItem('instagram_user_id')
      if (!userId) {
        setStatus('error')
        setMessage('User ID not found. Please try connecting again.')
        return
      }

      // Step 1: Exchange code for token on backend
      const tokenResponse = await fetch('/auth/instagram/callback?code=' + code, {
        method: 'GET',
      })

      if (!tokenResponse.ok) {
        throw new Error('Failed to exchange authorization code for token')
      }

      const tokenData = await tokenResponse.json()

      if (!tokenData.ok) {
        setStatus('error')
        setMessage(tokenData.error || 'Failed to exchange authorization code')
        return
      }

      // Step 2: Save the connection to our database
      const saveResponse = await fetch('/api/integrations/instagram/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          access_token: tokenData.access_token,
          user_id: tokenData.user_id,
          expires_in: tokenData.expires_in,
          user: tokenData.user,
        }),
      })

      if (!saveResponse.ok) {
        throw new Error('Failed to save Instagram connection')
      }

      const saveData = await saveResponse.json()

      if (!saveData.ok) {
        setStatus('error')
        setMessage(saveData.error || 'Failed to save Instagram connection')
        return
      }

      setStatus('success')
      setMessage(
        `Successfully connected to Instagram account @${tokenData.user.username}`
      )

      // Clean up
      sessionStorage.removeItem('instagram_user_id')

      // Redirect to integrations page after 2 seconds
      setTimeout(() => {
        navigate('/integrations')
      }, 2000)
    } catch (err: any) {
      console.error('Instagram callback error:', err)
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
                  <h2 className="text-lg font-semibold mb-2">Connecting Instagram</h2>
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
                    onClick={() => navigate('/integrations')}
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
