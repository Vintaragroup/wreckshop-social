import { Queue } from 'bullmq'
import { env } from '../../env'

let ingestQueue: Queue | undefined

export function getIngestQueue() {
  if (!ingestQueue) {
    ingestQueue = new Queue('ingest', { connection: { url: env.REDIS_URL } })
    console.log('[queue:ingest] initialized')
  }
  return ingestQueue
}

export async function enqueueIngest(job: { provider: string; handleOrUrl?: string; accessToken?: string }) {
  const q = getIngestQueue()
  return q.add('ingest', job)
}
