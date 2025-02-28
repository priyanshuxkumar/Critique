/*
  Warnings:

  - You are about to drop the `AvailableApps` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "AvailableApps";

-- CreateTable
CREATE TABLE "Website" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "websiteUrl" TEXT NOT NULL,
    "iconUrl" TEXT NOT NULL,

    CONSTRAINT "Website_pkey" PRIMARY KEY ("id")
);
