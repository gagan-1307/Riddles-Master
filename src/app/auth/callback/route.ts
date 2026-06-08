import { createClient } from '@supabase/supabase-js';
import { syncUser } from '@/lib/auth/syncUser';

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const next = requestUrl.searchParams.get('next') || '/problems';

    if (code) {
      const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
      const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY || '';
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error && data.user) {
        await syncUser(data.user);
        return Response.redirect(new URL(next, request.url));
      }
    }

    return Response.redirect(new URL('/auth/auth-code-error', request.url));
  } catch (err: any) {
    return new Response(JSON.stringify({ message: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

