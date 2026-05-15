import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Match } from '../lib/database.types';

export function useMatches() {
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .order('kickoff', { ascending: true });
      if (cancelled) return;
      if (error) setError(error.message);
      else setMatches(data ?? []);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { matches, error, loading: matches === null && !error };
}
