import { Schema, model, InferSchemaType } from 'mongoose'

const DiscoverySettingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: 'global' },
    enabled: { type: Boolean, default: true },
    genres: { type: [String], default: [] },
    artistTypes: { type: [String], default: [] },
    maxResults: { type: Number, default: 100 },
    maxCombosPerRun: { type: Number, default: 6 },
    intervalMs: { type: Number, default: 15 * 60 * 1000 },
  includePlaylistExpansion: { type: Boolean, default: false },
  expansionSeedLimit: { type: Number, default: 50 },
  expansionPerUserPlaylistLimit: { type: Number, default: 5 },
  expansionPerPlaylistTrackLimit: { type: Number, default: 100 },
  expansionMaxNewUsers: { type: Number, default: 200 },
    lastRunAt: { type: Date },
    lastRunSummary: { type: Schema.Types.Mixed },
    runHistory: {
      type: [
        new Schema(
          {
            at: { type: Date, default: Date.now },
            durationMs: { type: Number },
            totals: {
              found: { type: Number, default: 0 },
              saved: { type: Number, default: 0 },
              combos: { type: Number, default: 0 },
            },
            results: [
              new Schema(
                {
                  genre: String,
                  artistType: String,
                  found: Number,
                  saved: Number,
                },
                { _id: false }
              ),
            ],
          },
          { _id: false }
        ),
      ],
      default: [],
    },
  },
  { timestamps: true }
)

export type DiscoverySettings = InferSchemaType<typeof DiscoverySettingsSchema>

export const DiscoverySettingsModel =
  (global as any).DiscoverySettingsModel || model('DiscoverySettings', DiscoverySettingsSchema)

export async function getDiscoverySettings(): Promise<DiscoverySettings> {
  const doc = await DiscoverySettingsModel.findOne({ key: 'global' }).lean()
  if (doc) return doc as DiscoverySettings
  // Defaults
  return {
    key: 'global',
    enabled: true,
    genres: ['indie', 'hip-hop', 'pop', 'electronic', 'rock', 'r&b', 'country', 'jazz', 'metal', 'latino'],
    artistTypes: ['mainstream', 'underground', 'indie', 'emerging'],
    maxResults: 100,
    maxCombosPerRun: 6,
    intervalMs: 15 * 60 * 1000,
    includePlaylistExpansion: false,
    expansionSeedLimit: 50,
    expansionPerUserPlaylistLimit: 5,
    expansionPerPlaylistTrackLimit: 100,
    expansionMaxNewUsers: 200,
    lastRunAt: undefined,
    lastRunSummary: undefined,
    runHistory: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    _id: undefined as any,
  } as any
}

export async function upsertDiscoverySettings(input: Partial<DiscoverySettings>): Promise<DiscoverySettings> {
  const update: any = { ...input, key: 'global' }
  const doc = await DiscoverySettingsModel.findOneAndUpdate({ key: 'global' }, update, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  }).lean()
  return doc as DiscoverySettings
}
