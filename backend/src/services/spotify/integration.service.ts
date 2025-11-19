import prisma from '../../lib/prisma'
import { encryptSecret } from '../../lib/integration-tokens'
import { enrichSpotifyProfile, SpotifyEnrichedData } from './enrichment.service'

export interface SpotifyTokenBundle {
  accessToken: string
  refreshToken?: string | null
  expiresIn?: number
  scopes?: string[]
}

export async function upsertSpotifyIntegration(params: {
  artistId: string
  tokens: SpotifyTokenBundle
}): Promise<{
  integration: Awaited<ReturnType<typeof persistIntegration>>
  enrichedData: SpotifyEnrichedData
}> {
  const { artistId, tokens } = params
  const enrichedData = await enrichSpotifyProfile(tokens.accessToken)
  const integration = await persistIntegration({ artistId, tokens, enrichedData })

  return { integration, enrichedData }
}

async function persistIntegration(params: {
  artistId: string
  tokens: SpotifyTokenBundle
  enrichedData: SpotifyEnrichedData
}) {
  const { artistId, tokens, enrichedData } = params
  const expiresAt = tokens.expiresIn
    ? new Date(Date.now() + tokens.expiresIn * 1000)
    : undefined
  const scopes = tokens.scopes?.length ? tokens.scopes : []

  const baseData = {
    spotifyAccountId: enrichedData.profile.id,
    displayName: enrichedData.profile.displayName,
    profileUrl: enrichedData.profile.profileUrl,
    profileImageUrl: enrichedData.profile.avatarUrl,
    followers: enrichedData.profile.followersCount,
    isArtistAccount: enrichedData.profile.followersCount > 100,
    genres: enrichedData.topGenres.slice(0, 5),
    accessTokenEncrypted: encryptSecret(tokens.accessToken),
    refreshTokenEncrypted: tokens.refreshToken ? encryptSecret(tokens.refreshToken) : null,
    tokenExpiresAt: expiresAt,
    tokenScope: scopes,
    tokenStoredAt: new Date(),
    lastRefreshedAt: new Date(),
    lastSyncedAt: new Date(),
  }

  return prisma.spotifyIntegration.upsert({
    where: { artistId },
    create: {
      artistId,
      ...baseData,
    },
    update: baseData,
  })
}
