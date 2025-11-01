import { ProviderAdapter, MusicIdentity, MusicTaste } from './types'

function parseInstagramHandleOrUrl(input?: { handle?: string; profileUrl?: string }) {
  let handle = input?.handle?.trim()
  let profileUrl = input?.profileUrl
  if (!handle && profileUrl) {
    try {
      const url = new URL(profileUrl)
      if (url.hostname.includes('instagram.com')) {
        const parts = url.pathname.split('/').filter(Boolean)
        if (parts[0]) handle = decodeURIComponent(parts[0])
      }
    } catch {}
  }
  if (handle?.startsWith('@')) handle = handle.slice(1)
  return { handle, profileUrl }
}

export const instagramProvider: ProviderAdapter = {
  async resolveIdentity(input) {
    const { handle, profileUrl } = parseInstagramHandleOrUrl({ handle: input.handle, profileUrl: input.profileUrl })
    const id: MusicIdentity = {
      provider: 'instagram' as any,
      providerUserId: handle || input.providerUserId || 'unknown',
      profileUrl: profileUrl ?? (handle ? `https://www.instagram.com/${encodeURIComponent(handle)}/` : undefined),
      handle: handle ?? input.handle,
    }
    return id
  },

  async fetchTaste(_identity) {
    // No public API; return empty taste. Enrichment can be implemented via external scripts if needed.
    const empty: MusicTaste = { topArtists: [], topGenres: [], topTracks: [], playlists: [] }
    return empty
  },
}
