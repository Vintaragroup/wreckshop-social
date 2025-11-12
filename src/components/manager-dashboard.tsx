import { useState, useEffect } from 'react'
import { Plus, Trash2, Lock, Unlock, Mail, Copy, Check } from 'lucide-react'
import { useAuth } from '../lib/auth/context'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Checkbox } from './ui/checkbox'
import { Alert, AlertDescription } from './ui/alert'
import { AlertCircle } from 'lucide-react'

interface ManagedArtist {
  id: string
  email: string
  stageName: string
  fullName?: string
  profilePictureUrl?: string
  genres: string[]
  isVerified: boolean
  permissions: {
    viewAnalytics: boolean
    createCampaign: boolean
    editCampaign: boolean
    deleteCampaign: boolean
    postSocial: boolean
    editProfile: boolean
    configureIntegrations: boolean
    inviteCollaborator: boolean
    manageTeam: boolean
  }
  status: string
  approvedAt?: string
}

export function ManagerDashboard() {
  const { user, token } = useAuth()
  const [artists, setArtists] = useState<ManagedArtist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [managerEmail, setManagerEmail] = useState('')
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null)
  const [permissionDialogOpen, setPermissionDialogOpen] = useState(false)
  const [grantingPermissions, setGrantingPermissions] = useState(false)
  const [copied, setCopied] = useState(false)

  // Fetch managed artists
  useEffect(() => {
    fetchManagedArtists()
  }, [token])

  const fetchManagedArtists = async () => {
    if (!token) return

    try {
      setLoading(true)
      const response = await fetch('/api/manager/artists', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setArtists(data.artists || [])
        setError(null)
      } else {
        setError('Failed to load managed artists')
      }
    } catch (err) {
      console.error('Error fetching artists:', err)
      setError('An error occurred while loading artists')
    } finally {
      setLoading(false)
    }
  }

  const handleGrantAccess = async () => {
    if (!selectedArtistId || !managerEmail || !token) return

    try {
      setGrantingPermissions(true)
      const response = await fetch('/api/manager/grant-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          artistId: selectedArtistId,
          managerEmail,
          permissions: {
            viewAnalytics: true,
            createCampaign: false,
            editCampaign: false,
            deleteCampaign: false,
            postSocial: false,
            editProfile: false,
            configureIntegrations: true,
            inviteCollaborator: false,
            manageTeam: false,
          },
        }),
      })

      if (response.ok) {
        setManagerEmail('')
        setAddDialogOpen(false)
        await fetchManagedArtists()
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to grant access')
      }
    } catch (err) {
      console.error('Error granting access:', err)
      setError('An error occurred while granting access')
    } finally {
      setGrantingPermissions(false)
    }
  }

  const handleRevokeAccess = async (managerId: string, artistId: string) => {
    if (!token || !confirm('Are you sure you want to revoke this manager\'s access?')) return

    try {
      const response = await fetch(`/api/manager/revoke-access/${managerId}/${artistId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        await fetchManagedArtists()
      } else {
        setError('Failed to revoke access')
      }
    } catch (err) {
      console.error('Error revoking access:', err)
      setError('An error occurred while revoking access')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!user || user.accountType !== 'ARTIST_AND_MANAGER') {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          You need a Manager account to access this feature. Please upgrade your account to manage artists.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Manage Artists</h2>
          <p className="text-muted-foreground">Grant and manage access for artists you work with</p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Artist Access
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Grant Manager Access</DialogTitle>
              <DialogDescription>
                Enter the email of the artist you want to manage
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Your Artists</Label>
                <select
                  value={selectedArtistId || ''}
                  onChange={(e) => setSelectedArtistId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Select an artist...</option>
                  {/* In a real app, this would fetch the user's own artists */}
                  <option value="sample">Your Artist Profile</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Manager Email</Label>
                <Input
                  placeholder="manager@example.com"
                  value={managerEmail}
                  onChange={(e) => setManagerEmail(e.target.value)}
                  type="email"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleGrantAccess}
                disabled={grantingPermissions || !selectedArtistId || !managerEmail}
              >
                Grant Access
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Artists List */}
      {loading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">Loading managed artists...</div>
          </CardContent>
        </Card>
      ) : artists.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              No managed artists yet. Grant access to start collaborating.
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {artists.map((artist) => (
            <Card key={artist.id}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Artist Info */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      {artist.profilePictureUrl && (
                        <img
                          src={artist.profilePictureUrl}
                          alt={artist.stageName}
                          className="w-12 h-12 rounded-full"
                        />
                      )}
                      <div>
                        <h3 className="font-semibold">{artist.stageName}</h3>
                        <p className="text-sm text-muted-foreground">{artist.email}</p>
                        {artist.genres.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {artist.genres.slice(0, 3).map((genre) => (
                              <Badge key={genre} variant="secondary" className="text-xs">
                                {genre}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRevokeAccess(user.id, artist.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Permissions */}
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-semibold mb-3">Permissions</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(artist.permissions).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2">
                          {value ? (
                            <Unlock className="w-4 h-4 text-green-600" />
                          ) : (
                            <Lock className="w-4 h-4 text-gray-400" />
                          )}
                          <span className="text-sm capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Copy Artist ID */}
                  <div className="border-t pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => copyToClipboard(artist.id)}
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copied Artist ID
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Artist ID
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
