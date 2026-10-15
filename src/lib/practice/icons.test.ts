import { describe, it, expect } from 'vitest';
import { getTopicIcon } from './icons';

describe('getTopicIcon', () => {
  it('returns an SVG string for a known slug', () => {
    const svg = getTopicIcon('percentages');
    expect(svg).toContain('<svg');
    expect(svg).toContain('viewBox="0 0 24 24"');
  });

  it('returns distinct icons for different slugs', () => {
    expect(getTopicIcon('percentages')).not.toBe(getTopicIcon('averages'));
  });

  it('returns a fallback SVG for unknown slug', () => {
    const svg = getTopicIcon('definitely-not-a-topic');
    expect(svg).toContain('<svg');
    // fallback contains book-ish path
    expect(svg).toContain('M4 19.5A2.5 2.5 0 0 1 6.5 17H20');
  });

  it('returns fallback for empty string', () => {
    expect(getTopicIcon('')).toContain('<svg');
  });

  it('all known slugs return non-empty SVG', () => {
    const slugs = ['number-system', 'blood-relations', 'reading-comprehension', 'pattern-recognition'];
    for (const s of slugs) {
      expect(getTopicIcon(s).length).toBeGreaterThan(20);
    }
  });
});