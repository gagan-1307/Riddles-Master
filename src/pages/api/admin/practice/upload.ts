import type { APIRoute } from 'astro';
import { prisma } from '@/lib/db';
import { getUser } from '@/lib/auth/getUser';

interface ParsedQuestion {
  statement: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  solution: string;
}

export const POST: APIRoute = async ({ request, cookies, locals }) => {
  const dbUser = await getUser(cookies, locals.user);
  const user = locals.user || dbUser;

  if (!user) {
    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const role = locals.role || (dbUser ? dbUser.role : 'guest');
  const isAdmin = String(role).toLowerCase() === 'admin' || dbUser?.role === 'ADMIN';

  if (!isAdmin) {
    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const { topicId, setNumber, title, questions } = body as {
      topicId: string;
      setNumber: string | number;
      title: string;
      questions: ParsedQuestion[];
    };

    // 1. Basic validation
    if (!topicId || !setNumber || !title || !questions) {
      return new Response(JSON.stringify({ error: 'Missing required parameters: topicId, setNumber, title, questions' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const setNum = parseInt(String(setNumber), 10);
    if (isNaN(setNum) || setNum <= 0) {
      return new Response(JSON.stringify({ error: 'Set number must be a positive integer.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!Array.isArray(questions) || questions.length < 1) {
      return new Response(JSON.stringify({ error: 'Questions list must contain at least one question.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. Verify topic exists
    const topic = await prisma.practiceTopic.findUnique({
      where: { id: topicId }
    });

    if (!topic) {
      return new Response(JSON.stringify({ error: 'Selected topic does not exist.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 3. Generate and verify setSlug uniqueness
    const setSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (!setSlug) {
      return new Response(JSON.stringify({ error: 'Invalid title format. Generated slug is empty.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const [existingSetNumber, existingSetSlug] = await Promise.all([
      prisma.practiceSet.findFirst({
        where: { topicId, setNumber: setNum }
      }),
      prisma.practiceSet.findUnique({
        where: {
          topicId_setSlug: {
            topicId,
            setSlug
          }
        }
      })
    ]);

    if (existingSetNumber) {
      return new Response(JSON.stringify({ error: `Set number #${setNum} is already taken for this topic.` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (existingSetSlug) {
      return new Response(JSON.stringify({ error: `A set with slug '${setSlug}' already exists for this topic. Please choose a different title.` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 4. Validate each question structure
    const validLetters = ['A', 'B', 'C', 'D'];
    for (let idx = 0; idx < questions.length; idx++) {
      const q = questions[idx];
      const statement = q.statement?.trim();
      const optionA = q.optionA?.trim();
      const optionB = q.optionB?.trim();
      const optionC = q.optionC?.trim();
      const optionD = q.optionD?.trim();
      const correctOption = q.correctOption?.toUpperCase().trim();
      const solution = q.solution?.trim();

      if (!statement || !optionA || !optionB || !optionC || !optionD || !correctOption || !solution) {
        return new Response(JSON.stringify({ error: `Row #${idx + 1} has empty or missing required fields.` }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (!validLetters.includes(correctOption)) {
        return new Response(JSON.stringify({ error: `Row #${idx + 1} has an invalid correctOption '${correctOption}'. Must be A, B, C, or D.` }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // 5. Execute creation within a Prisma transaction
    const newSet = await prisma.$transaction(async (tx) => {
      const createdSet = await tx.practiceSet.create({
        data: {
          topicId,
          setNumber: setNum,
          setTitle: title.trim(),
          setSlug
        }
      });

      const questionCreates = questions.map((q, index) => {
        return tx.practiceQuestion.create({
          data: {
            setId: createdSet.id,
            order: index + 1,
            statement: q.statement.trim(),
            optionA: q.optionA.trim(),
            optionB: q.optionB.trim(),
            optionC: q.optionC.trim(),
            optionD: q.optionD.trim(),
            correctOption: q.correctOption.toUpperCase().trim(),
            solution: q.solution.trim()
          }
        });
      });

      await Promise.all(questionCreates);
      return createdSet;
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        setId: newSet.id, 
        questionsCreated: questions.length 
      }), 
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('Error uploading CSV practice questions:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
