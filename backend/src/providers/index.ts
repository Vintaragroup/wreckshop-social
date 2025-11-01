import { ProviderAdapter } from './types'
import { spotifyProvider } from './spotify.provider'
import { amazonProvider } from './amazon.provider'
import { lastfmProvider } from './lastfm.provider'
import { soundcloudProvider } from './soundcloud.provider'
import { deezerProvider } from './deezer.provider'
import { youtubeProvider } from './youtube.provider'
import { audiusProvider } from './audius.provider'
import { instagramProvider } from './instagram.provider'
import { facebookProvider } from './facebook.provider'
import { tiktokProvider } from './tiktok.provider'

const registry = {
  spotify: spotifyProvider,
  amazon: amazonProvider,
  lastfm: lastfmProvider,
  soundcloud: soundcloudProvider,
  deezer: deezerProvider,
  youtube: youtubeProvider,
  audius: audiusProvider,
  instagram: instagramProvider,
  facebook: facebookProvider,
  tiktok: tiktokProvider,
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

export { spotifyProvider, amazonProvider, lastfmProvider, soundcloudProvider }
