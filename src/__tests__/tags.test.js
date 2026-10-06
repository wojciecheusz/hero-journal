import { describe, it, expect } from 'vitest';
import { canonTag, displayTag, hasTag } from '../utils/tags.js';

describe('suggested tags follow the interface language', () => {
  it('maps Polish and English variants to one canonical tag', () => {
    expect(canonTag('akcja')).toBe('action');
    expect(canonTag('Bonus akcja')).toBe('bonus action');
    expect(canonTag('passive')).toBe('passive');
  });
  it('displays a suggested tag in the current language', () => {
    expect(displayTag('pasywna', 'en')).toBe('passive');
    expect(displayTag('reaction', 'pl')).toBe('reakcja');
  });
  it('keeps user-written tags untouched', () => {
    expect(canonTag('po odpoczynku')).toBe('po odpoczynku');
    expect(displayTag('skarb', 'en')).toBe('skarb');
  });
  it('matches tags across languages', () => {
    expect(hasTag(['akcja', 'skarb'], 'action')).toBe(true);
    expect(hasTag(['skarb'], 'action')).toBe(false);
  });
});
