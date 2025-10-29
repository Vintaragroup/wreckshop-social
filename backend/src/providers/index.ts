import { ProviderAdapter } from './types'
import { spotifyProvider } from './spotify.provider'
import { amazonProvider } from './amazon.provider'

const registry = {
  spotify: spotifyProvider,
  amazon: amazonProvider,
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

export { spotifyProvider, amazonProvider }
