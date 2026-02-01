import { useState, useEffect } from 'react';
import { Shield, BookOpen, FileQuestion, Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/app/shared/components/ui/button';
import { Input } from '@/app/shared/components/ui/input';
import { Label } from '@/app/shared/components/ui/label';
import { Textarea } from '@/app/shared/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/shared/components/ui/tabs';
import {
  coursesApi,
  quizzesApi,
  type Course,
  type CourseSection,
  type Quiz,
  type QuizQuestion,
} from '@/app/shared/api/client';

export const AdminPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [quizzes, setQuizzes] = useState<Record<string, Quiz | null>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses');

  const loadCourses = () => {
    coursesApi.list().then(setCourses).catch(() => setCourses([]));
  };

  const loadQuizzes = () => {
    courses.forEach((c) => {
      quizzesApi.getByCourseId(c.id).then((q) => setQuizzes((prev) => ({ ...prev, [c.id]: q }))).catch(() => setQuizzes((prev) => ({ ...prev, [c.id]: null })));
    });
  };

  useEffect(() => {
    loadCourses();
    setLoading(false);
  }, []);

  useEffect(() => {
    if (courses.length) loadQuizzes();
  }, [courses]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-gray-600">Chargement…</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-100 rounded-xl">
            <Shield className="w-8 h-8 text-teal-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
            <p className="text-gray-600 text-sm">Gérer les cours, la documentation et les quiz (QCM). Visible uniquement par l&apos;admin.</p>
          </div>
        </div>
        <div className="px-3 py-1.5 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium">
          Réservé à l&apos;administrateur
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="courses" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Cours & Documentation
          </TabsTrigger>
          <TabsTrigger value="quizzes" className="flex items-center gap-2">
            <FileQuestion className="w-4 h-4" />
            Quiz / QCM
          </TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <CoursesSection courses={courses} onRefresh={loadCourses} />
        </TabsContent>
        <TabsContent value="quizzes">
          <QuizzesSection courses={courses} quizzes={quizzes} onRefresh={loadQuizzes} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

function CoursesSection({ courses, onRefresh }: { courses: Course[]; onRefresh: () => void }) {
  const [editing, setEditing] = useState<Course | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: '', slug: '', description: '', sections: [] as CourseSection[] });

  const saveCourse = async () => {
    try {
      if (editing) {
        await coursesApi.update(editing.id, form);
        setEditing(null);
      } else {
        await coursesApi.create(form);
        setCreating(false);
        setForm({ title: '', slug: '', description: '', sections: [] });
      }
      onRefresh();
    } catch (e) {
      alert((e as Error).message || 'Erreur');
    }
  };

  const deleteCourse = async (id: string) => {
    if (!confirm('Supprimer ce cours ?')) return;
    try {
      await coursesApi.delete(id);
      onRefresh();
      setEditing(null);
    } catch (e) {
      alert((e as Error).message || 'Erreur');
    }
  };

  const addSection = () => {
    setForm((f) => ({
      ...f,
      sections: [...f.sections, { title: '', content: '', points: 10, order: f.sections.length, image: '', videoId: '' }],
    }));
  };

  const extractYoutubeId = (urlOrId: string): string => {
    const s = (urlOrId || '').trim();
    if (!s) return '';
    const m = s.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : s.length <= 11 ? s : '';
  };

  const updateSection = (index: number, field: string, value: string | number) => {
    setForm((f) => ({
      ...f,
      sections: f.sections.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    }));
  };

  const removeSection = (index: number) => {
    setForm((f) => ({ ...f, sections: f.sections.filter((_, i) => i !== index) }));
  };

  return (
    <div className="space-y-6">
      {!editing && !creating && (
        <Button onClick={() => { setCreating(true); setForm({ title: '', slug: '', description: '', sections: [] }); }} className="gap-2">
          <Plus className="w-4 h-4" />
          Nouveau cours
        </Button>
      )}

      {(editing || creating) && (
        <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-semibold text-lg">{editing ? 'Modifier le cours' : 'Nouveau cours'}</h3>
          <div className="grid gap-2">
            <Label>Titre</Label>
            <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="ex: VRIO" />
          </div>
          <div className="grid gap-2">
            <Label>Slug (URL)</Label>
            <Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="ex: vrio" disabled={!!editing} />
          </div>
          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} placeholder="Description courte" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Sections (documentation)</Label>
              <Button type="button" variant="outline" size="sm" onClick={addSection}>+ Section</Button>
            </div>
            {form.sections.map((s, i) => (
              <div key={i} className="border rounded-lg p-4 mb-2 space-y-3 bg-gray-50/50">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Section {i + 1}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeSection(i)}><Trash2 className="w-4 h-4" /></Button>
                </div>
                <Input placeholder="Titre section" value={s.title} onChange={(e) => updateSection(i, 'title', e.target.value)} />
                <div className="grid gap-2 sm:grid-cols-2">
                  <div>
                    <Label className="text-xs text-gray-500">Image (URL)</Label>
                    <Input placeholder="https://exemple.com/image.jpg" value={s.image ?? ''} onChange={(e) => updateSection(i, 'image', e.target.value)} />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Vidéo YouTube (lien ou ID)</Label>
                    <Input placeholder="https://youtube.com/watch?v=... ou ID vidéo" value={s.videoId ?? ''} onChange={(e) => updateSection(i, 'videoId', extractYoutubeId(e.target.value) || e.target.value)} />
                  </div>
                </div>
                <Textarea placeholder="Contenu" value={s.content} onChange={(e) => updateSection(i, 'content', e.target.value)} rows={3} />
                <Input type="number" placeholder="Points" value={s.points} onChange={(e) => updateSection(i, 'points', Number(e.target.value) || 0)} />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button onClick={saveCourse}>Enregistrer</Button>
            <Button variant="outline" onClick={() => { setEditing(null); setCreating(false); }}>Annuler</Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {courses.map((c) => (
          <div key={c.id} className="flex items-center justify-between bg-white border rounded-lg p-4">
            <div>
              <p className="font-semibold">{c.title}</p>
              <p className="text-sm text-gray-500">{c.slug} · {c.sections?.length ?? 0} sections</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => { setEditing(c); setForm({ title: c.title, slug: c.slug, description: c.description, sections: c.sections || [] }); setCreating(false); }}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => deleteCourse(c.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuizzesSection({
  courses,
  quizzes,
  onRefresh,
}: {
  courses: Course[];
  quizzes: Record<string, Quiz | null>;
  onRefresh: () => void;
}) {
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [creatingForCourseId, setCreatingForCourseId] = useState<string | null>(null);
  const [form, setForm] = useState<{ title: string; questions: QuizQuestion[] }>({ title: '', questions: [] });

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);
  const currentQuiz = selectedCourseId ? quizzes[selectedCourseId] : null;

  const saveQuiz = async () => {
    try {
      if (editingQuiz) {
        await quizzesApi.update(editingQuiz.id, { title: form.title, questions: form.questions });
        setEditingQuiz(null);
      } else if (creatingForCourseId) {
        await quizzesApi.create({ courseId: creatingForCourseId, title: form.title, questions: form.questions });
        setCreatingForCourseId(null);
      }
      setForm({ title: '', questions: [] });
      onRefresh();
    } catch (e) {
      alert((e as Error).message || 'Erreur');
    }
  };

  const deleteQuiz = async (id: string) => {
    if (!confirm('Supprimer ce quiz ?')) return;
    try {
      await quizzesApi.delete(id);
      onRefresh();
      setEditingQuiz(null);
      setSelectedCourseId('');
    } catch (e) {
      alert((e as Error).message || 'Erreur');
    }
  };

  const addQuestion = () => {
    setForm((f) => ({
      ...f,
      questions: [
        ...f.questions,
        {
          question: '',
          options: [
            { text: '', explanation: '' },
            { text: '', explanation: '' },
          ],
          correct: 0,
          generalExplanation: '',
        },
      ],
    }));
  };

  const removeQuestion = (qIndex: number) => {
    setForm((f) => ({ ...f, questions: f.questions.filter((_, i) => i !== qIndex) }));
  };

  const updateQuestion = (qIndex: number, field: string, value: string | number) => {
    setForm((f) => ({
      ...f,
      questions: f.questions.map((q, i) => (i === qIndex ? { ...q, [field]: value } : q)),
    }));
  };

  const updateOption = (qIndex: number, oIndex: number, field: 'text' | 'explanation', value: string) => {
    setForm((f) => ({
      ...f,
      questions: f.questions.map((q, i) =>
        i === qIndex ? { ...q, options: q.options.map((o, j) => (j === oIndex ? { ...o, [field]: value } : o)) } : q
      ),
    }));
  };

  const addOption = (qIndex: number) => {
    setForm((f) => ({
      ...f,
      questions: f.questions.map((q, i) =>
        i === qIndex ? { ...q, options: [...q.options, { text: '', explanation: '' }] } : q
      ),
    }));
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    setForm((f) => ({
      ...f,
      questions: f.questions.map((q, i) => {
        if (i !== qIndex || q.options.length <= 2) return q;
        const newOptions = q.options.filter((_, j) => j !== oIndex);
        let newCorrect = q.correct;
        if (oIndex === q.correct) newCorrect = 0;
        else if (oIndex < q.correct) newCorrect = q.correct - 1;
        return { ...q, options: newOptions, correct: newCorrect };
      }),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center flex-wrap">
        <Label>Cours</Label>
        <select
          className="border rounded-lg px-3 py-2 min-w-[200px]"
          value={selectedCourseId}
          onChange={(e) => { setSelectedCourseId(e.target.value); setEditingQuiz(null); setCreatingForCourseId(null); }}
        >
          <option value="">Choisir un cours</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
        {selectedCourseId && !currentQuiz && !editingQuiz && !creatingForCourseId && (
          <Button onClick={() => { setCreatingForCourseId(selectedCourseId); setForm({ title: `Quiz ${selectedCourse?.title || ''}`, questions: [] }); }}>
            <Plus className="w-4 h-4 mr-2" />
            Créer le quiz
          </Button>
        )}
      </div>

      {(editingQuiz || creatingForCourseId) && (
        <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-semibold text-lg">{editingQuiz ? 'Modifier le quiz' : 'Nouveau quiz'}</h3>
          <div className="grid gap-2">
            <Label>Titre du quiz</Label>
            <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <Label>Questions</Label>
              <Button type="button" variant="outline" size="sm" onClick={addQuestion}>+ Question</Button>
            </div>
            {form.questions.map((q, qi) => (
              <div key={qi} className="border rounded-lg p-4 mb-4 space-y-3 bg-gray-50/50">
                <div className="flex justify-between items-center">
                  <Label className="text-base">Question {qi + 1} (QCM)</Label>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeQuestion(qi)} className="text-red-600 hover:text-red-700">Supprimer la question</Button>
                </div>
                <Input placeholder="Énoncé de la question" value={q.question} onChange={(e) => updateQuestion(qi, 'question', e.target.value)} className="bg-white" />
                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-600">Réponses (cochez la bonne) :</span>
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex gap-2 items-center flex-wrap">
                      <label className="flex items-center gap-1.5 shrink-0 cursor-pointer">
                        <input type="radio" name={`q-${qi}`} checked={q.correct === oi} onChange={() => updateQuestion(qi, 'correct', oi)} className="text-teal-600" />
                        <span className="text-sm font-medium text-teal-700">Bonne réponse</span>
                      </label>
                      <Input placeholder={`Option ${oi + 1}`} value={opt.text} onChange={(e) => updateOption(qi, oi, 'text', e.target.value)} className="flex-1 min-w-[200px] bg-white" />
                      <Input placeholder="Explication si choisie" value={opt.explanation} onChange={(e) => updateOption(qi, oi, 'explanation', e.target.value)} className="flex-1 min-w-[180px] bg-white" />
                      {q.options.length > 2 && (
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeOption(qi, oi)} className="text-red-600 hover:text-red-700">Suppr.</Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => addOption(qi)}>+ Ajouter une option</Button>
                </div>
                <Input placeholder="Explication générale (après la question)" value={q.generalExplanation} onChange={(e) => updateQuestion(qi, 'generalExplanation', e.target.value)} className="bg-white" />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button onClick={saveQuiz}>Enregistrer</Button>
            <Button variant="outline" onClick={() => { setEditingQuiz(null); setCreatingForCourseId(null); }}>Annuler</Button>
          </div>
        </div>
      )}

      {selectedCourseId && currentQuiz && !editingQuiz && !creatingForCourseId && (
        <div className="bg-white border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">{currentQuiz.title}</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => { setEditingQuiz(currentQuiz); setForm({ title: currentQuiz.title, questions: currentQuiz.questions || [] }); }}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => deleteQuiz(currentQuiz.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-500">{currentQuiz.questions?.length ?? 0} questions</p>
        </div>
      )}
    </div>
  );
}
