import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../auth/AuthContext';

const Bar = styled.nav`
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => `${theme.spacing(3)} ${theme.spacing(5)}`};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  position: sticky;
  top: 0;
  z-index: 10;
`;

const Brand = styled.div`
  font-weight: 800;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-right: auto;
`;

const Link = styled(NavLink)`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.textMuted};
  padding: ${({ theme }) => `${theme.spacing(2)} ${theme.spacing(3)}`};
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 500;
  font-size: 0.95rem;
  &.active {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.surfaceAlt};
  }
  &:hover { color: ${({ theme }) => theme.colors.primary}; }
`;

export function NavBar() {
  const { profile } = useAuth();
  return (
    <Bar>
      <Brand>VM 2026</Brand>
      <Link to="/tipsa">Tipsa</Link>
      <Link to="/tabell">Tabell</Link>
      <Link to="/regler">Regler</Link>
      <Link to="/profil">Profil</Link>
      {profile?.is_admin && <Link to="/admin">Admin</Link>}
    </Bar>
  );
}
