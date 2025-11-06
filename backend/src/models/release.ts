import mongoose, { Schema, model, InferSchemaType } from 'mongoose'

const PlatformLinksSchema = new Schema(
  {
    spotify: { type: String },
    apple: { type: String },
    youtube: { type: String },
    soundcloud: { type: String },
    audius: { type: String },
  },
  { _id: false }
)

const ReleaseSchema = new Schema(
  {
    title: { type: String, required: true, index: true },
    isrc: { type: String },
    upc: { type: String },
    releaseDate: { type: Date },
    coverUrl: { type: String },
    links: { type: PlatformLinksSchema, default: {} },
    ownerProfileId: { type: Schema.Types.ObjectId, ref: 'Profile', index: true },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
)

export type Release = InferSchemaType<typeof ReleaseSchema>

const ReleaseModel = (mongoose.models as any)?.Release || model('Release', ReleaseSchema)
export default ReleaseModel
