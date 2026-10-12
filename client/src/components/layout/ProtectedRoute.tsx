import { Navigate, Outlet } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading)
    return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}
