import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // eslint-disable-next-line no-console
  console.warn(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. ' +
      'Set them in a .env.local file. See README.md.',
  );
}

// Note: row types live in ./database.types.ts and are used at the call sites.
// We don't pass the Database generic to createClient because supabase-js's
// strict typed builder is more trouble than it's worth for a small schema.
export const supabase = createClient(
  url ?? 'http://localhost:54321',
  anonKey ?? 'public-anon-key',
);
