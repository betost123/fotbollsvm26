import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { useMatches } from '../hooks/useMatches';
import { useMyBets } from '../hooks/useMyBets';
import { MatchCard } from '../components/MatchCard';
import { dateKey, formatDateHeader } from '../lib/time';
import type { Match } from '../lib/database.types';

const PageTitle = styled.h1`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const Lead = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0 0 ${({ theme }) => theme.spacing(5)} 0;
`;

const Tabs = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(6)};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Tab = styled.button<{ $active: boolean }>`
  background: transparent;
  border: none;
  padding: ${({ theme }) => `${theme.spacing(3)} ${theme.spacing(4)}`};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.textMuted)};
  border-bottom: 2px solid ${({ theme, $active }) => ($active ? theme.colors.primary : 'transparent')};
  margin-bottom: -1px;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const Count = styled.span<{ $active: boolean }>`
  font-size: 0.75rem;
  background: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.surfaceAlt)};
  color: ${({ theme, $active }) => ($active ? 'white' : theme.colors.textMuted)};
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.radii.pill};
  font-weight: 700;
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

type TabKey = 'group' | 'knockout';

function groupByDay(matches: Match[]): Array<[string, Match[]]> {
  const map = new Map<string, Match[]>();
  for (const m of matches) {
    const k = dateKey(m.kickoff);
    if (!map.has(k)) map.set(k, []);
    map.get(k)!.push(m);
  }
  return Array.from(map.entries());
}

export function TipsPage() {
  const { matches, loading } = useMatches();
  const { bets, upsert } = useMyBets();
  const [tab, setTab] = useState<TabKey>('group');

  const { groupMatches, knockoutMatches } = useMemo(() => {
    const all = matches ?? [];
    return {
      groupMatches: all.filter((m) => m.stage === 'group'),
      knockoutMatches: all.filter((m) => m.stage !== 'group'),
    };
  }, [matches]);

  const visible = tab === 'group' ? groupMatches : knockoutMatches;
  const grouped = useMemo(() => groupByDay(visible), [visible]);

  return (
    <>
      <PageTitle>Tipsa matcher</PageTitle>
      <Lead>
        Gissa slutresultatet i varje match. Du kan ändra ditt tips fram till
        två timmar innan avspark.
      </Lead>

      <Tabs role="tablist">
        <Tab
          role="tab"
          aria-selected={tab === 'group'}
          $active={tab === 'group'}
          onClick={() => setTab('group')}
        >
          Tippa gruppspel
          <Count $active={tab === 'group'}>{groupMatches.length}</Count>
        </Tab>
        <Tab
          role="tab"
          aria-selected={tab === 'knockout'}
          $active={tab === 'knockout'}
          onClick={() => setTab('knockout')}
        >
          Tippa slutspel
          <Count $active={tab === 'knockout'}>{knockoutMatches.length}</Count>
        </Tab>
      </Tabs>

      {loading && <Empty>Hämtar matcher…</Empty>}

      {!loading && grouped.length === 0 && tab === 'group' && (
        <Empty>
          Inga gruppspelsmatcher inlagda än. Be admin importera schemat på
          Admin-sidan.
        </Empty>
      )}

      {!loading && grouped.length === 0 && tab === 'knockout' && (
        <Empty>
          Slutspelsmatcher dyker upp här när gruppspelet är klart och lagen är lottade.
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
