import styled from 'styled-components';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { useAuth } from '../auth/AuthContext';

const PageTitle = styled.h1`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const Lead = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0 0 ${({ theme }) => theme.spacing(6)} 0;
`;

const Table = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
`;

const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: 48px 1fr 80px 80px 80px;
  padding: ${({ theme }) => `${theme.spacing(3)} ${theme.spacing(4)}`};
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.surfaceAlt};
`;

const Row = styled.div<{ $me?: boolean }>`
  display: grid;
  grid-template-columns: 48px 1fr 80px 80px 80px;
  padding: ${({ theme }) => `${theme.spacing(3)} ${theme.spacing(4)}`};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  font-weight: ${({ $me }) => ($me ? 700 : 500)};
  background: ${({ $me, theme }) => ($me ? theme.colors.surfaceAlt : 'transparent')};
`;

const Position = styled.span<{ $top?: boolean }>`
  color: ${({ $top, theme }) => ($top ? theme.colors.primary : theme.colors.textMuted)};
  font-weight: 700;
`;

const Empty = styled.div`
  padding: ${({ theme }) => theme.spacing(8)};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export function LeaderboardPage() {
  const { rows, loading } = useLeaderboard();
  const { user } = useAuth();

  return (
    <>
      <PageTitle>Tabell</PageTitle>
      <Lead>Poäng räknas så fort en match är klar.</Lead>
      <Table>
        <HeaderRow>
          <span>#</span>
          <span>Spelare</span>
          <span style={{ textAlign: 'right' }}>Poäng</span>
          <span style={{ textAlign: 'right' }}>Exakta</span>
          <span style={{ textAlign: 'right' }}>1X2 rätt</span>
        </HeaderRow>
        {loading && <Empty>Laddar tabell…</Empty>}
        {!loading && rows.length === 0 && <Empty>Inga spelare än.</Empty>}
        {rows.map((row, i) => (
          <Row key={row.user_id} $me={user?.id === row.user_id}>
            <Position $top={i < 3}>{i + 1}</Position>
            <span>{row.name}</span>
            <span style={{ textAlign: 'right' }}>{row.totalPoints}</span>
            <span style={{ textAlign: 'right' }}>{row.exactCount}</span>
            <span style={{ textAlign: 'right' }}>{row.signCount}</span>
          </Row>
        ))}
      </Table>
    </>
  );
}
