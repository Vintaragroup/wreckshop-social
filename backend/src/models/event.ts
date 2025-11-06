import { Schema, model, InferSchemaType, Types } from 'mongoose'

const VenueSchema = new Schema(
  {
    name: { type: String },
    city: { type: String },
    address: { type: String },
  },
  { _id: false }
)

const TicketsSchema = new Schema(
  {
    price: { type: Number },
    vipPrice: { type: Number },
    url: { type: String },
  },
  { _id: false }
)

const PresaleSchema = new Schema(
  {
    date: { type: Date },
    code: { type: String },
    enabled: { type: Boolean, default: false },
  },
  { _id: false }
)

const EventSchema = new Schema(
  {
    title: { type: String, required: true },
    type: { type: String },
    artistId: { type: Types.ObjectId, ref: 'Artist' },
    artistName: { type: String },
    description: { type: String },
    date: { type: Date },
    time: { type: String },
    doorsOpen: { type: String },
    venue: { type: VenueSchema, default: {} },
    capacity: { type: Number },
    tickets: { type: TicketsSchema, default: {} },
    presale: { type: PresaleSchema, default: {} },
    ageRestriction: { type: String, enum: ['all', '18+', '21+'], default: 'all' },
    status: { type: String, enum: ['announced', 'on_sale', 'live', 'sold_out', 'cancelled'], default: 'announced' },
  },
  { timestamps: true }
)

export type Event = InferSchemaType<typeof EventSchema>

const EventModel = (global as any).EventModel || model('Event', EventSchema)
;(global as any).EventModel = EventModel
export default EventModel
