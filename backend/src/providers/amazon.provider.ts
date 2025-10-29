import { ProviderAdapter, MusicIdentity, MusicTaste } from './types'

function parseAmazonHandleOrId(input?: string): string | undefined {
  if (!input) return undefined
  try {
    const url = new URL(input)
    // Amazon Music URLs vary by locale; last path segment is typically user/handle or id
    const parts = url.pathname.split('/').filter(Boolean)
    return parts[parts.length - 1] || undefined
  } catch {
    return input
  }
}

/**
 * Amazon Music provider (stub)
 * No public API for user taste; returns empty taste without scraping.
 * TODO: Integrate with first-party APIs or data shares if/when available.
 */
export const amazonProvider: ProviderAdapter = {
  async resolveIdentity(input): Promise<MusicIdentity> {
    const id = input.providerUserId || input.handle || parseAmazonHandleOrId(input.profileUrl)
    if (!id) throw new Error('amazon.resolveIdentity: missing user identifier')
    return {
      provider: 'amazon',
      providerUserId: id,
      profileUrl: input.profileUrl,
      handle: input.handle,
    }
  },

  async fetchTaste(_identity, _options?: { accessToken?: string }): Promise<MusicTaste> {
    return { topArtists: [], topGenres: [], topTracks: [], playlists: [] }
  },
}
