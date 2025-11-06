import 'dotenv/config'
import { z } from 'zod'

const EnvSchema = z.object({
  PORT: z.coerce.number().default(4000),
  MONGODB_URI: z.string().min(1),
  REDIS_URL: z.string().url(),
  SPOTIFY_CLIENT_ID: z.string().min(1),
  SPOTIFY_CLIENT_SECRET: z.string().min(1),
  SPOTIFY_REDIRECT_URI: z.string().url(),
  CORS_ORIGIN: z.string().url(),
  ADMIN_API_KEY: z.string().default(''),
})

export const env = EnvSchema.parse({
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  REDIS_URL: process.env.REDIS_URL,
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  ADMIN_API_KEY: process.env.ADMIN_API_KEY,
})
