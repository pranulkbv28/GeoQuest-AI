/*
  Warnings:

  - A unique constraint covering the columns `[categoryBlob]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - Made the column `categoryBlob` on table `categories` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "categoryBlob" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "categories_categoryBlob_key" ON "categories"("categoryBlob");
