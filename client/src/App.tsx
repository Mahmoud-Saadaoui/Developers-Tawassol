import { Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OAuthCallbackPage from './pages/OAuthCallbackPage';
import AskPage from './pages/AskPage';
import QuestionDetailPage from './pages/QuestionDetailPage';
import TagsPage from './pages/TagsPage';
import TagDetailPage from './pages/TagDetailPage';
import UsersPage from './pages/UsersPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  return (
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
  );
}
