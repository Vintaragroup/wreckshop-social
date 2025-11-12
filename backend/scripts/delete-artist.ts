/**
 * Delete artist by email
 */

import { prisma } from '../src/lib/prisma.js';

async function main() {
  const email = process.argv[2];
  
  if (!email) {
    console.error('Usage: npx tsx scripts/delete-artist.ts <email>');
    process.exit(1);
  }

  try {
    const artist = await prisma.artist.delete({
      where: { email },
    });

    console.log('✅ Artist deleted:', artist.email, '(', artist.id, ')');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
