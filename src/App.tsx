import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { GlobalStyle } from './styles/GlobalStyle';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { LoginPage } from './auth/LoginPage';
import { Layout } from './components/Layout';
import { TipsPage } from './pages/TipsPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { RulesPage } from './pages/RulesPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';

function Gate() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <LoginPage />;
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/tipsa" replace />} />
        <Route path="/tipsa" element={<TipsPage />} />
        <Route path="/tabell" element={<LeaderboardPage />} />
        <Route path="/regler" element={<RulesPage />} />
        <Route path="/profil" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/tipsa" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter>
        <AuthProvider>
          <Gate />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
