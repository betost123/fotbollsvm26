import styled from 'styled-components';
import { useLeaderboard, type DailyRow } from '../hooks/useLeaderboard';
import { useAuth } from '../auth/AuthContext';
import { formatDateHeader } from '../lib/time';

const PageTitle = styled.h1`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const Lead = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0 0 ${({ theme }) => theme.spacing(6)} 0;
`;

const SectionTitle = styled.h2`
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: ${({ theme }) => theme.spacing(8)} 0 ${({ theme }) => theme.spacing(3)} 0;
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing(2)};
  &:first-child { margin-top: 0; }
`;

const SectionMeta = styled.span`
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: normal;
  text-transform: none;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Table = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
`;

const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: 56px 1fr 100px;
  padding: ${({ theme }) => `${theme.spacing(3)} ${theme.spacing(4)}`};
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.surfaceAlt};
`;

const Row = styled.div<{ $me?: boolean; $leader?: boolean }>`
  display: grid;
  grid-template-columns: 56px 1fr 100px;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing(3)} ${theme.spacing(4)}`};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  font-weight: ${({ $me, $leader }) => ($me || $leader ? 700 : 500)};
  background: ${({ $me, $leader, theme }) =>
    $leader
      ? 'linear-gradient(90deg, rgba(254,204,2,0.15), transparent 60%)'
      : $me
        ? theme.colors.surfaceAlt
        : 'transparent'};
`;

const Position = styled.span<{ $top?: boolean }>`
  color: ${({ $top, theme }) => ($top ? theme.colors.primary : theme.colors.textMuted)};
  font-weight: 700;
`;

const Name = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const Trophy = styled.span`
  font-size: 1.2rem;
  line-height: 1;
`;

const Points = styled.span`
  text-align: right;
  font-variant-numeric: tabular-nums;
`;

const Empty = styled.div`
  padding: ${({ theme }) => theme.spacing(8)};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const SmallEmpty = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.spacing(5)};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.95rem;
`;

function MiniRow({
  row,
  index,
  isLeader,
  isMe,
}: {
  row: DailyRow;
  index: number;
  isLeader: boolean;
  isMe: boolean;
}) {
  return (
    <Row $me={isMe} $leader={isLeader}>
      <Position $top={index < 3}>{index + 1}</Position>
      <Name>
        {row.name}
        {isLeader && <Trophy aria-label="Dagens vinnare">🏆</Trophy>}
      </Name>
      <Points>{row.points}</Points>
    </Row>
  );
}

export function LeaderboardPage() {
  const { rows, recentDay, loading } = useLeaderboard();
  const { user } = useAuth();

  const totalLeaderHasPoints = rows.length > 0 && rows[0].totalPoints > 0;
  const recentLeaderHasPoints = !!recentDay && recentDay.rows.length > 0;

  return (
    <>
      <PageTitle>Tabell</PageTitle>
      <Lead>Poäng räknas så fort en match är klar.</Lead>

      <SectionTitle>
        Senaste matchdagen
        {recentDay && (
          <SectionMeta>
            {formatDateHeader(recentDay.dateKey)} · {recentDay.matchCount} avgjorda matcher
          </SectionMeta>
        )}
      </SectionTitle>
      {!recentDay && !loading && (
        <SmallEmpty>Inga matcher avgjorda än — tabellen tänds när första matchen är slut.</SmallEmpty>
      )}
      {recentDay && !recentLeaderHasPoints && (
        <SmallEmpty>
          Ingen plockade poäng på matchdagen {formatDateHeader(recentDay.dateKey)} — oj då.
        </SmallEmpty>
      )}
      {recentDay && recentLeaderHasPoints && (
        <Table>
          <HeaderRow>
            <span>#</span>
            <span>Spelare</span>
            <Points>Poäng</Points>
          </HeaderRow>
          {recentDay.rows.map((row, i) => (
            <MiniRow
              key={row.user_id}
              row={row}
              index={i}
              isLeader={i === 0}
              isMe={user?.id === row.user_id}
            />
          ))}
        </Table>
      )}

      <SectionTitle>Totalt</SectionTitle>
      <Table>
        <HeaderRow>
          <span>#</span>
          <span>Spelare</span>
          <Points>Poäng</Points>
        </HeaderRow>
        {loading && <Empty>Laddar tabell…</Empty>}
        {!loading && rows.length === 0 && <Empty>Inga spelare än.</Empty>}
        {rows.map((row, i) => {
          const isLeader = i === 0 && totalLeaderHasPoints;
          return (
            <Row key={row.user_id} $me={user?.id === row.user_id} $leader={isLeader}>
              <Position $top={i < 3}>{i + 1}</Position>
              <Name>
                {row.name}
                {isLeader && <Trophy aria-label="Ledare">🏆</Trophy>}
              </Name>
              <Points>{row.totalPoints}</Points>
            </Row>
          );
        })}
      </Table>
    </>
  );
}
