/**
 * Prisma Client Instance
 * 
 * Use this to access the database from your routes and services.
 * This is a singleton pattern to prevent multiple database connections.
 * 
 * Usage:
 * import prisma from '../lib/prisma.js'
 * 
 * Example:
 * const artist = await prisma.artist.create({
 *   data: {
 *     stackAuthUserId: 'user_123',
 *     email: 'artist@example.com',
 *     stageName: 'The Artist',
 *   }
 * })
 */

import { PrismaClient } from '@prisma/client';

/**
 * Instantiate Prisma Client
 * 
 * In production, this prevents instantiating a new PrismaClient with each import
 * by using the globalThis object to store a singleton instance
 */
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'warn', 'error']
      : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * Graceful shutdown
 * Disconnect from database when process exits
 */
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default prisma;
