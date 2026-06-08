import { prisma } from '../db';

export async function checkPremium(userId: string): Promise<boolean> {
  if (!userId) return false;

  try {
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: userId,
        status: 'ACTIVE',
        endDate: {
          gt: new Date(),
        },
      },
    });

    return !!subscription;
  } catch (error) {
    console.error('Error in checkPremium:', error);
    return false;
  }
}
