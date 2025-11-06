import { useEffect, useMemo, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import { AlertCircle, Play, Save, Shield } from 'lucide-react'

const API_BASE = '' // rely on /api proxy

function adminFetch<T>(path: string, adminKey: string, init?: RequestInit): Promise<T> {
  const key = (adminKey || '').trim()
  return fetch(`${API_BASE}/api${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': key,
      ...(init?.headers || {}),
    },
    credentials: 'include',
  }).then(async (res) => {
    const contentType = res.headers.get('content-type') || ''
    const isJson = contentType.includes('application/json')
    const payload = isJson ? await res.json().catch(() => undefined) : await res.text().catch(() => undefined)
    if (!res.ok) {
      const err = (isJson ? payload?.error : payload) ?? `${res.status} ${res.statusText}`
      throw new Error(typeof err === 'string' ? err : JSON.stringify(err))
    }
    return (payload as T) ?? (undefined as unknown as T)
  })
}

type Settings = {
  enabled: boolean
  genres: string[]
  artistTypes: string[]
  maxResults: number
  maxCombosPerRun: number
  intervalMs: number
  includePlaylistExpansion?: boolean
  expansionSeedLimit?: number
  expansionPerUserPlaylistLimit?: number
  expansionPerPlaylistTrackLimit?: number
  expansionMaxNewUsers?: number
  lastRunAt?: string
  lastRunSummary?: {
    at: string
    durationMs?: number
    totals?: { found: number; saved: number; combos: number }
    results?: Array<{ genre: string; artistType: string; found: number; saved: number }>
  }
  runHistory?: Array<{
    at: string
    durationMs?: number
    totals?: { found: number; saved: number; combos: number }
    results?: Array<{ genre: string; artistType: string; found: number; saved: number }>
  }>
}

export default function AdminDiscoveryPanel() {
  const [adminKey, setAdminKey] = useState<string>(() => localStorage.getItem('adminKey') || '')
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [genresInput, setGenresInput] = useState('')
  const [artistTypesInput, setArtistTypesInput] = useState('')
  const [refreshLimit, setRefreshLimit] = useState<number>(200)
  const [seedLimit, setSeedLimit] = useState<number>(50)
  const [perUserPlaylistLimit, setPerUserPlaylistLimit] = useState<number>(5)
  const [perPlaylistTrackLimit, setPerPlaylistTrackLimit] = useState<number>(100)
  const [maxNewUsers, setMaxNewUsers] = useState<number>(200)
  // Spotify actions state
  const [userAccessToken, setUserAccessToken] = useState<string>('')
  const [followUserIds, setFollowUserIds] = useState<string>('')
  const [followPlaylistId, setFollowPlaylistId] = useState<string>('')
  const [followPlaylistPublic, setFollowPlaylistPublic] = useState<boolean>(true)
  const [newPlaylistName, setNewPlaylistName] = useState<string>('Fan Collab Playlist')
  const [newPlaylistDesc, setNewPlaylistDesc] = useState<string>('Collaborative fan playlist')
  const [newPlaylistPublic, setNewPlaylistPublic] = useState<boolean>(false)
  const [newPlaylistCollaborative, setNewPlaylistCollaborative] = useState<boolean>(true)
  const [seedTrackUris, setSeedTrackUris] = useState<string>('')

  useEffect(() => {
    if (!adminKey) return
    setError(null)
    setLoading(true)
    adminFetch<{ ok: true; data: Settings }>(`/admin/discovery/settings`, adminKey)
      .then((res) => {
        setSettings(res.data)
        setGenresInput(res.data.genres?.join(', ') || '')
        setArtistTypesInput(res.data.artistTypes?.join(', ') || '')
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [adminKey])

  const parsedGenres = useMemo(
    () => genresInput.split(',').map((s) => s.trim()).filter(Boolean).map((s) => s.toLowerCase()),
    [genresInput]
  )
  const parsedArtistTypes = useMemo(
    () => artistTypesInput.split(',').map((s) => s.trim()).filter(Boolean).map((s) => s.toLowerCase()),
    [artistTypesInput]
  )

  function saveKey() {
    const key = (adminKey || '').trim()
    setAdminKey(key)
    localStorage.setItem('adminKey', key)
  }

  async function saveSettings() {
    if (!adminKey) {
      setError('Admin key is required')
      return
    }
    console.log('[AdminDiscovery] Save Settings clicked')
    setSaving(true)
    setError(null)
    try {
      const body = {
        enabled: settings?.enabled ?? true,
        genres: parsedGenres,
        artistTypes: parsedArtistTypes,
        maxResults: settings?.maxResults ?? 100,
        maxCombosPerRun: settings?.maxCombosPerRun ?? 6,
        intervalMs: settings?.intervalMs ?? 900000,
        includePlaylistExpansion: settings?.includePlaylistExpansion ?? false,
        expansionSeedLimit: settings?.expansionSeedLimit ?? 50,
        expansionPerUserPlaylistLimit: settings?.expansionPerUserPlaylistLimit ?? 5,
        expansionPerPlaylistTrackLimit: settings?.expansionPerPlaylistTrackLimit ?? 100,
        expansionMaxNewUsers: settings?.expansionMaxNewUsers ?? 200,
      }
      console.log('[AdminDiscovery] POST /admin/discovery/settings', body)
      const res = await adminFetch<{ ok: true; data: Settings }>(`/admin/discovery/settings`, adminKey, {
        method: 'POST',
        body: JSON.stringify(body),
      })
      console.log('[AdminDiscovery] Settings saved', res)
      setSettings(res.data)
    } catch (e: any) {
      console.error('[AdminDiscovery] Save settings error', e)
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function runNow() {
    if (!adminKey) {
      setError('Admin key is required')
      return
    }
    console.log('[AdminDiscovery] Run Now clicked')
    setRunning(true)
    setError(null)
    try {
      console.log('[AdminDiscovery] POST /admin/discovery/run')
      const res = await adminFetch<{ ok: true; data: { results: Array<{ genre: string; artistType: string; found: number; saved: number }>; ran: number; totals?: { found: number; saved: number; combos: number }; durationMs?: number } }>(`/admin/discovery/run`, adminKey, {
        method: 'POST',
        body: JSON.stringify({}),
      })
      // Refresh last run info
      const refreshed = await adminFetch<{ ok: true; data: Settings }>(`/admin/discovery/settings`, adminKey)
      setSettings(refreshed.data)
      console.log('[AdminDiscovery] Run completed', res)
      const totals = res.data.totals
      const msg = totals ? `Run completed: combos=${totals.combos}, found=${totals.found}, saved=${totals.saved}.` : `Run completed: ran ${res.data.ran} combos.`
      alert(msg)
    } catch (e: any) {
      console.error('[AdminDiscovery] Run now error', e)
      setError(e.message)
    } finally {
      setRunning(false)
    }
  }

  async function refreshFollowers() {
    if (!adminKey) {
      setError('Admin key is required')
      return
    }
    setRunning(true)
    setError(null)
    try {
      console.log('[AdminDiscovery] POST /admin/discovery/refresh-followers', { limit: refreshLimit })
      const res = await adminFetch<{ ok: true; data: { scanned: number; updated: number } }>(`/admin/discovery/refresh-followers`, adminKey, {
        method: 'POST',
        body: JSON.stringify({ limit: refreshLimit, onlyMissing: true }),
      })
      alert(`Refreshed follower counts: scanned=${res.data.scanned}, updated=${res.data.updated}`)
    } catch (e: any) {
      console.error('[AdminDiscovery] refresh followers error', e)
      setError(e.message)
    } finally {
      setRunning(false)
    }
  }

  async function expandPlaylists() {
    if (!adminKey) {
      setError('Admin key is required')
      return
    }
    setRunning(true)
    setError(null)
    try {
      const body = {
        seedLimit,
        perUserPlaylistLimit,
        perPlaylistTrackLimit,
        maxNewUsers,
      }
      console.log('[AdminDiscovery] POST /admin/discovery/expand-playlists', body)
      const res = await adminFetch<{ ok: true; data: { found: number; saved: number; durationMs?: number } }>(
        `/admin/discovery/expand-playlists`,
        adminKey,
        { method: 'POST', body: JSON.stringify(body) }
      )
      // Refresh settings to show run history
      const refreshed = await adminFetch<{ ok: true; data: Settings }>(`/admin/discovery/settings`, adminKey)
      setSettings(refreshed.data)
      alert(`Playlist expansion: found=${res.data.found}, saved=${res.data.saved}${
        typeof res.data.durationMs === 'number' ? ` in ${Math.round((res.data.durationMs as number)/1000)}s` : ''
      }`)
    } catch (e: any) {
      console.error('[AdminDiscovery] expand playlists error', e)
      setError(e.message)
    } finally {
      setRunning(false)
    }
  }

  // Spotify action handlers
  async function followUsers() {
    if (!adminKey) return setError('Admin key is required')
    if (!userAccessToken) return setError('Spotify user access token is required')
    const ids = followUserIds.split(',').map((s) => s.trim()).filter(Boolean)
    if (ids.length === 0) return setError('Enter at least one Spotify user ID')
    setRunning(true)
    setError(null)
    try {
      const res = await adminFetch<{ ok: true; data: { followed: number } }>(
        `/admin/spotify/follow-users`,
        adminKey,
        { method: 'POST', body: JSON.stringify({ accessToken: userAccessToken, userIds: ids }) }
      )
      alert(`Followed ${res.data.followed} users as the authorized account`)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setRunning(false)
    }
  }

  async function followPlaylist() {
    if (!adminKey) return setError('Admin key is required')
    if (!userAccessToken) return setError('Spotify user access token is required')
    if (!followPlaylistId.trim()) return setError('Enter a playlist ID')
    setRunning(true)
    setError(null)
    try {
      await adminFetch<{ ok: true; data: { followed: boolean } }>(`/admin/spotify/follow-playlist`, adminKey, {
        method: 'POST',
        body: JSON.stringify({ accessToken: userAccessToken, playlistId: followPlaylistId.trim(), public: followPlaylistPublic }),
      })
      alert(`Playlist followed`)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setRunning(false)
    }
  }

  async function createCollabPlaylist() {
    if (!adminKey) return setError('Admin key is required')
    if (!userAccessToken) return setError('Spotify user access token is required')
    if (!newPlaylistName.trim()) return setError('Enter a playlist name')
    setRunning(true)
    setError(null)
    try {
      const uris = seedTrackUris.split(',').map((s) => s.trim()).filter(Boolean)
      const res = await adminFetch<{ ok: true; data: { id: string; url?: string; collaborative: boolean } }>(
        `/admin/spotify/create-collab-playlist`,
        adminKey,
        {
          method: 'POST',
          body: JSON.stringify({
            accessToken: userAccessToken,
            name: newPlaylistName.trim(),
            description: newPlaylistDesc,
            public: newPlaylistPublic,
            collaborative: newPlaylistCollaborative,
            trackUris: uris,
          }),
        }
      )
      alert(`Created playlist ${res.data.id}${res.data.url ? ` • ${res.data.url}` : ''}`)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Shield className="w-6 h-6 text-accent" />
        <h2 className="text-2xl font-bold">Admin · Discovery Runner</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin Access</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Label htmlFor="admin-key">Admin API Key</Label>
          <div className="flex gap-2">
            <Input id="admin-key" value={adminKey} onChange={(e) => setAdminKey(e.target.value)} placeholder="Enter admin key" />
            <Button onClick={saveKey} variant="outline">Save</Button>
          </div>
          <p className="text-xs text-muted-foreground">The key is sent as an <code>x-admin-key</code> header to protected admin endpoints.</p>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Discovery Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading && <div className="text-sm text-muted-foreground">Loading settings…</div>}

          {settings && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Enabled</Label>
                  <div className="mt-2">
                    <Button variant={settings.enabled ? 'default' : 'outline'} onClick={() => setSettings({ ...settings, enabled: true })}>On</Button>
                    <Button variant={!settings.enabled ? 'default' : 'outline'} className="ml-2" onClick={() => setSettings({ ...settings, enabled: false })}>Off</Button>
                  </div>
                </div>
                <div>
                  <Label>Include playlist expansion</Label>
                  <div className="mt-2">
                    <Button variant={settings.includePlaylistExpansion ? 'default' : 'outline'} onClick={() => setSettings({ ...settings, includePlaylistExpansion: true })}>On</Button>
                    <Button variant={!settings.includePlaylistExpansion ? 'default' : 'outline'} className="ml-2" onClick={() => setSettings({ ...settings, includePlaylistExpansion: false })}>Off</Button>
                  </div>
                </div>

                <div>
                  <Label>Max results per combo</Label>
                  <Input type="number" className="mt-2" value={settings.maxResults} onChange={(e) => setSettings({ ...settings, maxResults: Math.max(1, Math.min(200, parseInt(e.target.value || '0'))) })} />
                </div>

                <div>
                  <Label>Max combos per run</Label>
                  <Input type="number" className="mt-2" value={settings.maxCombosPerRun} onChange={(e) => setSettings({ ...settings, maxCombosPerRun: Math.max(1, parseInt(e.target.value || '1')) })} />
                </div>

                <div>
                  <Label>Interval (ms)</Label>
                  <Input type="number" className="mt-2" value={settings.intervalMs} onChange={(e) => setSettings({ ...settings, intervalMs: Math.max(60000, parseInt(e.target.value || '60000')) })} />
                </div>
              </div>

              <div>
                <Label>Genres (comma separated)</Label>
                <Input className="mt-2" value={genresInput} onChange={(e) => setGenresInput(e.target.value)} />
                <div className="mt-2 flex flex-wrap gap-2">
                  {parsedGenres.map((g) => (
                    <Badge key={g} variant="secondary" className="capitalize">{g}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Artist Types (comma separated)</Label>
                <Input className="mt-2" value={artistTypesInput} onChange={(e) => setArtistTypesInput(e.target.value)} />
                <div className="mt-2 flex flex-wrap gap-2">
                  {parsedArtistTypes.map((t) => (
                    <Badge key={t} variant="outline" className="capitalize">{t}</Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={saveSettings} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" /> Save Settings
                </Button>
                <Button onClick={runNow} variant="secondary" disabled={running}>
                  <Play className="w-4 h-4 mr-2" /> Run Now
                </Button>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                <div>
                  <Label>Refresh follower counts (limit)</Label>
                  <Input type="number" className="mt-2" value={refreshLimit} onChange={(e) => setRefreshLimit(Math.max(1, Math.min(1000, parseInt(e.target.value || '1'))))} />
                </div>
                <div>
                  <Button onClick={refreshFollowers} disabled={running} className="w-full md:w-auto">
                    Refresh Followers (missing only)
                  </Button>
                </div>
              </div>

              {/* Playlist Expansion */}
              <div className="mt-6 border-t pt-4 space-y-3">
                <p className="text-sm font-medium">Playlist Contributor Expansion</p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <Label>Seed users (limit)</Label>
                    <Input type="number" className="mt-2" value={seedLimit} onChange={(e) => setSeedLimit(Math.max(1, Math.min(500, parseInt(e.target.value || '1'))))} />
                  </div>
                  <div>
                    <Label>Playlists per seed</Label>
                    <Input type="number" className="mt-2" value={perUserPlaylistLimit} onChange={(e) => setPerUserPlaylistLimit(Math.max(1, Math.min(20, parseInt(e.target.value || '1'))))} />
                  </div>
                  <div>
                    <Label>Tracks per playlist</Label>
                    <Input type="number" className="mt-2" value={perPlaylistTrackLimit} onChange={(e) => setPerPlaylistTrackLimit(Math.max(1, Math.min(100, parseInt(e.target.value || '1'))))} />
                  </div>
                  <div>
                    <Label>Max new users</Label>
                    <Input type="number" className="mt-2" value={maxNewUsers} onChange={(e) => setMaxNewUsers(Math.max(1, Math.min(1000, parseInt(e.target.value || '1'))))} />
                  </div>
                </div>
                <div>
                  <Button onClick={expandPlaylists} disabled={running} variant="secondary">
                    Expand via Playlists
                  </Button>
                </div>
              </div>

              {/* Spotify Actions */}
              <div className="mt-6 border-t pt-4 space-y-3">
                <p className="text-sm font-medium">Spotify Actions (authorized account)</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>User access token</Label>
                    <Input className="mt-2" placeholder="Paste Spotify user access token" value={userAccessToken} onChange={(e) => setUserAccessToken(e.target.value)} />
                    <p className="text-xs text-muted-foreground mt-1">This token must be from an authorized Spotify account with the proper scopes (follow, playlist modify).</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Follow users (comma-separated user IDs)</Label>
                    <Input value={followUserIds} onChange={(e) => setFollowUserIds(e.target.value)} placeholder="user1,user2" />
                    <Button onClick={followUsers} disabled={running}>Follow Users</Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Follow playlist (playlist ID)</Label>
                    <Input value={followPlaylistId} onChange={(e) => setFollowPlaylistId(e.target.value)} placeholder="playlistId" />
                    <div className="flex items-center gap-2">
                      <input id="pl-public" type="checkbox" checked={followPlaylistPublic} onChange={(e) => setFollowPlaylistPublic(e.target.checked)} />
                      <Label htmlFor="pl-public">Public follow</Label>
                    </div>
                    <Button onClick={followPlaylist} disabled={running}>Follow Playlist</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Create collaborative playlist</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input value={newPlaylistName} onChange={(e) => setNewPlaylistName(e.target.value)} placeholder="Playlist name" />
                    <Input value={newPlaylistDesc} onChange={(e) => setNewPlaylistDesc(e.target.value)} placeholder="Description (optional)" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="flex items-center gap-2">
                      <input id="pl-public-new" type="checkbox" checked={newPlaylistPublic} onChange={(e) => setNewPlaylistPublic(e.target.checked)} />
                      <Label htmlFor="pl-public-new">Public</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input id="pl-collab-new" type="checkbox" checked={newPlaylistCollaborative} onChange={(e) => setNewPlaylistCollaborative(e.target.checked)} />
                      <Label htmlFor="pl-collab-new">Collaborative</Label>
                    </div>
                  </div>
                  <Label>Seed track URIs (comma-separated, e.g., spotify:track:...)</Label>
                  <Input value={seedTrackUris} onChange={(e) => setSeedTrackUris(e.target.value)} placeholder="spotify:track:...,spotify:track:..." />
                  <Button onClick={createCollabPlaylist} disabled={running}>Create Collaborative Playlist</Button>
                </div>
              </div>

              {/* Last Run Summary */}
              {settings.lastRunSummary && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">Last Run • {new Date(settings.lastRunSummary.at || settings.lastRunAt || '').toLocaleString()}</p>
                  {settings.lastRunSummary.totals && (
                    <p className="text-sm text-muted-foreground">
                      Totals: combos={settings.lastRunSummary.totals.combos} • found={settings.lastRunSummary.totals.found} • saved={settings.lastRunSummary.totals.saved}
                      {typeof settings.lastRunSummary.durationMs === 'number' ? ` • duration=${Math.round((settings.lastRunSummary.durationMs as number)/1000)}s` : ''}
                    </p>
                  )}
                  {settings.lastRunSummary.results && settings.lastRunSummary.results.length > 0 && (
                    <div className="border rounded-md p-2">
                      <div className="grid grid-cols-3 md:grid-cols-4 text-xs font-medium text-muted-foreground px-2 py-1">
                        <div>Genre</div>
                        <div>Artist Type</div>
                        <div>Found</div>
                        <div className="hidden md:block">Saved</div>
                      </div>
                      <div className="divide-y">
                        {settings.lastRunSummary.results.map((r, idx) => (
                          <div key={idx} className="grid grid-cols-3 md:grid-cols-4 text-sm px-2 py-1">
                            <div className="capitalize">{r.genre}</div>
                            <div className="capitalize">{r.artistType}</div>
                            <div>{r.found}</div>
                            <div className="hidden md:block">{r.saved}</div>
                          </div>
                      
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Run History */}
              {settings.runHistory && settings.runHistory.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Run History</p>
                  <div className="space-y-2 max-h-64 overflow-auto">
                    {settings.runHistory.slice().reverse().map((h, i) => (
                      <div key={i} className="text-xs text-muted-foreground flex items-center justify-between border rounded-md px-2 py-1">
                        <span>{new Date(h.at).toLocaleString()}</span>
                        {h.totals && (
                          <span>combos={h.totals.combos} • found={h.totals.found} • saved={h.totals.saved}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
