import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { pointsForBet } from '../lib/scoring';
import type { Bet, Match, Profile } from '../lib/database.types';

export type LeaderboardRow = {
  user_id: string;
  name: string;
  totalPoints: number;
  exactCount: number;
  signCount: number;
  perMatch: Array<{ matchId: string; points: number }>;
};

export function useLeaderboard() {
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const [profilesRes, matchesRes, betsRes] = await Promise.all([
        supabase.from('profiles').select('id, name, is_admin, created_at'),
        supabase.from('matches').select('*').order('kickoff'),
        supabase.from('bets').select('*'),
      ]);
      if (cancelled) return;
      if (profilesRes.error) {
        setError(profilesRes.error.message);
        setLoading(false);
        return;
      }
      const profiles = (profilesRes.data ?? []) as Profile[];
      const allMatches = (matchesRes.data ?? []) as Match[];
      const allBets = (betsRes.data ?? []) as Bet[];

      const finishedById = new Map<string, Match>();
      for (const m of allMatches) {
        if (m.status === 'finished' && m.home_score !== null && m.away_score !== null) {
          finishedById.set(m.id, m);
        }
      }

      const byUser = new Map<string, LeaderboardRow>();
      for (const p of profiles) {
        byUser.set(p.id, {
          user_id: p.id,
          name: p.name,
          totalPoints: 0,
          exactCount: 0,
          signCount: 0,
          perMatch: [],
        });
      }
      for (const b of allBets) {
        const match = finishedById.get(b.match_id);
        if (!match) continue;
        const row = byUser.get(b.user_id);
        if (!row) continue;
        const pts = pointsForBet(
          { home: match.home_score!, away: match.away_score! },
          { home: b.home_bet, away: b.away_bet },
        );
        row.totalPoints += pts;
        if (pts === 10) row.exactCount += 1;
        if (pts > 0) row.signCount += 1;
        row.perMatch.push({ matchId: b.match_id, points: pts });
      }

      const sorted = Array.from(byUser.values()).sort(
        (a, b) => b.totalPoints - a.totalPoints || b.exactCount - a.exactCount,
      );
      setRows(sorted);
      setMatches(allMatches);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { rows, matches, loading, error };
}
