import { defineMiddleware } from 'astro:middleware';
import { updateSession } from './lib/supabase/middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  // First refresh the session and populate context.locals
  await updateSession(context);

  const url = new URL(context.request.url);

  // Protect /profile routes
  if (url.pathname.startsWith('/profile')) {
    if (!context.locals.user) {
      return context.redirect('/login');
    }
  }

  // Protect /admin and /api/admin routes
  if (url.pathname.startsWith('/admin')) {
    const role = context.locals.role;
    if (role !== 'admin') {
      return context.redirect('/404');
    }
  }

  if (url.pathname.startsWith('/api/admin')) {
    const role = context.locals.role;
    if (role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Not Found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return next();
});
