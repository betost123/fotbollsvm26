/**
 * Seed fixtures for Fotbolls-VM 2026.
 *
 * Tournament: 11 June – 19 July 2026, hosted by USA / Canada / Mexico.
 * 48 teams, 12 groups of 4, 104 matches total.
 *
 * This file contains a SMALL hand-curated set for initial seeding.
 * The full schedule should be imported from football-data.org via the
 * admin page (Admin -> Importera schema), which writes directly to Supabase.
 *
 * If you prefer to maintain the schedule in code, edit this file and run
 * the SQL seed in supabase/seed.sql.
 */
export type Stage =
  | 'group'
  | 'round_of_32'
  | 'round_of_16'
  | 'quarter_final'
  | 'semi_final'
  | 'third_place'
  | 'final';

export type FixtureSeed = {
  externalId: string; // stable id, used for upserts (e.g. football-data match id or fd-{n})
  homeTeam: string;
  awayTeam: string;
  kickoff: string; // ISO 8601 in UTC
  stage: Stage;
  groupName?: string;
  venue?: string;
};

// Opening matchday — host nations traditionally play.
// Verify and complete via the football-data.org import in the admin page.
export const seedFixtures: FixtureSeed[] = [
  {
    externalId: 'wc2026-001',
    homeTeam: 'Mexiko',
    awayTeam: 'TBD',
    kickoff: '2026-06-11T18:00:00Z',
    stage: 'group',
    groupName: 'A',
    venue: 'Estadio Azteca, Mexico City',
  },
];
