import { prisma } from './db';

/**
 * Formats a Date object as a YYYY-MM-DD string in IST timezone (UTC+5:30).
 */
export function getISTDateString(d: Date = new Date()): string {
  const offset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
  const istTime = new Date(d.getTime() + offset);
  return istTime.toISOString().split('T')[0];
}

/**
 * Gets the consistent daily riddle for today based on a date hash.
 */
export async function getTodaysProblem() {
  const dateStr = getISTDateString();
  
  // Calculate days since base epoch (January 1, 2026 IST)
  const currentISTDate = new Date(`${dateStr}T00:00:00Z`);
  const epochISTDate = new Date('2026-01-01T00:00:00Z');
  const msInDay = 24 * 60 * 60 * 1000;
  const daysDiff = Math.floor((currentISTDate.getTime() - epochISTDate.getTime()) / msInDay);
  const counter = Math.max(1, daysDiff + 1);

  // Get total problem count from the database
  const count = await prisma.problem.count();
  if (count === 0) {
    return null;
  }

  // Consistent 0-based index calculation cycled via modulo
  const index = (counter - 1) % count;

  // Retrieve the problem at that index, ordered consistently by 'number' ascending
  const problems = await prisma.problem.findMany({
    orderBy: {
      number: 'asc',
    },
    skip: index,
    take: 1,
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return problems[0] || null;
}
