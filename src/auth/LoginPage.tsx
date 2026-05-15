import { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from './AuthContext';

const Wrap = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: ${({ theme }) => theme.spacing(6)};
  background: linear-gradient(160deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.primaryDark} 100%);
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing(8)};
  width: 100%;
  max-width: 420px;
  box-shadow: ${({ theme }) => theme.shadow.md};
`;

const Title = styled.h1`
  font-size: 1.6rem;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const Sub = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0 0 ${({ theme }) => theme.spacing(6)} 0;
`;

const Field = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing(4)};
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Input = styled.input`
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing(1)};
  padding: ${({ theme }) => `${theme.spacing(3)} ${theme.spacing(4)}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 1rem;
  &:focus { outline: 2px solid ${({ theme }) => theme.colors.primary}; outline-offset: 1px; }
`;

const Button = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.spacing(3)};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 600;
  font-size: 1rem;
  &:disabled { opacity: 0.6; cursor: not-allowed; }
  &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.primaryDark}; }
`;

const Msg = styled.p<{ $error?: boolean }>`
  margin-top: ${({ theme }) => theme.spacing(4)};
  color: ${({ theme, $error }) => ($error ? theme.colors.danger : theme.colors.success)};
  font-size: 0.9rem;
`;

export function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ text: string; error: boolean } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const { error } = await signIn(email.trim(), name.trim() || 'Anonym');
    setBusy(false);
    setMsg(
      error
        ? { text: `Något gick fel: ${error}`, error: true }
        : { text: 'Kolla mejlen för en inloggningslänk!', error: false },
    );
  }

  return (
    <Wrap>
      <Card>
        <Title>Fotbolls-VM 2026</Title>
        <Sub>Tippa matcherna. Vinn äran. Logga in med din mejl.</Sub>
        <form onSubmit={submit}>
          <Field>
            Namn
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Hur ska du synas i tabellen?"
              maxLength={40}
              required
            />
          </Field>
          <Field>
            E-post
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="du@exempel.se"
              required
            />
          </Field>
          <Button type="submit" disabled={busy || !email || !name}>
            {busy ? 'Skickar...' : 'Skicka inloggningslänk'}
          </Button>
        </form>
        {msg && <Msg $error={msg.error}>{msg.text}</Msg>}
      </Card>
    </Wrap>
  );
}
