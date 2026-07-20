import type { APIRoute } from 'astro';
import { prisma } from '../../../../lib/db';
import { getUser } from '../../../../lib/auth/getUser';

export const POST: APIRoute = async ({ request, cookies, locals }) => {
  // Verify session and admin role server-side
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
    const { 
      number, 
      title, 
      slug, 
      difficulty, 
      isPremium, 
      statement, 
      answer, 
      editorial, 
      tagIds 
    } = body;

    // Validate inputs
    if (!title || !number || !slug || !statement) {
      return new Response(JSON.stringify({ error: 'Missing required fields: title, number, slug, and statement are required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const problemNumber = parseInt(number, 10);
    if (isNaN(problemNumber)) {
      return new Response(JSON.stringify({ error: 'Problem number must be a valid integer.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check duplicates
    const [existingNum, existingSlug] = await Promise.all([
      prisma.problem.findUnique({ where: { number: problemNumber } }),
      prisma.problem.findUnique({ where: { slug: slug.trim() } })
    ]);

    if (existingNum) {
      return new Response(JSON.stringify({ error: `Problem number #${problemNumber} already exists.` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (existingSlug) {
      return new Response(JSON.stringify({ error: `Slug '${slug}' already exists. Please choose a different slug.` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create problem + ProblemsOnTags records in a Prisma transaction
    const newProblem = await prisma.$transaction(async (tx) => {
      return tx.problem.create({
        data: {
          number: problemNumber,
          title: title.trim(),
          slug: slug.trim(),
          difficulty,
          isPremium,
          statement: statement.trim(),
          answer: answer ? answer.trim() : null,
          editorial: editorial ? editorial.trim() : null,
          tags: {
            create: (tagIds || []).map((tagId: string) => ({
              tagId
            }))
          }
        },
        include: {
          tags: true
        }
      });
    });

    return new Response(JSON.stringify({ success: true, problem: newProblem }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error creating problem:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
