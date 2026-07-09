import { db } from '@geoquest-ai/database';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  async check() {
    const rows = await db.$queryRaw<{ result: number }[]>`SELECT 1 as result`;
    const row = rows[0];

    if (!row) {
      return {
        message: 'No row',
      };
    }

    const userCount = await db.user.count();

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: {
        connected: row.result === 1,
        userCount,
      },
    };
  }
}
