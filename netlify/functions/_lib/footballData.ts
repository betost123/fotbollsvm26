/**
 * football-data.org client.
 * Docs: https://www.football-data.org/documentation/api
 * Competition code for FIFA World Cup: "WC".
 */

export type FdStage =
  | 'GROUP_STAGE'
  | 'LAST_32'
  | 'LAST_16'
  | 'QUARTER_FINALS'
  | 'SEMI_FINALS'
  | 'THIRD_PLACE'
  | 'FINAL'
  | string;

export interface FdMatch {
  id: number;
  utcDate: string;
  status: 'SCHEDULED' | 'TIMED' | 'IN_PLAY' | 'PAUSED' | 'FINISHED' | 'POSTPONED' | 'SUSPENDED' | 'CANCELLED';
  stage: FdStage;
  group?: string | null;
  homeTeam?: { id: number | null; name: string | null; shortName: string | null };
  awayTeam?: { id: number | null; name: string | null; shortName: string | null };
  score?: {
    fullTime?: { home: number | null; away: number | null };
    halfTime?: { home: number | null; away: number | null };
  };
}

export function mapStage(s: FdStage): string {
  switch (s) {
    case 'GROUP_STAGE': return 'group';
    case 'LAST_32': return 'round_of_32';
    case 'LAST_16': return 'round_of_16';
    case 'QUARTER_FINALS': return 'quarter_final';
    case 'SEMI_FINALS': return 'semi_final';
    case 'THIRD_PLACE': return 'third_place';
    case 'FINAL': return 'final';
    default: return 'group';
  }
}

export async function fetchWcMatches(apiKey: string): Promise<FdMatch[]> {
  const res = await fetch('https://api.football-data.org/v4/competitions/WC/matches', {
    headers: { 'X-Auth-Token': apiKey },
  });
  if (!res.ok) {
    throw new Error(`football-data.org returned ${res.status} ${res.statusText}`);
  }
  const json = (await res.json()) as { matches?: FdMatch[] };
  return json.matches ?? [];
}
