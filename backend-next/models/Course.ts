import mongoose from 'mongoose';

export interface ICourseSection {
  title: string;
  content: string;
  image?: string;
  videoId?: string;
  points: number;
  order: number;
}

export interface ICourse {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  sections: ICourseSection[];
  order: number;
  color?: string;
  bgColor?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSectionSchema = new mongoose.Schema<ICourseSection>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: String,
    videoId: String,
    points: { type: Number, default: 10 },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const CourseSchema = new mongoose.Schema<ICourse>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    sections: [CourseSectionSchema],
    order: { type: Number, default: 0 },
    color: String,
    bgColor: String,
  },
  { timestamps: true }
);

export default mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);
