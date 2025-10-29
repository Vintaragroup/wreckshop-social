import { z } from 'zod'

// Core provider-agnostic identity
export const MusicIdentity = z.object({
  provider: z.enum(['spotify', 'amazon', 'lastfm', 'soundcloud']),
  providerUserId: z.string(),
  profileUrl: z.string().url().optional(),
  handle: z.string().optional(),
})
export type MusicIdentity = z.infer<typeof MusicIdentity>

// Artist descriptor
export const Artist = z.object({
  id: z.string(),
  name: z.string(),
  genres: z.array(z.string()).default([]),
  popularity: z.number().int().nonnegative().max(100).optional(),
})
export type Artist = z.infer<typeof Artist>

// Playlist descriptor
export const Playlist = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string().url().optional(),
  trackCount: z.number().int().nonnegative().optional(),
  isPublic: z.boolean().optional(),
})
export type Playlist = z.infer<typeof Playlist>

// Aggregate music taste
export const MusicTaste = z.object({
  topArtists: z.array(Artist).default([]),
  topGenres: z.array(z.string()).default([]),
  topTracks: z.array(z.string()).default([]),
  playlists: z.array(Playlist).default([]),
})
export type MusicTaste = z.infer<typeof MusicTaste>

// Profile schema aligned with Mongoose model shape
export const ProfileSchema = z.object({
  displayName: z.string(),
  avatarUrl: z.string().url().optional(),
  bio: z.string().optional(),
  identities: z.array(MusicIdentity).default([]),
  taste: MusicTaste.default({ topArtists: [], topGenres: [], topTracks: [], playlists: [] }),
})
export type ProfileInput = z.infer<typeof ProfileSchema>

export interface ProviderAdapter {
  // Given either an access token or known identifiers, resolve to a normalized MusicIdentity
  resolveIdentity(input: {
    accessToken?: string
    providerUserId?: string
    profileUrl?: string
    handle?: string
  }): Promise<MusicIdentity>

  // Fetch normalized taste for a given identity
  fetchTaste(identity: MusicIdentity, options?: { accessToken?: string }): Promise<MusicTaste>
}
