import type { APIRoute } from 'astro';
import { prisma } from '../../../../lib/db';
import { getUser } from '../../../../lib/auth/getUser';

export const POST: APIRoute = async ({ request, cookies, locals }) => {
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
  const isAdmin = String(role).toLowerCase() === 'admin';

  if (!isAdmin) {
    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const { name, type } = body;

    // Validate inputs
    if (!name || !name.trim()) {
      return new Response(JSON.stringify({ error: 'Tag name is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (type !== 'COMPANY' && type !== 'TYPE') {
      return new Response(JSON.stringify({ error: 'Tag type must be either COMPANY or TYPE.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const tagName = name.trim();

    // Check duplicate
    const existing = await prisma.tag.findUnique({
      where: { name: tagName }
    });

    if (existing) {
      return new Response(JSON.stringify({ error: `Tag with name "${tagName}" already exists.` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create Tag
    const tag = await prisma.tag.create({
      data: {
        name: tagName,
        type,
      }
    });

    return new Response(JSON.stringify({ success: true, tag }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error creating tag:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
