import mongoose from 'mongoose';

export interface IBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface IUserGame {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  points: number;
  level: number;
  streak: number;
  lastActiveDate?: string;
  badges: IBadge[];
  progress: Record<string, number>;
  updatedAt: Date;
}

const defaultBadges: IBadge[] = [
  { id: 'first-steps', name: 'Premiers Pas', description: 'Complétez votre première leçon', icon: '🎯', unlocked: false },
  { id: 'quiz-master', name: 'Maître du Quiz', description: 'Réussissez 10 quiz', icon: '🏆', unlocked: false },
  { id: 'perfectionist', name: 'Perfectionniste', description: 'Obtenez un score parfait', icon: '⭐', unlocked: false },
  { id: 'strategist', name: 'Stratège', description: 'Maîtrisez les 3 stratégies', icon: '🎓', unlocked: false },
  { id: 'streak-5', name: 'Série de 5', description: '5 jours consécutifs', icon: '🔥', unlocked: false },
  { id: 'streak-7', name: 'Semaine Parfaite', description: "7 jours consécutifs d'activité", icon: '🌟', unlocked: false },
  { id: 'streak-10', name: 'Série de 10', description: '10 jours consécutifs', icon: '💫', unlocked: false },
];

const UserGameSchema = new mongoose.Schema<IUserGame>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    points: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streak: { type: Number, default: 0 },
    lastActiveDate: String,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Mongoose types are strict for array of Mixed
    badges: { type: [mongoose.Schema.Types.Mixed], default: defaultBadges } as any,
    progress: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

export default mongoose.models.UserGame || mongoose.model<IUserGame>('UserGame', UserGameSchema);
