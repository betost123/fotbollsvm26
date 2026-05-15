-- Optional seed: a couple of matches for local testing.
-- After running schema.sql, run this to insert sample fixtures.

insert into matches (external_id, home_team, away_team, kickoff, stage, group_name, venue)
values
  ('wc2026-001', 'Mexiko', 'TBD', '2026-06-11 18:00:00+00', 'group', 'A', 'Estadio Azteca, Mexico City')
on conflict (external_id) do nothing;
