import type { APIRoute } from 'astro';
import { prisma } from '../../../../lib/db';
import { getUser } from '../../../../lib/auth/getUser';

// PUT: Update an existing problem
export const PUT: APIRoute = async ({ params, request, cookies, locals }) => {
  const { id } = params;

  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing problem ID' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Verify session and admin role server-side
  const dbUser = await getUser(cookies);
  const user = locals.user || dbUser;
  
  if (!user) {
    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const role = locals.role || user.role;
  const isAdmin = role === 'admin' || role === 'ADMIN';

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

    // Check if the problem exists
    const existingProblem = await prisma.problem.findUnique({
      where: { id },
    });

    if (!existingProblem) {
      return new Response(JSON.stringify({ error: 'Problem not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check duplicates if number or slug changed
    if (problemNumber !== existingProblem.number) {
      const duplicateNum = await prisma.problem.findUnique({
        where: { number: problemNumber }
      });
      if (duplicateNum) {
        return new Response(JSON.stringify({ error: `Problem number #${problemNumber} is already taken.` }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    if (slug.trim() !== existingProblem.slug) {
      const duplicateSlug = await prisma.problem.findUnique({
        where: { slug: slug.trim() }
      });
      if (duplicateSlug) {
        return new Response(JSON.stringify({ error: `Slug '${slug}' is already taken.` }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Update in a Prisma transaction
    const updatedProblem = await prisma.$transaction(async (tx) => {
      // 1. Delete existing tag associations
      await tx.problemsOnTags.deleteMany({
        where: { problemId: id }
      });

      // 2. Update problem content and create new tag associations
      return tx.problem.update({
        where: { id },
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
        }
      });
    });

    return new Response(JSON.stringify({ success: true, problem: updatedProblem }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error updating problem:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// DELETE: Cascadingly delete a problem
export const DELETE: APIRoute = async ({ params, cookies, locals }) => {
  const { id } = params;

  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing problem ID' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Verify session and admin role server-side
  const dbUser = await getUser(cookies);
  const user = locals.user || dbUser;
  
  if (!user) {
    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const role = locals.role || user.role;
  const isAdmin = role === 'admin' || role === 'ADMIN';

  if (!isAdmin) {
    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const problem = await prisma.problem.findUnique({
      where: { id },
    });

    if (!problem) {
      return new Response(JSON.stringify({ error: 'Problem not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Delete related records in a transaction to satisfy foreign key constraints explicitly
    await prisma.$transaction(async (tx) => {
      // 1. UserProblemStatus
      await tx.userProblemStatus.deleteMany({ where: { problemId: id } });
      // 2. LikedProblem
      await tx.likedProblem.deleteMany({ where: { problemId: id } });
      // 3. ProblemView
      await tx.problemView.deleteMany({ where: { problemId: id } });
      // 4. DailyStreak
      await tx.dailyStreak.deleteMany({ where: { problemId: id } });
      // 5. ProblemsOnTags
      await tx.problemsOnTags.deleteMany({ where: { problemId: id } });
      // 6. The Problem itself
      await tx.problem.delete({ where: { id } });
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error deleting problem:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
