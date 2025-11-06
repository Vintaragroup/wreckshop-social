import mongoose, { Schema, model, InferSchemaType } from 'mongoose'

// Edge between steps
const EdgeSchema = new Schema(
  {
    to: { type: String, required: true }, // target stepId
    label: { type: String }, // e.g., condition name
    condition: { type: String }, // optional expression for branches
  },
  { _id: false }
)

// Canvas position (for editor)
const PositionSchema = new Schema(
  {
    x: { type: Number },
    y: { type: Number },
  },
  { _id: false }
)

// Journey step
const StepSchema = new Schema(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      enum: ['trigger', 'delay', 'condition', 'email', 'sms', 'branch', 'exit', 'webhook'],
      required: true,
    },
    name: { type: String },
    config: { type: Schema.Types.Mixed, default: {} },
    next: { type: [EdgeSchema], default: [] },
    position: { type: PositionSchema, default: {} },
  },
  { _id: false }
)

// Aggregated metrics per step for simple funnel views
const StepMetricSchema = new Schema(
  {
    stepId: { type: String, required: true },
    entered: { type: Number, default: 0 },
    completed: { type: Number, default: 0 },
    dropped: { type: Number, default: 0 },
  },
  { _id: false }
)

const JourneySchema = new Schema(
  {
    name: { type: String, required: true, index: true },
    description: { type: String },
    status: { type: String, enum: ['draft', 'active', 'paused'], default: 'draft', index: true },
    ownerProfileId: { type: Schema.Types.ObjectId, ref: 'Profile' },
    segmentId: { type: Schema.Types.ObjectId, ref: 'Segment' }, // optional for now
    triggerKey: { type: String }, // e.g., new-subscriber
    steps: { type: [StepSchema], default: [] },
    metrics: { type: [StepMetricSchema], default: [] },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
)

export type Journey = InferSchemaType<typeof JourneySchema>

const JourneyModel = (mongoose.models as any)?.Journey || model('Journey', JourneySchema)
export default JourneyModel
