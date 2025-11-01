import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { apiGetProfile, type ProfileDTO } from '../../lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { Badge } from '../../components/ui/badge'
import { ProviderBadge } from '../../components/ProviderBadge'

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

export default function ProfileDetailPage() {
  const { id = '' } = useParams()
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['profile', id],
    queryFn: () => apiGetProfile(id),
    enabled: !!id,
  })

  const p = data as ProfileDTO | undefined
  const lastfmId = useMemo(
    () => p?.identities?.find((i: any) => i.provider === 'lastfm') || p?.identities?.[0],
    [p],
  )

  if (isLoading) return <p className="text-sm text-muted-foreground p-4">Loading profile…</p>
  if (isError) return <p className="text-sm text-destructive p-4">Failed to load profile{error instanceof Error ? `: ${error.message}` : ''}.</p>
  if (!p) return <p className="text-sm text-muted-foreground p-4">Profile not found.</p>

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between w-full">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={p.avatarUrl} alt={p.displayName} />
                <AvatarFallback>{(p.displayName || '?').slice(0,2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="truncate text-lg font-semibold" title={p.displayName}>{p.displayName}</div>
                {lastfmId && (
                  <div className="text-xs text-muted-foreground truncate" title={lastfmId.handle || lastfmId.profileUrl}>
                    {lastfmId.handle ? `@${lastfmId.handle}` : ''}
                    {lastfmId.profileUrl && (
                      <>
                        {' '}•{' '}
                        <a className="text-primary hover:underline" href={lastfmId.profileUrl} target="_blank" rel="noreferrer">Profile</a>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-end">
              {p.identities.map((id) => (
                <ProviderBadge key={`${(id as any).provider}:${id.providerUserId}`} provider={(id as any).provider as any} />
              ))}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {p.bio && <p className="text-sm text-muted-foreground whitespace-pre-wrap">{p.bio}</p>}
          <p className="text-xs text-muted-foreground">Updated {timeAgo(p.updatedAt)} • Created {timeAgo(p.createdAt)}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm">Top genres</CardTitle>
          </CardHeader>
          <CardContent>
            {p.taste?.topGenres?.length ? (
              <div className="flex flex-wrap gap-2">
                {p.taste.topGenres.map((g) => (
                  <Badge key={g} variant="outline">{g}</Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No genres</p>
            )}
              {/* Social counts if available (Last.fm, YouTube, etc.) */}
              {(() => {
                const parts: string[] = []
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
                  <p className="mt-3 text-xs text-muted-foreground">{parts.join(' • ')}</p>
                ) : null
              })()}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Top artists & affinity</CardTitle>
          </CardHeader>
          <CardContent>
            {p.artistAffinity && p.artistAffinity.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {p.artistAffinity.map((a) => (
                  <Badge key={a.id || a.name} variant="secondary">{a.name} • {(a.score * 100).toFixed(0)}%</Badge>
                ))}
              </div>
            ) : p.taste?.topArtists?.length ? (
              <div className="flex flex-wrap gap-2">
                {p.taste.topArtists.map((a) => (
                  <Badge key={a.id || a.name} variant="secondary">{a.name}</Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No artists</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Top tracks</CardTitle>
          </CardHeader>
          <CardContent>
            {p.taste?.topTracks?.length ? (
              <ul className="text-sm list-disc pl-5 space-y-1">
                {p.taste.topTracks.map((t, idx) => (
                  <li key={`${t}-${idx}`} className="break-words">{t}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No tracks</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Playlists & tags</CardTitle>
          </CardHeader>
          <CardContent>
            {p.taste?.playlists?.length ? (
              <ul className="text-sm space-y-2">
                {p.taste.playlists.map((pl) => (
                  <li key={pl.id} className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate font-medium" title={pl.name}>{pl.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {typeof pl.trackCount === 'number' ? `${pl.trackCount} tracks` : 'Unknown length'}
                        {typeof pl.isPublic === 'boolean' ? ` • ${pl.isPublic ? 'Public' : 'Private'}` : ''}
                      </div>
                    </div>
                    {pl.url && (
                      <a className="text-xs text-primary hover:underline shrink-0" href={pl.url} target="_blank" rel="noreferrer">Open</a>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No playlists</p>
            )}

            {p.interestTags && p.interestTags.length > 0 && (
              <div className="mt-4">
                <div className="text-sm font-medium mb-2">Interest tags</div>
                <div className="flex flex-wrap gap-2">
                  {p.interestTags.map((t) => (
                    <Badge key={t} variant="outline">{t}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <Link to="/audience/profiles" className="text-sm text-primary hover:underline">Back to profiles</Link>
      </div>
    </div>
  )
}
