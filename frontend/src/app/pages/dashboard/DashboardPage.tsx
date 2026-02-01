import { useNavigate } from 'react-router-dom';
import { Trophy, Target, Brain, TrendingUp, Award, BarChart3, BookOpen, Calendar, Flame } from 'lucide-react';
import { useGame } from '@/app/context/GameContext';
import { useAuth } from '@/app/context/AuthContext';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/shared/components/ui/card';
import { useEffect } from 'react';

const strategies = [
  {
    id: 'vrio',
    name: 'VRIO',
    description: 'Value, Rarity, Imitability, Organization - Analysez vos ressources stratégiques',
    icon: Target,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'swot',
    name: 'SWOT',
    description: 'Strengths, Weaknesses, Opportunities, Threats - Évaluez votre position stratégique',
    icon: TrendingUp,
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
  },
  {
    id: 'coreCompetence',
    name: 'Core Competence',
    description: 'Identifiez et développez vos compétences clés distinctives',
    icon: Brain,
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-50',
  },
];

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { points, level, progress, badges, streak, incrementStreak } = useGame();
  const { user } = useAuth();

  const unlockedBadges = badges.filter(b => b.unlocked).length;
  const totalProgress = Math.round((progress.vrio + progress.swot + progress.coreCompetence) / 3);

  // Marquer l'utilisateur comme actif au chargement du dashboard
  useEffect(() => {
    incrementStreak();
  }, [incrementStreak]);

  return (
    <div className="min-h-screen page-bg">
      {/* Hero header gamifié */}
      <div className="hero-gradient text-white py-8 mb-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-xl">
                <Trophy className="w-8 h-8 text-orange-200 drop-shadow-lg" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight drop-shadow-md">
                  Bienvenue, {user?.name || 'Utilisateur'} !
                </h1>
                <p className="text-white/90 text-sm mt-1 font-medium">Voici un aperçu de votre progression</p>
              </div>
            </div>
            <div className="text-right bg-white/25 backdrop-blur-md px-5 py-3 rounded-2xl shadow-lg border border-white/20">
              <div className="text-xl font-bold">Niveau {level}</div>
              <div className="text-sm text-white/90 font-medium">{points} XP</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Stats Grid gamifié */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03, y: -4 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="card-glow"
          >
            <Card className="relative overflow-hidden border-2 border-orange-200/80 bg-white/90 backdrop-blur rounded-2xl shadow-xl transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700">Points totaux</CardTitle>
                <div className="p-2 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl shadow-md">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">{points}</div>
                <p className="text-xs text-gray-600 mt-1 font-medium">Niveau {level}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.03, y: -4 }}
            className="card-glow"
          >
            <Card className="relative overflow-hidden border-2 border-teal-200/80 bg-white/90 backdrop-blur rounded-2xl shadow-xl transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700">Progression</CardTitle>
                <div className="p-2 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl shadow-md">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">{totalProgress}%</div>
                <p className="text-xs text-gray-600 mt-1 font-medium">Progression moyenne</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.03, y: -4 }}
            className="card-glow"
          >
            <Card className="relative overflow-hidden border-2 border-orange-200/80 bg-white/90 backdrop-blur rounded-2xl shadow-xl transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700">Badges</CardTitle>
                <div className="p-2 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl shadow-md">
                  <Award className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">{unlockedBadges}</div>
                <p className="text-xs text-gray-600 mt-1 font-medium">Badges débloqués</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.03, y: -4 }}
            className="card-glow"
          >
            <Card className="relative overflow-hidden border-2 border-teal-200/80 bg-white/90 backdrop-blur rounded-2xl shadow-xl transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700">Stratégies</CardTitle>
                <div className="p-2 bg-gradient-to-br from-teal-400 to-cyan-600 rounded-xl shadow-md">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">3</div>
                <p className="text-xs text-gray-600 mt-1 font-medium">Stratégies disponibles</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.03, y: -4 }}
            className="card-glow"
          >
            <Card className="relative overflow-hidden border-2 border-orange-200/80 bg-white/90 backdrop-blur rounded-2xl shadow-xl transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700">Jours actifs</CardTitle>
                <div className="p-2 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl shadow-md">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{streak}</div>
                </div>
                <p className="text-xs text-gray-600 mt-1 font-medium">
                  {streak >= 7 ? '🌟 Semaine parfaite !' : streak >= 5 ? '🔥 Excellent !' : streak >= 3 ? '💪 Continue !' : 'Jour(s) consécutif(s)'}
                </p>
                {streak === 7 && (
                  <p className="text-xs text-green-600 font-semibold mt-1">+100 XP récompense !</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Strategy Cards gamifiées */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-orange-600 bg-clip-text text-transparent mb-6 flex items-center gap-3">
            <span className="p-2 bg-teal-100 rounded-xl">
              <Target className="w-6 h-6 text-teal-600" />
            </span>
            Choisissez votre stratégie
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {strategies.map((strategy, index) => {
              const Icon = strategy.icon;
              const progressValue = progress[strategy.id as keyof typeof progress] || 0;

              return (
                <motion.div
                  key={strategy.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  >
                  <Card className="overflow-hidden border-2 border-gray-200 hover:border-gray-300 bg-white shadow-xl shadow-gray-200/50 transition-all duration-300 cursor-pointer h-full rounded-2xl">
                    <div className={`h-32 bg-gradient-to-br ${strategy.color} flex items-center justify-center`}>
                      <Icon className="w-16 h-16 text-white" />
                    </div>
                    <CardHeader>
                      <CardTitle>{strategy.name}</CardTitle>
                      <CardDescription>{strategy.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Progression</span>
                          <span className="font-semibold text-gray-900">{progressValue}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressValue}%` }}
                            transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                            className={`h-2 rounded-full bg-gradient-to-r ${strategy.color}`}
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/learn/${strategy.id}`)}
                          className={`flex-1 py-2 px-4 bg-gradient-to-r ${strategy.color} text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-semibold`}
                        >
                          Apprendre
                        </button>
                        <button
                          onClick={() => navigate(`/quiz/${strategy.id}`)}
                          className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold"
                        >
                          Quiz
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
