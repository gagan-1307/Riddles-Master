import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../db', () => ({
  prisma: { user: { findUnique: vi.fn() } },
}));
vi.mock('../supabase', () => ({
  createSupabaseServer: vi.fn(),
}));

import { prisma } from '../db';
import { createSupabaseServer } from '../supabase';
import { getUser } from './getUser';

describe('getUser', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns null when cookies missing', async () => {
    expect(await getUser(null)).toBeNull();
    expect(await getUser(undefined)).toBeNull();
  });

  it('returns null when localsUser is explicitly null (guest)', async () => {
    const cookies = {} as any;
    expect(await getUser(cookies, null)).toBeNull();
    expect(createSupabaseServer).not.toHaveBeenCalled();
  });

  it('uses localsUser and looks up db user', async () => {
    const dbUser = { id: 'u1', email: 'a@b.com', subscription: null };
    (prisma.user.findUnique as any).mockResolvedValue(dbUser);
    const cookies = {} as any;
    const result = await getUser(cookies, { id: 'u1' } as any);
    expect(result).toBe(dbUser);
    const args = (prisma.user.findUnique as any).mock.calls[0][0];
    expect(args.where).toEqual({ id: 'u1' });
    expect(args.include).toEqual({ subscription: true });
  });

  it('falls back to supabase when no localsUser', async () => {
    const supabase = { auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'u2' } } }) } };
    (createSupabaseServer as any).mockReturnValue(supabase);
    const dbUser = { id: 'u2' };
    (prisma.user.findUnique as any).mockResolvedValue(dbUser);

    const cookies = { get: () => undefined } as any;
    const result = await getUser(cookies);
    expect(result).toBe(dbUser);
    expect(createSupabaseServer).toHaveBeenCalledWith({ cookies });
    expect(supabase.auth.getUser).toHaveBeenCalled();
  });

  it('returns null when supabase has no user', async () => {
    const supabase = { auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) } };
    (createSupabaseServer as any).mockReturnValue(supabase);
    const cookies = {} as any;
    const result = await getUser(cookies);
    expect(result).toBeNull();
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });

  it('returns null on error', async () => {
    (prisma.user.findUnique as any).mockRejectedValue(new Error('boom'));
    const result = await getUser({} as any, { id: 'u1' } as any);
    expect(result).toBeNull();
  });
});