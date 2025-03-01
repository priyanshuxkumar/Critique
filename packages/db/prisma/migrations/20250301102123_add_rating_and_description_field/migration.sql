/*
  Warnings:

  - Added the required column `rating` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Website` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "rating" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Website" ADD COLUMN     "description" TEXT NOT NULL;
