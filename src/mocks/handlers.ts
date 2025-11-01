import { http, HttpResponse } from 'msw'

const mockProfiles = [
  {
    _id: 'p1',
    displayName: 'Mock Listener',
    identities: [
      { provider: 'spotify', providerUserId: 'mock-user', profileUrl: 'https://open.spotify.com/user/mock-user' },
    ],
    taste: {
      topArtists: [
        { id: 'a1', name: 'Mock Artist', genres: ['pop'], popularity: 50 },
      ],
      topGenres: ['pop', 'rock', 'indie'],
      topTracks: [],
      playlists: [
        { id: 'pl1', name: 'Mock Playlist', url: 'https://open.spotify.com/playlist/mock', trackCount: 10, isPublic: true },
      ],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const handlers = [
  // List profiles (respect ?q loosely)
  http.get('*/api/profiles', ({ request }) => {
    const url = new URL(request.url)
    const q = url.searchParams.get('q')?.toLowerCase() || ''
    const data = q
      ? mockProfiles.filter((p) => p.displayName.toLowerCase().includes(q))
      : mockProfiles
    return HttpResponse.json({ ok: true, data })
  }),

  // Enqueue ingest; return a synthetic job id
  http.post('*/api/profiles/ingest', async () => {
    return HttpResponse.json({ ok: true, jobId: 'job_' + Math.random().toString(36).slice(2) })
  }),
]
