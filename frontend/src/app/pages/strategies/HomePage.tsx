import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Target, Brain, TrendingUp, Award, User, Search } from 'lucide-react';
import { useGame } from '@/app/context/GameContext';
import { motion } from 'framer-motion';
import { Input } from '@/app/shared/components/ui/input';
import { coursesApi, type Course } from '@/app/shared/api/client';

const iconBySlug: Record<string, typeof Target> = {
  vrio: Target,
  swot: TrendingUp,
  coreCompetence: Brain,
};

export const HomePage = () => {
  const navigate = useNavigate();
  const { points, level, progress, badges } = useGame();
  const [search, setSearch] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    coursesApi
      .list()
      .then(setCourses)
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  const unlockedBadges = badges.filter((b) => b.unlocked).length;

  const filteredCourses = courses.filter(
    (s) =>
      s.title.toLowerCase().includes(search.trim().toLowerCase()) ||
      s.description.toLowerCase().includes(search.trim().toLowerCase())
  );

  const progressValue = (slug: string) => progress[slug] ?? 0;

  if (loading) {
    return (
      <div className="min-h-screen page-bg flex items-center justify-center">
        <div className="text-gray-600 font-medium">Chargement des cours…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-bg">
      <header className="hero-gradient text-white py-8 mb-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-xl">
                <Target className="w-8 h-8 text-orange-200 drop-shadow-lg" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight drop-shadow-md">
                  Learn
                </h1>
                <p className="text-white/90 text-sm mt-1 font-medium">Maîtrisez les stratégies d&apos;entreprise en jouant</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-3 px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/30 transition-all"
              >
                <User className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-sm font-semibold">Niveau {level}</div>
                  <div className="text-xs opacity-90">{points} XP</div>
                </div>
              </button>
              <div className="bg-white/25 backdrop-blur-md px-5 py-3 rounded-2xl shadow-lg border border-white/20">
                <div className="text-xl font-bold">Level {level}</div>
                <div className="text-sm text-white/90 font-medium">{points} XP</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="bg-white/95 backdrop-blur border-2 border-orange-200/80 rounded-2xl p-6 shadow-xl card-glow"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl shadow-md">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">{points}</div>
                <div className="text-sm text-gray-600 font-medium">Points totaux</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-teal-100 rounded-lg">
                <Award className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <div className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-orange-600 bg-clip-text text-transparent">{unlockedBadges}</div>
                <div className="text-sm text-gray-600 font-medium">Badges débloqués</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -4 }}
            className="bg-white/95 backdrop-blur border-2 border-teal-200/80 rounded-2xl p-6 shadow-xl card-glow"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl shadow-md">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  {courses.length
                    ? `${Math.round(
                        courses.reduce((acc, c) => acc + (progressValue(c.slug) ?? 0), 0) / courses.length
                      )}%`
                    : '0%'}
                </div>
                <div className="text-sm text-gray-600 font-medium">Progression moyenne</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-orange-600 bg-clip-text text-transparent mb-6 flex items-center gap-3">
          <span className="p-2 bg-teal-100 rounded-xl">
            <Target className="w-6 h-6 text-teal-600" />
          </span>
          Choisissez votre stratégie
        </h2>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Rechercher un cours (VRIO, SWOT, Core Competence…)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 pr-4 h-12 rounded-xl border-2 border-gray-200 bg-white shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-base"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredCourses.length === 0 ? (
            <div className="col-span-full py-12 text-center rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">
                {courses.length === 0 ? 'Aucun cours pour le moment.' : `Aucun cours trouvé pour « ${search} »`}
              </p>
              <p className="text-gray-500 text-sm mt-1">Les cours sont gérés par l&apos;administrateur.</p>
            </div>
          ) : (
            filteredCourses.map((course, index) => {
              const Icon = iconBySlug[course.slug] || Target;
              const color = course.color || 'from-teal-500 to-teal-600';
              const progressVal = progressValue(course.slug);

              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="cursor-pointer"
                  onClick={() => navigate(`/learn/${course.slug}`)}
                >
                  <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden transition-all duration-300 h-full hover:border-gray-300">
                    <div className={`h-32 bg-gradient-to-br ${color} flex items-center justify-center relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/10" />
                      <Icon className="w-16 h-16 text-white drop-shadow-lg relative z-10" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{course.description}</p>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Progression</span>
                          <span className="font-semibold text-gray-900">{progressVal}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressVal}%` }}
                            transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                            className={`h-2 rounded-full bg-gradient-to-r ${color}`}
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/learn/${course.slug}`);
                          }}
                          className={`flex-1 py-2 px-4 bg-gradient-to-r ${color} text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-semibold`}
                        >
                          Apprendre
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/quiz/${course.slug}`);
                          }}
                          className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold"
                        >
                          Quiz
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
