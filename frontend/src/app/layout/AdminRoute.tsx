import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/app/context/AuthContext';
import { Layout } from './Layout';

interface AdminRouteProps {
  children: ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center page-bg">
        <div className="text-gray-600 font-medium">Chargement…</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Layout>{children}</Layout>;
};
