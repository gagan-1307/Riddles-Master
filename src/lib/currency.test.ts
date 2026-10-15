import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { currencyMap, planPrices, getPlanPrice, formatPrice, detectCurrency } from './currency';

describe('currencyMap / planPrices data', () => {
  it('contains all expected currencies', () => {
    expect(Object.keys(currencyMap)).toEqual(
      expect.arrayContaining(['INR', 'USD', 'GBP', 'AED', 'CAD', 'AUD', 'SGD', 'EUR']),
    );
  });

  it('every plan has a price for every currency', () => {
    for (const plan of Object.keys(planPrices)) {
      for (const cur of Object.keys(currencyMap)) {
        expect(planPrices[plan][cur]).toBeTypeOf('number');
      }
    }
  });
});

describe('getPlanPrice', () => {
  it('returns exact price for known plan + currency', () => {
    expect(getPlanPrice('ONE_MONTH', 'INR')).toBe(9900);
    expect(getPlanPrice('SIX_MONTH', 'EUR')).toBe(700);
  });

  it('normalizes plan/currency casing', () => {
    expect(getPlanPrice('one_month', 'inr')).toBe(9900);
  });

  it('throws on invalid plan', () => {
    expect(() => getPlanPrice('LIFETIME', 'USD')).toThrow(/Invalid plan/);
  });

  it('falls back to USD for unknown currency', () => {
    expect(getPlanPrice('ONE_MONTH', 'XYZ')).toBe(200);
  });
});

describe('formatPrice', () => {
  it('formats non-AED with symbol prefix no space', () => {
    expect(formatPrice(9900, 'INR')).toBe('₹99'); // 9900/100 = 99
    expect(formatPrice(200, 'USD')).toBe('$2');
  });

  it('formats AED with a space', () => {
    expect(formatPrice(700, 'AED')).toBe('د.إ 7');
  });

  it('falls back to USD for unknown currency', () => {
    expect(formatPrice(200, 'ZZZ')).toBe('$2');
  });
});

describe('detectCurrency', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('uses query param override and sets cookie', async () => {
    const req = new Request('https://example.com/?currency=inr');
    const cookieStore: Record<string, any> = {};
    const cookies = {
      get: (name: string) => cookieStore[name],
      set: (name: string, value: string, opts: any) => {
        cookieStore[name] = { value, opts };
      },
    };
    const result = await detectCurrency(req, cookies);
    expect(result).toBe('INR');
    expect(cookieStore['user-currency'].value).toBe('INR');
  });

  it('uses existing cookie when no query param', async () => {
    const req = new Request('https://example.com/');
    const cookies = {
      get: (name: string) => (name === 'user-currency' ? { value: 'GBP' } : undefined),
      set: () => {},
    };
    const result = await detectCurrency(req, cookies);
    expect(result).toBe('GBP');
  });

  it('reads cookie from request header when no cookies object', async () => {
    const req = new Request('https://example.com/', {
      headers: { cookie: 'user-currency=EUR' },
    });
    const result = await detectCurrency(req);
    expect(result).toBe('EUR');
  });

  it('uses Vercel country header', async () => {
    const req = new Request('https://example.com/', {
      headers: { 'x-vercel-ip-country': 'IN' },
    });
    const result = await detectCurrency(req);
    expect(result).toBe('INR');
  });

  it('uses Cloudflare country header', async () => {
    const req = new Request('https://example.com/', {
      headers: { 'cf-ipcountry': 'GB' },
    });
    const result = await detectCurrency(req);
    expect(result).toBe('GBP');
  });

  it('falls back to ipapi.co and caches nothing by default', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ country_code: 'DE' }),
    }) as any;

    const req = new Request('https://example.com/', {
      headers: { 'x-forwarded-for': '8.8.8.8' },
    });
    const result = await detectCurrency(req);
    expect(result).toBe('EUR');
    expect(global.fetch).toHaveBeenCalled();
  });

  it('uses local ipapi endpoint for local IPs', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ country_code: 'US' }),
    }) as any;

    const req = new Request('https://example.com/', {
      headers: { 'x-forwarded-for': '127.0.0.1' },
    });
    const result = await detectCurrency(req);
    expect(result).toBe('USD');
    // url called should be ipapi.co/json/
    const calledUrl = (global.fetch as any).mock.calls[0][0];
    expect(calledUrl).toBe('https://ipapi.co/json/');
  });

  it('defaults to USD when everything fails', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('network')) as any;
    const req = new Request('https://example.com/', {
      headers: { 'x-forwarded-for': '8.8.8.8' },
    });
    const result = await detectCurrency(req);
    expect(result).toBe('USD');
  });

  it('sets cookie on final fallback when cookies provided', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('network')) as any;
    const req = new Request('https://example.com/', {
      headers: { 'x-forwarded-for': '8.8.8.8' },
    });
    const cookieStore: Record<string, any> = {};
    const cookies = {
      get: () => undefined,
      set: (name: string, value: string) => {
        cookieStore[name] = value;
      },
    };
    const result = await detectCurrency(req, cookies);
    expect(result).toBe('USD');
    expect(cookieStore['user-currency']).toBe('USD');
  });
});