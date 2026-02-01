import mongoose from 'mongoose';

export interface IUserProgress {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  completedSections: number[];
  progressPercent: number;
  updatedAt: Date;
}

const UserProgressSchema = new mongoose.Schema<IUserProgress>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    completedSections: { type: [Number], default: [] },
    progressPercent: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

UserProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.models.UserProgress ||
  mongoose.model<IUserProgress>('UserProgress', UserProgressSchema);
