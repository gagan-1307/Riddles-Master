import type { APIRoute } from 'astro';
import { prisma } from '@/lib/db';
import { getUser } from '@/lib/auth/getUser';

export const GET: APIRoute = async ({ cookies }) => {
  try {
    const dbUser = await getUser(cookies);

    if (!dbUser) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const userId = dbUser.id;

    // Fetch all practice attempts for the user
    const attempts = await prisma.practiceAttempt.findMany({
      where: { userId },
      include: {
        set: {
          include: {
            topic: true
          }
        }
      }
    });

    // Get all topics with sets count
    const allTopics = await prisma.practiceTopic.findMany({
      include: {
        sets: { select: { id: true } }
      }
    });

    if (attempts.length === 0) {
      // Sort: most sets available first
      allTopics.sort((a, b) => b.sets.length - a.sets.length);
      const recommendedTopic = allTopics[0] || null;

      return new Response(
        JSON.stringify({
          overall: {
            totalQuestionsAttempted: 0,
            totalCorrect: 0,
            overallAccuracy: 0,
            setsCompleted: 0,
            testAttempts: 0,
            practiceAttempts: 0
          },
          weakTopics: [],
          strongTopics: [],
          recommended: recommendedTopic ? {
            id: recommendedTopic.id,
            name: recommendedTopic.name,
            slug: recommendedTopic.slug,
            icon: recommendedTopic.icon,
            accuracy: 0
          } : null,
          groupBreakdown: []
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // 1. Overall Aggregates
    let totalQuestionsAttempted = 0;
    let totalCorrect = 0;
    let testAttempts = 0;
    let practiceAttempts = 0;
    const testSetIds = new Set<string>();

    attempts.forEach(a => {
      totalQuestionsAttempted += a.totalAttempted;
      totalCorrect += a.score;
      if (a.mode === 'TEST') {
        testAttempts++;
        testSetIds.add(a.setId);
      } else {
        practiceAttempts++;
      }
    });

    const overallAccuracy = totalQuestionsAttempted > 0 
      ? Math.round((totalCorrect / totalQuestionsAttempted) * 100) 
      : 0;

    const setsCompleted = testSetIds.size;

    // 2. Per-Topic breakdown
    const topicGroups: Record<string, {
      topicId: string;
      topicName: string;
      topicSlug: string;
      topicIcon: string | null;
      groupName: string;
      score: number;
      totalAttempted: number;
      setIds: Set<string>;
    }> = {};

    attempts.forEach(a => {
      const topic = a.set?.topic;
      if (!topic) return;

      if (!topicGroups[topic.id]) {
        topicGroups[topic.id] = {
          topicId: topic.id,
          topicName: topic.name,
          topicSlug: topic.slug,
          topicIcon: topic.icon,
          groupName: topic.group,
          score: 0,
          totalAttempted: 0,
          setIds: new Set<string>()
        };
      }
      topicGroups[topic.id].score += a.score;
      topicGroups[topic.id].totalAttempted += a.totalAttempted;
      topicGroups[topic.id].setIds.add(a.setId);
    });

    const topicBreakdown = Object.values(topicGroups).map(t => {
      const topicAccuracy = t.totalAttempted > 0 
        ? Math.round((t.score / t.totalAttempted) * 100) 
        : 0;
      return {
        topicId: t.topicId,
        name: t.topicName,
        slug: t.topicSlug,
        icon: t.topicIcon,
        group: t.groupName,
        accuracy: topicAccuracy,
        setsAttempted: t.setIds.size,
        questionsAttempted: t.totalAttempted
      };
    });

    // Weak topics: accuracy < 60%
    const weakTopics = topicBreakdown.filter(t => t.accuracy < 60);
    // Strong topics: accuracy > 80%
    const strongTopics = topicBreakdown.filter(t => t.accuracy > 80);

    // 3. Recommended: topic with most sets available but lowest user accuracy
    const topicAccuracyMap = new Map<string, number>();
    topicBreakdown.forEach(t => {
      topicAccuracyMap.set(t.topicId, t.accuracy);
    });

    // Sort: lowest accuracy first, then highest sets count
    allTopics.sort((a, b) => {
      const accA = topicAccuracyMap.has(a.id) ? topicAccuracyMap.get(a.id)! : 0;
      const accB = topicAccuracyMap.has(b.id) ? topicAccuracyMap.get(b.id)! : 0;
      if (accA !== accB) {
        return accA - accB; // lowest user accuracy first
      }
      return b.sets.length - a.sets.length; // most sets available first
    });

    const recTopic = allTopics[0] || null;
    const recommended = recTopic ? {
      id: recTopic.id,
      name: recTopic.name,
      slug: recTopic.slug,
      icon: recTopic.icon,
      accuracy: topicAccuracyMap.has(recTopic.id) ? topicAccuracyMap.get(recTopic.id)! : 0
    } : null;

    // 4. Per-group breakdown table data:
    // Group | Topics Practiced | Avg Accuracy | Questions Done
    const groupAggregates: Record<string, {
      groupName: string;
      topicsPracticed: Set<string>;
      score: number;
      totalAttempted: number;
    }> = {};

    attempts.forEach(a => {
      const topic = a.set?.topic;
      if (!topic) return;

      if (!groupAggregates[topic.group]) {
        groupAggregates[topic.group] = {
          groupName: topic.group,
          topicsPracticed: new Set<string>(),
          score: 0,
          totalAttempted: 0
        };
      }
      groupAggregates[topic.group].topicsPracticed.add(topic.id);
      groupAggregates[topic.group].score += a.score;
      groupAggregates[topic.group].totalAttempted += a.totalAttempted;
    });

    const groupBreakdown = Object.values(groupAggregates).map(g => ({
      group: g.groupName,
      topicsPracticed: g.topicsPracticed.size,
      avgAccuracy: g.totalAttempted > 0 ? Math.round((g.score / g.totalAttempted) * 100) : 0,
      questionsDone: g.totalAttempted
    }));

    return new Response(
      JSON.stringify({
        overall: {
          totalQuestionsAttempted,
          totalCorrect,
          overallAccuracy,
          setsCompleted,
          testAttempts,
          practiceAttempts
        },
        weakTopics: weakTopics.map(t => ({ id: t.topicId, name: t.name, accuracy: t.accuracy, slug: t.slug, icon: t.icon })),
        strongTopics: strongTopics.map(t => ({ id: t.topicId, name: t.name, accuracy: t.accuracy, slug: t.slug, icon: t.icon })),
        recommended,
        groupBreakdown
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('Error fetching practice stats:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
