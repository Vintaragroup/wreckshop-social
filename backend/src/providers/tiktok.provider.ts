import { ProviderAdapter, MusicIdentity, MusicTaste } from './types'

function parseTikTokHandleOrUrl(input?: { handle?: string; profileUrl?: string }) {
  let handle = input?.handle?.trim()
  let profileUrl = input?.profileUrl
  if (!handle && profileUrl) {
    try {
      const url = new URL(profileUrl)
      if (url.hostname.includes('tiktok.com')) {
        const parts = url.pathname.split('/').filter(Boolean)
        // Expect /@handle at parts[0] or parts[1]
        const seg = parts.find((p) => p.startsWith('@'))
        if (seg) handle = seg.replace(/^@/, '')
      }
    } catch {}
  }
  if (handle?.startsWith('@')) handle = handle.slice(1)
  return { handle, profileUrl }
}

export const tiktokProvider: ProviderAdapter = {
  async resolveIdentity(input) {
    const { handle, profileUrl } = parseTikTokHandleOrUrl({ handle: input.handle, profileUrl: input.profileUrl })
    const id: MusicIdentity = {
      provider: 'tiktok' as any,
      providerUserId: handle || input.providerUserId || 'unknown',
      profileUrl: profileUrl ?? (handle ? `https://www.tiktok.com/@${encodeURIComponent(handle)}` : undefined),
      handle: handle ?? input.handle,
    }
    return id
  },

  async fetchTaste(_identity) {
    // No public API; return empty taste for now.
    const empty: MusicTaste = { topArtists: [], topGenres: [], topTracks: [], playlists: [] }
    return empty
  },
}
