import { prisma } from '../db';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export async function syncUser(supabaseUser: SupabaseUser) {
  if (!supabaseUser.email) {
    throw new Error('User email is required for sync');
  }

  const metadata = supabaseUser.user_metadata || {};
  const name = metadata.full_name || metadata.name || null;
  const avatarUrl = metadata.avatar_url || metadata.avatarUrl || null;

  return await prisma.user.upsert({
    where: { email: supabaseUser.email },
    update: {
      name,
      avatarUrl,
    },
    create: {
      id: supabaseUser.id,
      email: supabaseUser.email,
      name,
      avatarUrl,
    },
  });
}
