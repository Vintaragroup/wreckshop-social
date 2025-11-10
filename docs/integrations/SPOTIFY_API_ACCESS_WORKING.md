# Spotify API Access - Data Fetching Now Active ✅

## What's Working Now

Your Spotify integration now **automatically fetches user profile data** when they connect their account.

### Data Being Fetched

When a user connects their Spotify account, the system now fetches:

1. **User Profile** (name, email, avatar, follower/following counts)
2. **Top 50 Artists** (with genres and popularity scores)
3. **Top 50 Tracks** (with artist info and popularity)
4. **Top Genres** (derived from artist data - useful for segmentation)
5. **All Playlists** (public and private)

### Total Data Per User

**~200+ data points** including:
- Profile: 7 fields
- Top Artists: 50 × 6 fields = 300 fields
- Top Tracks: 50 × 5 fields = 250 fields  
- Genres: ~30-50 unique genres
- Playlists: All playlists × 4 fields

## How It Works

```
1. User clicks "Connect Spotify"
   ↓
2. Spotify OAuth flow (user logs in & authorizes)
   ↓
3. Backend exchanges authorization code for access token
   ↓
4. Frontend receives token, posts to backend enrichment endpoint
   ↓
5. Backend calls Spotify API to fetch:
   - /v1/me (profile)
   - /v1/me/top/artists (top artists)
   - /v1/me/top/tracks (top tracks)
   - /v1/me/playlists (playlists)
   ↓
6. All data returned to frontend
   ↓
7. User sees "Connected as [Name]" ✓
```

## New Endpoint

**POST /auth/spotify/connect**

**What it does:**
- Receives access token from frontend
- Fetches all 4 Spotify API endpoints
- Returns structured data with profile, artists, tracks, genres, playlists
- Handles errors gracefully

**Example:**
```bash
curl -X POST http://localhost:4002/auth/spotify/connect \
  -H "Content-Type: application/json" \
  -d '{"accessToken":"BQCxxxxx..."}'
```

**Response:**
```json
{
  "ok": true,
  "data": {
    "profile": {
      "id": "user123",
      "displayName": "John Doe",
      "email": "john@example.com",
      "avatarUrl": "https://...",
      "profileUrl": "https://open.spotify.com/user/...",
      "followersCount": 42,
      "followingCount": 156
    },
    "topArtists": [
      {
        "id": "artist1",
        "name": "Artist Name",
        "genres": ["indie", "pop", "alternative"],
        "popularity": 85,
        "imageUrl": "https://...",
        "externalUrl": "https://..."
      },
      // ... 49 more artists
    ],
    "topTracks": [
      {
        "id": "track1",
        "name": "Track Title",
        "artists": ["Artist 1", "Artist 2"],
        "popularity": 78,
        "imageUrl": "https://...",
        "externalUrl": "https://..."
      },
      // ... 49 more tracks
    ],
    "topGenres": ["indie", "pop", "alternative", "hip-hop", ...],
    "playlists": [
      {
        "id": "playlist1",
        "name": "My Playlist",
        "trackCount": 42,
        "isPublic": true,
        "externalUrl": "https://..."
      },
      // ... all playlists
    ]
  },
  "message": "Spotify profile enriched successfully"
}
```

## What You Can Do With This Data

### Immediate Uses
- **Profile Display** - Show user's Spotify profile info on audience pages
- **Music Taste Profile** - Display top artists and genres
- **Genre Segmentation** - Group users by musical preferences
- **Artist Affinity** - Find users who like the same artists
- **Playlist Analysis** - Understand user's music curation

### Campaign Targeting
- Target campaigns to users who like specific artists
- Segment by genre preference
- Create lookalike audiences based on top genres
- Personalize content based on top tracks

### Discovery
- Find new audiences interested in specific music
- Identify music taste clusters
- Cross-pollinate recommendations

## Next Steps

To fully use this data, you'll want to:

1. **Store in Database** - Save enriched data to Profile documents
2. **Display in UI** - Show top artists, genres on profile pages
3. **Enable Queries** - Search/filter by artist, genre, taste
4. **Auto-Update** - Periodically refresh user data
5. **Create Segments** - Build audience segments based on taste

## Files Updated

- **Backend**: `backend/src/services/spotify/enrichment.service.ts` (NEW)
- **Backend**: `backend/src/routes/auth/spotify.routes.ts` (added /connect endpoint)
- **Frontend**: `src/components/spotify-oauth.tsx` (calls enrichment endpoint)
- **Frontend**: `src/pages/auth/spotify-callback.tsx` (calls enrichment endpoint)

## Verification

✅ Endpoint tested and working: `POST /auth/spotify/connect`
✅ Error handling verified (rejects invalid tokens appropriately)
✅ Frontend and backend both build successfully
✅ Data structure is comprehensive and well-typed

## Ready to Test

Visit http://localhost:5176/integrations and click "Connect Spotify" to see it in action!

The system will automatically fetch your Spotify profile data and display it on the UI.
