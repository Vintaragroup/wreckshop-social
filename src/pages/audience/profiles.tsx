import { useState, useMemo } from 'react'
import { useProfiles, useIngestProfile, ProfileDTO } from '../../hooks/useProfiles'
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
import { Badge } from '../../components/ui/badge'

export default function ProfilesPage() {
  const [q, setQ] = useState('')
  const [provider, setProvider] = useState<'spotify' | 'amazon'>('spotify')
  const [handleOrUrl, setHandleOrUrl] = useState('')
  const [accessToken, setAccessToken] = useState('')

  const { data, isLoading, isError } = useProfiles(q)
  const ingest = useIngestProfile()

  const profiles = data ?? []

  const canIngest = useMemo(() => handleOrUrl.trim().length > 0, [handleOrUrl])

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
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
          <Select value={provider} onValueChange={(v: string) => setProvider(v as 'spotify' | 'amazon')}>
            <SelectTrigger>
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="spotify">Spotify</SelectItem>
              <SelectItem value="amazon">Amazon Music</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="handle">Handle or profile URL</Label>
          <Input
            id="handle"
            placeholder={provider === 'spotify' ? 'spotify handle or https://open.spotify.com/user/...' : 'amazon handle or URL'}
            value={handleOrUrl}
            onChange={(e) => setHandleOrUrl(e.target.value)}
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
        </div>

        <div className="md:col-span-4 -mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="token">Access token (optional)</Label>
              <Input
                id="token"
                placeholder="Paste Spotify access token (optional)"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* States */}
      {isLoading && <p className="text-sm text-muted-foreground">Loading profiles…</p>}
      {isError && <p className="text-sm text-destructive">Failed to load profiles.</p>}
      {!isLoading && profiles.length === 0 && (
        <p className="text-sm text-muted-foreground">No profiles found. Try searching or ingest a profile above.</p>
      )}

      {/* Profiles grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {profiles.map((p: ProfileDTO) => (
          <Card key={p._id}>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span className="truncate" title={p.displayName}>{p.displayName}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {p.identities.map((id) => (
                  <Badge key={`${id.provider}:${id.providerUserId}`} variant="secondary">
                    {id.provider}
                  </Badge>
                ))}
              </div>
              {p.taste?.topGenres && p.taste.topGenres.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {p.taste.topGenres.slice(0, 5).map((g) => (
                    <Badge key={g} variant="outline">{g}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No genres yet</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
