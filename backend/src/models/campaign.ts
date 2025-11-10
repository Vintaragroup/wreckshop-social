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

const MetricsSchema = new Schema(
  {
    // Delivery metrics
    sent: { type: Number, default: 0 },
    delivered: { type: Number, default: 0 },
    bounced: { type: Number, default: 0 },
    failed: { type: Number, default: 0 },
    
    // Engagement metrics
    opened: { type: Number, default: 0 },
    clicked: { type: Number, default: 0 },
    unsubscribed: { type: Number, default: 0 },
    complained: { type: Number, default: 0 },
    
    // Conversions
    converted: { type: Number, default: 0 },
    
    // Timeline events
    events: [{
      type: {
        type: String,
        enum: ['sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed', 'unsubscribed', 'complained'],
      },
      count: { type: Number, default: 1 },
      timestamp: { type: Date, default: Date.now },
    }],
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
    metrics: { type: MetricsSchema, default: {} },
    launchedAt: { type: Date },
  },
  { timestamps: true }
)

export type Campaign = InferSchemaType<typeof CampaignSchema>

const CampaignModel = (mongoose.models as any)?.Campaign || model('Campaign', CampaignSchema)
export default CampaignModel
