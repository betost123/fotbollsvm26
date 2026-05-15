import styled from 'styled-components';

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
  padding: ${({ theme }) => theme.spacing(6)};
  margin-bottom: ${({ theme }) => theme.spacing(5)};
`;

const H2 = styled.h2`
  font-size: 1.15rem;
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: ${({ theme }) => `${theme.spacing(2)} 0`};

  th, td {
    text-align: left;
    padding: ${({ theme }) => `${theme.spacing(2)} ${theme.spacing(3)}`};
  }
  thead {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
  }
  tbody tr:nth-child(even) {
    background: ${({ theme }) => theme.colors.surfaceAlt};
  }
`;

const Pts = styled.span`
  display: inline-block;
  min-width: 32px;
  text-align: center;
  background: ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.radii.pill};
  padding: ${({ theme }) => `2px ${theme.spacing(2)}`};
  font-weight: 700;
`;

const Example = styled.div`
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.spacing(4)};
  margin-top: ${({ theme }) => theme.spacing(4)};
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.text};
`;

export function RulesPage() {
  return (
    <>
      <PageTitle>Regler</PageTitle>
      <Lead>Så fungerar poängen i Fotbolls-VM 2026.</Lead>

      <Section>
        <H2>Poängtrappa: Fotboll</H2>
        <p>
          Avgör hur många poäng du får för ett tips med <strong>rätt tecken (1X2)</strong>{' '}
          men inte helt rätt resultat. Den sammanlagda resultatdiffen ger din <em>poäng</em>.
        </p>
        <Table>
          <thead>
            <tr>
              <th>Resultatdiff</th>
              <th>Poäng</th>
              <th>Förklaring</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>0 – 0</td><td><Pts>10</Pts></td><td>Exakt resultat ger <strong>10 poäng</strong></td></tr>
            <tr><td>1 – 1</td><td><Pts>6</Pts></td><td>En resultatdiff på <strong>1</strong> ger <strong>6 poäng</strong></td></tr>
            <tr><td>2 – 2</td><td><Pts>4</Pts></td><td>En resultatdiff på <strong>2</strong> ger <strong>4 poäng</strong></td></tr>
            <tr><td>3 – 3</td><td><Pts>3</Pts></td><td>En resultatdiff på <strong>3</strong> ger <strong>3 poäng</strong></td></tr>
            <tr><td>4 – 4</td><td><Pts>2</Pts></td><td>En resultatdiff på <strong>4</strong> ger <strong>2 poäng</strong></td></tr>
            <tr><td>5+</td><td><Pts>1</Pts></td><td>En resultatdiff på <strong>5 eller mer</strong> ger <strong>1 poäng</strong></td></tr>
          </tbody>
        </Table>
        <p style={{ marginTop: 16 }}>
          Har du <strong>fel 1X2-tecken</strong> får du <strong>0 poäng</strong>.
        </p>
        <Example>
          <strong>Exempel:</strong> Resultatet i en match blir 2–1, du har tippat 4–2.
          Rätt vinnare men inte helt rätt resultat. Då får du diffen mellan 2 &amp; 4 +
          diffen mellan 1 &amp; 2 = 2 + 1 = <strong>3 i resultatdiff</strong>. I poängtrappan
          ger det <strong>3 poäng</strong>.
        </Example>
      </Section>

      <Section>
        <H2>Tipsa &amp; deadlines</H2>
        <ul>
          <li>Du kan ändra ditt tips fram till <strong>två timmar innan avspark</strong>.</li>
          <li>Efter deadline låses matchen och tipset kan inte längre ändras.</li>
          <li>Glömmer du tippa en match får du <strong>0 poäng</strong> för den.</li>
          <li>Slutspelsmatcher öppnas för tipsning när lagen är klara (efter gruppspelet, åttondelar osv.).</li>
        </ul>
      </Section>
    </>
  );
}
