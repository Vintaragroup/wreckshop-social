import mongoose from 'mongoose'

export async function connectMongo(uri: string) {
  try {
    await mongoose.connect(uri)
    console.log('[mongo] connected')
  } catch (err) {
    console.error('[mongo] connection error', err)
  }
}
