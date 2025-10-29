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

  // Upsert by identity match
  const filter = {
    'identities.provider': identity.provider,
    'identities.providerUserId': identity.providerUserId,
  }

  const displayName = handle || identity.handle || identity.providerUserId

  const update = {
    $set: { taste },
    $setOnInsert: {
      displayName,
      identities: [identity],
    },
  }

  const options = { upsert: true, new: true }
  const doc = await (Profile as any).findOneAndUpdate(filter, update, options)
  return doc
}
