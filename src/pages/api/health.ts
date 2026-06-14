export const prerender = false;

import type { APIRoute } from 'astro';
import { prisma } from '../../lib/db';

export const GET: APIRoute = async () => {
  const timestamp = new Date().toISOString();
  
  let database = false;
  try {
    // Attempt database query with a 2-second timeout using Promise.race
    const dbPromise = prisma.$queryRaw`SELECT 1`;
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database query timeout')), 2000)
    );
    
    await Promise.race([dbPromise, timeoutPromise]);
    database = true;
  } catch (error) {
    database = false;
  }

  return new Response(
    JSON.stringify({
      status: 'ok',
      timestamp,
      database,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};
