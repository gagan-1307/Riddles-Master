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

  // Protect /admin routes
  if (url.pathname.startsWith('/admin')) {
    const role = context.locals.role;
    if (role !== 'admin' && role !== 'ADMIN') {
      return context.redirect('/404');
    }
  }

  return next();
});
