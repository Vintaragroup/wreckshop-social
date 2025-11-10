import mongoose, { Schema, model, InferSchemaType } from 'mongoose'

const SegmentSchema = new Schema(
  {
    name: { type: String, required: true, index: true },
    description: { type: String },
    ownerProfileId: { type: Schema.Types.ObjectId, ref: 'Profile' },
    // Store filter definition as JSON; evaluation will be in a worker later
    query: { 
      type: Schema.Types.Mixed, 
      default: {
        type: 'discovered-user',
        filters: {
          genres: [],
          artistTypes: [],
          minScore: 0,
          countries: [],
          states: [],
          cities: [],
          timezone: [],
          geoRadius: null, // { centerLat, centerLng, radiusKm }
        }
      }
    },
    tags: { type: [String], default: [] },
    estimatedCount: { type: Number, default: 0 },
    // Geographic metadata
    geographicScope: { 
      type: String, 
      enum: ['global', 'country', 'state', 'city', 'radius'],
      default: 'global'
    },
  },
  { timestamps: true }
)

export type Segment = InferSchemaType<typeof SegmentSchema>

const SegmentModel = (mongoose.models as any)?.Segment || model('Segment', SegmentSchema)
export default SegmentModel
