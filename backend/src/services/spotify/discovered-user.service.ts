import DiscoveredUserModel, { DiscoveredUser } from '../../models/discovered-user'
import { DiscoveredUser as DiscoveryServiceUser, DiscoveryResult } from './discovery.service'

/**
 * Service for persisting and querying discovered users in the database
 */

/**
 * Store discovered users in the database
 * Deduplicates and updates existing users with new discovery data
 */
export async function saveDiscoveredUsers(
  discoveryResult: DiscoveryResult,
  userId?: string // Optional: associate with a specific user/artist
): Promise<DiscoveredUser[]> {
  const savedUsers: DiscoveredUser[] = []

  for (const user of discoveryResult.users) {
    try {
      // Check if user already exists
      const existingUser = await DiscoveredUserModel.findOne({
        spotifyId: user.spotifyId,
      })

      if (existingUser) {
        // Update existing user with new discovery data
        existingUser.matchScore = Math.max(existingUser.matchScore, user.matchScore)
        existingUser.matchDetails.genreMatch = [
          ...new Set([...existingUser.matchDetails.genreMatch, ...user.matchDetails.genreMatch]),
        ]
        existingUser.matchDetails.artistMatches = [
          ...new Set([
            ...existingUser.matchDetails.artistMatches,
            ...user.matchDetails.artistMatches,
          ]),
        ]
        existingUser.discoveredVia.timestamp = new Date()
        existingUser.updatedAt = new Date()

        const updated = await existingUser.save()
        savedUsers.push(updated)
      } else {
        // Create new discovered user
        const newUser = await DiscoveredUserModel.create({
          spotifyId: user.spotifyId,
          displayName: user.displayName,
          profileUrl: user.profileUrl,
          avatarUrl: user.avatarUrl,
          followersCount: user.followersCount,
          followingCount: user.followingCount,
          discoveryMethod: user.discoveryMethod,
          matchDetails: user.matchDetails,
          matchScore: user.matchScore,
          discoveredVia: {
            musicGenre: discoveryResult.query.musicGenre,
            artistType: discoveryResult.query.artistType,
            timestamp: new Date(),
          },
        })

        savedUsers.push(newUser)
      }
    } catch (err) {
      console.error(`[DiscoveredUserDB] Failed to save user ${user.spotifyId}:`, err)
      // Continue with next user
    }
  }

  console.log(`[DiscoveredUserDB] Saved ${savedUsers.length} discovered users`)
  return savedUsers
}

/**
 * Query discovered users by filters
 */
export async function queryDiscoveredUsers(filters: {
  genre?: string
  artistType?: string
  minMatchScore?: number
  limit?: number
  offset?: number
  isSynced?: boolean
}) {
  const query: any = {}

  if (filters.genre) {
    query['discoveredVia.musicGenre'] = filters.genre
  }

  if (filters.artistType) {
    query['discoveredVia.artistType'] = filters.artistType
  }

  if (filters.minMatchScore !== undefined) {
    query.matchScore = { $gte: filters.minMatchScore }
  }

  if (filters.isSynced !== undefined) {
    query.isSynced = filters.isSynced
  }

  const limit = Math.min(filters.limit || 50, 200)
  const offset = filters.offset || 0

  const [users, total] = await Promise.all([
    DiscoveredUserModel.find(query).sort({ matchScore: -1 }).limit(limit).skip(offset).exec(),
    DiscoveredUserModel.countDocuments(query),
  ])

  return {
    users,
    total,
    limit,
    offset,
    hasMore: offset + limit < total,
  }
}

/**
 * Get discovered users by genre
 */
export async function getDiscoveredUsersByGenre(
  genre: string,
  limit: number = 50
): Promise<DiscoveredUser[]> {
  return DiscoveredUserModel.find({ 'discoveredVia.musicGenre': genre })
    .sort({ matchScore: -1 })
    .limit(Math.min(limit, 200))
    .exec()
}

/**
 * Get discovered users by artist type
 */
export async function getDiscoveredUsersByArtistType(
  artistType: string,
  limit: number = 50
): Promise<DiscoveredUser[]> {
  return DiscoveredUserModel.find({ 'discoveredVia.artistType': artistType })
    .sort({ matchScore: -1 })
    .limit(Math.min(limit, 200))
    .exec()
}

/**
 * Get discovered users by both genre and artist type
 */
export async function getDiscoveredUsersByGenreAndArtistType(
  genre: string,
  artistType: string,
  limit: number = 50
): Promise<DiscoveredUser[]> {
  return DiscoveredUserModel.find({
    'discoveredVia.musicGenre': genre,
    'discoveredVia.artistType': artistType,
  })
    .sort({ matchScore: -1 })
    .limit(Math.min(limit, 200))
    .exec()
}

/**
 * Mark discovered users as needing enrichment
 */
export async function markForEnrichment(userIds: string[]): Promise<number> {
  const result = await DiscoveredUserModel.updateMany(
    { spotifyId: { $in: userIds } },
    { syncStatus: 'pending', isSynced: false }
  )

  return result.modifiedCount
}

/**
 * Get users pending enrichment
 */
export async function getPendingEnrichmentUsers(limit: number = 100): Promise<DiscoveredUser[]> {
  return DiscoveredUserModel.find({ syncStatus: 'pending' }).limit(limit).exec()
}

/**
 * Update user enrichment data
 */
export async function updateUserEnrichment(
  spotifyId: string,
  enrichmentData: Partial<DiscoveredUser['enrichedProfile']>
): Promise<DiscoveredUser | null> {
  return DiscoveredUserModel.findOneAndUpdate(
    { spotifyId },
    {
      enrichedProfile: enrichmentData,
      isSynced: true,
      syncStatus: 'synced',
      lastSyncedAt: new Date(),
    },
    { new: true }
  )
}

/**
 * Create or update audience segment from discovered users
 */
export async function addUsersToSegment(userIds: string[], segmentId: string): Promise<number> {
  const result = await DiscoveredUserModel.updateMany(
    { spotifyId: { $in: userIds } },
    { $addToSet: { segmentIds: segmentId } }
  )

  return result.modifiedCount
}

/**
 * Get stats on discovered users
 */
export async function getDiscoveryStats() {
  const [total, byGenre, byArtistType, syncedCount, avgMatchScore] = await Promise.all([
    DiscoveredUserModel.countDocuments({}),
    DiscoveredUserModel.aggregate([
      {
        $group: {
          _id: '$discoveredVia.musicGenre',
          count: { $sum: 1 },
        },
      },
    ]),
    DiscoveredUserModel.aggregate([
      {
        $group: {
          _id: '$discoveredVia.artistType',
          count: { $sum: 1 },
        },
      },
    ]),
    DiscoveredUserModel.countDocuments({ isSynced: true }),
    DiscoveredUserModel.aggregate([
      {
        $group: {
          _id: null,
          avg: { $avg: '$matchScore' },
        },
      },
    ]),
  ])

  return {
    total,
    byGenre: Object.fromEntries(byGenre.map((g: any) => [g._id, g.count])),
    byArtistType: Object.fromEntries(byArtistType.map((a: any) => [a._id, a.count])),
    enrichedCount: syncedCount,
    averageMatchScore: avgMatchScore[0]?.avg || 0,
  }
}
