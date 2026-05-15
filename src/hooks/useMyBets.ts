import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Bet } from '../lib/database.types';
import { useAuth } from '../auth/AuthContext';

export function useMyBets() {
  const { user } = useAuth();
  const [bets, setBets] = useState<Record<string, Bet>>({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) {
      setBets({});
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from('bets')
      .select('*')
      .eq('user_id', user.id);
    const map: Record<string, Bet> = {};
    (data ?? []).forEach((b) => {
      map[b.match_id] = b;
    });
    setBets(map);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const upsert = useCallback(
    async (matchId: string, home: number, away: number) => {
      if (!user) return { error: 'Inte inloggad' };
      const { data, error } = await supabase
        .from('bets')
        .upsert(
          { user_id: user.id, match_id: matchId, home_bet: home, away_bet: away },
          { onConflict: 'user_id,match_id' },
        )
        .select()
        .single();
      if (error) return { error: error.message };
      setBets((prev) => ({ ...prev, [matchId]: data as Bet }));
      return {};
    },
    [user],
  );

  return { bets, loading, upsert, reload: load };
}
