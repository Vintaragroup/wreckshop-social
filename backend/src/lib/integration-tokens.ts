import crypto from 'crypto'
import { env } from '../env'

const KEY = crypto
  .createHash('sha256')
  .update(env.INTEGRATION_TOKEN_SECRET)
  .digest()

const IV_LENGTH = 12 // AES-GCM recommended length
const STATE_TTL_MS = 10 * 60 * 1000 // 10 minutes

export type IntegrationStatePayload = {
  artistId: string
  userId: string
  redirectPath?: string
  nonce: string
  createdAt: number
}

export function encryptSecret(value: string): string {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv('aes-256-gcm', KEY, iv)
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()

  return [iv.toString('hex'), authTag.toString('hex'), encrypted.toString('hex')].join(':')
}

export function decryptSecret(payload: string): string {
  const [ivHex, authTagHex, encryptedHex] = payload.split(':')
  if (!ivHex || !authTagHex || !encryptedHex) {
    throw new Error('Invalid encrypted payload')
  }

  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    KEY,
    Buffer.from(ivHex, 'hex')
  )
  decipher.setAuthTag(Buffer.from(authTagHex, 'hex'))
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedHex, 'hex')),
    decipher.final(),
  ])

  return decrypted.toString('utf8')
}

export function createIntegrationState(payload: {
  artistId: string
  userId: string
  redirectPath?: string
}): string {
  const enriched: IntegrationStatePayload = {
    artistId: payload.artistId,
    userId: payload.userId,
    redirectPath: payload.redirectPath,
    nonce: crypto.randomBytes(16).toString('hex'),
    createdAt: Date.now(),
  }

  const serialized = JSON.stringify(enriched)
  const signature = crypto.createHmac('sha256', KEY).update(serialized).digest('hex')
  const transport = JSON.stringify({ payload: enriched, signature })

  return Buffer.from(transport).toString('base64url')
}

export function verifyIntegrationState(state: string): IntegrationStatePayload {
  const decoded = Buffer.from(state, 'base64url').toString('utf8')
  const parsed = JSON.parse(decoded) as { payload: IntegrationStatePayload; signature: string }
  const serializedPayload = JSON.stringify(parsed.payload)
  const expectedSignature = crypto.createHmac('sha256', KEY).update(serializedPayload).digest('hex')

  if (expectedSignature !== parsed.signature) {
    throw new Error('Invalid state signature')
  }

  if (Date.now() - parsed.payload.createdAt > STATE_TTL_MS) {
    throw new Error('State has expired')
  }

  return parsed.payload
}
