import { Schema, model, InferSchemaType } from 'mongoose'

const HandlesSchema = new Schema(
  {
    instagram: { type: String },
    youtube: { type: String },
    tiktok: { type: String },
    twitter: { type: String },
    spotify: { type: String },
    apple: { type: String },
    soundcloud: { type: String },
    website: { type: String },
  },
  { _id: false }
)

const FollowersSchema = new Schema(
  {
    total: { type: Number, default: 0 },
    instagram: { type: Number, default: 0 },
    youtube: { type: Number, default: 0 },
    tiktok: { type: Number, default: 0 },
    spotify: { type: Number, default: 0 },
    apple: { type: Number, default: 0 },
    soundcloud: { type: Number, default: 0 },
  },
  { _id: false }
)

const ArtistSchema = new Schema(
  {
    name: { type: String, required: true },
    stageName: { type: String },
    bio: { type: String },
    avatarUrl: { type: String },
    genres: { type: [String], default: [] },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    handles: { type: HandlesSchema, default: {} },
    followers: { type: FollowersSchema, default: {} },
    lastRelease: { type: String },
    nextEvent: { type: String },
    upcomingDate: { type: String },
  },
  { timestamps: true }
)

export type Artist = InferSchemaType<typeof ArtistSchema>

const ArtistModel = (global as any).ArtistModel || model('Artist', ArtistSchema)
;(global as any).ArtistModel = ArtistModel
export default ArtistModel
