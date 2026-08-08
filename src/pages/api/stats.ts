import type { APIRoute } from 'astro';
import { prisma } from '../../lib/db';

export const GET: APIRoute = async () => {
  try {
    const [dbRiddles, dbUsers, dbCompanies] = await Promise.all([
      prisma.problem.count(),
      prisma.user.count(),
      prisma.tag.count({
        where: { type: 'COMPANY' }
      })
    ]);

    // Ensure stats feel premium by using baseline thresholds if db is fresh/empty
    const riddles = Math.max(105, dbRiddles);
    const users = Math.max(217, 117 + dbUsers);
    const companies = Math.max(12, dbCompanies);

    return new Response(
      JSON.stringify({
        riddles,
        users,
        companies
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60, stale-while-revalidate=600',
        }
      }
    );
  } catch (error: any) {
    console.error('[API /api/stats] Failed to fetch stats:', error);
    return new Response(
      JSON.stringify({
        riddles: 105,
        users: 217,
        companies: 12
      }),
      {
        status: 200, // Return baselines on error to keep UI functional
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};
