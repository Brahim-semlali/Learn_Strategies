import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, Trophy, RotateCcw, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/app/context/GameContext';
import confetti from 'canvas-confetti';
import { coursesApi, quizzesApi, type Course, type Quiz, type QuizQuestion } from '@/app/shared/api/client';

export const QuizPage = () => {
  const { strategy } = useParams<{ strategy: string }>();
  const navigate = useNavigate();
  const { addPoints, unlockBadge, incrementStreak } = useGame();
  const [course, setCourse] = useState<Course | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showExplanations, setShowExplanations] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    if (!strategy) return;
    setLoading(true);
    setError(null);
    coursesApi
      .getBySlug(strategy)
      .then((c) => {
        setCourse(c);
        return quizzesApi.getByCourseId(c.id);
      })
      .then(setQuiz)
      .catch((e) => {
        setError(e?.message || 'Quiz introuvable');
        setQuiz(null);
      })
      .finally(() => setLoading(false));
  }, [strategy]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 font-medium">Chargement du quiz…</div>
      </div>
    );
  }

  if (error || !quiz || !quiz.questions?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 font-medium">{error || 'Aucune question dans ce quiz.'}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 py-2 px-4 bg-teal-500 text-white rounded-xl hover:bg-teal-600"
          >
            Retour à l&apos;accueil
          </button>
        </div>
      </div>
    );
  }

  const questions = quiz.questions;
  const currentQ = questions[currentQuestion] as QuizQuestion;

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowExplanations(false);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    const isCorrect = selectedAnswer === currentQ.correct;
    setShowResult(true);
    setShowExplanations(true);
    setAnswers([...answers, isCorrect]);
    if (isCorrect) {
      setScore(score + 1);
      addPoints(20);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowExplanations(false);
    } else {
      setQuizCompleted(true);
      const finalScore = ((score + (selectedAnswer === currentQ.correct ? 1 : 0)) / questions.length) * 100;
      if (finalScore === 100) {
        unlockBadge('perfectionist');
        confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
      }
      incrementStreak();
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setShowExplanations(false);
    setScore(0);
    setAnswers([]);
    setQuizCompleted(false);
  };

  const finalScore = quizCompleted ? ((score / questions.length) * 100).toFixed(0) : 0;

  if (quizCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-block p-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6"
            >
              <Trophy className="w-16 h-16 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Quiz Terminé !</h2>
            <div className="text-6xl font-bold bg-gradient-to-r from-teal-600 to-orange-600 bg-clip-text text-transparent mb-4">
              {finalScore}%
            </div>
            <p className="text-lg text-gray-600 mb-8">
              Vous avez répondu correctement à {score} question{score > 1 ? 's' : ''} sur {questions.length}
            </p>
            {parseInt(finalScore, 10) === 100 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl"
              >
                <p className="text-yellow-800 font-semibold">
                  Score parfait ! Vous avez débloqué le badge &quot;Perfectionniste&quot;
                </p>
              </motion.div>
            )}
            <div className="flex gap-4">
              <button
                onClick={handleRestart}
                className="flex-1 py-3 px-6 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Recommencer
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-teal-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Retour à l&apos;accueil
              </button>
            </div>
          </div>
        </motion.div>
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
                <span>Retour</span>
              </button>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <span className="text-sm text-gray-600">
                Question {currentQuestion + 1}/{questions.length}
              </span>
              <div className="flex items-center gap-2 bg-teal-100 px-4 py-2 rounded-full">
                <Trophy className="w-4 h-4 text-teal-600" />
                <span className="font-semibold text-teal-900">{score * 20} pts</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-2 mb-8">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`flex-1 h-2 rounded-full transition-all ${
                index < currentQuestion
                  ? answers[index]
                    ? 'bg-green-500'
                    : 'bg-red-500'
                  : index === currentQuestion
                  ? 'bg-teal-500'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8">{currentQ.question}</h2>

            <div className="space-y-4 mb-8">
              {currentQ.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === currentQ.correct;
                const showCorrect = showResult && isCorrect;
                const showWrong = showResult && isSelected && !isCorrect;

                return (
                  <div key={index}>
                    <motion.button
                      whileHover={{ scale: showResult ? 1 : 1.02 }}
                      whileTap={{ scale: showResult ? 1 : 0.98 }}
                      onClick={() => handleAnswer(index)}
                      disabled={showResult}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        showCorrect
                          ? 'border-green-500 bg-green-50'
                          : showWrong
                          ? 'border-red-500 bg-red-50'
                          : isSelected
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 hover:border-teal-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{option.text}</span>
                        {showCorrect && <CheckCircle2 className="w-6 h-6 text-green-600" />}
                        {showWrong && <XCircle className="w-6 h-6 text-red-600" />}
                      </div>
                    </motion.button>
                    {showExplanations && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className={`mt-2 ml-4 p-3 rounded-lg text-sm ${
                          isCorrect 
                            ? 'bg-green-50 border-l-4 border-green-500 text-green-800' 
                            : 'bg-gray-50 border-l-4 border-gray-300 text-gray-700'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <p>{option.explanation}</p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>

            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl mb-6 ${
                  selectedAnswer === currentQ.correct
                    ? 'bg-green-50 border-2 border-green-200'
                    : 'bg-blue-50 border-2 border-blue-200'
                }`}
              >
                <p
                  className={`font-semibold mb-2 ${
                  selectedAnswer === currentQ.correct ? 'text-green-900' : 'text-blue-900'
                  }`}
                >
                  {selectedAnswer === currentQ.correct ? '✓ Correct !' : 'À retenir'}
                </p>
                <p className="text-gray-700">{currentQ.generalExplanation}</p>
              </motion.div>
            )}

            {!showResult ? (
              <button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className={`w-full py-4 px-6 rounded-xl font-semibold transition-all ${
                  selectedAnswer === null
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-teal-500 to-orange-500 text-white hover:shadow-lg'
                }`}
              >
                Valider
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="w-full py-4 px-6 bg-gradient-to-r from-teal-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                {currentQuestion === questions.length - 1
                  ? 'Voir les résultats'
                  : 'Question suivante'}
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
