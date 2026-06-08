import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { APIContext } from 'astro';

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
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    context.locals.role = profile?.role ?? 'user';
  } else {
    context.locals.role = 'guest';
  }
}
