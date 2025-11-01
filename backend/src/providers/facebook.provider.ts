import { ProviderAdapter, MusicIdentity, MusicTaste } from './types'

function parseFacebookHandleOrUrl(input?: { handle?: string; profileUrl?: string }) {
  let handle = input?.handle?.trim()
  let profileUrl = input?.profileUrl
  if (!handle && profileUrl) {
    try {
      const url = new URL(profileUrl)
      if (url.hostname.includes('facebook.com')) {
        const parts = url.pathname.split('/').filter(Boolean)
        if (parts[0] && parts[0] !== 'profile.php') {
          handle = decodeURIComponent(parts[0])
        }
        // If profile.php?id=xxxx
        if (!handle && url.searchParams.has('id')) {
          handle = url.searchParams.get('id') || undefined
        }
      }
    } catch {}
  }
  return { handle, profileUrl }
}

export const facebookProvider: ProviderAdapter = {
  async resolveIdentity(input) {
    const { handle, profileUrl } = parseFacebookHandleOrUrl({ handle: input.handle, profileUrl: input.profileUrl })
    const id: MusicIdentity = {
      provider: 'facebook' as any,
      providerUserId: handle || input.providerUserId || 'unknown',
      profileUrl: profileUrl ?? (handle ? `https://www.facebook.com/${encodeURIComponent(handle)}/` : undefined),
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
