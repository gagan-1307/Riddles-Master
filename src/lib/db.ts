import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prismaInstance: PrismaClient;

const databaseUrl = process.env.DATABASE_URL || import.meta.env.DATABASE_URL || '';

if (databaseUrl.startsWith('prisma://') || databaseUrl.startsWith('prisma+postgres://')) {
  prismaInstance = new PrismaClient({
    accelerateUrl: databaseUrl,
  });
} else {
  const pool = new pg.Pool({ connectionString: databaseUrl });
  const adapter = new PrismaPg(pool);
  prismaInstance = new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? prismaInstance;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
