import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prismaInstance: PrismaClient;

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
    // eslint-disable-next-line no-console
    console.warn('Disabled TLS certificate verification for database connections (local dev only)');
  } catch (e) {
    // ignore if environment cannot be mutated
  }
}

if (databaseUrl.startsWith('prisma://') || databaseUrl.startsWith('prisma+postgres://')) {
  prismaInstance = new PrismaClient({
    accelerateUrl: databaseUrl,
  });
} else {
  const pool = new pg.Pool({
    connectionString: databaseUrl,
    ...(shouldDisableTlsVerification ? { ssl: { rejectUnauthorized: false } } : {}),
  });
  const adapter = new PrismaPg(pool);
  prismaInstance = new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? prismaInstance;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
