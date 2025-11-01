import { Badge } from './ui/badge'

type Provider = 'spotify' | 'amazon' | 'lastfm' | 'soundcloud' | 'deezer' | 'youtube' | 'audius' | 'instagram' | 'facebook' | 'tiktok'

export function ProviderBadge({ provider }: { provider: Provider }) {
  const label =
    provider === 'spotify'
      ? 'Spotify'
      : provider === 'amazon'
      ? 'Amazon Music'
      : provider === 'lastfm'
      ? 'Last.fm'
  : provider === 'soundcloud'
  ? 'SoundCloud'
  : provider === 'deezer'
  ? 'Deezer'
  : provider === 'youtube'
  ? 'YouTube'
  : provider === 'audius'
  ? 'Audius'
  : provider === 'instagram'
  ? 'Instagram'
  : provider === 'facebook'
  ? 'Facebook'
  : 'TikTok'

  const className =
    provider === 'spotify'
      ? 'bg-emerald-600 text-emerald-50 hover:bg-emerald-600/90'
      : provider === 'amazon'
      ? 'bg-amber-500 text-amber-950 hover:bg-amber-500/90'
      : provider === 'lastfm'
      ? 'bg-rose-600 text-rose-50 hover:bg-rose-600/90'
  : provider === 'soundcloud'
  ? 'bg-orange-500 text-orange-950 hover:bg-orange-500/90'
  : provider === 'deezer'
  ? 'bg-blue-600 text-blue-50 hover:bg-blue-600/90'
  : provider === 'youtube'
  ? 'bg-red-600 text-red-50 hover:bg-red-600/90'
  : provider === 'audius'
  ? 'bg-purple-600 text-purple-50 hover:bg-purple-600/90'
  : provider === 'instagram'
  ? 'bg-pink-600 text-pink-50 hover:bg-pink-600/90'
  : provider === 'facebook'
  ? 'bg-blue-700 text-blue-50 hover:bg-blue-700/90'
  : 'bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90'

  return (
    <Badge className={className} aria-label={`Provider: ${label}`}>
      {label}
    </Badge>
  )
}
