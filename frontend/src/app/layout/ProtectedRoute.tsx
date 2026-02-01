import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/app/context/AuthContext';
import { Layout } from './Layout';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();

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

  return <Layout>{children}</Layout>;
};
