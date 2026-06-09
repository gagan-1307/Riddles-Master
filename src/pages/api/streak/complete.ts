import type { APIRoute } from 'astro';
import { prisma } from '../../../lib/db';
import { getStreakCount } from '../../../lib/auth/streak';
import { getISTDateString } from '../../../lib/daily';

export const POST: APIRoute = async ({ request, locals }) => {
  const user = locals.user;

  // 1. Require authentication
  if (!user) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized. Please sign in.' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // 2. Parse request body for problemId
  let problemId: string | undefined;
  try {
    const body = await request.json();
    problemId = body.problemId;
  } catch (err) {
    // Body is empty or malformed
  }

  if (!problemId) {
    return new Response(
      JSON.stringify({ error: 'Missing problemId in request body.' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const todayStr = getISTDateString(new Date());

  try {
    // Check if a streak already exists for this user today
    const existingStreak = await prisma.dailyStreak.findUnique({
      where: {
        userId_date: {
          userId: user.id,
          date: todayStr,
        },
      },
    });

    const alreadyDone = !!existingStreak;

    // Ignore/do not create if it already exists, otherwise create
    if (!alreadyDone) {
      await prisma.dailyStreak.create({
        data: {
          userId: user.id,
          date: todayStr,
          problemId: problemId,
        },
      });
    }

    // Get the updated streak count
    const currentStreak = await getStreakCount(user.id);

    return new Response(
      JSON.stringify({
        alreadyDone,
        currentStreak,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in POST /api/streak/complete:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
