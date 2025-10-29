import { ProviderAdapter, MusicIdentity as MusicIdentitySchema, MusicTaste as MusicTasteSchema } from './types'
import { spotifyProvider } from './spotify.provider'

const amazonAdapter: ProviderAdapter = {
  async resolveIdentity(input) {
    if (!input.providerUserId && !input.handle) {
      throw new Error('amazon: insufficient identity input')
    }
    const identity = {
      provider: 'amazon' as const,
      providerUserId: input.providerUserId ?? input.handle ?? 'self',
      profileUrl: input.profileUrl,
      handle: input.handle,
    }
    return MusicIdentitySchema.parse(identity)
  },
  async fetchTaste(_identity) {
    const taste = { topArtists: [], topGenres: [], topTracks: [], playlists: [] }
    return MusicTasteSchema.parse(taste)
  },
}

const registry = {
  spotify: spotifyProvider,
  amazon: amazonAdapter,
} as const

export type ProviderName = keyof typeof registry

export function getProvider(name: ProviderName): ProviderAdapter
export function getProvider(name: string): ProviderAdapter
export function getProvider(name: string): ProviderAdapter {
  const adapter = (registry as Record<string, ProviderAdapter>)[name]
  if (!adapter) {
    throw new Error(`Unknown provider: ${name}`)
  }
  return adapter
}

export { spotifyProvider, amazonAdapter }
