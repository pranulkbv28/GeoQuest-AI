-- CreateEnum
CREATE TYPE "game_mode" AS ENUM ('SOLO', 'LOCAL_PASS_AND_PLAY');

-- CreateEnum
CREATE TYPE "challenge_type" AS ENUM ('COUNTRY_GUESS', 'QUESTION');

-- CreateTable
CREATE TABLE "games" (
    "id" TEXT NOT NULL,
    "mode" "game_mode" NOT NULL DEFAULT 'SOLO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_players" (
    "id" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "userId" TEXT,
    "currentTile" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "game_players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "turns" (
    "id" TEXT NOT NULL,
    "gamePlayerId" TEXT NOT NULL,
    "turnNumber" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "turns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attempts" (
    "id" TEXT NOT NULL,
    "turnId" TEXT NOT NULL,
    "challengeType" "challenge_type" NOT NULL,
    "countryId" TEXT,
    "questionId" TEXT,
    "selectedAnswer" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "responseTimeMs" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attempts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "game_players_gameId_idx" ON "game_players"("gameId");

-- CreateIndex
CREATE INDEX "game_players_userId_idx" ON "game_players"("userId");

-- CreateIndex
CREATE INDEX "turns_gamePlayerId_idx" ON "turns"("gamePlayerId");

-- CreateIndex
CREATE INDEX "attempts_turnId_idx" ON "attempts"("turnId");

-- CreateIndex
CREATE INDEX "attempts_countryId_idx" ON "attempts"("countryId");

-- CreateIndex
CREATE INDEX "attempts_questionId_idx" ON "attempts"("questionId");

-- AddForeignKey
ALTER TABLE "game_players" ADD CONSTRAINT "game_players_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_players" ADD CONSTRAINT "game_players_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turns" ADD CONSTRAINT "turns_gamePlayerId_fkey" FOREIGN KEY ("gamePlayerId") REFERENCES "game_players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempts" ADD CONSTRAINT "attempts_turnId_fkey" FOREIGN KEY ("turnId") REFERENCES "turns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempts" ADD CONSTRAINT "attempts_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempts" ADD CONSTRAINT "attempts_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
