import { lazy, Suspense } from 'react';
import { Spin } from 'antd';
import { Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Routes are code-split so the initial bundle only ships the app shell.
// Each page is loaded on demand (see plan §16.4 — performance).
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const OAuthCallbackPage = lazy(() => import('./pages/OAuthCallbackPage'));
const AskPage = lazy(() => import('./pages/AskPage'));
const QuestionDetailPage = lazy(() => import('./pages/QuestionDetailPage'));
const TagsPage = lazy(() => import('./pages/TagsPage'));
const TagDetailPage = lazy(() => import('./pages/TagDetailPage'));
const UsersPage = lazy(() => import('./pages/UsersPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

/** Full-page fallback shown while a lazy route chunk is loading. */
function RouteFallback() {
  return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
}

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
          <Route path="/tags" element={<TagsPage />} />
          <Route path="/tags/:slug" element={<TagDetailPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/:id" element={<ProfilePage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/ask" element={<AskPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>

          <Route path="/questions/:id" element={<QuestionDetailPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
