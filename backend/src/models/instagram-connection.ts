import mongoose, { Schema, Document } from 'mongoose'

export interface IInstagramConnection extends Document {
  userId: string // Reference to User or Audience profile
  instagramUserId: string // Instagram business account ID
  accessToken: string // Long-lived access token
  tokenExpiresAt: Date // Expiration date for 60-day token
  profile: {
    username: string
    name: string
    profilePictureUrl?: string
    biography?: string
    website?: string
    followersCount: number
    followsCount: number
    mediaCount: number
  }
  scopes: string[] // Granted scopes
  connectedAt: Date
  lastSyncedAt: Date
  lastError?: string
  isActive: boolean
}

const InstagramConnectionSchema = new Schema<IInstagramConnection>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    instagramUserId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    accessToken: {
      type: String,
      required: true,
      select: false, // Don't include by default for security
    },
    tokenExpiresAt: {
      type: Date,
      required: true,
    },
    profile: {
      username: {
        type: String,
        required: true,
      },
      name: {
        type: String,
      },
      profilePictureUrl: String,
      biography: String,
      website: String,
      followersCount: {
        type: Number,
        default: 0,
      },
      followsCount: {
        type: Number,
        default: 0,
      },
      mediaCount: {
        type: Number,
        default: 0,
      },
    },
    scopes: [String],
    connectedAt: {
      type: Date,
      default: Date.now,
    },
    lastSyncedAt: {
      type: Date,
    },
    lastError: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

// Index for finding connections by userId
InstagramConnectionSchema.index({ userId: 1, isActive: 1 })

// Index for token expiration cleanup
InstagramConnectionSchema.index({ tokenExpiresAt: 1 })

export const InstagramConnection =
  mongoose.models.InstagramConnection ||
  mongoose.model<IInstagramConnection>(
    'InstagramConnection',
    InstagramConnectionSchema
  )
