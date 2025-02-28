/*
  Warnings:

  - A unique constraint covering the columns `[userId,websiteId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_websiteId_key" ON "Review"("userId", "websiteId");
