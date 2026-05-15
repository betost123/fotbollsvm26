# Fotbolls-VM 2026 — Tippa med kompisarna

En liten React-app där du och dina kompisar tippar resultatet på alla matcher i
Fotbolls-VM 2026 (11 juni – 19 juli). Magic-link-inloggning, automatisk
poängräkning, scoreboard. Byggd med React + Vite + styled-components + Supabase
och deployas till Netlify.

## Features
- Logga in med mejl (magic link), eget namn för tabellen
- Tippa hemmamål – bortamål på varje match
- Tipset kan ändras fram till **2 timmar innan avspark** (låst både i UI och i Postgres RLS)
- Tabell med poäng, exakta tips och 1X2-rätt
- Profilsida med poängstatistik
- Admin-sida för att importera schema och fylla i resultat manuellt
- Netlify-funktion som var 30:e minut hämtar resultat från football-data.org

## Poäng
Se `src/pages/RulesPage.tsx` — eller `src/lib/scoring.ts` för logiken.

| Resultatdiff | Poäng |
| --- | --- |
| 0 (exakt) | **10** |
| 1 | 6 |
| 2 | 4 |
| 3 | 3 |
| 4 | 2 |
| 5+ | 1 |
| Fel 1X2 | 0 |

Resultatdiff = `|verkligt_hemma - tippat_hemma| + |verkligt_borta - tippat_borta|`.

## Kom igång lokalt

```bash
npm install
cp .env.example .env.local   # fyll i dina värden
npm run dev
```

### Tester
```bash
npm test
```

## Supabase-uppsättning (engångsjobb)

1. Skapa ett gratis projekt på [supabase.com](https://supabase.com).
2. Gå till **SQL Editor** i Supabase-dashboarden, kopiera in
   `supabase/schema.sql` och kör det. (Skapar tabeller, RLS-policies och
   profil-trigger.)
3. Gå till **Authentication → URL configuration** och lägg in:
   - Site URL: `https://din-app.netlify.app`
   - Redirect URLs: även din lokala URL, t.ex. `http://localhost:5173`
4. Gå till **Authentication → Providers → Email** och se till att magic link är på.
5. Kopiera **Project URL** och **anon public key** till `.env.local`
   (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
6. När du själv loggat in en gång, sätt din profil till admin:
   ```sql
   update profiles set is_admin = true where id = '<din-user-id-från-auth.users>';
   ```

## Resultat från football-data.org

1. Skapa ett konto på [football-data.org](https://www.football-data.org/client/register).
   Gratis tier räcker (10 anrop/min, alla VM-matcher).
2. Notera din API-token.
3. Sätt env-variablerna i Netlify (Site settings → Environment variables):
   - `SUPABASE_URL` (samma som ovan, utan VITE-prefix)
   - `SUPABASE_SERVICE_ROLE_KEY` (Supabase-dashen → Settings → API)
   - `FOOTBALL_DATA_API_KEY`
4. Efter första deployen, öppna `/admin` i appen och tryck
   **"Importera schema"** för att hämta alla matcher en gång.
   Sedan kör Netlify-cronen `sync-results` var 30:e minut automatiskt.
   Du kan också trycka **"Hämta resultat nu"** för att synka direkt.

## Bjuda in kompisar

Det enklaste sättet:

1. Deploya appen på Netlify (se nedan).
2. Skicka länken (`https://din-app.netlify.app`) till kompisarna i en gruppchatt.
3. De skriver in sitt namn + mejl → får en inloggningslänk → klart.

Inga särskilda inbjudningskoder behövs — magic link via Supabase Auth räcker.
Vill du stänga ute främlingar finns två enkla varianter:

- **Lägg till en whitelist** i `supabase/schema.sql` (kommentera ut sign-up-triggern och
  godkänn manuellt).
- **Stäng av sign-ups i Supabase Auth** efter att alla loggat in en gång.

## Deploya till Netlify

1. Pusha repot till GitHub.
2. På [netlify.com](https://netlify.com) → **Add new site → Import an existing project**.
3. Netlify ska autodetektera `netlify.toml`. Bekräfta:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`
4. Lägg in alla env-variabler enligt `.env.example`.
5. Deploya.

## Filstruktur

```
src/
  auth/           AuthContext, LoginPage
  components/     NavBar, Layout, MatchCard
  data/           seedFixtures (om man vill seeda i kod)
  hooks/          useMatches, useMyBets, useLeaderboard
  lib/            supabase client, scoring, time helpers, types
  pages/          TipsPage, LeaderboardPage, RulesPage, ProfilePage, AdminPage
  styles/         theme, GlobalStyle
supabase/
  schema.sql      kör en gång i Supabase SQL Editor
  seed.sql        (valfritt) några testmatcher
netlify/
  functions/
    sync-results.ts     scheduled cron (var 30:e min) + admin-trigger
    import-schedule.ts  admin-trigger för att importera hela schemat
    _lib/footballData.ts
netlify.toml
```

## Vad gör vi när VM startar?
- Importera schemat i admin-fliken (sker en gång; idempotent via `external_id`).
- Se till att `is_admin` är satt på minst en spelare.
- Cronjobbet sköter resultat. Om något krånglar (cup-stadiet ändras, lag-namn
  stavas annorlunda), gå till `/admin` och fixa manuellt.
