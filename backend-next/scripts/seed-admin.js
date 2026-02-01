const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGODB_URI_DEV || 'mongodb://localhost:27017/strat-quest';

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    points: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
  },
  { timestamps: true }
);

const bcrypt = require('bcryptjs');
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    sections: [{
      title: String,
      content: String,
      image: String,
      videoId: String,
      points: { type: Number, default: 10 },
      order: Number,
    }],
    order: { type: Number, default: 0 },
    color: String,
    bgColor: String,
  },
  { timestamps: true }
);
const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);

const QuizOptionSchema = new mongoose.Schema({ text: String, explanation: String }, { _id: false });
const QuizQuestionSchema = new mongoose.Schema({
  question: String,
  options: [QuizOptionSchema],
  correct: Number,
  generalExplanation: String,
  order: Number,
}, { _id: false });
const QuizSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  questions: [QuizQuestionSchema],
}, { timestamps: true });
const Quiz = mongoose.models.Quiz || mongoose.model('Quiz', QuizSchema);

async function seed() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI manquant. Créez un fichier .env.local avec MONGODB_URI=mongodb://...');
    process.exit(1);
  }
  try {
    await mongoose.connect(MONGODB_URI);
  } catch (err) {
    const msg = err.message || '';
    if (msg.includes('querySrv ECONNREFUSED')) {
      console.error('');
      console.error('Votre réseau bloque la résolution DNS SRV (mongodb+srv://).');
      console.error('Utilisez l\'URI STANDARD dans .env.local :');
      console.error('');
      console.error('  1) Atlas → Database → Connect → Drivers');
      console.error('  2) Choisir "Standard connection string" (pas SRV)');
      console.error('  3) Copier l\'URI complète et la mettre dans .env.local comme MONGODB_URI=...');
      console.error('  4) Remplacer <password> par votre mot de passe, et ajouter le nom de la base /strat-quest');
      console.error('');
    } else if (err.name === 'MongooseServerSelectionError' && msg.includes('whitelist')) {
      console.error('');
      console.error('MongoDB Atlas : votre IP n\'est pas autorisée.');
      console.error('Atlas → Network Access → Add IP Address → Add Current IP Address');
      console.error('');
    } else if (err.code === 'ECONNREFUSED' || err.name === 'MongooseServerSelectionError') {
      console.error('');
      console.error('Impossible de se connecter à MongoDB.');
      console.error('Vérifiez .env.local (MONGODB_URI) et Network Access dans Atlas.');
      console.error('');
    }
    throw err;
  }
  console.log('Connected to MongoDB');

  const adminEmail = 'admin@stratquest.com';
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      email: adminEmail,
      password: 'Admin123!',
      name: 'Administrateur',
      role: 'admin',
      points: 0,
      level: 1,
    });
    console.log('Compte admin créé:', adminEmail, ' / Admin123!');
  } else {
    console.log('Compte admin existe déjà:', adminEmail);
  }

  const defaultCourses = [
    { slug: 'vrio', title: 'VRIO', description: 'Value, Rarity, Imitability, Organization - Analysez vos ressources stratégiques', order: 0, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50' },
    { slug: 'swot', title: 'SWOT', description: 'Strengths, Weaknesses, Opportunities, Threats - Évaluez votre position stratégique', order: 1, color: 'from-green-500 to-green-600', bgColor: 'bg-green-50' },
    { slug: 'coreCompetence', title: 'Core Competence', description: 'Identifiez et développez vos compétences clés distinctives', order: 2, color: 'from-red-500 to-red-600', bgColor: 'bg-red-50' },
  ];

  for (const c of defaultCourses) {
    let course = await Course.findOne({ slug: c.slug });
    if (!course) {
      course = await Course.create({
        ...c,
        sections: [
          { title: 'Introduction', content: 'Contenu d\'introduction – à compléter par l\'admin.', points: 10, order: 0 },
        ],
      });
      console.log('Cours créé:', c.slug);
      const quiz = await Quiz.findOne({ courseId: course._id });
      if (!quiz) {
        await Quiz.create({
          courseId: course._id,
          title: `Quiz ${c.title}`,
          questions: [
            {
              question: 'Question exemple – modifiez dans l\'admin.',
              options: [
                { text: 'Option A', explanation: 'Explication A' },
                { text: 'Option B', explanation: 'Explication B' },
              ],
              correct: 0,
              generalExplanation: 'Explication générale.',
              order: 0,
            },
          ],
        });
        console.log('Quiz créé pour', c.slug);
      }
    }
  }

  await mongoose.disconnect();
  console.log('Seed terminé.');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
