const BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || ''

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: unknown } | any

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${BASE_URL}/api${path}`
  const res = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    ...init,
  })
  const contentType = res.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const payload = isJson ? await res.json().catch(() => undefined) : await res.text().catch(() => undefined)
  if (!res.ok) {
    const err = (isJson ? payload?.error : payload) ?? `${res.status} ${res.statusText}`
    throw new Error(typeof err === 'string' ? err : JSON.stringify(err))
  }
  return (payload as T) ?? (undefined as unknown as T)
}

export type Provider = 'spotify' | 'amazon' | 'lastfm' | 'soundcloud' | 'deezer' | 'youtube' | 'audius'

export interface IdentityDTO {
  provider: Provider
  providerUserId: string
  profileUrl?: string
  handle?: string
  followersCount?: number
  followingCount?: number
  friendsCount?: number
  neighboursCount?: number
}

export interface ArtistDTO {
  id: string
  name: string
  genres?: string[]
  popularity?: number
}

export interface PlaylistDTO {
  id: string
  name: string
  url?: string
  trackCount?: number
  isPublic?: boolean
}

export interface MusicTasteDTO {
  topArtists: ArtistDTO[]
  topGenres: string[]
  topTracks: string[]
  playlists: PlaylistDTO[]
}

export interface ProfileDTO {
  _id: string
  displayName: string
  avatarUrl?: string
  bio?: string
  identities: IdentityDTO[]
  taste: MusicTasteDTO
  interestTags?: string[]
  artistAffinity?: Array<{ id?: string; name: string; score: number }>
  createdAt?: string
  updatedAt?: string
}

export interface DiscoverCandidateDTO {
  provider: 'soundcloud' | 'deezer' | 'youtube' | 'audius' | 'lastfm'
  providerUserId: string
  displayName: string
  profileUrl?: string
  handle?: string
  avatarUrl?: string
  followers?: number
  tracks?: number
  playlists?: number
  location?: string
  bio?: string
}

export async function apiListProfiles(q?: string, provider?: Provider, tag?: string) {
  const params = new URLSearchParams()
  if (q && q.length > 0) params.set('q', q)
  if (provider && provider.length > 0) params.set('provider', provider)
  if (tag && tag.length > 0) params.set('tag', tag.toLowerCase())
  const qs = params.toString() ? `?${params.toString()}` : ''
  const res = await request<{ ok: true; data: ProfileDTO[] }>(`/profiles${qs}`)
  return res.data
}

export async function apiGetProfile(id: string) {
  const res = await request<{ ok: true; data: ProfileDTO }>(`/profiles/${id}`)
  return res.data
}

export async function apiEnqueueIngest(body: { provider: Provider; handleOrUrl: string; accessToken?: string }) {
  const res = await request<{ ok: true; jobId: string }>(`/profiles/ingest`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
  return res.jobId
}

export async function apiDiscover(provider: 'soundcloud' | 'deezer' | 'youtube' | 'audius' | 'lastfm', q: string, limit = 10, genre?: string) {
  const params = new URLSearchParams({ provider, q, limit: String(limit) })
  if (genre && genre.trim()) params.set('genre', genre)
  const qs = `?${params.toString()}`
  const res = await request<{ ok: true; data: DiscoverCandidateDTO[] }>(`/profiles/discover${qs}`)
  return res.data
}

export interface ProfileCounts {
  total: number
  byProvider: Record<Provider, number>
}

export async function apiGetProfileCounts(): Promise<ProfileCounts> {
  const res = await request<{ ok: true; data: ProfileCounts }>(`/profiles/counts`)
  return res.data
}
