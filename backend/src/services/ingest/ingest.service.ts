import Profile from '../../models/profile'
import { getProvider, ProviderName } from '../../providers'

export type IngestRequest = {
  provider: ProviderName
  handleOrUrl?: string
  accessToken?: string
}

export async function ingestProfile(req: IngestRequest) {
  const adapter = getProvider(req.provider)

  // Derive identifier fields from handleOrUrl
  let handle: string | undefined
  let profileUrl: string | undefined
  if (req.handleOrUrl) {
    try {
      const url = new URL(req.handleOrUrl)
      profileUrl = url.toString()
    } catch {
      handle = req.handleOrUrl
    }
  }

  const identity = await adapter.resolveIdentity({
    handle,
    profileUrl,
    providerUserId: undefined,
  })

  // Fetch taste; providers may choose to ignore token
  const taste = await adapter.fetchTaste(identity, { accessToken: req.accessToken })

  // Optionally fetch richer profile details
  const details = typeof adapter.fetchProfileDetails === 'function'
    ? await adapter.fetchProfileDetails(identity, { accessToken: req.accessToken })
    : {}

  // Upsert by identity match
  const filter = {
    'identities.provider': identity.provider,
    'identities.providerUserId': identity.providerUserId,
  }

  const displayName = details.displayName || handle || identity.handle || identity.providerUserId

  // Prepare identity for insert with optional counts
  const identityForInsert: any = { ...identity }

  const update: any = {
    $set: { taste },
    $setOnInsert: {
      displayName,
      identities: [identityForInsert],
    },
  }

  // If we have richer details, set them (even on existing docs)
  if (details.avatarUrl) update.$set.avatarUrl = details.avatarUrl
  if (typeof details.bio === 'string' && details.bio.length > 0) update.$set.bio = details.bio
  if (details.displayName) update.$set.displayName = details.displayName
  if (typeof (details as any).friendsCount === 'number') identityForInsert.friendsCount = (details as any).friendsCount
  if (typeof (details as any).neighboursCount === 'number') identityForInsert.neighboursCount = (details as any).neighboursCount
  if (typeof (details as any).followersCount === 'number') identityForInsert.followersCount = (details as any).followersCount
  if (typeof (details as any).followingCount === 'number') identityForInsert.followingCount = (details as any).followingCount

  // Derive interest tags and artist affinity from taste
  try {
    if (taste) {
      const norm = (s: string) =>
        s
          .toLowerCase()
          .trim()
          .replace(/&/g, 'and')
          .replace(/r\s*&\s*b/g, 'rnb')
          .replace(/\s+/g, ' ')
      const unique = <T,>(arr: T[]) => Array.from(new Set(arr))
      const interestTags = unique((taste.topGenres || []).map((g) => norm(g)))

      const artists = (taste.topArtists || [])
      const n = artists.length
      const artistAffinity = artists.map((a, idx) => ({
        id: a.id,
        name: a.name,
        // higher score for earlier ranks, normalized 1..0 range
        score: n > 0 ? (n - idx) / n : 0,
      }))

      update.$set.interestTags = interestTags
      update.$set.artistAffinity = artistAffinity
    }
  } catch {}

  const options = { upsert: true, new: true }
  const doc = await (Profile as any).findOneAndUpdate(filter, update, options)

  // If doc existed before insert, update counts on matching identity element
  try {
    const setCounts: any = {}
    if (typeof (details as any).friendsCount === 'number') setCounts['identities.$.friendsCount'] = (details as any).friendsCount
    if (typeof (details as any).neighboursCount === 'number') setCounts['identities.$.neighboursCount'] = (details as any).neighboursCount
    if (typeof (details as any).followersCount === 'number') setCounts['identities.$.followersCount'] = (details as any).followersCount
    if (typeof (details as any).followingCount === 'number') setCounts['identities.$.followingCount'] = (details as any).followingCount
    if (Object.keys(setCounts).length > 0) {
      await (Profile as any).updateOne(
        { _id: doc._id, 'identities.provider': identity.provider, 'identities.providerUserId': identity.providerUserId },
        { $set: setCounts },
      ).exec()
    }
  } catch {}
  return doc
}
