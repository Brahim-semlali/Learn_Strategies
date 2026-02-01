const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function getToken(): string | null {
  return sessionStorage.getItem('token');
}

export function setToken(token: string) {
  sessionStorage.setItem('token', token);
}

export function clearToken() {
  sessionStorage.removeItem('token');
}

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  } catch (err) {
    const msg =
      err instanceof TypeError && (err as Error).message === 'Failed to fetch'
        ? 'Impossible de joindre le serveur. Vérifiez que le backend tourne (port 3001) et que l\'URL est correcte (VITE_API_URL).'
        : (err instanceof Error ? err.message : 'Erreur réseau');
    throw new Error(msg);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      (data && typeof data.error === 'string' ? data.error : null) ||
        res.statusText ||
        'Erreur API'
    );
  }
  return data as T;
}

export const authApi = {
  login: (email: string, password: string) =>
    api<{ token: string; user: AuthUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  signup: (email: string, password: string, name: string) =>
    api<{ token: string; user: AuthUser }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),
  me: () => api<{ user: AuthUser; game: GameState | null }>('/auth/me'),
};

export const coursesApi = {
  list: () => api<Course[]>('/courses'),
  getById: (id: string) => api<Course>(`/courses/${id}`),
  getBySlug: (slug: string) => api<Course>(`/courses/slug/${slug}`),
  create: (body: Partial<Course>) => api<Course>('/courses', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: Partial<Course>) => api<Course>(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id: string) => api<{ success: boolean }>(`/courses/${id}`, { method: 'DELETE' }),
};

export const quizzesApi = {
  getByCourseId: (courseId: string) => api<Quiz>(`/quizzes?courseId=${encodeURIComponent(courseId)}`),
  getById: (id: string) => api<Quiz>(`/quizzes/${id}`),
  create: (body: { courseId: string; title: string; questions?: QuizQuestion[] }) =>
    api<Quiz>('/quizzes', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: Partial<Quiz>) => api<Quiz>(`/quizzes/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id: string) => api<{ success: boolean }>(`/quizzes/${id}`, { method: 'DELETE' }),
};

export const gameApi = {
  get: () => api<GameState>('/users/me/game'),
  patch: (body: Partial<GameState>) => api<GameState>('/users/me/game', { method: 'PATCH', body: JSON.stringify(body) }),
};

export const progressApi = {
  get: (courseId?: string) =>
    api<ProgressResponse>(courseId ? `/users/me/progress?courseId=${encodeURIComponent(courseId)}` : '/users/me/progress'),
  patch: (courseId: string, completedSections: number[], progressPercent: number) =>
    api<{ completedSections: number[]; progressPercent: number }>('/users/me/progress', {
      method: 'PATCH',
      body: JSON.stringify({ courseId, completedSections, progressPercent }),
    }),
};

export const pointsApi = {
  patch: (points: number) =>
    api<{ points: number; level: number }>('/users/me/points', { method: 'PATCH', body: JSON.stringify({ points }) }),
};

export interface LeaderboardUser {
  id: string;
  name: string;
  email: string;
  points: number;
  level: number;
}

export const rankingsApi = {
  get: () => api<{ leaderboard: LeaderboardUser[] }>('/rankings'),
};

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  points: number;
  level: number;
}

export interface GameState {
  points: number;
  level: number;
  streak: number;
  lastActiveDate?: string;
  badges: { id: string; name: string; description: string; icon: string; unlocked: boolean }[];
  progress: Record<string, number>;
}

export interface CourseSection {
  title: string;
  content: string;
  image?: string;
  videoId?: string;
  points: number;
  order: number;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  sections: CourseSection[];
  order: number;
  color?: string;
  bgColor?: string;
}

export interface QuizOption {
  text: string;
  explanation: string;
}

export interface QuizQuestion {
  question: string;
  options: QuizOption[];
  correct: number;
  generalExplanation: string;
  order?: number;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  questions: QuizQuestion[];
}

type ProgressResponse =
  | { completedSections: number[]; progressPercent: number }
  | Record<string, { completedSections: number[]; progressPercent: number }>;
