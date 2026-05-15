import { useEffect, useState } from 'react';
import styled from 'styled-components';
import type { Match, Bet } from '../lib/database.types';
import { formatKickoff, isLocked } from '../lib/time';
import { pointsForBet } from '../lib/scoring';
import { flagFor } from '../lib/flags';

const Card = styled.div<{ $locked: boolean }>`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.spacing(4)};
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
  opacity: ${({ $locked }) => ($locked ? 0.85 : 1)};
`;

const Team = styled.div<{ $align: 'left' | 'right' }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ $align }) => ($align === 'left' ? 'flex-start' : 'flex-end')};
  gap: ${({ theme }) => theme.spacing(1)};
`;

const TeamName = styled.div`
  font-weight: 600;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const Flag = styled.span`
  font-size: 1.4rem;
  line-height: 1;
`;

const ScoreInputs = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const NumInput = styled.input`
  width: 48px;
  height: 48px;
  text-align: center;
  font-size: 1.2rem;
  font-weight: 700;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  &:focus { outline: none; border-color: ${({ theme }) => theme.colors.primary}; }
  &:disabled {
    background: ${({ theme }) => theme.colors.surfaceAlt};
    color: ${({ theme }) => theme.colors.locked};
    cursor: not-allowed;
  }
`;

const Dash = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 700;
`;

const Meta = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textMuted};
  padding-top: ${({ theme }) => theme.spacing(2)};
  border-top: 1px dashed ${({ theme }) => theme.colors.border};
`;

const Badge = styled.span<{ $variant: 'open' | 'locked' | 'saved' | 'points' }>`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing(1)} ${theme.spacing(2)}`};
  border-radius: ${({ theme }) => theme.radii.pill};
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ theme, $variant }) =>
    $variant === 'locked'
      ? theme.colors.surfaceAlt
      : $variant === 'saved'
        ? '#E6F4EA'
        : $variant === 'points'
          ? theme.colors.accent
          : '#E0EFFF'};
  color: ${({ theme, $variant }) =>
    $variant === 'locked'
      ? theme.colors.textMuted
      : $variant === 'saved'
        ? theme.colors.success
        : $variant === 'points'
          ? theme.colors.text
          : theme.colors.primary};
`;

type Props = {
  match: Match;
  bet: Bet | undefined;
  onSave: (matchId: string, home: number, away: number) => Promise<{ error?: string }>;
};

export function MatchCard({ match, bet, onSave }: Props) {
  const locked = isLocked(match.kickoff);
  const finished = match.status === 'finished' && match.home_score !== null && match.away_score !== null;

  const [home, setHome] = useState<string>(bet ? String(bet.home_bet) : '');
  const [away, setAway] = useState<string>(bet ? String(bet.away_bet) : '');
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bet) {
      setHome(String(bet.home_bet));
      setAway(String(bet.away_bet));
    }
  }, [bet]);

  const points = finished
    ? pointsForBet(
        { home: match.home_score!, away: match.away_score! },
        bet ? { home: bet.home_bet, away: bet.away_bet } : null,
      )
    : null;

  async function trySave() {
    const h = Number(home);
    const a = Number(away);
    if (home === '' || away === '' || Number.isNaN(h) || Number.isNaN(a)) return;
    if (h < 0 || a < 0 || h > 20 || a > 20) return;
    if (bet && bet.home_bet === h && bet.away_bet === a) return;
    setSaving(true);
    setError(null);
    const { error } = await onSave(match.id, h, a);
    setSaving(false);
    if (error) setError(error);
    else setSavedAt(Date.now());
  }

  return (
    <Card $locked={locked}>
      <Team $align="left">
        <TeamName>
          {flagFor(match.home_team) && <Flag aria-hidden="true">{flagFor(match.home_team)}</Flag>}
          {match.home_team}
        </TeamName>
        {finished && (
          <Badge $variant="locked">Resultat: {match.home_score}</Badge>
        )}
      </Team>
      <ScoreInputs>
        <NumInput
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={2}
          value={home}
          onChange={(e) => setHome(e.target.value.replace(/\D/g, ''))}
          onBlur={trySave}
          disabled={locked}
          aria-label={`Mål för ${match.home_team}`}
        />
        <Dash>–</Dash>
        <NumInput
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={2}
          value={away}
          onChange={(e) => setAway(e.target.value.replace(/\D/g, ''))}
          onBlur={trySave}
          disabled={locked}
          aria-label={`Mål för ${match.away_team}`}
        />
      </ScoreInputs>
      <Team $align="right">
        <TeamName>
          {match.away_team}
          {flagFor(match.away_team) && <Flag aria-hidden="true">{flagFor(match.away_team)}</Flag>}
        </TeamName>
        {finished && (
          <Badge $variant="locked">Resultat: {match.away_score}</Badge>
        )}
      </Team>
      <Meta>
        <span>
          {formatKickoff(match.kickoff)}
          {match.group_name && ` · Grupp ${match.group_name}`}
        </span>
        <span style={{ display: 'flex', gap: 8 }}>
          {error && <Badge $variant="locked">{error}</Badge>}
          {points !== null && <Badge $variant="points">{points} p</Badge>}
          {!locked && saving && <Badge $variant="open">Sparar…</Badge>}
          {!locked && !saving && savedAt && <Badge $variant="saved">Sparat ✓</Badge>}
          {!locked && !saving && !savedAt && bet && <Badge $variant="saved">Tippat</Badge>}
          {locked && !finished && <Badge $variant="locked">Låst</Badge>}
        </span>
      </Meta>
    </Card>
  );
}
