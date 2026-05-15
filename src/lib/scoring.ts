export type Score = { home: number; away: number };

export type Sign = '1' | 'X' | '2';

export function sign({ home, away }: Score): Sign {
  if (home > away) return '1';
  if (home < away) return '2';
  return 'X';
}

export function diff(actual: Score, bet: Score): number {
  return Math.abs(actual.home - bet.home) + Math.abs(actual.away - bet.away);
}

export function pointsForBet(actual: Score | null, bet: Score | null): number {
  if (!actual || !bet) return 0;
  if (sign(actual) !== sign(bet)) return 0;
  const d = diff(actual, bet);
  switch (d) {
    case 0: return 10;
    case 1: return 6;
    case 2: return 4;
    case 3: return 3;
    case 4: return 2;
    case 5: return 1;
    default: return 1;
  }
}
