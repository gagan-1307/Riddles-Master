import type { APIRoute } from 'astro';
import { getTodaysProblem } from '../../lib/daily';
import { getStreakCount } from '../../lib/auth/streak';

export const GET: APIRoute = async (context) => {
  try {
    const todaysProblem = await getTodaysProblem();
    const user = context.locals.user;

    let streakCount: number | null = null;
    if (user?.id) {
      streakCount = await getStreakCount(user.id);
    }

    return new Response(
      JSON.stringify({
        todaysProblem,
        streakCount,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error: any) {
    console.error('[API /api/daily] Error fetching daily data:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to load daily data',
        todaysProblem: null,
        streakCount: null,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
