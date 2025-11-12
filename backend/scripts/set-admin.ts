/**
 * Set Admin Status Script
 * 
 * Usage: npx tsx scripts/set-admin.ts <email>
 */

import { prisma } from '../src/lib/prisma.js';

async function main() {
  const email = process.argv[2];
  
  if (!email) {
    console.error('Usage: npx tsx scripts/set-admin.ts <email>');
    process.exit(1);
  }

  try {
    const artist = await prisma.artist.update({
      where: { email },
      data: { isAdmin: true },
      select: {
        id: true,
        email: true,
        stageName: true,
        isAdmin: true,
      },
    });

    console.log('✅ Admin status updated:', artist);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
