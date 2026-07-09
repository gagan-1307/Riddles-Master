import type { APIRoute } from 'astro';
import { prisma } from '@/lib/db';
import { getUser } from '@/lib/auth/getUser';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const dbUser = await getUser(cookies);

    if (!dbUser) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    const { questionId, setId } = body;

    if (!questionId || !setId) {
      return new Response(JSON.stringify({ error: 'questionId and setId are required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verify the question belongs to the set (security check)
    const question = await prisma.practiceQuestion.findUnique({
      where: { id: questionId }
    });

    if (!question || question.setId !== setId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      correctOption: question.correctOption,
      solution: question.solution
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error verifying answer:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
