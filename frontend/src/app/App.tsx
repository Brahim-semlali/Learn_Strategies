import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '@/app/pages/strategies/HomePage';
import { LearningPage } from '@/app/pages/strategies/LearningPage';
import { QuizPage } from '@/app/pages/strategies/QuizPage';
import { ProfilePage } from '@/app/pages/profile/ProfilePage';
import { LoginPage } from '@/app/pages/auth/LoginPage';
import { SignupPage } from '@/app/pages/auth/SignupPage';
import { DashboardPage } from '@/app/pages/dashboard/DashboardPage';
import { RankingsPage } from '@/app/pages/rankings/RankingsPage';
import { CertificatesPage } from '@/app/pages/certificates/CertificatesPage';
import { SettingsPage } from '@/app/pages/settings/SettingsPage';
import { AdminPage } from '@/app/pages/admin/AdminPage';
import { ProtectedRoute } from '@/app/layout/ProtectedRoute';
import { AdminRoute } from '@/app/layout/AdminRoute';
import { GameProvider } from '@/app/context/GameContext';
import { AuthProvider, useAuth } from '@/app/context/AuthContext';

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const RootRedirect = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <SignupPage />
                </PublicRoute>
              }
            />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rankings"
              element={
                <ProtectedRoute>
                  <RankingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/learn/:strategy"
              element={
                <ProtectedRoute>
                  <LearningPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz/:strategy"
              element={
                <ProtectedRoute>
                  <QuizPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/certificates"
              element={
                <ProtectedRoute>
                  <CertificatesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              }
            />

            {/* Default redirect */}
            <Route path="*" element={<RootRedirect />} />
          </Routes>
        </Router>
      </GameProvider>
    </AuthProvider>
  );
}
