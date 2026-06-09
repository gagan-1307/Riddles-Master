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
  
  // Hash the YYYY-MM-DD string by summing its character codes
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash += dateStr.charCodeAt(i);
  }

  // Get total problem count from the database
  const count = await prisma.problem.count();
  if (count === 0) {
    return null;
  }

  // Consistent 0-based index calculation
  const index = hash % count;

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
