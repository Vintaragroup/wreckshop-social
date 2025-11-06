import mongoose, { Schema, model, InferSchemaType } from 'mongoose'

const SegmentSchema = new Schema(
  {
    name: { type: String, required: true, index: true },
    description: { type: String },
    ownerProfileId: { type: Schema.Types.ObjectId, ref: 'Profile' },
    // Store filter definition as JSON; evaluation will be in a worker later
    query: { type: Schema.Types.Mixed, default: {} },
    tags: { type: [String], default: [] },
    estimatedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export type Segment = InferSchemaType<typeof SegmentSchema>

const SegmentModel = (mongoose.models as any)?.Segment || model('Segment', SegmentSchema)
export default SegmentModel
