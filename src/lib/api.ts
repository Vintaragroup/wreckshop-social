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

export interface IdentityDTO {
  provider: 'spotify' | 'amazon' | 'lastfm' | 'soundcloud'
  providerUserId: string
  profileUrl?: string
  handle?: string
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
  createdAt?: string
  updatedAt?: string
}

export async function apiListProfiles(q?: string) {
  const qs = q && q.length > 0 ? `?q=${encodeURIComponent(q)}` : ''
  const res = await request<{ ok: true; data: ProfileDTO[] }>(`/profiles${qs}`)
  return res.data
}

export async function apiGetProfile(id: string) {
  const res = await request<{ ok: true; data: ProfileDTO }>(`/profiles/${id}`)
  return res.data
}

export async function apiEnqueueIngest(body: { provider: 'spotify' | 'amazon'; handleOrUrl: string; accessToken?: string }) {
  const res = await request<{ ok: true; jobId: string }>(`/profiles/ingest`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
  return res.jobId
}
