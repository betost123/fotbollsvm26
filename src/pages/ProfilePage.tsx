import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../auth/AuthContext';
import { supabase } from '../lib/supabase';
import { useLeaderboard } from '../hooks/useLeaderboard';

const PageTitle = styled.h1`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const Card = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.spacing(6)};
  margin-bottom: ${({ theme }) => theme.spacing(5)};
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

const Input = styled.input`
  padding: ${({ theme }) => `${theme.spacing(3)} ${theme.spacing(4)}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 1rem;
  flex: 1;
`;

const Button = styled.button<{ $variant?: 'primary' | 'ghost' | 'danger' }>`
  padding: ${({ theme }) => `${theme.spacing(3)} ${theme.spacing(5)}`};
  border-radius: ${({ theme }) => theme.radii.md};
  border: none;
  font-weight: 600;
  background: ${({ theme, $variant }) =>
    $variant === 'danger'
      ? theme.colors.danger
      : $variant === 'ghost'
        ? 'transparent'
        : theme.colors.primary};
  color: ${({ theme, $variant }) => ($variant === 'ghost' ? theme.colors.text : 'white')};
  border: ${({ theme, $variant }) =>
    $variant === 'ghost' ? `1px solid ${theme.colors.border}` : 'none'};
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const StatVal = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
`;

const StatLabel = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing(4)};
`;

export function ProfilePage() {
  const { user, profile, refreshProfile, signOut } = useAuth();
  const { rows } = useLeaderboard();
  const [name, setName] = useState(profile?.name ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile?.name) setName(profile.name);
  }, [profile?.name]);

  const myRow = useMemo(
    () => rows.find((r) => r.user_id === user?.id),
    [rows, user?.id],
  );
  const myRank = useMemo(
    () => (myRow ? rows.findIndex((r) => r.user_id === myRow.user_id) + 1 : null),
    [rows, myRow],
  );

  async function saveName() {
    if (!user || !name.trim()) return;
    setSaving(true);
    setSaved(false);
    const { error } = await supabase
      .from('profiles')
      .update({ name: name.trim() })
      .eq('id', user.id);
    setSaving(false);
    if (!error) {
      setSaved(true);
      await refreshProfile();
    }
  }

  return (
    <>
      <PageTitle>Profil</PageTitle>

      <Card>
        <Label>Visningsnamn</Label>
        <Row>
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setSaved(false);
            }}
            maxLength={40}
          />
          <Button onClick={saveName} disabled={saving || !name.trim() || name === profile?.name}>
            {saving ? 'Sparar…' : saved ? 'Sparat ✓' : 'Spara'}
          </Button>
        </Row>
        <Label style={{ marginTop: 16 }}>E-post</Label>
        <div style={{ color: '#6B7280' }}>{user?.email}</div>
      </Card>

      <Card>
        <StatGrid>
          <Stat>
            <StatVal>{myRow?.totalPoints ?? 0}</StatVal>
            <StatLabel>Poäng</StatLabel>
          </Stat>
          <Stat>
            <StatVal>{myRank ?? '–'}</StatVal>
            <StatLabel>Placering</StatLabel>
          </Stat>
          <Stat>
            <StatVal>{myRow?.exactCount ?? 0}</StatVal>
            <StatLabel>Exakta tips</StatLabel>
          </Stat>
        </StatGrid>
      </Card>

      <Button $variant="ghost" onClick={signOut}>Logga ut</Button>
    </>
  );
}
