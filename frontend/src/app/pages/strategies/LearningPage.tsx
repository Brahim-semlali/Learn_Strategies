import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, CheckCircle2, PlayCircle, Trophy } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/app/context/GameContext';
import confetti from 'canvas-confetti';
import { ImageWithFallback } from '@/app/shared/components/figma/ImageWithFallback';
import { coursesApi, progressApi, type Course, type CourseSection } from '@/app/shared/api/client';

export const LearningPage = () => {
  const { strategy } = useParams<{ strategy: string }>();
  const navigate = useNavigate();
  const { addPoints, updateProgress, unlockBadge } = useGame();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<number[]>([]);

  useEffect(() => {
    if (!strategy) return;
    coursesApi
      .getBySlug(strategy)
      .then((c) => {
        setCourse(c);
      })
      .catch(() => setCourse(null))
      .finally(() => setLoading(false));
  }, [strategy]);

  useEffect(() => {
    if (!strategy || !course) return;
    progressApi
      .get(course.id)
      .then((data) => {
        const payload = data as { completedSections?: number[] };
        if (payload && Array.isArray(payload.completedSections)) {
          setCompletedSections(payload.completedSections);
        }
      })
      .catch(() => {});
  }, [strategy, course?.id]);

  const saveProgress = async (newCompleted: number[]) => {
    if (!course) return;
    const progressPercent = course.sections.length
      ? Math.round((newCompleted.length / course.sections.length) * 100)
      : 0;
    try {
      await progressApi.patch(course.id, newCompleted, progressPercent);
    } catch (_) {}
  };

  if (loading || !strategy) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 font-medium">Chargement…</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 font-medium">Cours introuvable.</div>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-teal-600 hover:underline"
        >
          Retour à l&apos;accueil
        </button>
      </div>
    );
  }

  const content = course;
  const sections = content.sections || [];
  const hasVideoStrategy =
    strategy === 'swot' || strategy === 'vrio' || strategy === 'coreCompetence';
  const strategyVideos: Record<string, { id: string; title: string }[]> = {
    swot: [
      { id: 'C1vF-sZFqMQ', title: 'How to do a SWOT analysis' },
      { id: '46cSJ81C0SQ', title: 'SWOT Analysis: What it is and how to use it' },
      { id: '5EHhSMjqd0I', title: 'How to conduct a SWOT for your business' },
      { id: 'EJ4uVsSqQ9k', title: 'How to Use SWOT Analysis' },
    ],
    vrio: [
      { id: 'afrPC91zCkQ', title: 'Internal Analysis: The VRIO Framework' },
      { id: '9vPvxEKnNM4', title: 'How the VRIO framework helps uncover your competitive edge' },
      { id: 'dxwJM9HlUIc', title: 'VRIO Analysis tutorial' },
    ],
    coreCompetence: [
      { id: 'M9Rot4AWOWY', title: 'Core Competencies explained' },
    ],
  };
  const playlist = hasVideoStrategy ? strategyVideos[strategy] ?? [] : [];
  const playlistSize = hasVideoStrategy && sections.length ? Math.min(playlist.length, sections.length) : 0;

  const handleCompleteSection = (index: number) => {
    if (completedSections.includes(index)) return;
    const newCompleted = [...completedSections, index];
    setCompletedSections(newCompleted);
    const section = sections[index];
    const points = section?.points ?? 10;
    addPoints(points);
    const progressPct = sections.length ? (newCompleted.length / sections.length) * 100 : 0;
    updateProgress(strategy, progressPct);
    saveProgress(newCompleted);
    if (newCompleted.length === 1) unlockBadge('first-steps');
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    if (hasVideoStrategy && index < playlistSize - 1) {
      setCurrentSection(index + 1);
    }
  };

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      navigate(`/quiz/${strategy}`);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) setCurrentSection(currentSection - 1);
  };

  const isCompleted = completedSections.includes(currentSection);
  const allCompleted = completedSections.length === sections.length;
  const currentSectionData = sections[currentSection];

  if (!currentSectionData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Aucune section dans ce cours.</p>
        <button onClick={() => navigate('/')} className="mt-4 text-teal-600 hover:underline">
          Retour
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 p-1.5 -m-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors shrink-0"
                aria-label="StrategyLearn - Accueil"
              >
                <div className="p-1.5 bg-gradient-to-br from-teal-500 via-cyan-500 to-orange-500 rounded-lg shadow-md shrink-0">
                  <Trophy className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-sm bg-gradient-to-r from-teal-600 via-cyan-600 to-orange-600 bg-clip-text text-transparent whitespace-nowrap hidden sm:inline">
                  StrategyLearn
                </span>
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 shrink-0 py-1"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <BookOpen className="w-5 h-5 text-teal-600 shrink-0" />
              <span className="font-semibold text-gray-900 truncate">{content.title}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-2 mb-8">
          {sections.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSection(index)}
              className={`flex-1 h-2 rounded-full transition-all ${
                completedSections.includes(index)
                  ? 'bg-teal-500'
                  : index === currentSection
                  ? 'bg-orange-500'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-6"
          >
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">
                {currentSectionData.title}
              </h2>
              {isCompleted && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="w-6 h-6" />
                  <span className="text-sm font-semibold">Terminé</span>
                </div>
              )}
            </div>

            {currentSectionData.videoId ? (
              <div className="mb-6 relative w-full pb-[56.25%] rounded-xl overflow-hidden shadow-lg bg-black">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${currentSectionData.videoId}?rel=0&modestbranding=1&controls=1`}
                  title={currentSectionData.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : hasVideoStrategy && currentSection < playlistSize && playlist[currentSection] ? (
              <div className="mb-6 relative w-full pb-[56.25%] rounded-xl overflow-hidden shadow-lg bg-black">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${playlist[currentSection].id}?rel=0&modestbranding=1&controls=1`}
                  title={playlist[currentSection].title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              currentSectionData.image && (
                <div className="mb-6 rounded-xl overflow-hidden shadow-lg">
                  <ImageWithFallback
                    src={currentSectionData.image}
                    alt={currentSectionData.title}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )
            )}

            <div className="prose max-w-none mb-8">
              <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                {currentSectionData.content}
              </p>
            </div>

            {!isCompleted && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCompleteSection(currentSection)}
                className="w-full py-4 px-6 bg-gradient-to-r from-teal-500 to-orange-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Marquer comme terminé (+{(currentSectionData as CourseSection).points ?? 10} pts)
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentSection === 0}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
              currentSection === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-teal-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg flex items-center justify-center gap-2"
          >
            {currentSection === sections.length - 1 ? (
              <>
                <PlayCircle className="w-5 h-5" />
                Go to Quiz
              </>
            ) : (
              'Next'
            )}
          </button>
        </div>

        {allCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-6 bg-gradient-to-r from-teal-50 to-emerald-50 border-2 border-teal-200 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="font-bold text-green-900">Félicitations !</h3>
                <p className="text-green-700">
                  Vous avez terminé toutes les sections. Passez au quiz pour tester vos connaissances.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
