import mongoose, { Schema, model, InferSchemaType } from 'mongoose'

const ChannelConfigSchema = new Schema(
  {
    // Each channel can store template/content + settings
    email: {
      subject: { type: String },
      bodyHtml: { type: String },
      fromName: { type: String },
      fromEmail: { type: String },
    },
    sms: {
      bodyText: { type: String },
      fromNumber: { type: String },
    },
    instagram: {
      caption: { type: String },
      mediaUrl: { type: String },
    },
    facebook: {
      message: { type: String },
      mediaUrl: { type: String },
    },
    youtube: {
      playlistId: { type: String },
      addVideoIds: { type: [String], default: [] },
    },
    tiktok: {
      caption: { type: String },
      mediaUrl: { type: String },
    },
    twitter: {
      text: { type: String },
    },
  },
  { _id: false }
)

const ScheduleSchema = new Schema(
  {
    startAt: { type: Date },
    endAt: { type: Date },
    timezone: { type: String },
  },
  { _id: false }
)

const CampaignSchema = new Schema(
  {
    name: { type: String, required: true, index: true },
    ownerProfileId: { type: Schema.Types.ObjectId, ref: 'Profile', index: true },
    releaseId: { type: Schema.Types.ObjectId, ref: 'Release' },
    segments: { type: [Schema.Types.ObjectId], default: [] },
    tags: { type: [String], default: [] },
    channels: { type: ChannelConfigSchema, default: {} },
    schedule: { type: ScheduleSchema, default: {} },
    status: { type: String, enum: ['draft', 'scheduled', 'running', 'paused', 'completed', 'failed'], default: 'draft' },
  },
  { timestamps: true }
)

export type Campaign = InferSchemaType<typeof CampaignSchema>

const CampaignModel = (mongoose.models as any)?.Campaign || model('Campaign', CampaignSchema)
export default CampaignModel
