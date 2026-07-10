import { createSupabaseServer } from '../supabase';
import { prisma } from '../db';

export async function getUser(cookies: any, localsUser?: any) {
  if (!cookies) return null;

  try {
    // If localsUser is explicitly null, we know they are a guest (verified by middleware).
    // Bypassing standard lookup avoids a slow external HTTPS call to Supabase.
    if (localsUser === null) {
      return null;
    }

    let authUser = localsUser;
    if (!authUser) {
      const supabase = createSupabaseServer({ cookies });
      const { data: { user } } = await supabase.auth.getUser();
      authUser = user;
    }

    if (!authUser) {
      return null;
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: authUser.id },
      include: {
        subscription: true,
      },
    });

    return dbUser;
  } catch (error) {
    console.error('Error in getUser:', error);
    return null;
  }
}
