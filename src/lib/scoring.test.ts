import { describe, it, expect } from 'vitest';
import { pointsForBet, sign, diff } from './scoring';

describe('sign', () => {
  it('returns 1 for home win', () => expect(sign({ home: 2, away: 1 })).toBe('1'));
  it('returns 2 for away win', () => expect(sign({ home: 0, away: 1 })).toBe('2'));
  it('returns X for draw', () => expect(sign({ home: 1, away: 1 })).toBe('X'));
});

describe('pointsForBet', () => {
  it('returns 0 when bet missing', () => {
    expect(pointsForBet({ home: 2, away: 1 }, null)).toBe(0);
  });

  it('returns 0 when actual missing', () => {
    expect(pointsForBet(null, { home: 2, away: 1 })).toBe(0);
  });

  it('returns 0 for wrong 1X2 sign', () => {
    expect(pointsForBet({ home: 2, away: 1 }, { home: 1, away: 2 })).toBe(0);
  });

  it('returns 10 for exact result', () => {
    expect(pointsForBet({ home: 2, away: 1 }, { home: 2, away: 1 })).toBe(10);
  });

  it('matches the example from the rules: actual 2-1, bet 4-2 -> 3 points', () => {
    // diff = |2-4| + |1-2| = 3
    expect(pointsForBet({ home: 2, away: 1 }, { home: 4, away: 2 })).toBe(3);
  });

  it('diff 1 with correct sign -> 6 points', () => {
    expect(pointsForBet({ home: 3, away: 1 }, { home: 2, away: 1 })).toBe(6);
  });

  it('diff 5 with correct sign -> 1 point', () => {
    // bet 1-0, actual 5-1 -> diff = 4 + 1 = 5
    expect(pointsForBet({ home: 5, away: 1 }, { home: 1, away: 0 })).toBe(1);
  });

  it('diff >5 with correct sign -> 1 point floor', () => {
    // bet 1-0, actual 7-1 -> diff = 6 + 1 = 7
    expect(pointsForBet({ home: 7, away: 1 }, { home: 1, away: 0 })).toBe(1);
  });

  it('correct draw with diff 0 -> 10 points', () => {
    expect(pointsForBet({ home: 1, away: 1 }, { home: 1, away: 1 })).toBe(10);
  });

  it('correct draw sign, diff 2 -> 4 points', () => {
    // bet 0-0, actual 1-1 -> diff = 1 + 1 = 2
    expect(pointsForBet({ home: 1, away: 1 }, { home: 0, away: 0 })).toBe(4);
  });
});

describe('diff', () => {
  it('sums absolute diffs', () => {
    expect(diff({ home: 2, away: 1 }, { home: 4, away: 2 })).toBe(3);
  });
});
