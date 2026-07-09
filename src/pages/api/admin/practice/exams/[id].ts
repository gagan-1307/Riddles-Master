import type { APIRoute } from 'astro';
import { prisma } from '@/lib/db';
import { getUser } from '@/lib/auth/getUser';

export const PUT: APIRoute = async ({ params, request, cookies, locals }) => {
  const dbUser = await getUser(cookies);
  const user = locals.user || dbUser;

  if (!user) {
    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const role = locals.role || user.role;
  const isAdmin = String(role).toLowerCase() === 'admin';

  if (!isAdmin) {
    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: 'Exam ID is required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const { 
      name, 
      slug, 
      description, 
      duration, 
      totalQuestions, 
      pattern, 
      topicIds, 
      isPublished 
    } = body;

    // Validate inputs
    if (!name || !slug || duration === undefined || totalQuestions === undefined) {
      return new Response(JSON.stringify({ error: 'Missing required fields: name, slug, duration, and totalQuestions are required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const durationVal = parseInt(String(duration), 10);
    const questionsVal = parseInt(String(totalQuestions), 10);

    if (isNaN(durationVal) || durationVal <= 0 || isNaN(questionsVal) || questionsVal <= 0) {
      return new Response(JSON.stringify({ error: 'Duration and totalQuestions must be positive integers.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
    if (!cleanSlug) {
      return new Response(JSON.stringify({ error: 'Slug is invalid.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check duplicate name/slug (excluding this exam)
    const [existingName, existingSlug] = await Promise.all([
      prisma.exam.findFirst({
        where: {
          name: name.trim(),
          id: { not: id }
        }
      }),
      prisma.exam.findFirst({
        where: {
          slug: cleanSlug,
          id: { not: id }
        }
      })
    ]);

    if (existingName) {
      return new Response(JSON.stringify({ error: `An exam with the name '${name}' already exists.` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (existingSlug) {
      return new Response(JSON.stringify({ error: `An exam with the slug '${cleanSlug}' already exists.` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update in transaction: delete old topics first, then insert new ones and update exam
    const updatedExam = await prisma.$transaction(async (tx) => {
      // 1. Delete existing topics
      await tx.examTopic.deleteMany({
        where: { examId: id }
      });

      // 2. Update exam + write new topics
      return tx.exam.update({
        where: { id },
        data: {
          name: name.trim(),
          slug: cleanSlug,
          description: description ? description.trim() : null,
          duration: durationVal,
          totalQuestions: questionsVal,
          pattern: pattern ? pattern.trim() : null,
          isPublished: !!isPublished,
          topics: {
            create: (topicIds || []).map((topicId: string) => ({
              topicId
            }))
          }
        },
        include: {
          topics: true
        }
      });
    });

    return new Response(JSON.stringify({ success: true, exam: updatedExam }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error updating exam:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async ({ params, cookies, locals }) => {
  const dbUser = await getUser(cookies);
  const user = locals.user || dbUser;

  if (!user) {
    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const role = locals.role || user.role;
  const isAdmin = String(role).toLowerCase() === 'admin';

  if (!isAdmin) {
    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: 'Exam ID is required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Delete associated topics
      await tx.examTopic.deleteMany({
        where: { examId: id }
      });

      // 2. Delete exam
      await tx.exam.delete({
        where: { id }
      });
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error deleting exam:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
