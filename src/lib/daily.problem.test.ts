import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('getTodaysProblem', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('returns null when there are no problems', async () => {
    vi.doMock('./db', () => ({ prisma: { problem: { count: vi.fn().mockResolvedValue(0), findMany: vi.fn() } } }));
    const { getTodaysProblem } = await import('./daily');
    const result = await getTodaysProblem();
    expect(result).toBeNull();
  });

  it('returns the problem at the computed index', async () => {
    const findMany = vi.fn().mockResolvedValue([{ id: 'p2', number: 2 }]);
    const count = vi.fn().mockResolvedValue(5);
    vi.doMock('./db', () => ({ prisma: { problem: { count, findMany } } }));
    const { getTodaysProblem } = await import('./daily');
    const result = await getTodaysProblem();
    expect(result).toEqual({ id: 'p2', number: 2 });
    expect(findMany).toHaveBeenCalled();
    const args = findMany.mock.calls[0][0];
    expect(args.orderBy).toEqual({ number: 'asc' });
    expect(args.take).toBe(1);
    expect(args.skip).toBeGreaterThanOrEqual(0);
  });

  it('returns cached result on repeated call same day', async () => {
    const findMany = vi.fn().mockResolvedValue([{ id: 'cached' }]);
    const count = vi.fn().mockResolvedValue(3);
    vi.doMock('./db', () => ({ prisma: { problem: { count, findMany } } }));
    const { getTodaysProblem } = await import('./daily');
    const first = await getTodaysProblem();
    const second = await getTodaysProblem();
    expect(first).toBe(second);
    expect(findMany).toHaveBeenCalledTimes(1);
  });
});