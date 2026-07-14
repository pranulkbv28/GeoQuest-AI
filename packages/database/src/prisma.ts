import { PrismaPg } from '@prisma/adapter-pg';
import {
  ChallengeType,
  GameMode,
  PrismaClient,
  QuestionSource,
  QuestionStatus,
  QuestionType,
} from './generated/prisma/client.ts';

export { ChallengeType, GameMode, QuestionSource, QuestionStatus, QuestionType };

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const globalForPrisma = globalThis as unknown as { __prisma?: PrismaClient };

export const db = globalForPrisma.__prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__prisma = db;
}
