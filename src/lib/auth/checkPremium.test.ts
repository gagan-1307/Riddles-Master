import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../db', () => ({
  prisma: {
    subscription: { findFirst: vi.fn() },
  },
}));

import { prisma } from '../db';
import { checkPremium } from './checkPremium';

describe('checkPremium', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns false for empty userId', async () => {
    expect(await checkPremium('')).toBe(false);
  });

  it('returns true when active subscription exists', async () => {
    (prisma.subscription.findFirst as any).mockResolvedValue({ id: 'sub1', status: 'ACTIVE' });
    expect(await checkPremium('u1')).toBe(true);
  });

  it('returns false when no subscription', async () => {
    (prisma.subscription.findFirst as any).mockResolvedValue(null);
    expect(await checkPremium('u1')).toBe(false);
  });

  it('query includes ACTIVE status and future endDate', async () => {
    (prisma.subscription.findFirst as any).mockResolvedValue(null);
    await checkPremium('u1');
    const args = (prisma.subscription.findFirst as any).mock.calls[0][0];
    expect(args.where.status).toBe('ACTIVE');
    expect(args.where.endDate.gt).toBeInstanceOf(Date);
    expect(args.where.userId).toBe('u1');
  });

  it('returns false on db error', async () => {
    (prisma.subscription.findFirst as any).mockRejectedValue(new Error('db down'));
    expect(await checkPremium('u1')).toBe(false);
  });
});