import { ProviderAdapter, MusicIdentity, MusicTaste, MusicIdentity as MusicIdentitySchema, MusicTaste as MusicTasteSchema } from './types'

// Minimal stub adapters. Implementations can be replaced with real API clients later.
const spotifyAdapter: ProviderAdapter = {
  async resolveIdentity(input): Promise<MusicIdentity> {
    if (!input.providerUserId && !input.accessToken && !input.handle && !input.profileUrl) {
      throw new Error('spotify: insufficient identity input')
    }
    const identity = {
      provider: 'spotify' as const,
      providerUserId: input.providerUserId ?? 'self',
      profileUrl: input.profileUrl,
      handle: input.handle,
    }
    return MusicIdentitySchema.parse(identity)
  },
  async fetchTaste(_identity): Promise<MusicTaste> {
    const taste = { topArtists: [], topGenres: [], topTracks: [], playlists: [] }
    return MusicTasteSchema.parse(taste)
  },
}

const amazonAdapter: ProviderAdapter = {
  async resolveIdentity(input): Promise<MusicIdentity> {
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
  async fetchTaste(_identity): Promise<MusicTaste> {
    const taste = { topArtists: [], topGenres: [], topTracks: [], playlists: [] }
    return MusicTasteSchema.parse(taste)
  },
}

const registry = {
  spotify: spotifyAdapter,
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

export { spotifyAdapter, amazonAdapter }
