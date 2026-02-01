import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  authApi,
  setToken,
  clearToken,
  type AuthUser,
} from '@/app/shared/api/client';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUserPoints: (points: number) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    if (!sessionStorage.getItem('token')) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const { user: u, game } = await authApi.me();
      setUser(u);
      if (game && u.points !== game.points) {
        setUser((prev) => (prev ? { ...prev, points: game.points, level: game.level } : null));
      }
    } catch {
      clearToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { token, user: u } = await authApi.login(email, password);
      setToken(token);
      setUser(u);
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la connexion';
      return { success: false, error: message };
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { token, user: u } = await authApi.signup(email, password, name);
      setToken(token);
      setUser(u);
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de l\'inscription';
      return { success: false, error: message };
    }
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  const updateUserPoints = (points: number) => {
    if (user) {
      setUser({
        ...user,
        points,
        level: Math.floor(points / 100) + 1,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        signup,
        logout,
        updateUserPoints,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
