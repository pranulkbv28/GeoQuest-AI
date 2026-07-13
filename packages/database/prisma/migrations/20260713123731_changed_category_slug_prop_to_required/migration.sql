/*
  Warnings:

  - A unique constraint covering the columns `[categorySlug]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - Made the column `categorySlug` on table `categories` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "categorySlug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "categories_categorySlug_key" ON "categories"("categorySlug");
