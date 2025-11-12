import { useState, useEffect } from 'react'
import { Trash2, Lock, Shield } from 'lucide-react'
import { useAuth } from '../lib/auth/context'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import { AlertCircle } from 'lucide-react'

interface Manager {
  id: string
  email: string
  fullName?: string
  profilePictureUrl?: string
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

export function ArtistAccessDashboard() {
  const { user, token } = useAuth()
  const [managers, setManagers] = useState<Manager[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch managers with access
  useEffect(() => {
    if (user?.id) {
      fetchManagers()
    }
  }, [token, user?.id])

  const fetchManagers = async () => {
    if (!token || !user?.id) return

    try {
      setLoading(true)
      const response = await fetch(`/api/manager/managers/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setManagers(data.managers || [])
        setError(null)
      } else {
        setError('Failed to load managers')
      }
    } catch (err) {
      console.error('Error fetching managers:', err)
      setError('An error occurred while loading managers')
    } finally {
      setLoading(false)
    }
  }

  const handleRevokeAccess = async (managerId: string) => {
    if (!token || !user?.id || !confirm('Are you sure you want to revoke this manager\'s access?')) return

    try {
      const response = await fetch(`/api/manager/revoke-access/${managerId}/${user.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        await fetchManagers()
      } else {
        setError('Failed to revoke access')
      }
    } catch (err) {
      console.error('Error revoking access:', err)
      setError('An error occurred while revoking access')
    }
  }

  const getPermissionCount = (permissions: Manager['permissions']) => {
    return Object.values(permissions).filter(Boolean).length
  }

  const getActivePermissions = (permissions: Manager['permissions']) => {
    return Object.entries(permissions)
      .filter(([, value]) => value)
      .map(([key]) => key)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Account Access</h2>
        <p className="text-muted-foreground">Managers and collaborators with access to your profile</p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Managers List */}
      {loading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">Loading manager access...</div>
          </CardContent>
        </Card>
      ) : managers.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              No managers have access to your profile yet.
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {managers.map((manager) => {
            const activePermissions = getActivePermissions(manager.permissions)
            const permissionCount = getPermissionCount(manager.permissions)

            return (
              <Card key={manager.id}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Manager Info */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        {manager.profilePictureUrl && (
                          <img
                            src={manager.profilePictureUrl}
                            alt={manager.fullName}
                            className="w-12 h-12 rounded-full"
                          />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{manager.fullName || 'Manager'}</h3>
                            <Shield className="w-4 h-4 text-blue-600" />
                          </div>
                          <p className="text-sm text-muted-foreground">{manager.email}</p>
                          {manager.approvedAt && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Access granted: {new Date(manager.approvedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRevokeAccess(manager.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Permissions */}
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold">Permissions</h4>
                        <Badge variant="outline">
                          {permissionCount}/{Object.keys(manager.permissions).length}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {activePermissions.map((perm) => (
                          <Badge key={perm} variant="secondary" className="justify-start">
                            <Lock className="w-3 h-3 mr-1" />
                            {perm.replace(/([A-Z])/g, ' $1').trim()}
                          </Badge>
                        ))}
                      </div>
                      {permissionCount === 0 && (
                        <p className="text-sm text-muted-foreground mt-2">
                          No permissions granted
                        </p>
                      )}
                    </div>

                    {/* Status */}
                    <div className="border-t pt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-sm text-muted-foreground">
                          Status: {manager.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
