import type { APIRoute } from 'astro';
import { prisma } from '../../../lib/db';

export const POST: APIRoute = async ({ request }) => {
  const secretEnv = process.env.ADMIN_SETUP_SECRET || '';

  // If no ADMIN_SETUP_SECRET env var set, return 404.
  if (!secretEnv || secretEnv.trim() === '') {
    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { email, secret } = body;

    // Validate inputs
    if (!email || !secret) {
      return new Response(JSON.stringify({ error: 'Email and secret are required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if secret matches the setup secret
    if (secret !== secretEnv) {
      return new Response(JSON.stringify({ error: 'Not Found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() }
    });

    if (!user) {
      return new Response(JSON.stringify({ error: `User with email "${email}" not found.` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update the user to role ADMIN
    const updatedUser = await prisma.user.update({
      where: { email: email.trim().toLowerCase() },
      data: {
        role: 'ADMIN'
      }
    });

    return new Response(JSON.stringify({
      success: true,
      message: `User "${email}" upgraded to ADMIN successfully.`,
      email: updatedUser.email,
      role: updatedUser.role
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error during admin setup:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
