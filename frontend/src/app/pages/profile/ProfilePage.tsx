import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Award, TrendingUp, Target, Flame } from 'lucide-react';
import { useGame } from '@/app/context/GameContext';
import { motion } from 'framer-motion';
import * as Progress from '@radix-ui/react-progress';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { points, level, badges, progress, streak } = useGame();

  const unlockedBadges = badges.filter(b => b.unlocked);
  const lockedBadges = badges.filter(b => !b.unlocked);
  const totalProgress = Math.round((progress.vrio + progress.swot + progress.coreCompetence) / 3);

  const levelProgress = (points % 100);

  return (
    <div className="min-h-screen pb-20 page-bg">
      {/* Hero header gamifié */}
      <header className="hero-gradient text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>

          <div className="text-center py-8">
            <div className="inline-block p-5 bg-white/20 backdrop-blur-md rounded-2xl mb-4 shadow-xl">
              <Trophy className="w-16 h-16 text-orange-200 drop-shadow-lg" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 drop-shadow-md tracking-tight">Mon Profil</h1>
            <p className="text-white/90 text-lg font-medium">Suivez votre progression et vos réussites</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-teal-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{level}</div>
                <div className="text-sm text-gray-600">Niveau</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progression</span>
                <span className="font-semibold text-gray-900">{levelProgress}/100</span>
              </div>
              <Progress.Root
                className="relative overflow-hidden bg-gray-200 rounded-full w-full h-2"
                value={levelProgress}
              >
                <Progress.Indicator
                  className="bg-gradient-to-r from-teal-500 to-orange-500 w-full h-full transition-transform duration-300 ease-out"
                  style={{ transform: `translateX(-${100 - levelProgress}%)` }}
                />
              </Progress.Root>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{points}</div>
                <div className="text-sm text-gray-600">Points totaux</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Flame className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{streak}</div>
                <div className="text-sm text-gray-600">Jours de série</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Progress by Strategy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-teal-600" />
            <h2 className="text-2xl font-bold text-gray-900">Progression par Stratégie</h2>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-900">VRIO</span>
                <span className="text-gray-600">{progress.vrio}%</span>
              </div>
              <Progress.Root
                className="relative overflow-hidden bg-gray-200 rounded-full w-full h-3"
                value={progress.vrio}
              >
                <Progress.Indicator
                  className="bg-gradient-to-r from-blue-500 to-blue-600 w-full h-full transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${100 - progress.vrio}%)` }}
                />
              </Progress.Root>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-900">SWOT</span>
                <span className="text-gray-600">{progress.swot}%</span>
              </div>
              <Progress.Root
                className="relative overflow-hidden bg-gray-200 rounded-full w-full h-3"
                value={progress.swot}
              >
                <Progress.Indicator
                  className="bg-gradient-to-r from-green-500 to-green-600 w-full h-full transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${100 - progress.swot}%)` }}
                />
              </Progress.Root>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-900">Core Competence</span>
                <span className="text-gray-600">{progress.coreCompetence}%</span>
              </div>
              <Progress.Root
                className="relative overflow-hidden bg-gray-200 rounded-full w-full h-3"
                value={progress.coreCompetence}
              >
                <Progress.Indicator
                  className="bg-gradient-to-r from-red-500 to-red-600 w-full h-full transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${100 - progress.coreCompetence}%)` }}
                />
              </Progress.Root>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900">Progression Totale</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-orange-600 bg-clip-text text-transparent">
                  {totalProgress}%
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-6 h-6 text-teal-600" />
            <h2 className="text-2xl font-bold text-gray-900">Badges</h2>
          </div>

          {unlockedBadges.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Débloqués ({unlockedBadges.length})</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {unlockedBadges.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-teal-50 to-orange-50 border-2 border-teal-200 rounded-xl p-4 text-center"
                  >
                    <div className="text-4xl mb-2">{badge.icon}</div>
                    <div className="font-bold text-gray-900 mb-1">{badge.name}</div>
                    <div className="text-xs text-gray-600">{badge.description}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {lockedBadges.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">À débloquer ({lockedBadges.length})</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {lockedBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 text-center opacity-60"
                  >
                    <div className="text-4xl mb-2 grayscale">{badge.icon}</div>
                    <div className="font-bold text-gray-700 mb-1">{badge.name}</div>
                    <div className="text-xs text-gray-500">{badge.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
