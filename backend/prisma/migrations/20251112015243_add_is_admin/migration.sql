-- AlterTable
ALTER TABLE "Artist" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "permissions" JSONB NOT NULL DEFAULT '{"configureIntegrations": true, "viewAnalytics": false, "createCampaigns": false, "editProfile": true, "postSocial": false}';
