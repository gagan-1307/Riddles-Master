import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { APIContext } from 'astro';
import { prisma } from '../db';

export async function updateSession(context: APIContext) {
  const supabase = createServerClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(key) {
          return context.cookies.get(key)?.value;
        },
        set(key, value, options: CookieOptions) {
          context.cookies.set(key, value, options);
        },
        remove(key, options: CookieOptions) {
          context.cookies.delete(key, options);
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { data: { session } } = await supabase.auth.getSession();

  context.locals.supabase = supabase;
  context.locals.session = session;
  context.locals.user = user;

  if (user) {
    const url = new URL(context.request.url);
    if (url.pathname.startsWith('/admin')) {
      try {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true }
        });

        const roleStr = dbUser?.role === 'ADMIN' ? 'admin' : 'user';
        context.locals.role = roleStr;
      } catch (dbError: any) {
        console.error('[Middleware] Database query failed in middleware:', dbError.message);
        // Fallback to guest/user if DB is temporarily unreachable
        context.locals.role = 'user';
      }
    } else {
      context.locals.role = 'user';
    }
  } else {
    context.locals.role = 'guest';
  }
}
