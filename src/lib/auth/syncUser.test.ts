import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../db', () => ({
  prisma: { user: { upsert: vi.fn() } },
}));

import { prisma } from '../db';
import { syncUser } from './syncUser';

describe('syncUser', () => {
  beforeEach(() => vi.clearAllMocks());

  it('throws when email is missing', async () => {
    await expect(syncUser({ id: '1', email: null } as any)).rejects.toThrow(/email is required/);
  });

  it('upserts using email and metadata (full_name, avatar_url)', async () => {
    const upserted = { id: 'u1', email: 'a@b.com', name: 'Alice', avatarUrl: 'url' };
    (prisma.user.upsert as any).mockResolvedValue(upserted);

    const result = await syncUser({
      id: 'u1',
      email: 'a@b.com',
      user_metadata: { full_name: 'Alice', avatar_url: 'url' },
    } as any);

    expect(result).toBe(upserted);
    const args = (prisma.user.upsert as any).mock.calls[0][0];
    expect(args.where).toEqual({ email: 'a@b.com' });
    expect(args.update).toEqual({ name: 'Alice', avatarUrl: 'url' });
    expect(args.create).toMatchObject({ id: 'u1', email: 'a@b.com', name: 'Alice', avatarUrl: 'url' });
  });

  it('falls back to name/avatarUrl metadata keys', async () => {
    (prisma.user.upsert as any).mockResolvedValue({ id: 'u2' });
    await syncUser({
      id: 'u2',
      email: 'b@c.com',
      user_metadata: { name: 'Bob', avatarUrl: 'pic' },
    } as any);
    const args = (prisma.user.upsert as any).mock.calls[0][0];
    expect(args.update.name).toBe('Bob');
    expect(args.update.avatarUrl).toBe('pic');
  });

  it('defaults metadata to null when absent', async () => {
    (prisma.user.upsert as any).mockResolvedValue({ id: 'u3' });
    await syncUser({ id: 'u3', email: 'c@d.com' } as any);
    const args = (prisma.user.upsert as any).mock.calls[0][0];
    expect(args.update).toEqual({ name: null, avatarUrl: null });
  });
});