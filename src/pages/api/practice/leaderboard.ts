import type { APIRoute } from 'astro';
import { prisma } from '@/lib/db';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const topicId = url.searchParams.get('topicId');
    const targetUserId = url.searchParams.get('userId');

    if (!topicId) {
      return new Response(JSON.stringify({ error: 'topicId parameter is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 1. Fetch all attempts for this topic
    const attempts = await prisma.practiceAttempt.findMany({
      where: {
        set: {
          topicId: topicId
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      }
    });

    // 2. Group and aggregate by user
    const userAggregates: Record<string, {
      userId: string;
      userName: string;
      userAvatar: string | null;
      totalScore: number;
      totalAttempted: number;
      setsCompleted: Set<string>;
    }> = {};

    attempts.forEach(attempt => {
      const userId = attempt.userId;
      if (!userAggregates[userId]) {
        userAggregates[userId] = {
          userId,
          userName: attempt.user?.name || 'Anonymous',
          userAvatar: attempt.user?.avatarUrl || null,
          totalScore: 0,
          totalAttempted: 0,
          setsCompleted: new Set<string>()
        };
      }
      userAggregates[userId].totalScore += attempt.score;
      userAggregates[userId].totalAttempted += attempt.totalAttempted;
      userAggregates[userId].setsCompleted.add(attempt.setId);
    });

    // Convert to flat list with computed overall accuracy
    const leaderboardList = Object.values(userAggregates).map(u => ({
      userId: u.userId,
      userName: u.userName,
      userAvatar: u.userAvatar,
      totalScore: u.totalScore,
      totalAttempted: u.totalAttempted,
      overallAccuracy: u.totalAttempted > 0 ? Math.round((u.totalScore / u.totalAttempted) * 100) : 0,
      setsCompleted: u.setsCompleted.size
    }));

    // 3. Sort by:
    // PRIMARY: overallAccuracy DESC
    // SECONDARY: totalAttempted DESC (tiebreaker)
    leaderboardList.sort((a, b) => {
      if (b.overallAccuracy !== a.overallAccuracy) {
        return b.overallAccuracy - a.overallAccuracy;
      }
      return b.totalAttempted - a.totalAttempted;
    });

    // 4. Map index to rank (1-indexed consecutive)
    const rankedList = leaderboardList.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));

    // 5. Get current user rank & full stats if requested
    let currentUserRank: number | null = null;
    let currentUserEntry: typeof rankedList[0] | null = null;

    if (targetUserId) {
      const found = rankedList.find(r => r.userId === targetUserId);
      if (found) {
        currentUserRank = found.rank;
        currentUserEntry = found;
      }
    }

    return new Response(
      JSON.stringify({
        leaderboard: rankedList.slice(0, 20),
        currentUserRank,
        currentUserEntry
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    console.error('Error fetching leaderboard:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
