import mongoose from 'mongoose'

export async function connectMongo(uri: string) {
  try {
    await mongoose.connect(uri, {
      // Add connection options to prevent buffering issues
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of infinite buffering
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority',
    })
    console.log('[mongo] connected')
  } catch (err) {
    console.error('[mongo] connection error', err)
    // Don't throw - let the server start and retry connections on demand
    console.warn('[mongo] starting server without MongoDB connection, will retry on queries')
  }
}
