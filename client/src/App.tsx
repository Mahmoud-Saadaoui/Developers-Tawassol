import { Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OAuthCallbackPage from './pages/OAuthCallbackPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/oauth/callback" element={<OAuthCallbackPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          {/* <Route path="/ask" element={<AskPage />} /> */}
          {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
        </Route>
      </Route>
    </Routes>
  );
}
