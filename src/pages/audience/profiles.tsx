import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfiles, useIngestProfile, useProfileCounts, ProfileDTO } from '../../hooks/useProfiles'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { Label } from '../../components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { Badge } from '../../components/ui/badge'
import { ProviderBadge } from '../../components/ProviderBadge'
import { IngestStatusBadge } from '../../components/IngestStatusBadge'

type ProviderType = 'spotify' | 'amazon' | 'lastfm' | 'soundcloud' | 'deezer' | 'youtube' | 'audius'

export default function ProfilesPage() {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [provider, setProvider] = useState<ProviderType>('spotify')
  const [handleOrUrl, setHandleOrUrl] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [providerFilter, setProviderFilter] = useState<ProviderType | ''>('')
  const [tagFilter, setTagFilter] = useState<string>('')

  const { data, isLoading, isError } = useProfiles(q, providerFilter || undefined, tagFilter || undefined)
  const ingest = useIngestProfile()
  const { data: counts } = useProfileCounts()

  const profiles = data ?? []

  function timeAgo(iso?: string) {
    if (!iso) return ''
    const d = new Date(iso)
    const diffMs = Date.now() - d.getTime()
    const sec = Math.floor(diffMs / 1000)
    const min = Math.floor(sec / 60)
    const hr = Math.floor(min / 60)
    const day = Math.floor(hr / 24)
    if (day > 0) return `${day}d ago`
    if (hr > 0) return `${hr}h ago`
    if (min > 0) return `${min}m ago`
    return 'just now'
  }

  const enabledProviders = useMemo(() => {
    const list: ProviderType[] = ['spotify', 'amazon']
    if ((import.meta as any).env?.VITE_ENABLE_LASTFM === 'true') list.push('lastfm')
    if ((import.meta as any).env?.VITE_ENABLE_SOUNDCLOUD === 'true') list.push('soundcloud')
    if ((import.meta as any).env?.VITE_ENABLE_DEEZER === 'true') list.push('deezer')
    if ((import.meta as any).env?.VITE_ENABLE_YOUTUBE === 'true') list.push('youtube')
    if ((import.meta as any).env?.VITE_ENABLE_AUDIUS === 'true') list.push('audius')
    return list
  }, [])

  const canIngest = useMemo(() => handleOrUrl.trim().length > 0, [handleOrUrl])


  return (
    <div className="space-y-6">
      {/* Snapshot overview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Platforms overview</h3>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => setProviderFilter('')} disabled={!providerFilter}>Clear filter</Button>
            <Button size="sm" variant="outline" onClick={() => navigate('/audience/profiles/discover')}>Find profiles</Button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {(['spotify','amazon','lastfm','soundcloud','deezer','youtube','audius'] as ProviderType[]).map((pname) => {
            const count = (counts as any)?.byProvider?.[pname] ?? 0
            const active = providerFilter === pname
            return (
              <Button key={pname} variant={active ? 'default' : 'secondary'} className="justify-between" onClick={() => setProviderFilter(active ? '' : pname)}>
                <span className="flex items-center gap-2"><ProviderBadge provider={pname as any} /></span>
                <span className="text-xs opacity-80">{count}</span>
              </Button>
            )
          })}
        </div>
      </div>
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search profiles by name"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Provider</Label>
          <Select value={provider} onValueChange={(v: string) => setProvider(v as ProviderType)}>
            <SelectTrigger>
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent>
              {enabledProviders.includes('spotify') && (
                <SelectItem value="spotify">Spotify</SelectItem>
              )}
              {enabledProviders.includes('amazon') && (
                <SelectItem value="amazon">Amazon Music</SelectItem>
              )}
              {enabledProviders.includes('lastfm') && (
                <SelectItem value="lastfm">Last.fm</SelectItem>
              )}
              {enabledProviders.includes('soundcloud') && (
                <SelectItem value="soundcloud">SoundCloud</SelectItem>
              )}
              {enabledProviders.includes('deezer') && (
                <SelectItem value="deezer">Deezer</SelectItem>
              )}
              {enabledProviders.includes('youtube') && (
                <SelectItem value="youtube">YouTube</SelectItem>
              )}
              {enabledProviders.includes('audius') && (
                <SelectItem value="audius">Audius</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="handle">Handle or profile URL</Label>
          <Input
            id="handle"
            placeholder={
              provider === 'spotify'
                ? 'spotify handle or https://open.spotify.com/user/...'
                : provider === 'amazon'
                ? 'amazon handle or URL'
                : provider === 'lastfm'
                ? 'last.fm username or https://www.last.fm/user/...'
                : provider === 'soundcloud'
                ? 'soundcloud handle or https://soundcloud.com/...'
        : provider === 'deezer'
        ? 'deezer user id or https://www.deezer.com/profile/...'
        : provider === 'youtube'
        ? 'youtube @handle or https://www.youtube.com/channel/UC...'
        : 'audius handle or https://audius.co/<handle>'
            }
            value={handleOrUrl}
            onChange={(e) => setHandleOrUrl(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tagfilter">Filter by tag</Label>
          <Input
            id="tagfilter"
            placeholder="e.g., hip-hop, rnb, pop"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
          />
        </div>

        <div className="flex items-end gap-2">
          <Button
            className="w-full md:w-auto"
            onClick={() => ingest.mutate({ provider, handleOrUrl, accessToken: accessToken || undefined })}
            disabled={!canIngest || ingest.isPending}
          >
            {ingest.isPending ? 'Ingesting…' : 'Ingest'}
          </Button>
          <IngestStatusBadge status={ingest.isPending ? 'pending' : ingest.isSuccess ? 'success' : ingest.isError ? 'error' : 'idle'} />
        </div>

        <div className="md:col-span-4 -mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="token">Access token (optional)</Label>
              <Input
                id="token"
                placeholder={
                  provider === 'spotify'
                    ? 'Paste Spotify access token (optional)'
                    : 'Access token not required for this provider'
                }
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Discover moved to sub-page */}

      {/* States */}
      {isLoading && <p className="text-sm text-muted-foreground">Loading profiles…</p>}
      {isError && <p className="text-sm text-destructive">Failed to load profiles.</p>}
      {!isLoading && profiles.length === 0 && (
        <p className="text-sm text-muted-foreground">No profiles found. Try searching or ingest a profile above.</p>
      )}

      {/* Profiles grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {profiles.map((p: ProfileDTO) => {
          const lastfmId = p.identities?.find((id) => (id as any).provider === 'lastfm') || p.identities?.[0]
          const subtitle = lastfmId?.handle ? `@${lastfmId.handle}` : ''
          return (
            <Card key={p._id} className="cursor-pointer hover:border-primary/50" onClick={() => navigate(`/audience/profiles/${p._id}`)}>
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between w-full">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage src={p.avatarUrl} alt={p.displayName} />
                      <AvatarFallback>{(p.displayName || '?').slice(0,2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="truncate" title={p.displayName}>{p.displayName}</div>
                      {subtitle && (
                        <div className="text-xs text-muted-foreground truncate" title={subtitle}>
                          {subtitle}
                          {lastfmId?.profileUrl && (
                            <>
                              {' '}
                              •{' '}
                              <a className="text-primary hover:underline" href={lastfmId.profileUrl} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>Profile</a>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {p.bio && (
                  <p className="text-xs text-muted-foreground line-clamp-2" title={p.bio}>{p.bio}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {p.identities.map((id) => (
                    <ProviderBadge key={`${(id as any).provider}:${id.providerUserId}`} provider={(id as any).provider as any} />
                  ))}
                </div>
                {/* Social counts if available (Spotify, Last.fm, YouTube, etc.) */}
                {(() => {
                  const parts: string[] = []
                  const spotify = p.identities.find((id: any) => id.provider === 'spotify') as any
                  if (spotify) {
                    if (typeof spotify?.followersCount === 'number') parts.push(`${spotify.followersCount.toLocaleString()} followers`)
                    if (typeof spotify?.followingCount === 'number') parts.push(`${spotify.followingCount.toLocaleString()} following`)
                  }
                  const lf = p.identities.find((id: any) => id.provider === 'lastfm') as any
                  if (lf) {
                    if (typeof lf?.friendsCount === 'number') parts.push(`${lf.friendsCount.toLocaleString()} friends`)
                    if (typeof lf?.neighboursCount === 'number') parts.push(`${lf.neighboursCount.toLocaleString()} neighbours`)
                  }
                  const yt = p.identities.find((id: any) => id.provider === 'youtube') as any
                  if (yt && typeof yt?.followersCount === 'number') {
                    parts.push(`${yt.followersCount.toLocaleString()} subscribers`)
                  }
                  return parts.length > 0 ? (
                    <p className="text-xs text-muted-foreground">{parts.join(' • ')}</p>
                  ) : null
                })()}
                {p.taste?.topGenres && p.taste.topGenres.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {p.taste.topGenres.slice(0, 5).map((g) => (
                      <Badge key={g} variant="outline">{g}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No genres yet</p>
                )}
                {p.taste?.topArtists && p.taste.topArtists.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {p.taste.topArtists.slice(0, 3).map((a) => (
                      <Badge key={a.id || a.name} variant="secondary">{a.name}</Badge>
                    ))}
                  </div>
                )}
                {p.interestTags && p.interestTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {p.interestTags.slice(0, 6).map((t) => (
                      <Badge key={t} variant="outline">{t}</Badge>
                    ))}
                  </div>
                )}
                {p.updatedAt && (
                  <p className="text-[10px] text-muted-foreground">Updated {timeAgo(p.updatedAt)}</p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
