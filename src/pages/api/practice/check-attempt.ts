import type { APIRoute } from 'astro';
import { prisma } from '@/lib/db';
import { getUser } from '@/lib/auth/getUser';
import { QuizMode } from '@prisma/client';

export const GET: APIRoute = async ({ request, cookies }) => {
  try {
    const url = new URL(request.url);
    const setId = url.searchParams.get('setId');
    const modeParam = url.searchParams.get('mode');

    if (!setId || !modeParam) {
      return new Response(JSON.stringify({ error: 'setId and mode parameters are required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const mode = modeParam.toUpperCase();
    if (mode !== 'PRACTICE' && mode !== 'TEST') {
      return new Response(JSON.stringify({ error: 'Invalid mode parameter.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const dbUser = await getUser(cookies);

    if (!dbUser) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Find if an attempt already exists for this user, set, and mode
    const existingAttempt = await prisma.practiceAttempt.findFirst({
      where: {
        userId: dbUser.id,
        setId: setId,
        mode: mode as QuizMode
      },
      select: {
        score: true,
        totalAttempted: true
      },
      orderBy: {
        completedAt: 'desc' // Get the latest one if multiple exist (for PRACTICE)
      }
    });

    if (existingAttempt) {
      return new Response(JSON.stringify({
        attempted: true,
        attempt: {
          score: existingAttempt.score,
          totalAttempted: existingAttempt.totalAttempted,
          accuracy: Math.round((existingAttempt.score / existingAttempt.totalAttempted) * 100)
        }
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ attempted: false, attempt: null }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error checking attempt status:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
