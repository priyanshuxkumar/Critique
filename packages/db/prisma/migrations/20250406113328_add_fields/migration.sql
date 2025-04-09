/*
  Warnings:

  - Added the required column `category` to the `Website` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WebsiteCategory" AS ENUM ('PRODUCTIVITY', 'DEV_TOOL', 'DESIGN', 'MARKETING', 'EDUCATION', 'FINANCE', 'HEALTH', 'AI', 'ECOMMERCE', 'SOCIAL', 'ENTERTAINMENT', 'OTHER');

-- AlterTable
ALTER TABLE "Website" ADD COLUMN     "category" "WebsiteCategory" NOT NULL,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;
