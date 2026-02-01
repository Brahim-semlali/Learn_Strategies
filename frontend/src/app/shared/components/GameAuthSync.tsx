import { useEffect, useRef } from 'react';
import { useGame } from '@/app/context/GameContext';
import { useAuth } from '@/app/context/AuthContext';

export const GameAuthSync = () => {
  const { points, addPoints } = useGame();
  const { user, updateUserPoints } = useAuth();
  const initialSyncDone = useRef(false);

  // Sync from user to game context when user logs in
  useEffect(() => {
    if (user && !initialSyncDone.current) {
      if (user.points > points) {
        // User has more points in their profile, update game context
        const diff = user.points - points;
        if (diff > 0) {
          addPoints(diff);
        }
      }
      initialSyncDone.current = true;
    } else if (!user) {
      initialSyncDone.current = false;
    }
  }, [user, points, addPoints]);

  // Keep AuthContext user.points in sync with game (server is updated by GameContext syncToServer)
  useEffect(() => {
    if (user && initialSyncDone.current && user.points !== points) {
      updateUserPoints(points);
    }
  }, [points, user, updateUserPoints]);

  return null;
};
