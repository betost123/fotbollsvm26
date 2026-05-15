import type { Handler, HandlerEvent } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { mapStage, fetchWcMatches, type FdMatch } from './_lib/footballData';

/**
 * Sync match results from football-data.org -> Supabase.
 * Runs on a schedule (see netlify.toml) and is also callable from the Admin UI.
 *
 * Required env:
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY  (server-side, bypasses RLS)
 *   FOOTBALL_DATA_API_KEY
 */
const handler: Handler = async (_event: HandlerEvent) => {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;

  if (!url || !serviceKey || !apiKey) {
    return { statusCode: 500, body: 'Saknar env-variabler (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, FOOTBALL_DATA_API_KEY).' };
  }

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

  let fdMatches: FdMatch[];
  try {
    fdMatches = await fetchWcMatches(apiKey);
  } catch (e) {
    return { statusCode: 502, body: `football-data.org-fel: ${(e as Error).message}` };
  }

  const updates = fdMatches
    .filter((m) => m.status === 'FINISHED' || m.status === 'IN_PLAY' || m.status === 'PAUSED')
    .map((m) => ({
      external_id: `fd-${m.id}`,
      home_score: m.score?.fullTime?.home ?? null,
      away_score: m.score?.fullTime?.away ?? null,
      status: m.status === 'FINISHED' ? 'finished' : 'live',
    }));

  let updated = 0;
  for (const u of updates) {
    const { error, count } = await supabase
      .from('matches')
      .update({
        home_score: u.home_score,
        away_score: u.away_score,
        status: u.status as 'finished' | 'live',
      }, { count: 'exact' })
      .eq('external_id', u.external_id);
    if (!error && count) updated += count;
  }

  return {
    statusCode: 200,
    body: `Synkade ${updated} matchresultat (av ${updates.length} kandidater).`,
  };
};

// Netlify Scheduled Functions: keep this export so the scheduler is picked up.
export const config = { schedule: '*/30 * * * *' };
export { handler };
// silence unused import warnings
void mapStage;
