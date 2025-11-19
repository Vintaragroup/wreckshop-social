-- AlterTable
ALTER TABLE "SpotifyIntegration" ADD COLUMN     "accessTokenEncrypted" TEXT,
ADD COLUMN     "lastRefreshedAt" TIMESTAMP(3),
ADD COLUMN     "refreshTokenEncrypted" TEXT,
ADD COLUMN     "tokenExpiresAt" TIMESTAMP(3),
ADD COLUMN     "tokenScope" TEXT[] DEFAULT ARRAY[]::TEXT[];
