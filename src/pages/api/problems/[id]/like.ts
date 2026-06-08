import type { APIRoute } from 'astro';
import { prisma } from '../../../../lib/db';

export const POST: APIRoute = async ({ params, locals }) => {
  const { id: problemId } = params;
  const user = locals.user;

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!problemId) {
    return new Response(JSON.stringify({ error: 'Missing problem ID' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Check if problem exists
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
    });

    if (!problem) {
      return new Response(JSON.stringify({ error: 'Problem not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Toggle liked state
    const existingLike = await prisma.likedProblem.findUnique({
      where: {
        userId_problemId: {
          userId: user.id,
          problemId: problemId,
        },
      },
    });

    let liked = false;
    if (existingLike) {
      await prisma.likedProblem.delete({
        where: { id: existingLike.id },
      });
    } else {
      await prisma.likedProblem.create({
        data: {
          userId: user.id,
          problemId: problemId,
        },
      });
      liked = true;
    }

    // Get updated count
    const likesCount = await prisma.likedProblem.count({
      where: { problemId: problemId },
    });

    return new Response(JSON.stringify({ liked, likesCount }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in like API:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
