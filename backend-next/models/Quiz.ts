import mongoose from 'mongoose';

export interface IQuizOption {
  text: string;
  explanation: string;
}

export interface IQuizQuestion {
  question: string;
  options: IQuizOption[];
  correct: number;
  generalExplanation: string;
  order: number;
}

export interface IQuiz {
  _id: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  title: string;
  questions: IQuizQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

const QuizOptionSchema = new mongoose.Schema<IQuizOption>(
  { text: { type: String, required: true }, explanation: { type: String, required: true } },
  { _id: false }
);

const QuizQuestionSchema = new mongoose.Schema<IQuizQuestion>(
  {
    question: { type: String, required: true },
    options: [QuizOptionSchema],
    correct: { type: Number, required: true },
    generalExplanation: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const QuizSchema = new mongoose.Schema<IQuiz>(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    questions: [QuizQuestionSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Quiz || mongoose.model<IQuiz>('Quiz', QuizSchema);
