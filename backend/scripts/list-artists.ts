/**
 * List all artists in database
 */

import { prisma } from '../src/lib/prisma.js';

async function main() {
  try {
    const artists = await prisma.artist.findMany({
      select: {
        id: true,
        email: true,
        stageName: true,
        isAdmin: true,
      },
    });

    if (artists.length === 0) {
      console.log('No artists found in database');
    } else {
      console.log('Artists in database:');
      console.table(artists);
    }
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
