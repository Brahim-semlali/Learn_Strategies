import { useEffect, useState } from 'react';
import { Trophy, Medal, Award, Crown, TrendingUp } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/shared/components/ui/card';
import { Avatar, AvatarFallback } from '@/app/shared/components/ui/avatar';
import { rankingsApi, type LeaderboardUser } from '@/app/shared/api/client';

export const RankingsPage = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    rankingsApi
      .get()
      .then((res) => {
        if (!cancelled) {
          setLeaderboard(res.leaderboard);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setLeaderboard([]);
          setError(err instanceof Error ? err.message : 'Erreur lors du chargement du classement');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-orange-500" />;
    return <span className="text-gray-500 font-bold">#{rank}</span>;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300';
    if (rank === 2) return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300';
    if (rank === 3) return 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-300';
    return 'bg-white border-gray-200';
  };

  const userRank = leaderboard.findIndex(u => u.id === user?.id) + 1;

  if (loading) {
    return (
      <div className="min-h-screen page-bg flex items-center justify-center">
        <div className="text-center text-gray-600">
          <Trophy className="w-12 h-12 mx-auto mb-4 animate-pulse" />
          <p>Chargement du classement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen page-bg flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Erreur</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-bg">
      {/* Hero header gamifié */}
      <div className="hero-gradient text-white py-8 mb-8 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-xl">
              <Trophy className="w-8 h-8 text-orange-200 drop-shadow-lg" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight drop-shadow-md">Classement</h1>
              <p className="text-white/90 text-sm mt-1 font-medium">Découvrez les meilleurs joueurs</p>
            </div>
          </div>
          {user && (
            <div className="mt-4 text-center">
              <div className="inline-block bg-white/25 backdrop-blur-md px-5 py-3 rounded-2xl shadow-lg border border-white/20">
                <div className="text-xl font-bold">Level {user.level}</div>
                <div className="text-sm text-white/90 font-medium">{user.points} XP</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">

        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              {/* 2nd Place */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center"
              >
                <div className="relative mb-2">
                  <Avatar className="w-20 h-20 border-4 border-gray-300">
                    <AvatarFallback className="bg-gray-200 text-gray-700 text-xl">
                      {leaderboard[1].name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-2 -right-2">
                    <Medal className="w-6 h-6 text-gray-400" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-700">{leaderboard[1].name}</div>
                  <div className="text-sm text-gray-600">{leaderboard[1].points} pts</div>
                </div>
              </motion.div>

              {/* 1st Place */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col items-center -mt-4"
              >
                <div className="relative mb-2">
                  <Avatar className="w-24 h-24 border-4 border-yellow-400">
                    <AvatarFallback className="bg-yellow-100 text-yellow-700 text-2xl">
                      {leaderboard[0].name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-2 -right-2">
                    <Crown className="w-8 h-8 text-yellow-500" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-yellow-700">{leaderboard[0].name}</div>
                  <div className="text-sm text-yellow-600 font-semibold">{leaderboard[0].points} pts</div>
                </div>
              </motion.div>

              {/* 3rd Place */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col items-center"
              >
                <div className="relative mb-2">
                  <Avatar className="w-20 h-20 border-4 border-orange-300">
                    <AvatarFallback className="bg-orange-100 text-orange-700 text-xl">
                      {leaderboard[2].name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-2 -right-2">
                    <Award className="w-6 h-6 text-orange-500" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-orange-700">{leaderboard[2].name}</div>
                  <div className="text-sm text-orange-600">{leaderboard[2].points} pts</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* User's Rank Card */}
        {user && userRank > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-teal-50 to-orange-50/80 border-teal-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-teal-600" />
                  Votre classement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-bold text-teal-600">#{userRank}</div>
                    <div>
                      <div className="font-semibold text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-600">Niveau {user.level}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-teal-600">{user.points}</div>
                    <div className="text-sm text-gray-600">points</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Full Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Classement complet</CardTitle>
              <CardDescription>Top 100 des meilleurs joueurs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {leaderboard.map((player, index) => {
                  const rank = index + 1;
                  const isCurrentUser = player.id === user?.id;

                  return (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.02 }}
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                        getRankColor(rank)
                      } ${isCurrentUser ? 'ring-2 ring-teal-500' : ''}`}
                    >
                      <div className="flex items-center justify-center w-12">
                        {getRankIcon(rank)}
                      </div>
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-teal-100 text-teal-700">
                          {player.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className={`font-semibold ${isCurrentUser ? 'text-teal-700' : 'text-gray-900'}`}>
                          {player.name}
                          {isCurrentUser && <span className="ml-2 text-xs">(Vous)</span>}
                        </div>
                        <div className="text-sm text-gray-600">Niveau {player.level}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">{player.points}</div>
                        <div className="text-xs text-gray-600">points</div>
                      </div>
                    </motion.div>
                  );
                })}

                {leaderboard.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun joueur dans le classement pour le moment</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
