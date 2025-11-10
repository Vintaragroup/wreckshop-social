import mongoose, { Schema, model, InferSchemaType } from 'mongoose'

const VariantSchema = new Schema(
  {
    name: { type: String, required: true },
    subject: { type: String },
    bodyHtml: { type: String },
    sendTime: { type: Date },
    audience: { type: Number, default: 0 }, // total to send to this variant
    
    // Tracking metrics
    sent: { type: Number, default: 0 },
    delivered: { type: Number, default: 0 },
    opened: { type: Number, default: 0 },
    clicked: { type: Number, default: 0 },
    bounced: { type: Number, default: 0 },
    unsubscribed: { type: Number, default: 0 },
    complained: { type: Number, default: 0 },
    converted: { type: Number, default: 0 },
  },
  { _id: true }
)

const WinnerSchema = new Schema(
  {
    variantId: { type: Schema.Types.ObjectId, required: true },
    variantName: { type: String },
    metric: { type: String }, // 'openRate', 'clickRate', etc
    confidence: { type: Number, min: 0, max: 100 }, // confidence percentage
    improvement: { type: Number }, // percentage improvement over second place
    pValue: { type: Number }, // statistical p-value
  },
  { _id: false }
)

const ABTestSchema = new Schema(
  {
    campaignId: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true, index: true },
    name: { type: String, required: true },
    description: { type: String },
    
    testType: { 
      type: String, 
      enum: ['subject', 'time', 'content', 'comprehensive'],
      required: true,
      index: true,
    },
    
    status: {
      type: String,
      enum: ['draft', 'running', 'paused', 'completed'],
      default: 'draft',
      index: true,
    },
    
    // Variants (2-4 per test)
    variants: { type: [VariantSchema], default: [] },
    
    // Settings
    settings: {
      splitType: { type: String, enum: ['even', 'custom', 'adaptive'], default: 'even' },
      confidenceLevel: { type: Number, enum: [90, 95, 99], default: 95 },
      minimumSampleSize: { type: Number, default: 100 },
      testDuration: { type: String, enum: ['hours', 'days', 'weeks'], default: 'days' },
      durationValue: { type: Number, default: 7 }, // 7 days, 48 hours, etc
      autoOptimize: { type: Boolean, default: false },
    },
    
    // Winner determination
    winner: { type: WinnerSchema },
    winnerApplied: { type: Boolean, default: false },
    
    // Timeline
    startedAt: { type: Date },
    completedAt: { type: Date },
    scheduledFor: { type: Date }, // for scheduled tests
    
    // Related data
    segmentId: { type: Schema.Types.ObjectId, ref: 'Segment' },
    totalAudience: { type: Number }, // total recipients for this test
    
    // Metadata
    createdBy: { type: Schema.Types.ObjectId, ref: 'Profile' },
  },
  { timestamps: true }
)

// Index for common queries
ABTestSchema.index({ campaignId: 1, status: 1 })
ABTestSchema.index({ status: 1, createdAt: -1 })

export type ABTest = InferSchemaType<typeof ABTestSchema>

const ABTestModel = (mongoose.models as any)?.ABTest || model('ABTest', ABTestSchema)
export default ABTestModel
