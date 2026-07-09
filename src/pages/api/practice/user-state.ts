import type { APIRoute } from 'astro';
import { prisma } from '@/lib/db';
import { getUser } from '@/lib/auth/getUser';

export const GET: APIRoute = async ({ request, cookies }) => {
  try {
    const url = new URL(request.url);
    const topicId = url.searchParams.get('topicId');

    if (!topicId) {
      return new Response(JSON.stringify({ error: 'topicId parameter is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const dbUser = await getUser(cookies);

    if (!dbUser) {
      return new Response(JSON.stringify({ isLoggedIn: false, attempts: {} }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fetch attempts for the user on this specific topic
    const attempts = await prisma.practiceAttempt.findMany({
      where: {
        userId: dbUser.id,
        set: {
          topicId: topicId
        }
      },
      select: {
        id: true,
        setId: true,
        score: true,
        totalAttempted: true,
        timeTaken: true,
        mode: true,
        completedAt: true
      },
      orderBy: {
        completedAt: 'asc'
      }
    });

    // Group attempts by setId
    const groupedAttempts = attempts.reduce((acc, attempt) => {
      if (!acc[attempt.setId]) {
        acc[attempt.setId] = [];
      }
      acc[attempt.setId].push(attempt);
      return acc;
    }, {} as Record<string, typeof attempts>);

    return new Response(JSON.stringify({
      isLoggedIn: true,
      userId: dbUser.id,
      attempts: groupedAttempts
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error fetching user attempts state:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
