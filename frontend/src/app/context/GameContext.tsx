import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { gameApi, type GameState } from '@/app/shared/api/client';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

interface StrategyProgress {
  vrio: number;
  swot: number;
  coreCompetence: number;
  [key: string]: number;
}

interface GameContextType {
  points: number;
  level: number;
  badges: Badge[];
  progress: StrategyProgress;
  addPoints: (amount: number) => void;
  unlockBadge: (badgeId: string) => void;
  updateProgress: (strategy: string, value: number) => void;
  streak: number;
  incrementStreak: () => void;
  resetStreak: () => void;
  loading: boolean;
  syncToServer: (payload: Partial<GameState>) => Promise<void>;
}

const defaultBadges: Badge[] = [
  { id: 'first-steps', name: 'Premiers Pas', description: 'Complétez votre première leçon', icon: '🎯', unlocked: false },
  { id: 'quiz-master', name: 'Maître du Quiz', description: 'Réussissez 10 quiz', icon: '🏆', unlocked: false },
  { id: 'perfectionist', name: 'Perfectionniste', description: 'Obtenez un score parfait', icon: '⭐', unlocked: false },
  { id: 'strategist', name: 'Stratège', description: 'Maîtrisez les 3 stratégies', icon: '🎓', unlocked: false },
  { id: 'streak-5', name: 'Série de 5', description: '5 jours consécutifs', icon: '🔥', unlocked: false },
  { id: 'streak-7', name: 'Semaine Parfaite', description: "7 jours consécutifs d'activité", icon: '🌟', unlocked: false },
  { id: 'streak-10', name: 'Série de 10', description: '10 jours consécutifs', icon: '💫', unlocked: false },
];

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [lastActiveDate, setLastActiveDate] = useState<string | undefined>();
  const [progress, setProgress] = useState<StrategyProgress>({ vrio: 0, swot: 0, coreCompetence: 0 });
  const [badges, setBadges] = useState<Badge[]>(defaultBadges);
  const [loading, setLoading] = useState(true);

  const fetchGame = useCallback(async () => {
    if (!isAuthenticated) {
      setPoints(0);
      setLevel(1);
      setStreak(0);
      setLastActiveDate(undefined);
      setProgress({ vrio: 0, swot: 0, coreCompetence: 0 });
      setBadges(defaultBadges.map((b) => ({ ...b, unlocked: false })));
      setLoading(false);
      return;
    }
    try {
      const data = await gameApi.get();
      setPoints(data.points);
      setLevel(data.level);
      setStreak(data.streak);
      setLastActiveDate(data.lastActiveDate);
      setBadges(Array.isArray(data.badges) ? data.badges : defaultBadges);
      setProgress((data.progress as StrategyProgress) || { vrio: 0, swot: 0, coreCompetence: 0 });
    } catch {
      setPoints(0);
      setLevel(1);
      setStreak(0);
      setLastActiveDate(undefined);
      setBadges(defaultBadges.map((b) => ({ ...b, unlocked: false })));
      setProgress({ vrio: 0, swot: 0, coreCompetence: 0 });
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchGame();
  }, [fetchGame]);

  const syncToServer = useCallback(
    async (payload: Partial<GameState>) => {
      if (!isAuthenticated) return;
      try {
        const data = await gameApi.patch(payload);
        setPoints(data.points);
        setLevel(data.level);
        setStreak(data.streak);
        if (data.badges) setBadges(data.badges);
        if (data.progress) setProgress(data.progress as StrategyProgress);
      } catch (_) {}
    },
    [isAuthenticated]
  );

  const addPoints = (amount: number) => {
    setPoints((prev) => {
      const next = prev + amount;
      const newLevel = Math.floor(next / 100) + 1;
      setLevel(newLevel);
      syncToServer({ points: next, level: newLevel });
      return next;
    });
  };

  const unlockBadge = (badgeId: string) => {
    setBadges((prev) => {
      const next = prev.map((b) => (b.id === badgeId ? { ...b, unlocked: true } : b));
      syncToServer({ badges: next });
      return next;
    });
  };

  const updateProgress = (strategy: string, value: number) => {
    setProgress((prev) => {
      const next = { ...prev, [strategy]: Math.min(100, Math.max(0, value)) };
      syncToServer({ progress: next });
      return next;
    });
  };

  const getTodayString = () => new Date().toISOString().split('T')[0];

  const incrementStreak = () => {
    const today = getTodayString();
    if (lastActiveDate === today) return;
    let newStreak = 1;
    if (lastActiveDate) {
      const last = new Date(lastActiveDate);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) newStreak = streak + 1;
      else if (diffDays > 1) newStreak = 1;
      else return;
    }
    setLastActiveDate(today);
    setStreak(newStreak);
    if (newStreak === 5) unlockBadge('streak-5');
    if (newStreak === 7) {
      unlockBadge('streak-7');
      addPoints(100);
    }
    if (newStreak === 10) unlockBadge('streak-10');
    syncToServer({ streak: newStreak, lastActiveDate: today });
  };

  const resetStreak = () => {
    setStreak(0);
    syncToServer({ streak: 0, lastActiveDate: undefined });
  };

  return (
    <GameContext.Provider
      value={{
        points,
        level,
        badges,
        progress,
        addPoints,
        unlockBadge,
        updateProgress,
        streak,
        incrementStreak,
        resetStreak,
        loading,
        syncToServer,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};
