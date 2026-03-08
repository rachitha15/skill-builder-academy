import { describe, it, expect } from 'vitest';
import { calculateXP } from '@/lib/validation';

describe('Module 1 XP Scoring', () => {
  it('4/4 first attempt = 150 XP (base 150, capped at max)', () => {
    const result = calculateXP(1, 4, 4, 1, 0);
    expect(result.total).toBe(150);
  });

  it('4/4 second attempt = 150 XP (no first attempt bonus)', () => {
    const result = calculateXP(1, 4, 4, 2, 0);
    expect(result.total).toBe(150);
  });

  it('3/4 first attempt = 100 XP (base 100, capped at max before bonus can push over)', () => {
    const result = calculateXP(1, 3, 4, 1, 0);
    // base 100 + 50 bonus = 150, capped at 150
    expect(result.total).toBe(150);
  });

  it('3/4 second attempt = 100 XP', () => {
    const result = calculateXP(1, 3, 4, 2, 0);
    expect(result.total).toBe(100);
  });

  it('2/4 = 0 XP (below passing)', () => {
    const result = calculateXP(1, 2, 4, 1, 0);
    expect(result.total).toBe(0);
  });

  // Hint penalties
  it('4/4 first attempt with 1 hint = 150 XP (first hint free)', () => {
    const result = calculateXP(1, 4, 4, 1, 1);
    expect(result.total).toBe(150);
  });

  it('4/4 first attempt with 2 hints = 150 XP (base 150 + 50 - 25 = 175, capped at 150)', () => {
    const result = calculateXP(1, 4, 4, 1, 2);
    expect(result.total).toBe(150);
  });

  it('4/4 second attempt with 2 hints = 125 XP (base 150 - 25)', () => {
    const result = calculateXP(1, 4, 4, 2, 2);
    expect(result.total).toBe(125);
  });

  it('4/4 first attempt with 3 hints = 125 XP (base 150 + 50 - 75 = 125)', () => {
    const result = calculateXP(1, 4, 4, 1, 3);
    expect(result.total).toBe(125);
  });

  it('4/4 second attempt with 3 hints = 75 XP (base 150 - 75)', () => {
    const result = calculateXP(1, 4, 4, 2, 3);
    expect(result.total).toBe(75);
  });

  it('3/4 second attempt with 3 hints = 25 XP (base 100 - 75)', () => {
    const result = calculateXP(1, 3, 4, 2, 3);
    expect(result.total).toBe(25);
  });
});
