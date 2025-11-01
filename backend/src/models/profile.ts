import mongoose, { Schema, model, InferSchemaType } from 'mongoose'

const IdentitySchema = new Schema(
  {
    provider: {
      type: String,
      enum: ['spotify', 'amazon', 'lastfm', 'soundcloud', 'deezer', 'youtube', 'audius'],
      required: true,
    },
    providerUserId: { type: String, required: true },
    profileUrl: { type: String },
    handle: { type: String },
    // Social graph counts (provider-specific)
    followersCount: { type: Number },
    followingCount: { type: Number },
    friendsCount: { type: Number },
    neighboursCount: { type: Number },
  },
  { _id: false }
)

const TopArtistSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    genres: { type: [String], default: [] },
    popularity: { type: Number },
  },
  { _id: false }
)

const PlaylistSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    url: { type: String },
    trackCount: { type: Number },
    isPublic: { type: Boolean },
  },
  { _id: false }
)

const TasteSchema = new Schema(
  {
    topArtists: { type: [TopArtistSchema], default: [] },
    topGenres: { type: [String], default: [] },
    topTracks: { type: [String], default: [] },
    playlists: { type: [PlaylistSchema], default: [] },
  },
  { _id: false }
)

const ArtistAffinitySchema = new Schema(
  {
    id: { type: String },
    name: { type: String, required: true },
    score: { type: Number, required: true },
  },
  { _id: false }
)

const ProfileSchema = new Schema(
  {
    displayName: { type: String, required: true },
    avatarUrl: { type: String },
    bio: { type: String },
    identities: { type: [IdentitySchema], default: [] },
    taste: { type: TasteSchema, default: {} },
    interestTags: { type: [String], default: [] },
    artistAffinity: { type: [ArtistAffinitySchema], default: [] },
  },
  { timestamps: true }
)

export type Profile = InferSchemaType<typeof ProfileSchema>

const ProfileModel = (mongoose.models as any)?.Profile || model('Profile', ProfileSchema)
export default ProfileModel
