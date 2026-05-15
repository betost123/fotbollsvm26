import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { NavBar } from './NavBar';

const Main = styled.main`
  max-width: 900px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing(6)} ${({ theme }) => theme.spacing(5)};
`;

export function Layout() {
  return (
    <>
      <NavBar />
      <Main>
        <Outlet />
      </Main>
    </>
  );
}
