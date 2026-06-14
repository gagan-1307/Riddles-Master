export const prerender = false;

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

    // Upsert solved status
    const status = await prisma.userProblemStatus.upsert({
      where: {
        userId_problemId: {
          userId: user.id,
          problemId: problemId,
        },
      },
      update: {
        solved: true,
        solvedAt: new Date(),
      },
      create: {
        userId: user.id,
        problemId: problemId,
        solved: true,
        solvedAt: new Date(),
      },
    });

    // Handle daily streak
    const getISTDateString = (d: Date) => {
      const offset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
      const istTime = new Date(d.getTime() + offset);
      return istTime.toISOString().split('T')[0];
    };
    const todayStr = getISTDateString(new Date());

    try {
      await prisma.dailyStreak.upsert({
        where: {
          userId_date: {
            userId: user.id,
            date: todayStr,
          },
        },
        update: {
          problemId: problemId,
        },
        create: {
          userId: user.id,
          date: todayStr,
          problemId: problemId,
        },
      });
    } catch (streakErr) {
      // If there's already a streak recorded for today, it might fail/warn depending on logic,
      // but upsert covers it. Let's just catch to be safe.
      console.error('Error upserting daily streak:', streakErr);
    }

    return new Response(JSON.stringify({ solved: true, status }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in solve API:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
