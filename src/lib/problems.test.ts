import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./db', () => ({
  prisma: {
    problem: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn(),
    },
  },
}));

import { prisma } from './db';
import { getAllProblems, getProblemBySlug, getProblemById, getProblemsCount } from './problems';

describe('problems lib', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getAllProblems orders by number asc and includes tags', async () => {
    (prisma.problem.findMany as any).mockResolvedValue([{ id: 'p1' }]);
    const res = await getAllProblems();
    expect(res).toEqual([{ id: 'p1' }]);
    const args = (prisma.problem.findMany as any).mock.calls[0][0];
    expect(args.orderBy).toEqual({ number: 'asc' });
    expect(args.include).toEqual({ tags: { include: { tag: true } } });
  });

  it('getProblemBySlug calls findUnique with slug', async () => {
    (prisma.problem.findUnique as any).mockResolvedValue({ slug: 'r1' });
    const res = await getProblemBySlug('r1');
    expect(res).toEqual({ slug: 'r1' });
    const args = (prisma.problem.findUnique as any).mock.calls[0][0];
    expect(args.where).toEqual({ slug: 'r1' });
  });

  it('getProblemById calls findUnique with id', async () => {
    (prisma.problem.findUnique as any).mockResolvedValue({ id: 'abc' });
    const res = await getProblemById('abc');
    expect(res).toEqual({ id: 'abc' });
  });

  it('getProblemsCount returns count', async () => {
    (prisma.problem.count as any).mockResolvedValue(42);
    expect(await getProblemsCount()).toBe(42);
  });
});