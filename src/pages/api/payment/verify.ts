import type { APIRoute } from 'astro';
import crypto from 'crypto';
import { prisma } from '../../../lib/db';
import { getUser } from '../../../lib/auth/getUser';
import type { SubscriptionPlan } from '@prisma/client';

export const POST: APIRoute = async ({ request, cookies }) => {
  // 1. Authenticate the user.
  const dbUser = await getUser(cookies);
  if (!dbUser) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized. Please log in to complete your verification.' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan,
      currency,
      amountPaid,
    } = body;

    // 2. Validate input parameters.
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !plan ||
      !currency ||
      amountPaid === undefined
    ) {
      return new Response(
        JSON.stringify({ error: 'Missing required payment verification parameters.' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 3. Verify Razorpay HMAC SHA256 signature.
    const hmacSource = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(hmacSource)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return new Response(
        JSON.stringify({ error: 'Invalid payment signature. Verification failed.' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const normalizedPlan = plan.toUpperCase();
    const validPlans = ['ONE_MONTH', 'THREE_MONTH', 'SIX_MONTH'];
    if (!validPlans.includes(normalizedPlan)) {
      return new Response(
        JSON.stringify({ error: `Invalid plan. Must be one of: ${validPlans.join(', ')}` }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 4. Calculate subscription start/end dates.
    const startDate = new Date();
    let durationDays = 30;
    if (normalizedPlan === 'THREE_MONTH') {
      durationDays = 90;
    } else if (normalizedPlan === 'SIX_MONTH') {
      durationDays = 180;
    }
    const endDate = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);

    // 5. Upsert Prisma Subscription.
    const subscription = await prisma.subscription.upsert({
      where: { userId: dbUser.id },
      update: {
        plan: normalizedPlan as SubscriptionPlan,
        startDate,
        endDate,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        currency: currency.toUpperCase(),
        amountPaid: Number(amountPaid),
        status: 'ACTIVE',
      },
      create: {
        userId: dbUser.id,
        plan: normalizedPlan as SubscriptionPlan,
        startDate,
        endDate,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        currency: currency.toUpperCase(),
        amountPaid: Number(amountPaid),
        status: 'ACTIVE',
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Payment verified and subscription activated successfully.',
        subscription,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error during payment verification:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An error occurred during verification.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
