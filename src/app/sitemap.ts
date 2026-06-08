import { prisma } from '../lib/db';

export interface SitemapEntry {
  url: string;
  lastModified?: string | Date;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export default async function sitemap(baseUrl: string = 'http://localhost:4321'): Promise<SitemapEntry[]> {
  const problems = await prisma.problem.findMany({
    select: {
      slug: true,
      updatedAt: true,
    },
    orderBy: {
      number: 'asc',
    },
  });

  return problems.map((problem) => ({
    url: `${baseUrl}/problems/${problem.slug}`,
    lastModified: problem.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));
}
