export const currencyMap: Record<string, { code: string; symbol: string }> = {
  INR: { code: 'INR', symbol: '₹' },
  USD: { code: 'USD', symbol: '$' },
  GBP: { code: 'GBP', symbol: '£' },
  AED: { code: 'AED', symbol: 'د.إ' },
  CAD: { code: 'CAD', symbol: '$' },
  AUD: { code: 'AUD', symbol: '$' },
  SGD: { code: 'SGD', symbol: '$' },
  EUR: { code: 'EUR', symbol: '€' },
};

export const planPrices: Record<string, Record<string, number>> = {
  ONE_MONTH: {
    INR: 9900,
    USD: 200,
    GBP: 200,
    AED: 700,
    CAD: 300,
    AUD: 300,
    SGD: 300,
    EUR: 200,
  },
  THREE_MONTH: {
    INR: 24900,
    USD: 400,
    GBP: 300,
    AED: 1500,
    CAD: 500,
    AUD: 600,
    SGD: 600,
    EUR: 400,
  },
  SIX_MONTH: {
    INR: 44900,
    USD: 700,
    GBP: 600,
    AED: 2600,
    CAD: 1000,
    AUD: 1100,
    SGD: 1000,
    EUR: 700,
  },
};

function getCookie(request: Request, name: string): string | null {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(';').map((c) => c.trim().split('='));
  const match = cookies.find(([k]) => k === name);
  return match ? decodeURIComponent(match[1]) : null;
}

function mapCountryToCurrency(countryCode: string | undefined): string {
  if (!countryCode) return 'USD';
  const code = countryCode.toUpperCase();
  if (code === 'IN') return 'INR';
  if (code === 'US') return 'USD';
  if (code === 'GB') return 'GBP';
  if (code === 'AE') return 'AED';
  if (code === 'CA') return 'CAD';
  if (code === 'AU') return 'AUD';
  if (code === 'SG') return 'SGD';
  if (['DE', 'FR', 'IT', 'ES', 'NL'].includes(code)) return 'EUR';
  return 'USD';
}

/**
 * Detects the user's currency.
 * Looks for the 'user-currency' cookie first. If not found, calls ipapi.co.
 * If a `cookies` object is passed, it sets the cookie for 30 days.
 */
export async function detectCurrency(request: Request, cookies?: any): Promise<string> {
  let currency = cookies ? cookies.get('user-currency')?.value : getCookie(request, 'user-currency');
  if (currency) {
    return currency;
  }

  try {
    const res = await fetch('https://ipapi.co/json/');
    if (res.ok) {
      const data = await res.json();
      currency = mapCountryToCurrency(data.country_code);
    }
  } catch (err) {
    console.error('Error fetching country from ipapi:', err);
  }

  if (!currency) {
    currency = 'USD';
  }

  if (cookies) {
    cookies.set('user-currency', currency, {
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      httpOnly: false,
      secure: true,
      sameSite: 'lax',
    });
  }

  return currency;
}

/**
 * Returns the plan price in the smallest unit (paise/cents/fils) for the specified currency.
 * Fallbacks to USD if currency is not defined.
 */
export function getPlanPrice(plan: string, currency: string): number {
  const normalizedPlan = plan.toUpperCase();
  const normalizedCurrency = currency.toUpperCase();

  const planData = planPrices[normalizedPlan];
  if (!planData) {
    throw new Error(`Invalid plan: ${plan}`);
  }

  return planData[normalizedCurrency] ?? planData['USD'];
}

/**
 * Formats the price given the amount (in smallest unit) and currency code.
 */
export function formatPrice(amount: number, currency: string): string {
  const normalizedCurrency = currency.toUpperCase();
  const value = amount / 100;
  const currencyInfo = currencyMap[normalizedCurrency] || currencyMap['USD'];

  if (normalizedCurrency === 'AED') {
    return `${currencyInfo.symbol} ${value}`;
  }

  return `${currencyInfo.symbol}${value}`;
}
