import mongoose, { Schema, model, InferSchemaType } from 'mongoose'

const ConsentSchema = new Schema(
  {
    email: { type: Boolean, default: false },
    sms: { type: Boolean, default: false },
  },
  { _id: false }
)

const AudienceContactSchema = new Schema(
  {
    email: { type: String, index: true },
    phone: { type: String, index: true },
    displayName: { type: String },
    consent: { type: ConsentSchema, default: {} },
    tags: { type: [String], default: [] },
    segmentIds: { type: [Schema.Types.ObjectId], default: [] },
    source: { type: String }, // e.g., 'pre-save', 'landing-page', 'import'
    ownerProfileId: { type: Schema.Types.ObjectId, ref: 'Profile', index: true },
  },
  { timestamps: true }
)

AudienceContactSchema.index({ email: 1, ownerProfileId: 1 }, { unique: false, sparse: true })
AudienceContactSchema.index({ phone: 1, ownerProfileId: 1 }, { unique: false, sparse: true })

export type AudienceContact = InferSchemaType<typeof AudienceContactSchema>

const AudienceContactModel = (mongoose.models as any)?.AudienceContact || model('AudienceContact', AudienceContactSchema)
export default AudienceContactModel
