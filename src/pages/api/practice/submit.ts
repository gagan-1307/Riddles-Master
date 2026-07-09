import type { APIRoute } from 'astro';
import { prisma } from '@/lib/db';
import { getUser } from '@/lib/auth/getUser';
import { QuizMode } from '@prisma/client';

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
    const { setId, answers, timeTaken, mode } = body;

    if (!setId || !answers || timeTaken === undefined || !mode) {
      return new Response(JSON.stringify({ error: 'Missing required parameters: setId, answers, timeTaken, mode' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const quizMode = mode.toUpperCase();
    if (quizMode !== 'PRACTICE' && quizMode !== 'TEST') {
      return new Response(JSON.stringify({ error: 'Invalid mode parameter.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 1. Enforce TEST mode attempt limits
    if (quizMode === 'TEST') {
      const existingTestAttempt = await prisma.practiceAttempt.findFirst({
        where: {
          userId: dbUser.id,
          setId,
          mode: 'TEST'
        }
      });

      if (existingTestAttempt) {
        return new Response(
          JSON.stringify({
            error: 'TEST_ALREADY_ATTEMPTED',
            message: 'You have already completed this set in Test mode.',
            existingAttempt: {
              score: existingTestAttempt.score,
              totalAttempted: existingTestAttempt.totalAttempted,
              accuracy: Math.round(
                (existingTestAttempt.score / existingTestAttempt.totalAttempted) * 100
              )
            }
          }),
          {
            status: 403,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // 2. Fetch set questions to grade
    const questions = await prisma.practiceQuestion.findMany({
      where: { setId },
      orderBy: { order: 'asc' }
    });

    if (questions.length === 0) {
      return new Response(JSON.stringify({ error: 'Set has no questions.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let score = 0;
    for (const question of questions) {
      const selected = answers[question.id];
      const isCorrect = selected === question.correctOption;
      if (isCorrect) {
        score++;
      }
    }

    const totalAttempted = questions.length;
    const accuracy = Math.round((score / totalAttempted) * 100);

    const questionsWithSolutions = questions.map(q => ({
      id: q.id,
      correctOption: q.correctOption,
      solution: q.solution
    }));

    // 3. Create PracticeAttempt record in database
    await prisma.practiceAttempt.create({
      data: {
        userId: dbUser.id,
        setId,
        score,
        totalAttempted,
        timeTaken: quizMode === 'TEST' ? timeTaken : 0,
        mode: quizMode as QuizMode,
        answers: answers // answers is Record<string, string>, compatible with Prisma Json type
      }
    });

    // 4. Calculate Rank in Leaderboard (TEST mode only)
    let rank = 1;
    if (quizMode === 'TEST') {
      const allTestAttempts = await prisma.practiceAttempt.findMany({
        where: {
          setId,
          mode: 'TEST'
        },
        select: {
          score: true,
          totalAttempted: true
        }
      });

      const userAccuracy = accuracy;
      for (const attempt of allTestAttempts) {
        const otherAccuracy = Math.round((attempt.score / attempt.totalAttempted) * 100);
        if (otherAccuracy > userAccuracy) {
          rank++;
        } else if (otherAccuracy === userAccuracy && attempt.totalAttempted > totalAttempted) {
          rank++;
        }
      }
    }

    return new Response(
      JSON.stringify({
        score,
        totalAttempted,
        accuracy,
        timeTaken,
        rank: quizMode === 'TEST' ? rank : null,
        questionsWithSolutions
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    console.error('Error during quiz submission:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
