-- CreateEnum
CREATE TYPE "question_type" AS ENUM ('MULTIPLE_CHOICE');

-- CreateEnum
CREATE TYPE "question_source" AS ENUM ('MANUAL', 'AI_GENERATED');

-- CreateEnum
CREATE TYPE "question_status" AS ENUM ('DRAFT', 'PUBLISHED');

-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "explanation" TEXT,
ADD COLUMN     "options" JSONB,
ADD COLUMN     "questionType" "question_type" NOT NULL DEFAULT 'MULTIPLE_CHOICE',
ADD COLUMN     "source" "question_source" NOT NULL DEFAULT 'MANUAL',
ADD COLUMN     "status" "question_status" NOT NULL DEFAULT 'PUBLISHED';
