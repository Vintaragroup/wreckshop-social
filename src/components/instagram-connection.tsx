import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Loader2, LogOut, Instagram as InstagramIcon } from 'lucide-react'
import { useAuth } from '../lib/auth/context'
import { apiUrl } from '../lib/api'

interface InstagramConnectionProps {
  userId: string
  onConnectionChange?: () => void
}

interface InstagramConnection {
  id: string
  username: string
  name: string
  profilePictureUrl?: string
  followers: number
  connectedAt: string
  expiresAt: string
  needsRefresh: boolean
}

export function InstagramConnectionCard({
  userId,
  onConnectionChange,
}: InstagramConnectionProps) {
  const { token } = useAuth();
  const [connection, setConnection] = useState<InstagramConnection | null>(null)
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load connection status on mount
  useEffect(() => {
    fetchConnectionStatus()
  }, [userId])

  const fetchConnectionStatus = async () => {
    if (!token) return;

    try {
      setLoading(true)
      const response = await fetch(
        apiUrl(`/integrations/instagram/${userId}`),
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      )

      if (response.ok) {
        const data = await response.json()
        setConnection(data.integration)
        setError(null)
      } else if (response.status === 404) {
        // Not connected
        setConnection(null)
      } else {
        throw new Error('Failed to fetch connection status')
      }
    } catch (err: any) {
      console.error('Error fetching Instagram connection:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async () => {
    try {
      setConnecting(true)
      setError(null)

      // Step 1: Get the Instagram OAuth login URL
      const loginResponse = await fetch(apiUrl('/auth/instagram/login'), {
        credentials: 'include',
      })
      if (!loginResponse.ok) {
        throw new Error('Failed to start Instagram OAuth')
      }

      const { authUrl } = await loginResponse.json()

      // Step 2: Store callback handler in sessionStorage so we can process it
      sessionStorage.setItem('instagram_user_id', userId)

      // Step 3: Redirect to Instagram for authorization
      window.location.href = authUrl
    } catch (err: any) {
      console.error('Error connecting Instagram:', err)
      setError(err.message)
      setConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    if (!token) return;

    try {
      setConnecting(true)
      const response = await fetch(apiUrl(`/integrations/instagram/${userId}`), {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to disconnect Instagram')
      }

      setConnection(null)
      onConnectionChange?.()
    } catch (err: any) {
      console.error('Error disconnecting Instagram:', err)
      setError(err.message)
    } finally {
      setConnecting(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4 flex items-center justify-center min-h-[200px]">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (connection) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
                <InstagramIcon className="w-5 h-5 text-pink-500" />
              </div>
              <div>
                <CardTitle>Instagram</CardTitle>
                <p className="text-sm text-muted-foreground">Business Account Connected</p>
              </div>
            </div>
            <Badge className="bg-accent text-accent-foreground">Connected</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {connection.profilePictureUrl && (
            <img
              src={connection.profilePictureUrl}
              alt={connection.username}
              className="w-12 h-12 rounded-full"
            />
          )}

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Username</span>
              <span className="font-medium">@{connection.username}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium">{connection.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Followers</span>
              <span className="font-medium">
                {connection.followers.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Connected</span>
              <span className="font-medium">
                {new Date(connection.connectedAt).toLocaleDateString()}
              </span>
            </div>
            {connection.needsRefresh && (
              <div className="flex justify-between text-sm">
                <span className="text-destructive">Token expires</span>
                <span className="font-medium text-destructive">
                  {new Date(connection.expiresAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
              {error}
            </div>
          )}

          <Button
            variant="outline"
            className="w-full"
            onClick={handleDisconnect}
            disabled={connecting}
          >
            {connecting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4 mr-2" />
            )}
            Disconnect Instagram
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
              <InstagramIcon className="w-5 h-5 text-pink-500" />
            </div>
            <div>
              <CardTitle>Instagram</CardTitle>
              <p className="text-sm text-muted-foreground">Connect your business account</p>
            </div>
          </div>
          <Badge variant="secondary">Disconnected</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Connect your Instagram business account to sync follower data, insights, and
          enable content publishing directly from WreckShop.
        </p>

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
            {error}
          </div>
        )}

        <Button
          className="w-full"
          onClick={handleConnect}
          disabled={connecting}
        >
          {connecting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <InstagramIcon className="w-4 h-4 mr-2" />
          )}
          Connect Instagram
        </Button>

        <div className="space-y-2 text-xs text-muted-foreground">
          <p>✓ Read follower insights and demographics</p>
          <p>✓ Access content performance metrics</p>
          <p>✓ Publish and schedule posts</p>
          <p>✓ Manage direct messages</p>
        </div>
      </CardContent>
    </Card>
  )
}
