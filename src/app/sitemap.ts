import { prisma } from '../lib/db';
import { getCollection } from 'astro:content';

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
    { url: `${baseUrl}/practice`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/exams`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/articles`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/terms`, changeFrequency: 'monthly', priority: 0.3 },
  ];

  const [problems, topics, sets, exams, articles] = await Promise.all([
    prisma.problem.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
      orderBy: {
        number: 'asc',
      },
    }),
    prisma.practiceTopic.findMany({
      select: { slug: true }
    }),
    prisma.practiceSet.findMany({
      select: {
        setSlug: true,
        createdAt: true,
        topic: {
          select: { slug: true }
        }
      }
    }),
    prisma.exam.findMany({
      where: { isPublished: true },
      select: { slug: true, createdAt: true }
    }),
    getCollection('blog', ({ data }) => {
      return import.meta.env.PROD ? !data.draft : true;
    })
  ]);

  const problemEntries = problems.map((problem) => ({
    url: `${baseUrl}/problems/${problem.slug}`,
    lastModified: problem.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const topicEntries = topics.map((topic) => ({
    url: `${baseUrl}/practice/${topic.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const setEntries = sets
    .filter((set) => set.topic?.slug && set.setSlug)
    .map((set) => ({
      url: `${baseUrl}/practice/${set.topic.slug}/set/${set.setSlug}`,
      lastModified: set.createdAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  const examEntries = exams.map((exam) => ({
    url: `${baseUrl}/exams/${exam.slug}`,
    lastModified: exam.createdAt,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const articleEntries = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.id}`,
    lastModified: article.data.updatedDate || article.data.pubDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    ...staticPages,
    ...problemEntries,
    ...topicEntries,
    ...setEntries,
    ...examEntries,
    ...articleEntries
  ];
}
