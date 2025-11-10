import mongoose, { Schema, model, InferSchemaType } from 'mongoose'

const MatchDetailsSchema = new Schema(
  {
    genreMatch: { type: [String], default: [] },
    artistMatches: { type: [String], default: [] },
  },
  { _id: false }
)

const DiscoveredUserSchema = new Schema(
  {
    // Spotify identity
    spotifyId: { type: String, required: true, unique: true, index: true },
    displayName: { type: String, required: true },
    profileUrl: { type: String },
    avatarUrl: { type: String },

    // Social graph
    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
  publicPlaylistsCount: { type: Number, default: 0 },

    // Discovery metadata
    discoveryMethod: {
      type: String,
      enum: ['playlist_contributor', 'playlist_listener', 'artist_follower'],
      default: 'playlist_contributor',
    },
    matchDetails: { type: MatchDetailsSchema, default: {} },
    matchScore: { type: Number, default: 0, min: 0, max: 100 },

    // Discovery filters used
    discoveredVia: {
      musicGenre: { type: String },
      artistType: { type: String },
      timestamp: { type: Date, default: Date.now },
    },

    // Geolocation data
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
      latitude: { type: Number },
      longitude: { type: Number },
      country: { type: String }, // ISO 3166-1 alpha-2 code
      countryName: { type: String },
      state: { type: String }, // US state abbreviation or region
      stateName: { type: String },
      city: { type: String },
      postalCode: { type: String },
      timezone: { type: String }, // IANA timezone
      geohash: { type: String }, // For efficient nearby queries
    },

    // Tags for segmentation
    tags: { type: [String], default: [] },
    segmentIds: { type: [mongoose.Types.ObjectId], default: [], ref: 'Segment' },

    // Enrichment data (fetched from Spotify later)
    enrichedProfile: {
      topArtists: [
        {
          id: String,
          name: String,
          genres: [String],
          popularity: Number,
        },
      ],
      topGenres: [String],
      topTracks: [String],
      bio: String,
      isArtist: Boolean,
      artistInfo: {
        followers: Number,
        genres: [String],
        images: [String],
        popularity: Number,
      },
    },

    // Engagement tracking
    engagementData: {
      followerGrowth: Number,
      engagementRate: Number,
      lastUpdated: Date,
    },

    // Provenance/sources for how we discovered this user
    sources: [
      new Schema(
        {
          type: { type: String, enum: ['playlist'], default: 'playlist' },
          playlistId: String,
          playlistName: String,
          ownerId: String,
          trackId: String,
          addedById: String,
          discoveredAt: { type: Date, default: Date.now },
        },
        { _id: false }
      ),
    ],

    // Status and sync
    isSynced: { type: Boolean, default: false },
    lastSyncedAt: { type: Date },
    syncStatus: {
      type: String,
      enum: ['pending', 'syncing', 'synced', 'failed'],
      default: 'pending',
    },
    syncError: String,

    // Metadata
    createdAt: { type: Date, default: Date.now, index: true },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

// Indexes for efficient querying
DiscoveredUserSchema.index({ 'discoveredVia.musicGenre': 1, 'discoveredVia.artistType': 1 })
DiscoveredUserSchema.index({ matchScore: -1 })
DiscoveredUserSchema.index({ isSynced: 1 })
DiscoveredUserSchema.index({ createdAt: -1 })
DiscoveredUserSchema.index({ segmentIds: 1 })
// Geospatial indexes
DiscoveredUserSchema.index({ 'location.coordinates': '2dsphere' })
DiscoveredUserSchema.index({ 'location.country': 1, 'location.state': 1 })
DiscoveredUserSchema.index({ 'location.city': 1 })
DiscoveredUserSchema.index({ 'location.timezone': 1 })
DiscoveredUserSchema.index({ 'location.geohash': 1 })

export type DiscoveredUser = InferSchemaType<typeof DiscoveredUserSchema>

const DiscoveredUserModel =
  (mongoose.models as any)?.DiscoveredUser || model('DiscoveredUser', DiscoveredUserSchema)
export default DiscoveredUserModel
