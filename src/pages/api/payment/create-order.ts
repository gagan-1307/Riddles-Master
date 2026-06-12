import type { APIRoute } from 'astro';
import Razorpay from 'razorpay';
import { getUser } from '../../../lib/auth/getUser';
import { getPlanPrice, currencyMap } from '../../../lib/currency';

// Initialize Razorpay client.
// In SSR environment, keys must exist in process.env.
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export const POST: APIRoute = async ({ request, cookies }) => {
  // 1. Authenticate user.
  const dbUser = await getUser(cookies);
  if (!dbUser) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized. Please log in to complete your purchase.' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { plan, currency } = body;

    // 2. Validate plan parameter.
    const validPlans = ['ONE_MONTH', 'THREE_MONTH', 'SIX_MONTH'];
    if (!plan || !validPlans.includes(plan.toUpperCase())) {
      return new Response(
        JSON.stringify({
          error: `Invalid plan. Must be one of: ${validPlans.join(', ')}`,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 3. Validate currency parameter.
    const validCurrencies = Object.keys(currencyMap);
    if (!currency || !validCurrencies.includes(currency.toUpperCase())) {
      return new Response(
        JSON.stringify({
          error: `Unsupported currency. Supported: ${validCurrencies.join(', ')}`,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const normalizedPlan = plan.toUpperCase();
    const normalizedCurrency = currency.toUpperCase();

    // 4. Retrieve plan price in the smallest unit (paise/cents/fils).
    const amount = getPlanPrice(normalizedPlan, normalizedCurrency);
    const symbol = currencyMap[normalizedCurrency].symbol;

    // 5. Create Razorpay order.
    const order = await razorpay.orders.create({
      amount: amount,
      currency: normalizedCurrency,
      receipt: `order_${Date.now()}`,
    });

    return new Response(
      JSON.stringify({
        orderId: order.id,
        amount,
        currency: normalizedCurrency,
        symbol,
        keyId: process.env.RAZORPAY_KEY_ID || '',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'An error occurred while creating order',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
