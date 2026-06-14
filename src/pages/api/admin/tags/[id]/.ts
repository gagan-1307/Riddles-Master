export const prerender = false;

import type { APIRoute } from 'astro';
import { prisma } from '../../../../lib/db';
import { getUser } from '../../../../lib/auth/getUser';

export const DELETE: APIRoute = async ({ params, cookies, locals }) => {
  const { id } = params;

  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing tag ID' }), {
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
    // Check if the tag exists
    const tag = await prisma.tag.findUnique({
      where: { id },
    });

    if (!tag) {
      return new Response(JSON.stringify({ error: 'Tag not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if any problem references this tag
    const usagesCount = await prisma.problemsOnTags.count({
      where: { tagId: id },
    });

    if (usagesCount > 0) {
      return new Response(JSON.stringify({ error: `Cannot delete tag "${tag.name}": It is currently assigned to ${usagesCount} riddle(s).` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Delete tag
    await prisma.tag.delete({
      where: { id },
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error deleting tag:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
