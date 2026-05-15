import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { pointsForBet } from '../lib/scoring';
import { dateKey } from '../lib/time';
import type { Bet, Match, Profile } from '../lib/database.types';

export type LeaderboardRow = {
  user_id: string;
  name: string;
  totalPoints: number;
  exactCount: number;
  signCount: number;
  perMatch: Array<{ matchId: string; points: number }>;
};

export type DailyRow = {
  user_id: string;
  name: string;
  points: number;
  matchesScored: number;
};

export type RecentDay = {
  dateKey: string; // yyyy-mm-dd of the most recent match day with finished matches
  matchCount: number;
  rows: DailyRow[]; // already sorted, filtered to those who actually scored
};

export function useLeaderboard() {
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [recentDay, setRecentDay] = useState<RecentDay | null>(null);
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
      const finishedByDay = new Map<string, Match[]>();
      for (const m of allMatches) {
        if (m.status === 'finished' && m.home_score !== null && m.away_score !== null) {
          finishedById.set(m.id, m);
          const k = dateKey(m.kickoff);
          if (!finishedByDay.has(k)) finishedByDay.set(k, []);
          finishedByDay.get(k)!.push(m);
        }
      }

      // Most recent calendar day that has finished matches.
      const recentKey = Array.from(finishedByDay.keys()).sort().pop() ?? null;
      const recentMatchIds = new Set(
        recentKey ? finishedByDay.get(recentKey)!.map((m) => m.id) : [],
      );

      const byUser = new Map<string, LeaderboardRow>();
      const byUserRecent = new Map<string, DailyRow>();
      for (const p of profiles) {
        byUser.set(p.id, {
          user_id: p.id,
          name: p.name,
          totalPoints: 0,
          exactCount: 0,
          signCount: 0,
          perMatch: [],
        });
        byUserRecent.set(p.id, {
          user_id: p.id,
          name: p.name,
          points: 0,
          matchesScored: 0,
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

        if (recentMatchIds.has(b.match_id)) {
          const recent = byUserRecent.get(b.user_id);
          if (recent) {
            recent.points += pts;
            if (pts > 0) recent.matchesScored += 1;
          }
        }
      }

      const sorted = Array.from(byUser.values()).sort(
        (a, b) => b.totalPoints - a.totalPoints || b.exactCount - a.exactCount,
      );
      const sortedRecent = Array.from(byUserRecent.values())
        .filter((r) => r.points > 0)
        .sort((a, b) => b.points - a.points);

      setRows(sorted);
      setRecentDay(
        recentKey
          ? {
              dateKey: recentKey,
              matchCount: recentMatchIds.size,
              rows: sortedRecent,
            }
          : null,
      );
      setMatches(allMatches);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { rows, recentDay, matches, loading, error };
}
