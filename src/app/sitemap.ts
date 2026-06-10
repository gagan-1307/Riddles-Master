import { prisma } from '../lib/db';

export interface SitemapEntry {
  url: string;
  lastModified?: string | Date;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export default async function sitemap(baseUrl: string = 'http://localhost:4321'): Promise<SitemapEntry[]> {
  const staticPages: SitemapEntry[] = [
    { url: `${baseUrl}/`, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/problems`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/daily`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/pricing`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/terms`, changeFrequency: 'monthly', priority: 0.3 },
  ];

  const problems = await prisma.problem.findMany({
    select: {
      slug: true,
      updatedAt: true,
    },
    orderBy: {
      number: 'asc',
    },
  });

  const dynamicEntries = problems.map((problem) => ({
    url: `${baseUrl}/problems/${problem.slug}`,
    lastModified: problem.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticPages, ...dynamicEntries];
}
