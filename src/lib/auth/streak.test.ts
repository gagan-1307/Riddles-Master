import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../db', () => ({
  prisma: {
    dailyStreak: {
      findMany: vi.fn(),
    },
  },
}));

import { prisma } from '../db';
import { getStreakCount, getMaxStreakCount } from './streak';

function istDateStr(d: Date) {
  const offset = 5.5 * 60 * 60 * 1000;
  return new Date(d.getTime() + offset).toISOString().split('T')[0];
}

describe('getStreakCount', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 0 for empty userId', async () => {
    expect(await getStreakCount('')).toBe(0);
  });

  it('returns 0 when no streaks', async () => {
    (prisma.dailyStreak.findMany as any).mockResolvedValue([]);
    expect(await getStreakCount('u1')).toBe(0);
  });

  it('returns 0 when last activity older than yesterday', async () => {
    const old = new Date(Date.now() - 5 * 86400000);
    (prisma.dailyStreak.findMany as any).mockResolvedValue([
      { date: istDateStr(old) },
    ]);
    expect(await getStreakCount('u1')).toBe(0);
  });

  it('counts today + consecutive prior days', async () => {
    const todayStr = istDateStr(new Date());
    const yestStr = istDateStr(new Date(Date.now() - 86400000));
    (prisma.dailyStreak.findMany as any).mockResolvedValue([
      { date: todayStr },
      { date: yestStr },
    ]);
    expect(await getStreakCount('u1')).toBe(2);
  });

  it('stops counting at a gap', async () => {
    const todayStr = istDateStr(new Date());
    const twoDaysAgo = istDateStr(new Date(Date.now() - 2 * 86400000));
    (prisma.dailyStreak.findMany as any).mockResolvedValue([
      { date: todayStr },
      { date: twoDaysAgo }, // gap yesterday
    ]);
    // yesterday missing => 0 per rule? Actually rule: if today and not yesterday -> starts from yesterday? Let's see code:
    // if neither today nor yesterday => 0. Here today present, so currentDate = today, count today then decrements, next date yesterday missing -> break. count=1.
    expect(await getStreakCount('u1')).toBe(1);
  });

  it('returns 0 on db error', async () => {
    (prisma.dailyStreak.findMany as any).mockRejectedValue(new Error('db down'));
    expect(await getStreakCount('u1')).toBe(0);
  });
});

describe('getMaxStreakCount', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 0 for empty userId', async () => {
    expect(await getMaxStreakCount('')).toBe(0);
  });

  it('returns 0 for no streaks', async () => {
    (prisma.dailyStreak.findMany as any).mockResolvedValue([]);
    expect(await getMaxStreakCount('u1')).toBe(0);
  });

  it('computes max run of consecutive dates', async () => {
    (prisma.dailyStreak.findMany as any).mockResolvedValue([
      { date: '2025-01-01' },
      { date: '2025-01-02' },
      { date: '2025-01-03' },
      { date: '2025-01-05' }, // gap -> reset
      { date: '2025-01-06' },
    ]);
    expect(await getMaxStreakCount('u1')).toBe(3);
  });

  it('single date returns 1', async () => {
    (prisma.dailyStreak.findMany as any).mockResolvedValue([{ date: '2025-01-01' }]);
    expect(await getMaxStreakCount('u1')).toBe(1);
  });

  it('returns 0 on db error', async () => {
    (prisma.dailyStreak.findMany as any).mockRejectedValue(new Error('db down'));
    expect(await getMaxStreakCount('u1')).toBe(0);
  });
});