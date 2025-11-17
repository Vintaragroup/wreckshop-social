import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Loader2, LogOut, Music } from 'lucide-react'
import { useAuth } from '../lib/auth/context'
import { apiUrl, apiRequest } from '../lib/api'

interface TikTokConnectionProps {
  userId: string
  onConnectionChange?: () => void
}

interface TikTokConnection {
  id: string
  creatorId: string
  username: string
  avatarUrl?: string
  followers: number
  connectedAt: string
  expiresAt?: string
  needsRefresh?: boolean
}

export function TikTokConnectionCard({
  userId,
  onConnectionChange,
}: TikTokConnectionProps) {
  const { token } = useAuth()
  const [connection, setConnection] = useState<TikTokConnection | null>(null)
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)
  const [disconnecting, setDisconnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)

  // Load connection status on mount
  useEffect(() => {
    fetchConnectionStatus()
  }, [userId, token])

  const fetchConnectionStatus = async () => {
    if (!token) return

    try {
      setLoading(true)
      setNotFound(false)
      const data = await apiRequest<{ ok: true; integration: TikTokConnection }>(
        `/integrations/tiktok/${userId}`
      )

      if (data?.integration) {
        setConnection(data.integration)
        setError(null)
      } else {
        setConnection(null)
        setNotFound(true)
      }
    } catch (err: any) {
      console.error('Error fetching TikTok connection:', err)
      if (err?.message?.includes('404') || err?.message?.includes('not found')) {
        setNotFound(true)
        setConnection(null)
        setError(null)
      } else {
        setError(err.message || 'Failed to load TikTok connection')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async () => {
    try {
      setConnecting(true)
      setError(null)

      // Store user ID for callback handler
      sessionStorage.setItem('tiktok_user_id', userId)

      // Redirect to backend OAuth login
      window.location.href = apiUrl('/auth/tiktok/login')
    } catch (err: any) {
      console.error('Error starting TikTok connection:', err)
      setError(err.message || 'Failed to start TikTok connection')
      setConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    if (!token || !confirm('Are you sure you want to disconnect TikTok?')) return

    try {
      setDisconnecting(true)
      setError(null)

      await apiRequest(`/integrations/tiktok/${userId}`, {
        method: 'DELETE',
      })

      setConnection(null)
      setNotFound(true)
      onConnectionChange?.()
    } catch (err: any) {
      console.error('Error disconnecting TikTok:', err)
      setError(err.message || 'Failed to disconnect TikTok')
    } finally {
      setDisconnecting(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4 flex items-center justify-center h-40">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-base">TikTok</CardTitle>
              <p className="text-xs text-muted-foreground">Creator analytics & content insights</p>
            </div>
          </div>
          {connection ? (
            <Badge className="bg-accent text-accent-foreground">Connected</Badge>
          ) : (
            <Badge variant="secondary">Not Connected</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <div className="p-2 bg-destructive/10 text-destructive text-sm rounded border border-destructive/20">
            {error}
          </div>
        )}

        {connection ? (
          <>
            <div className="space-y-2 bg-muted/50 p-3 rounded">
              {connection.avatarUrl && (
                <img
                  src={connection.avatarUrl}
                  alt={connection.username}
                  className="w-12 h-12 rounded-full"
                />
              )}
              <div>
                <p className="text-sm font-medium">@{connection.username}</p>
                <p className="text-xs text-muted-foreground">
                  {connection.followers?.toLocaleString()} followers
                </p>
              </div>
              {connection.expiresAt && (
                <p className="text-xs text-muted-foreground">
                  Connected on {new Date(connection.connectedAt).toLocaleDateString()}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`https://www.tiktok.com/@${connection.username}`, '_blank')}
                className="w-full"
              >
                View Profile
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDisconnect}
                disabled={disconnecting}
                className="w-full"
              >
                {disconnecting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <LogOut className="w-4 h-4 mr-2" />}
                Disconnect
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Connect your TikTok creator account to access analytics and audience insights.
            </p>
            <Button
              onClick={handleConnect}
              disabled={connecting}
              className="w-full bg-black hover:bg-black/90"
            >
              {connecting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {connecting ? 'Connecting...' : 'Connect TikTok'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
