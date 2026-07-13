/*
  Warnings:

  - You are about to drop the column `categoryBlob` on the `categories` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "categories_categoryBlob_key";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "categoryBlob",
ADD COLUMN     "categorySlug" TEXT;
