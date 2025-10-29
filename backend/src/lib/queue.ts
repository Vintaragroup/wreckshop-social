import { Queue } from 'bullmq'

export function createQueue(connection: string) {
  const queue = new Queue('default', { connection: { url: connection } })
  console.log('[queue] initialized')
  return queue
}
