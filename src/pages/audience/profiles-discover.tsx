import { useMemo, useState } from 'react'
import { useIngestProfile, useDiscover } from '../../hooks/useProfiles'
import { useNavigate } from 'react-router-dom'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { Label } from '../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { ProviderBadge } from '../../components/ProviderBadge'

type ProviderType = 'soundcloud' | 'deezer' | 'youtube' | 'audius' | 'lastfm'

export default function ProfilesDiscoverPage() {
  const navigate = useNavigate()
  const [discoverQuery, setDiscoverQuery] = useState('')
  const [discoverProvider, setDiscoverProvider] = useState<ProviderType>('soundcloud')
  const [discoverGenre, setDiscoverGenre] = useState<string>('')
  const [discoverLimit, setDiscoverLimit] = useState<number>(20)
  const [bulkIngesting, setBulkIngesting] = useState<boolean>(false)
  const [bulkProgress, setBulkProgress] = useState<{ done: number; total: number }>({ done: 0, total: 0 })

  const ingest = useIngestProfile()

  const enabledProviders = useMemo(() => {
    const list: ProviderType[] = []
    if ((import.meta as any).env?.VITE_ENABLE_SOUNDCLOUD === 'true') list.push('soundcloud')
    if ((import.meta as any).env?.VITE_ENABLE_LASTFM === 'true') list.push('lastfm')
    if ((import.meta as any).env?.VITE_ENABLE_DEEZER === 'true') list.push('deezer')
    if ((import.meta as any).env?.VITE_ENABLE_YOUTUBE === 'true') list.push('youtube')
    if ((import.meta as any).env?.VITE_ENABLE_AUDIUS === 'true') list.push('audius')
    return list
  }, [])

  const { data: discoverResults = [], isFetching: isDiscovering } = useDiscover(
    discoverProvider,
    discoverQuery,
    discoverGenre,
    discoverLimit,
  )

  async function handleIngestAll() {
    if (!discoverResults || discoverResults.length === 0) return
    setBulkIngesting(true)
    setBulkProgress({ done: 0, total: discoverResults.length })
    for (const c of discoverResults) {
      const input = { provider: c.provider as any, handleOrUrl: c.profileUrl || c.handle || c.providerUserId }
      try {
        // @ts-ignore mutateAsync is available on useMutation result
        if (typeof (ingest as any).mutateAsync === 'function') await (ingest as any).mutateAsync(input)
        else ingest.mutate(input)
      } catch {}
      setBulkProgress((p) => ({ done: p.done + 1, total: p.total }))
    }
    setBulkIngesting(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Discover candidates</h2>
        <Button variant="ghost" onClick={() => navigate('/audience/profiles')}>Back to profiles</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
        <div className="space-y-2">
          <Label>Provider</Label>
          <Select value={discoverProvider} onValueChange={(v: string) => setDiscoverProvider(v as ProviderType)}>
            <SelectTrigger>
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent>
              {enabledProviders.includes('soundcloud') && (
                <SelectItem value="soundcloud">SoundCloud</SelectItem>
              )}
              {enabledProviders.includes('lastfm') && (
                <SelectItem value="lastfm">Last.fm</SelectItem>
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
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="discover-q">Search by name or handle</Label>
          <Input id="discover-q" placeholder="Type an artist, channel, or handle" value={discoverQuery} onChange={(e) => setDiscoverQuery(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Music interest</Label>
          <Select value={discoverGenre} onValueChange={(v: string) => setDiscoverGenre(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select genre/tag (optional)" />
            </SelectTrigger>
            <SelectContent>
              {['Hip-Hop','R&B','Pop','Rock','Electronic','Jazz','Country','Latin','Afrobeats','Reggae','Gospel','Metal','Indie'].map((g) => (
                <SelectItem key={g} value={g}>{g}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="discover-limit">Max results</Label>
          <Input id="discover-limit" type="number" min={1} max={50} value={discoverLimit} onChange={(e) => setDiscoverLimit(Math.max(1, Math.min(50, Number(e.target.value) || 10)))} />
        </div>
        <div className="flex items-end">
          <Button onClick={() => setDiscoverQuery(discoverQuery.trim())} disabled={(!discoverQuery.trim() && !discoverGenre.trim()) || isDiscovering} className="w-full md:w-auto">
            {isDiscovering ? 'Searching…' : 'Search'}
          </Button>
        </div>
      </div>

      {discoverResults && discoverResults.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Found {discoverResults.length} candidates</p>
            <Button size="sm" onClick={handleIngestAll} disabled={bulkIngesting}>{bulkIngesting ? `Ingesting ${bulkProgress.done}/${bulkProgress.total}…` : 'Ingest all results'}</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {discoverResults.map((c: any) => {
              const subtitle = c.handle ? `@${c.handle}` : (c.location || '')
              const stats: string[] = []
              if (typeof c.followers === 'number') stats.push(`${c.followers.toLocaleString()} followers`)
              if (typeof c.tracks === 'number') stats.push(`${c.tracks} tracks`)
              if (typeof c.playlists === 'number') stats.push(`${c.playlists} playlists`)
              return (
                <Card key={`${c.provider}:${c.providerUserId}`}>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center justify-between">
                      <span className="truncate" title={c.displayName}>{c.displayName}</span>
                      <ProviderBadge provider={c.provider as any} />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarImage src={c.avatarUrl} alt={c.displayName} />
                        <AvatarFallback>{(c.displayName || '?').slice(0,2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1 space-y-1">
                        {subtitle && <p className="text-xs text-muted-foreground truncate" title={subtitle}>{subtitle}</p>}
                        {c.profileUrl && (
                          <a href={c.profileUrl} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline break-all">{c.profileUrl}</a>
                        )}
                        {stats.length > 0 && (
                          <p className="text-xs text-muted-foreground">{stats.join(' • ')}</p>
                        )}
                        {c.bio && (
                          <p className="text-xs text-muted-foreground line-clamp-2" title={c.bio}>{c.bio}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <Button size="sm" variant="secondary" onClick={() => ingest.mutate({ provider: c.provider, handleOrUrl: c.profileUrl || c.handle || c.providerUserId })}>Ingest</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
