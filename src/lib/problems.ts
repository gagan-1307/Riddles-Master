import { prisma } from './db';

export async function getAllProblems() {
  return prisma.problem.findMany({
    orderBy: {
      number: 'asc',
    },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });
}

export async function getProblemBySlug(slug: string) {
  return prisma.problem.findUnique({
    where: { slug },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });
}

export async function getProblemById(id: string) {
  return prisma.problem.findUnique({
    where: { id },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });
}

export async function getProblemsCount() {
  return prisma.problem.count();
}
