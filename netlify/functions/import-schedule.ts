import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { fetchWcMatches, mapStage } from './_lib/footballData';

/**
 * Upsert the entire WC 2026 schedule from football-data.org into Supabase.
 * Idempotent: matches are upserted on `external_id` = "fd-{matchId}".
 */
const handler: Handler = async () => {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;

  if (!url || !serviceKey || !apiKey) {
    return { statusCode: 500, body: 'Saknar env-variabler.' };
  }

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

  const fdMatches = await fetchWcMatches(apiKey);

  const rows = fdMatches.map((m) => ({
    external_id: `fd-${m.id}`,
    home_team: m.homeTeam?.shortName || m.homeTeam?.name || 'TBD',
    away_team: m.awayTeam?.shortName || m.awayTeam?.name || 'TBD',
    kickoff: m.utcDate,
    stage: mapStage(m.stage),
    group_name: m.group ?? null,
    venue: null,
  }));

  const { error, count } = await supabase
    .from('matches')
    .upsert(rows, { onConflict: 'external_id', count: 'exact' });

  if (error) return { statusCode: 500, body: error.message };
  return { statusCode: 200, body: `Importerade/uppdaterade ${count ?? rows.length} matcher.` };
};

export { handler };
