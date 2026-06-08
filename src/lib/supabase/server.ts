import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { AstroCookies } from 'astro';

export const createSupabaseServer = (cookies: AstroCookies) => {
  return createServerClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(key) {
          return cookies.get(key)?.value;
        },
        set(key, value, options: CookieOptions) {
          cookies.set(key, value, options);
        },
        remove(key, options: CookieOptions) {
          cookies.delete(key, options);
        },
      },
    }
  );
};
