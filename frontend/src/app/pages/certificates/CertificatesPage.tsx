import { useAuth } from '@/app/context/AuthContext';
import { useGame } from '@/app/context/GameContext';
import { Award, CheckCircle2, Lock, BookOpen, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { jsPDF } from 'jspdf';

const COURSE_NAMES: Record<string, string> = {
  vrio: 'VRIO - Value, Rarity, Imitability, Organization',
  swot: 'SWOT - Strengths, Weaknesses, Opportunities, Threats',
  coreCompetence: 'Core Competence',
};

const COURSE_IDS = ['vrio', 'swot', 'coreCompetence'] as const;

function generateCertificatePdf(
  userName: string,
  level: number,
  courseId: string,
  courseName: string
) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const margin = 18;
  const innerW = W - 2 * margin;
  const innerH = H - 2 * margin;

  doc.setDrawColor(13, 148, 136);
  doc.setLineWidth(2);
  doc.rect(margin, margin, innerW, innerH);

  doc.setDrawColor(20, 184, 166);
  doc.setLineWidth(0.8);
  doc.rect(margin + 4, margin + 4, innerW - 8, innerH - 8);

  const corner = 12;
  doc.setLineWidth(1.2);
  doc.setDrawColor(20, 184, 166);
  doc.line(margin, margin, margin + corner, margin);
  doc.line(margin, margin, margin, margin + corner);
  doc.line(W - margin, margin, W - margin - corner, margin);
  doc.line(W - margin, margin, W - margin, margin + corner);
  doc.line(margin, H - margin, margin + corner, H - margin);
  doc.line(margin, H - margin, margin, H - margin - corner);
  doc.line(W - margin, H - margin, W - margin - corner, H - margin);
  doc.line(W - margin, H - margin, W - margin, H - margin - corner);

  doc.setFillColor(79, 70, 229);
  doc.rect(margin + 4, margin + 4, innerW - 8, 22, 'F');

  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('Certificate of Completion', W / 2, margin + 18, { align: 'center' });

  doc.setFontSize(11);
  doc.setTextColor(224, 231, 255);
  doc.setFont('helvetica', 'normal');
  doc.text('StrategyLearn — Learn by playing', W / 2, margin + 26, { align: 'center' });

  doc.setDrawColor(153, 246, 228);
  doc.setFillColor(240, 253, 250);
  doc.roundedRect(margin + 20, margin + 38, innerW - 40, 16, 2, 2, 'FD');
  doc.setFontSize(14);
  doc.setTextColor(17, 94, 89);
  doc.setFont('helvetica', 'bold');
  doc.text(courseName, W / 2, margin + 49, { align: 'center' });

  doc.setFontSize(12);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text('This is to certify that', W / 2, margin + 72, { align: 'center' });

  doc.setFontSize(26);
  doc.setTextColor(55, 48, 163);
  doc.setFont('helvetica', 'bold');
  doc.text(userName, W / 2, margin + 92, { align: 'center' });

  doc.setFontSize(12);
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  doc.text(`has successfully completed the above course at Level ${level}.`, W / 2, margin + 108, {
    align: 'center',
  });

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  doc.setFontSize(11);
  doc.setTextColor(100, 116, 139);
  doc.text(`Issued on ${today}`, W / 2, margin + 128, { align: 'center' });

  doc.setDrawColor(153, 246, 228);
  doc.setLineWidth(0.5);
  doc.line(margin + 40, margin + 138, W - margin - 40, margin + 138);

  doc.setDrawColor(20, 184, 166);
  doc.setLineWidth(1);
  doc.setFillColor(240, 253, 250);
  doc.circle(W / 2, H - margin - 28, 14, 'FD');
  doc.setFontSize(8);
  doc.setTextColor(13, 148, 136);
  doc.setFont('helvetica', 'bold');
  doc.text('STRATEGYLEARN', W / 2, H - margin - 28, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.text('100% Completion', W / 2, H - margin - 22, { align: 'center' });

  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'This certificate is awarded upon 100% completion of the course. Verify at StrategyLearn.',
    W / 2,
    H - margin - 8,
    { align: 'center' }
  );

  const safeName = userName.replace(/[^a-z0-9]/gi, '_').slice(0, 30);
  doc.save(`StrategyLearn_Certificate_${courseId}_${safeName}.pdf`);
}

export const CertificatesPage = () => {
  const { user } = useAuth();
  const { progress, level } = useGame();

  const completedCourses = COURSE_IDS.filter(
    (id) => progress[id as keyof typeof progress] === 100
  );
  const startedOrLocked = COURSE_IDS.filter(
    (id) => (progress[id as keyof typeof progress] ?? 0) < 100
  );

  const handleDownloadCertificate = (courseId: string) => {
    const courseName = COURSE_NAMES[courseId] || courseId;
    generateCertificatePdf(
      user?.name || 'User',
      user?.level ?? level,
      courseId,
      courseName
    );
  };

  return (
    <div className="min-h-screen page-bg">
      <div className="relative overflow-hidden text-white py-16 hero-gradient shadow-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="inline-block mb-6"
          >
            <div className="p-6 bg-white/25 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20">
              <Award className="w-16 h-16 text-white drop-shadow-lg" />
            </div>
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-2xl tracking-tight">
            My Certificates
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium">
            Download your certificates in PDF format when you complete a course
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-4">
        {completedCourses.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
              <h2 className="text-3xl font-bold text-gray-900">
                Completed Courses ({completedCourses.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {completedCourses.map((courseId, i) => {
                const courseName = COURSE_NAMES[courseId] || courseId;
                const shortName = courseName.split(' - ')[0];
                const description = courseName.includes(' - ') ? courseName.split(' - ')[1] : '';
                return (
                  <motion.div
                    key={courseId}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="relative"
                  >
                    <div className="relative bg-white rounded-3xl shadow-2xl border-4 border-teal-400 overflow-hidden h-full flex flex-col">
                      <div className="h-3 bg-gradient-to-r from-teal-400 via-cyan-400 to-orange-400"></div>
                      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-teal-500"></div>
                      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-teal-500"></div>
                      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-teal-500"></div>
                      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-teal-500"></div>

                      <div className="p-8 flex flex-col items-center text-center flex-1">
                        <div className="mb-6 p-5 bg-gradient-to-br from-teal-400 to-orange-500 rounded-full shadow-xl">
                          <Award className="w-14 h-14 text-white" />
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{shortName}</h3>
                        {description && (
                          <p className="text-sm text-gray-600 mb-6 min-h-[40px]">{description}</p>
                        )}

                        <div className="mb-6 px-5 py-2 bg-green-100 rounded-full">
                          <span className="text-sm font-bold text-green-700 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5" />
                            Certificate Available
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDownloadCertificate(courseId)}
                          className="mt-auto w-full flex items-center justify-center gap-3 px-6 py-4 btn-game text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-105"
                        >
                          <FileText className="w-6 h-6" />
                          Download Certificate
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {startedOrLocked.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <Lock className="w-8 h-8 text-gray-500" />
              <h2 className="text-3xl font-bold text-gray-900">
                In Progress ({startedOrLocked.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {startedOrLocked.map((courseId, i) => {
                const courseName = COURSE_NAMES[courseId] || courseId;
                const pct = progress[courseId as keyof typeof progress] ?? 0;
                const isStarted = pct > 0;
                return (
                  <motion.div
                    key={courseId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (completedCourses.length * 0.15) + (i * 0.1) }}
                    className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-4 bg-gray-100 rounded-xl">
                        <Lock className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {courseName.split(' - ')[0]}
                        </h3>
                        {isStarted ? (
                          <>
                            <p className="text-sm text-gray-600 mb-3">Progress: {pct}%</p>
                            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.8 }}
                                className="h-full bg-gradient-to-r from-teal-500 to-orange-500 rounded-full"
                              />
                            </div>
                            <p className="text-xs text-gray-500">
                              Complete to unlock your certificate
                            </p>
                          </>
                        ) : (
                          <p className="text-sm text-gray-500">
                            Start the course to begin earning your certificate
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {completedCourses.length === 0 && startedOrLocked.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-3xl shadow-xl border-2 border-gray-200 p-16 text-center"
          >
            <div className="inline-block p-8 bg-gray-100 rounded-full mb-6">
              <BookOpen className="w-20 h-20 text-gray-400" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">No Certificates Yet</h3>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Complete a course to earn your first certificate!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
