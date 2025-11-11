-- CreateTable
CREATE TABLE "Artist" (
    "id" TEXT NOT NULL,
    "stackAuthUserId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profilePictureUrl" TEXT,
    "stageName" TEXT NOT NULL,
    "fullName" TEXT,
    "bio" TEXT,
    "genres" TEXT[],
    "niches" TEXT[],
    "countryCode" TEXT,
    "region" TEXT,
    "accountType" TEXT NOT NULL DEFAULT 'ARTIST',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationDate" TIMESTAMP(3),
    "publicMetricsOptIn" BOOLEAN NOT NULL DEFAULT false,
    "leaderboardRank" INTEGER,
    "leaderboardScore" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ManagerArtist" (
    "id" TEXT NOT NULL,
    "managerId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "viewAnalytics" BOOLEAN NOT NULL DEFAULT false,
    "createCampaign" BOOLEAN NOT NULL DEFAULT false,
    "editCampaign" BOOLEAN NOT NULL DEFAULT false,
    "deleteCampaign" BOOLEAN NOT NULL DEFAULT false,
    "postSocial" BOOLEAN NOT NULL DEFAULT false,
    "editProfile" BOOLEAN NOT NULL DEFAULT false,
    "configureIntegrations" BOOLEAN NOT NULL DEFAULT false,
    "inviteCollaborator" BOOLEAN NOT NULL DEFAULT false,
    "manageTeam" BOOLEAN NOT NULL DEFAULT false,
    "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),

    CONSTRAINT "ManagerArtist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpotifyIntegration" (
    "id" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "spotifyAccountId" TEXT NOT NULL,
    "displayName" TEXT,
    "profileUrl" TEXT,
    "profileImageUrl" TEXT,
    "followers" INTEGER NOT NULL DEFAULT 0,
    "isArtistAccount" BOOLEAN NOT NULL DEFAULT false,
    "genres" TEXT[],
    "tokenStoredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "monthlyListeners" INTEGER NOT NULL DEFAULT 0,
    "dailyStreams" INTEGER NOT NULL DEFAULT 0,
    "totalStreams" INTEGER NOT NULL DEFAULT 0,
    "lastSyncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpotifyIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstagramIntegration" (
    "id" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "instagramAccountId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "profileUrl" TEXT,
    "profileImageUrl" TEXT,
    "followers" INTEGER NOT NULL DEFAULT 0,
    "isBusinessAccount" BOOLEAN NOT NULL DEFAULT false,
    "monthlyReach" INTEGER NOT NULL DEFAULT 0,
    "monthlyImpressions" INTEGER NOT NULL DEFAULT 0,
    "engagementRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastSyncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstagramIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "YoutubeIntegration" (
    "id" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "youtubeChannelId" TEXT NOT NULL,
    "channelTitle" TEXT,
    "channelUrl" TEXT,
    "channelImageUrl" TEXT,
    "subscribers" INTEGER NOT NULL DEFAULT 0,
    "totalViews" INTEGER NOT NULL DEFAULT 0,
    "monthlyViews" INTEGER NOT NULL DEFAULT 0,
    "monthlySubscribers" INTEGER NOT NULL DEFAULT 0,
    "lastSyncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "YoutubeIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TikTokIntegration" (
    "id" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "tiktokUserId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "profileUrl" TEXT,
    "profileImageUrl" TEXT,
    "followers" INTEGER NOT NULL DEFAULT 0,
    "totalLikes" INTEGER NOT NULL DEFAULT 0,
    "videoCount" INTEGER NOT NULL DEFAULT 0,
    "monthlyViews" INTEGER NOT NULL DEFAULT 0,
    "monthlyEngagement" INTEGER NOT NULL DEFAULT 0,
    "lastSyncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TikTokIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "changes" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Artist_stackAuthUserId_key" ON "Artist"("stackAuthUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Artist_email_key" ON "Artist"("email");

-- CreateIndex
CREATE INDEX "Artist_stackAuthUserId_idx" ON "Artist"("stackAuthUserId");

-- CreateIndex
CREATE INDEX "Artist_email_idx" ON "Artist"("email");

-- CreateIndex
CREATE INDEX "ManagerArtist_status_idx" ON "ManagerArtist"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ManagerArtist_managerId_artistId_key" ON "ManagerArtist"("managerId", "artistId");

-- CreateIndex
CREATE UNIQUE INDEX "SpotifyIntegration_artistId_key" ON "SpotifyIntegration"("artistId");

-- CreateIndex
CREATE UNIQUE INDEX "SpotifyIntegration_spotifyAccountId_key" ON "SpotifyIntegration"("spotifyAccountId");

-- CreateIndex
CREATE INDEX "SpotifyIntegration_artistId_idx" ON "SpotifyIntegration"("artistId");

-- CreateIndex
CREATE UNIQUE INDEX "InstagramIntegration_artistId_key" ON "InstagramIntegration"("artistId");

-- CreateIndex
CREATE UNIQUE INDEX "InstagramIntegration_instagramAccountId_key" ON "InstagramIntegration"("instagramAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "InstagramIntegration_username_key" ON "InstagramIntegration"("username");

-- CreateIndex
CREATE INDEX "InstagramIntegration_artistId_idx" ON "InstagramIntegration"("artistId");

-- CreateIndex
CREATE UNIQUE INDEX "YoutubeIntegration_artistId_key" ON "YoutubeIntegration"("artistId");

-- CreateIndex
CREATE UNIQUE INDEX "YoutubeIntegration_youtubeChannelId_key" ON "YoutubeIntegration"("youtubeChannelId");

-- CreateIndex
CREATE INDEX "YoutubeIntegration_artistId_idx" ON "YoutubeIntegration"("artistId");

-- CreateIndex
CREATE UNIQUE INDEX "TikTokIntegration_artistId_key" ON "TikTokIntegration"("artistId");

-- CreateIndex
CREATE UNIQUE INDEX "TikTokIntegration_tiktokUserId_key" ON "TikTokIntegration"("tiktokUserId");

-- CreateIndex
CREATE UNIQUE INDEX "TikTokIntegration_username_key" ON "TikTokIntegration"("username");

-- CreateIndex
CREATE INDEX "TikTokIntegration_artistId_idx" ON "TikTokIntegration"("artistId");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "ManagerArtist" ADD CONSTRAINT "ManagerArtist_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManagerArtist" ADD CONSTRAINT "ManagerArtist_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpotifyIntegration" ADD CONSTRAINT "SpotifyIntegration_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstagramIntegration" ADD CONSTRAINT "InstagramIntegration_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YoutubeIntegration" ADD CONSTRAINT "YoutubeIntegration_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TikTokIntegration" ADD CONSTRAINT "TikTokIntegration_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
