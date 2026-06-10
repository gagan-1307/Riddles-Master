import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pgPool: pg.Pool | undefined;
};

let prismaInstance: PrismaClient;

if (globalForPrisma.prisma) {
  prismaInstance = globalForPrisma.prisma;
} else {
  const databaseUrl = process.env.DATABASE_URL || (typeof import.meta !== 'undefined' && import.meta && (import.meta as any).env ? (import.meta as any).env.DATABASE_URL : '') || '';
  const shouldDisableTlsVerification = (() => {
    if (!databaseUrl) return false;

    try {
      const url = new URL(databaseUrl);
      return url.hostname.endsWith('supabase.co') || url.searchParams.get('sslmode') === 'require';
    } catch {
      return databaseUrl.includes('sslmode=require');
    }
  })();

  if (shouldDisableTlsVerification) {
    try {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    } catch (e) {
      // ignore if environment cannot be mutated
    }
  }

  if (databaseUrl.startsWith('prisma://') || databaseUrl.startsWith('prisma+postgres://')) {
    prismaInstance = new PrismaClient({
      accelerateUrl: databaseUrl,
    });
  } else {
    // Strip query parameters (like ?sslmode=require) from connection string when bypassing TLS verification.
    // Otherwise, the pg parser overrides our 'rejectUnauthorized: false' option with strict validation.
    const cleanedDatabaseUrl = shouldDisableTlsVerification
      ? databaseUrl.split('?')[0]
      : databaseUrl;

    const pool = new pg.Pool({
      connectionString: cleanedDatabaseUrl,
      ...(shouldDisableTlsVerification ? { ssl: { rejectUnauthorized: false } } : {}),
    });

    globalForPrisma.pgPool = pool;

    const adapter = new PrismaPg(pool);
    prismaInstance = new PrismaClient({ adapter });
  }

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaInstance;
  }
}

export const prisma = prismaInstance;
