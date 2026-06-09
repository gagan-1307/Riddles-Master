import { createSupabaseServer } from '../supabase';
import { prisma } from '../db';

export async function getUser(cookies: any) {
  if (!cookies) return null;

  try {
    const supabase = createSupabaseServer({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
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
