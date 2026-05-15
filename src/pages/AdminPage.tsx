import { useState } from 'react';
import styled from 'styled-components';
import { useMatches } from '../hooks/useMatches';
import { useAuth } from '../auth/AuthContext';
import { supabase } from '../lib/supabase';
import { formatKickoff } from '../lib/time';
import { flagFor } from '../lib/flags';
import type { Match } from '../lib/database.types';

const PageTitle = styled.h1`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const Lead = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0 0 ${({ theme }) => theme.spacing(6)} 0;
`;

const Section = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.spacing(5)};
  margin-bottom: ${({ theme }) => theme.spacing(5)};
`;

const H2 = styled.h2`
  font-size: 1.1rem;
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`;

const Button = styled.button`
  padding: ${({ theme }) => `${theme.spacing(3)} ${theme.spacing(5)}`};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 600;
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const Grid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing(3)};
`;

const MatchRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 60px 16px 60px 100px 120px;
  gap: ${({ theme }) => theme.spacing(3)};
  align-items: center;
  padding: ${({ theme }) => theme.spacing(3)};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.9rem;
  &:last-child { border-bottom: 0; }
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing(2)};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  text-align: center;
  font-weight: 600;
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing(2)};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
`;

function AdminMatchRow({ match }: { match: Match }) {
  const [home, setHome] = useState<string>(match.home_score?.toString() ?? '');
  const [away, setAway] = useState<string>(match.away_score?.toString() ?? '');
  const [status, setStatus] = useState(match.status);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    setSaved(false);
    const h = home === '' ? null : Number(home);
    const a = away === '' ? null : Number(away);
    const { error } = await supabase
      .from('matches')
      .update({ home_score: h, away_score: a, status })
      .eq('id', match.id);
    setSaving(false);
    if (!error) setSaved(true);
  }

  return (
    <MatchRow>
      <div>
        <strong>{flagFor(match.home_team)} {match.home_team}</strong>
        {' – '}
        <strong>{match.away_team} {flagFor(match.away_team)}</strong>
        <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>
          {formatKickoff(match.kickoff)}
        </div>
      </div>
      <Input value={home} onChange={(e) => setHome(e.target.value.replace(/\D/g, ''))} placeholder="–" />
      <span style={{ textAlign: 'center' }}>:</span>
      <Input value={away} onChange={(e) => setAway(e.target.value.replace(/\D/g, ''))} placeholder="–" />
      <Select value={status} onChange={(e) => setStatus(e.target.value as Match['status'])}>
        <option value="scheduled">Schemalagd</option>
        <option value="live">Pågår</option>
        <option value="finished">Klar</option>
        <option value="cancelled">Inställd</option>
      </Select>
      <Button onClick={save} disabled={saving}>{saving ? '…' : saved ? 'Sparat' : 'Spara'}</Button>
    </MatchRow>
  );
}

export function AdminPage() {
  const { profile } = useAuth();
  const { matches, loading } = useMatches();
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  if (profile && !profile.is_admin) {
    return (
      <>
        <PageTitle>Admin</PageTitle>
        <Lead>
          Du har inte admin-behörighet. Sätt <code>is_admin = true</code> på din profil i Supabase
          för att se den här sidan.
        </Lead>
      </>
    );
  }

  async function syncResults() {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch('/.netlify/functions/sync-results', { method: 'POST' });
      const text = await res.text();
      setSyncResult(res.ok ? text || 'Synkat!' : `Fel: ${text}`);
    } catch (e) {
      setSyncResult(`Fel: ${(e as Error).message}`);
    } finally {
      setSyncing(false);
    }
  }

  async function importSchedule() {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch('/.netlify/functions/import-schedule', { method: 'POST' });
      const text = await res.text();
      setSyncResult(res.ok ? text || 'Importerat!' : `Fel: ${text}`);
    } catch (e) {
      setSyncResult(`Fel: ${(e as Error).message}`);
    } finally {
      setSyncing(false);
    }
  }

  return (
    <>
      <PageTitle>Admin</PageTitle>
      <Lead>Importera schema, synka resultat, eller fyll i resultat manuellt.</Lead>

      <Section>
        <H2>Schema &amp; resultat från football-data.org</H2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Button onClick={importSchedule} disabled={syncing}>
            {syncing ? 'Arbetar…' : 'Importera schema'}
          </Button>
          <Button onClick={syncResults} disabled={syncing}>
            {syncing ? 'Arbetar…' : 'Hämta resultat nu'}
          </Button>
        </div>
        {syncResult && (
          <p style={{ marginTop: 12, fontFamily: 'monospace', fontSize: '0.85rem' }}>
            {syncResult}
          </p>
        )}
      </Section>

      <Section>
        <H2>Manuell resultatregistrering</H2>
        {loading && <p>Laddar matcher…</p>}
        <Grid>
          {matches?.map((m) => <AdminMatchRow key={m.id} match={m} />)}
        </Grid>
      </Section>
    </>
  );
}
