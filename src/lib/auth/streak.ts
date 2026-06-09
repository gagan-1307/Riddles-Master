import { prisma } from '../db';

export async function getStreakCount(userId: string): Promise<number> {
  if (!userId) return 0;

  try {
    const streaks = await prisma.dailyStreak.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    if (streaks.length === 0) return 0;

    const getISTDateString = (d: Date) => {
      const offset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
      const istTime = new Date(d.getTime() + offset);
      return istTime.toISOString().split('T')[0];
    };

    const todayStr = getISTDateString(new Date());

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = getISTDateString(yesterday);

    const streakDates = new Set(streaks.map(s => s.date));

    if (!streakDates.has(todayStr) && !streakDates.has(yesterdayStr)) {
      return 0;
    }

    let count = 0;
    let currentDate = streakDates.has(todayStr) ? new Date() : yesterday;

    while (true) {
      const dateStr = getISTDateString(currentDate);
      if (streakDates.has(dateStr)) {
        count++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return count;
  } catch (error) {
    console.error('Error in getStreakCount:', error);
    return 0;
  }
}

export async function getMaxStreakCount(userId: string): Promise<number> {
  if (!userId) return 0;

  try {
    const streaks = await prisma.dailyStreak.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
    });

    if (streaks.length === 0) return 0;

    const dates = streaks.map(s => s.date);
    let max = 0;
    let current = 0;
    let prevTime: number | null = null;

    for (const dateStr of dates) {
      const [y, m, d] = dateStr.split('-').map(Number);
      const time = Date.UTC(y, m - 1, d);

      if (prevTime === null) {
        current = 1;
      } else {
        const diffDays = (time - prevTime) / (1000 * 60 * 60 * 24);
        if (diffDays === 1) {
          current++;
        } else if (diffDays > 1) {
          max = Math.max(max, current);
          current = 1;
        }
      }
      prevTime = time;
    }

    return Math.max(max, current);
  } catch (error) {
    console.error('Error in getMaxStreakCount:', error);
    return 0;
  }
}

