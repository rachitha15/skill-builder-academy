import { describe, it, expect } from 'vitest';
import { calculateXP } from '@/lib/validation';

describe('Module 2 XP Scoring', () => {
  // Module 2: All 3 tasks correct first try = 150, correct (not first) = 100
  
  it('3/3 first attempt = 150 XP', () => {
    const result = calculateXP(2, 3, 3, 1, 0);
    expect(result.total).toBe(150);
  });

  it('3/3 second attempt = 100 XP', () => {
    const result = calculateXP(2, 3, 3, 2, 0);
    expect(result.total).toBe(100);
  });

  it('3/3 third attempt = 100 XP', () => {
    const result = calculateXP(2, 3, 3, 3, 0);
    expect(result.total).toBe(100);
  });

  it('2/3 = 0 XP (below passing)', () => {
    const result = calculateXP(2, 2, 3, 1, 0);
    expect(result.total).toBe(0);
  });

  it('1/3 = 0 XP (below passing)', () => {
    const result = calculateXP(2, 1, 3, 1, 0);
    expect(result.total).toBe(0);
  });

  it('0/3 = 0 XP (below passing)', () => {
    const result = calculateXP(2, 0, 3, 1, 0);
    expect(result.total).toBe(0);
  });

  // Hint penalties
  it('3/3 first attempt with 1 hint = 150 XP (first hint free)', () => {
    const result = calculateXP(2, 3, 3, 1, 1);
    expect(result.total).toBe(150);
  });

  it('3/3 first attempt with 2 hints = 125 XP (150 - 25)', () => {
    const result = calculateXP(2, 3, 3, 1, 2);
    expect(result.total).toBe(125);
  });

  it('3/3 first attempt with 3 hints = 75 XP (150 - 75)', () => {
    const result = calculateXP(2, 3, 3, 1, 3);
    expect(result.total).toBe(75);
  });

  it('3/3 second attempt with 2 hints = 75 XP (100 - 25)', () => {
    const result = calculateXP(2, 3, 3, 2, 2);
    expect(result.total).toBe(75);
  });

  it('3/3 second attempt with 3 hints = 25 XP (100 - 75)', () => {
    const result = calculateXP(2, 3, 3, 2, 3);
    expect(result.total).toBe(25);
  });
});
