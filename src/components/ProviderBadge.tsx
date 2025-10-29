import { Badge } from './ui/badge'

type Provider = 'spotify' | 'amazon' | 'lastfm' | 'soundcloud'

export function ProviderBadge({ provider }: { provider: Provider }) {
  const label =
    provider === 'spotify'
      ? 'Spotify'
      : provider === 'amazon'
      ? 'Amazon Music'
      : provider === 'lastfm'
      ? 'Last.fm'
      : 'SoundCloud'

  const className =
    provider === 'spotify'
      ? 'bg-emerald-600 text-emerald-50 hover:bg-emerald-600/90'
      : provider === 'amazon'
      ? 'bg-amber-500 text-amber-950 hover:bg-amber-500/90'
      : provider === 'lastfm'
      ? 'bg-rose-600 text-rose-50 hover:bg-rose-600/90'
      : 'bg-orange-500 text-orange-950 hover:bg-orange-500/90'

  return (
    <Badge className={className} aria-label={`Provider: ${label}`}>
      {label}
    </Badge>
  )
}
