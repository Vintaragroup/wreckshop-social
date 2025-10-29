import { Worker, Job } from 'bullmq'
import { env } from '../../env'
import { ingestProfile } from './ingest.service'

export function startIngestWorker() {
  const worker = new Worker(
    'ingest',
    async (job: Job) => {
      const { provider, handleOrUrl, accessToken } = job.data as {
        provider: string
        handleOrUrl?: string
        accessToken?: string
      }
      console.log('[worker:ingest] processing', { id: job.id, provider, handleOrUrl })
      const doc = await ingestProfile({ provider: provider as any, handleOrUrl, accessToken })
      console.log('[worker:ingest] done', { id: job.id, profileId: doc?._id?.toString?.() })
      return { profileId: doc?._id }
    },
    { connection: { url: env.REDIS_URL } }
  )

  worker.on('failed', (job, err) => {
    console.error('[worker:ingest] failed', { id: job?.id, err: err?.message })
  })

  console.log('[worker:ingest] started')
  return worker
}
