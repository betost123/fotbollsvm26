import { useMemo } from 'react';
import styled from 'styled-components';
import { useMatches } from '../hooks/useMatches';
import { useMyBets } from '../hooks/useMyBets';
import { MatchCard } from '../components/MatchCard';
import { dateKey, formatDateHeader } from '../lib/time';

const PageTitle = styled.h1`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const Lead = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0 0 ${({ theme }) => theme.spacing(6)} 0;
`;

const DayGroup = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing(6)};
`;

const DayHeader = styled.h2`
  font-size: 0.9rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`;

const List = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing(3)};
`;

const Empty = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.spacing(8)};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export function TipsPage() {
  const { matches, loading } = useMatches();
  const { bets, upsert } = useMyBets();

  const grouped = useMemo(() => {
    if (!matches) return [];
    const map = new Map<string, typeof matches>();
    for (const m of matches) {
      const k = dateKey(m.kickoff);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(m);
    }
    return Array.from(map.entries());
  }, [matches]);

  return (
    <>
      <PageTitle>Tipsa matcher</PageTitle>
      <Lead>
        Gissa slutresultatet i varje match. Du kan ändra ditt tips fram till
        två timmar innan avspark.
      </Lead>
      {loading && <Empty>Hämtar matcher…</Empty>}
      {!loading && grouped.length === 0 && (
        <Empty>
          Inga matcher inlagda än. Be admin importera schemat på Admin-sidan.
        </Empty>
      )}
      {grouped.map(([day, dayMatches]) => (
        <DayGroup key={day}>
          <DayHeader>{formatDateHeader(dayMatches[0].kickoff)}</DayHeader>
          <List>
            {dayMatches.map((m) => (
              <MatchCard key={m.id} match={m} bet={bets[m.id]} onSave={upsert} />
            ))}
          </List>
        </DayGroup>
      ))}
    </>
  );
}
