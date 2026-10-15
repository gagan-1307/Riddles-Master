import { describe, it, expect } from 'vitest';
import { getISTDateString } from './daily';

describe('getISTDateString', () => {
  it('formats a date as YYYY-MM-DD in IST', () => {
    // 2026-01-15 00:00 UTC -> 05:30 IST same date
    const d = new Date('2026-01-15T00:00:00Z');
    expect(getISTDateString(d)).toBe('2026-01-15');
  });

  it('rolls over near midnight UTC (IST is UTC+5:30)', () => {
    // 2026-01-15 20:00 UTC -> 2026-01-16 01:30 IST
    const d = new Date('2026-01-15T20:00:00Z');
    expect(getISTDateString(d)).toBe('2026-01-16');
  });

  it('uses current date when no argument given', () => {
    const result = getISTDateString();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('handles IST-aware dates already in next day edge', () => {
    const d = new Date('2026-12-31T18:29:59Z'); // 23:59:59 IST
    expect(getISTDateString(d)).toBe('2026-12-31');
    const d2 = new Date('2026-12-31T18:30:00Z'); // 00:00 IST next day
    expect(getISTDateString(d2)).toBe('2027-01-01');
  });
});