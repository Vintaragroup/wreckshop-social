import mongoose, { Schema, model, InferSchemaType } from 'mongoose'

const StatsSchema = new Schema(
  {
    visits: { type: Number, default: 0 },
    submissions: { type: Number, default: 0 },
  },
  { _id: false }
)

const CaptureLinkSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String },
    description: { type: String },
    ownerProfileId: { type: Schema.Types.ObjectId, ref: 'Profile', index: true },
    allowedChannels: { type: [String], default: ['email', 'sms'] }, // ex: ['email','sms']
    tags: { type: [String], default: [] },
    redirectUrl: { type: String },
    disabled: { type: Boolean, default: false },
    stats: { type: StatsSchema, default: {} },
  },
  { timestamps: true }
)

export type CaptureLink = InferSchemaType<typeof CaptureLinkSchema>

const CaptureLinkModel = (mongoose.models as any)?.CaptureLink || model('CaptureLink', CaptureLinkSchema)
export default CaptureLinkModel
