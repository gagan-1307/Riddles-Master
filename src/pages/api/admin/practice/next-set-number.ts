import type { APIRoute } from 'astro';
import { prisma } from '@/lib/db';
import { getUser } from '@/lib/auth/getUser';

export const GET: APIRoute = async ({ request, cookies, locals }) => {
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

  const url = new URL(request.url);
  const topicId = url.searchParams.get('topicId');

  if (!topicId) {
    return new Response(JSON.stringify({ error: 'topicId parameter is required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const maxSet = await prisma.practiceSet.findFirst({
      where: { topicId },
      orderBy: { setNumber: 'desc' },
      select: { setNumber: true }
    });

    const nextSetNumber = maxSet ? maxSet.setNumber + 1 : 1;

    return new Response(JSON.stringify({ nextSetNumber }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error in next-set-number API:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
