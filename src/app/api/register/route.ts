import { createClient } from '@supabase/supabase-js';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ message: 'Email and password are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const domain = email.split('@')[1]?.toLowerCase();
    const allowedDomains = [
      'gmail.com',
      'yahoo.com',
      'outlook.com',
      'hotmail.com',
      'icloud.com',
      'yahoo.in',
      'protonmail.com',
    ];

    if (!allowedDomains.includes(domain)) {
      return new Response(JSON.stringify({ message: 'Please use a personal email address (Gmail, Yahoo, Outlook)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const supabaseClient = createClient(
      process.env.PUBLIC_SUPABASE_URL!,
      process.env.PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: signUpData, error: signUpError } = await supabaseClient.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      return new Response(JSON.stringify({ message: signUpError.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const authUser = signUpData.user;
    if (authUser) {
      await prisma.user.upsert({
        where: { email: authUser.email },
        update: {
          name: name || null,
        },
        create: {
          id: authUser.id,
          email: authUser.email!,
          name: name || null,
        },
      });
    }

    return new Response(JSON.stringify({ message: 'Success' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ message: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

