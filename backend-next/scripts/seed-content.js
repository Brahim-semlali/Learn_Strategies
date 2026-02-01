/**
 * Seed des cours (sections avec texte, images, vidéos YouTube) et des quiz (questions QCM)
 * Usage: node scripts/seed-content.js
 */
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGODB_URI_DEV || 'mongodb://localhost:27017/strat-quest';

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

const COURSES_DATA = [
  {
    slug: 'vrio',
    title: 'VRIO',
    description: 'Value, Rarity, Imitability, Organization - Analysez vos ressources stratégiques',
    order: 0,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    sections: [
      { title: 'Introduction au cadre VRIO', content: 'Le cadre VRIO est un outil d\'analyse stratégique développé par Jay Barney. Il permet d\'évaluer si les ressources et compétences d\'une entreprise peuvent créer un avantage concurrentiel durable. Les quatre critères (Valeur, Rareté, Imitabilité, Organisation) doivent être évalués dans cet ordre pour chaque ressource clé.', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800', videoId: 'afrPC91zCkQ', points: 10, order: 0 },
      { title: 'V – Valeur (Value)', content: 'La ressource permet-elle d\'exploiter une opportunité ou de neutraliser une menace ? Une ressource crée de la valeur si elle aide l\'entreprise à augmenter ses revenus ou à réduire ses coûts. Sans valeur, inutile d\'évaluer les autres critères.', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800', videoId: '9vPvxEKnNM4', points: 15, order: 1 },
      { title: 'R – Rareté (Rarity)', content: 'La ressource est-elle contrôlée par un petit nombre de concurrents ? Plus une ressource précieuse est rare, plus son potentiel d\'avantage concurrentiel est élevé. Une ressource précieuse mais commune mène à la parité concurrentielle.', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800', videoId: 'dxwJM9HlUIc', points: 15, order: 2 },
      { title: 'I – Imitabilité (Imitability)', content: 'Est-il coûteux ou difficile pour les concurrents d\'obtenir, développer ou imiter cette ressource ? Les ressources les plus difficiles à imiter sont souvent intangibles : réputation, culture d\'entreprise, savoir-faire tacite. Elles offrent des avantages plus durables.', image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800', points: 15, order: 3 },
      { title: 'O – Organisation', content: 'L\'entreprise est-elle organisée pour capter la valeur de cette ressource ? Même une ressource précieuse, rare et difficile à imiter ne génère pas de profit si l\'organisation n\'a pas les systèmes, processus et structure pour l\'exploiter efficacement.', image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800', points: 20, order: 4 },
    ],
  },
  {
    slug: 'swot',
    title: 'SWOT',
    description: 'Strengths, Weaknesses, Opportunities, Threats - Évaluez votre position stratégique',
    order: 1,
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    sections: [
      { title: 'Introduction à l\'analyse SWOT', content: 'L\'analyse SWOT (Forces, Faiblesses, Opportunités, Menaces) est un outil de diagnostic stratégique. Elle combine l\'analyse interne (Forces et Faiblesses) et l\'analyse externe (Opportunités et Menaces) pour une vision complète de la situation de l\'entreprise.', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800', videoId: 'C1vF-sZFqMQ', points: 10, order: 0 },
      { title: 'S – Forces (Strengths)', content: 'Les forces sont les atouts internes de l\'organisation : avantages concurrentiels, ressources uniques, capacités distinctives. Une force est stratégiquement pertinente quand elle différencie l\'entreprise de ses concurrents et crée de la valeur pour les clients.', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800', videoId: '46cSJ81C0SQ', points: 15, order: 1 },
      { title: 'W – Faiblesses (Weaknesses)', content: 'Les faiblesses sont les aspects internes qui placent l\'organisation en position de désavantage : manque de compétences, ressources limitées, processus inefficaces. Les identifier permet de concevoir des stratégies d\'amélioration ou de les compenser.', image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800', videoId: '5EHhSMjqd0I', points: 15, order: 2 },
      { title: 'O – Opportunités (Opportunities)', content: 'Les opportunités sont des facteurs externes favorables que l\'entreprise peut exploiter : nouveaux marchés, tendances positives, changements réglementaires. Les stratégies SO (Forces-Opportunités) sont les plus offensives.', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', videoId: 'EJ4uVsSqQ9k', points: 15, order: 3 },
      { title: 'T – Menaces (Threats)', content: 'Les menaces sont des facteurs externes défavorables : concurrence agressive, évolution technologique, instabilité réglementaire. Les anticiper permet de développer des stratégies défensives (ST, WT) et de réduire les risques.', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800', points: 20, order: 4 },
    ],
  },
  {
    slug: 'coreCompetence',
    title: 'Core Competence',
    description: 'Identifiez et développez vos compétences clés distinctives',
    order: 2,
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-50',
    sections: [
      { title: 'Qu\'est-ce qu\'une compétence clé ?', content: 'Une compétence clé est une capacité stratégique unique qui procure un avantage concurrentiel durable. Le concept a été développé par Prahalad et Hamel. Une vraie compétence clé : crée une valeur significative pour le client, est difficile à imiter, et peut ouvrir l\'accès à plusieurs marchés.', image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800', videoId: 'M9Rot4AWOWY', points: 10, order: 0 },
      { title: 'Caractéristiques des compétences clés', content: 'Une compétence clé doit : 1) Apporter une valeur significative au client ; 2) Être difficile à imiter par les concurrents ; 3) Donner accès à plusieurs marchés différents. Les compétences clés se développent par l\'apprentissage organisationnel et l\'innovation continue, pas par l\'achat d\'équipements.', image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800', points: 15, order: 1 },
      { title: 'Identifier vos compétences clés', content: 'Pour identifier vos compétences clés, posez-vous : Que faisons-nous mieux que quiconque ? Quelles capacités nous permettent de créer une valeur unique pour nos clients ? Attention : ne vous définissez pas uniquement par vos produits actuels, mais par les capacités sous-jacentes qui les génèrent.', image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800', points: 15, order: 2 },
      { title: 'Développer et protéger les compétences clés', content: 'Les compétences clés se construisent dans la durée via l\'apprentissage, l\'expérimentation et l\'intégration des savoirs. La meilleure protection est l\'innovation continue : une compétence qui évolue reste une cible mouvante pour les imitateurs. Investissez dans la formation, le recrutement et les partenariats stratégiques.', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800', points: 20, order: 3 },
    ],
  },
];

const QUIZZES_DATA = {
  vrio: {
    title: 'Quiz VRIO',
    questions: [
      { question: 'Que signifie le "V" dans VRIO ?', options: [{ text: 'Valeur', explanation: 'Correct. V = Value (Valeur). La ressource doit créer de la valeur.' }, { text: 'Vision', explanation: 'Incorrect. Le V représente Value (Valeur).' }, { text: 'Volume', explanation: 'Incorrect. Le V dans VRIO signifie Value (Valeur).' }, { text: 'Vitesse', explanation: 'Incorrect. V = Value (Valeur).' }], correct: 0, generalExplanation: 'Le V de VRIO signifie Value (Valeur). C\'est le premier critère à évaluer.', order: 0 },
      { question: 'Une ressource VRIO complète offre quel type d\'avantage ?', options: [{ text: 'Avantage temporaire', explanation: 'Incorrect. Un avantage temporaire vient d\'une ressource partiellement VRIO.' }, { text: 'Avantage concurrentiel durable', explanation: 'Correct. Une ressource VRIO complète offre un avantage durable.' }, { text: 'Désavantage', explanation: 'Incorrect. Une ressource VRIO crée un avantage.' }, { text: 'Neutralité', explanation: 'Incorrect. VRIO complet = avantage durable.' }], correct: 1, generalExplanation: 'Une ressource qui remplit les quatre critères VRIO procure un avantage concurrentiel durable.', order: 1 },
      { question: 'Quel critère évalue si une ressource est difficile à copier ?', options: [{ text: 'Value', explanation: 'Incorrect. Value évalue la création de valeur.' }, { text: 'Rarity', explanation: 'Incorrect. Rarity évalue la rareté.' }, { text: 'Imitability', explanation: 'Correct. L\'Inimitabilité évalue la difficulté à imiter.' }, { text: 'Organization', explanation: 'Incorrect. Organization évalue l\'exploitation interne.' }], correct: 2, generalExplanation: 'L\'Inimitabilité (I) examine la difficulté pour les concurrents de reproduire la ressource.', order: 2 },
      { question: 'Pourquoi l\'Organisation est-elle importante dans VRIO ?', options: [{ text: 'Pour réduire les coûts', explanation: 'Incorrect. Son rôle principal est autre.' }, { text: 'Pour capturer la valeur des ressources', explanation: 'Correct. L\'Organisation permet d\'exploiter les ressources VRI.' }, { text: 'Pour augmenter la production', explanation: 'Incorrect. O = capturer la valeur.' }, { text: 'Pour recruter du personnel', explanation: 'Incorrect. O évalue la capacité à exploiter les ressources.' }], correct: 1, generalExplanation: 'Sans organisation appropriée, les ressources VRI ne génèrent pas d\'avantage.', order: 3 },
      { question: 'Une ressource précieuse mais commune offre :', options: [{ text: 'Avantage durable', explanation: 'Incorrect. Il faut aussi R, I et O.' }, { text: 'Parité concurrentielle', explanation: 'Correct. Précieuse mais non rare = parité.' }, { text: 'Désavantage', explanation: 'Incorrect. Précieuse = au moins parité.' }, { text: 'Monopole', explanation: 'Incorrect. Une ressource commune ne crée pas de monopole.' }], correct: 1, generalExplanation: 'Ressource précieuse mais commune = parité concurrentielle.', order: 4 },
    ],
  },
  swot: {
    title: 'Quiz SWOT',
    questions: [
      { question: 'SWOT analyse quels types de facteurs ?', options: [{ text: 'Seulement internes', explanation: 'Incorrect. SWOT analyse aussi les facteurs externes.' }, { text: 'Seulement externes', explanation: 'Incorrect. SWOT évalue aussi les facteurs internes.' }, { text: 'Internes et externes', explanation: 'Correct. SWOT combine analyse interne (S/W) et externe (O/T).' }, { text: 'Uniquement financiers', explanation: 'Incorrect. SWOT couvre tous les aspects.' }], correct: 2, generalExplanation: 'SWOT combine l\'analyse interne (Forces/Faiblesses) et externe (Opportunités/Menaces).', order: 0 },
      { question: 'Les Forces et Faiblesses sont des facteurs :', options: [{ text: 'Externes', explanation: 'Incorrect. S et W sont internes.' }, { text: 'Internes', explanation: 'Correct. Forces et Faiblesses sont internes à l\'organisation.' }, { text: 'Économiques', explanation: 'Incorrect. S et W peuvent être de toute nature.' }, { text: 'Politiques', explanation: 'Incorrect. S et W sont des facteurs internes.' }], correct: 1, generalExplanation: 'S et W concernent ce qui se passe DANS l\'organisation.', order: 1 },
      { question: 'Quel est un exemple d\'Opportunité ?', options: [{ text: 'Manque de compétences dans l\'équipe', explanation: 'Incorrect. C\'est une Faiblesse (W).' }, { text: 'Équipe talentueuse', explanation: 'Incorrect. C\'est une Force (S).' }, { text: 'Nouveau marché émergent à fort potentiel', explanation: 'Correct. C\'est une Opportunité (O) externe.' }, { text: 'Concurrent agressif', explanation: 'Incorrect. C\'est une Menace (T).' }], correct: 2, generalExplanation: 'Les Opportunités sont des facteurs externes favorables.', order: 2 },
      { question: 'La stratégie SO (Forces-Opportunités) est :', options: [{ text: 'Défensive', explanation: 'Incorrect. SO est offensive.' }, { text: 'Offensive : exploiter les forces pour saisir les opportunités', explanation: 'Correct. SO est la stratégie de croissance.' }, { text: 'De réduction', explanation: 'Incorrect. SO = croissance.' }, { text: 'De survie', explanation: 'Incorrect. SO = stratégie offensive.' }], correct: 1, generalExplanation: 'SO est la combinaison la plus favorable (croissance).', order: 3 },
      { question: 'À quelle fréquence une entreprise devrait-elle faire une analyse SWOT ?', options: [{ text: 'Une seule fois à sa création', explanation: 'Incorrect. L\'environnement change.' }, { text: 'Régulièrement (annuellement ou lors de changements majeurs)', explanation: 'Correct. SWOT doit être mise à jour régulièrement.' }, { text: 'Seulement en cas de crise', explanation: 'Incorrect. Mieux vaut anticiper.' }, { text: 'Jamais après la première', explanation: 'Incorrect. Les marchés évoluent.' }], correct: 1, generalExplanation: 'SWOT est un outil vivant ; une analyse régulière est recommandée.', order: 4 },
    ],
  },
  coreCompetence: {
    title: 'Quiz Compétences Clés',
    questions: [
      { question: 'Une compétence clé doit apporter :', options: [{ text: 'Des coûts réduits uniquement', explanation: 'Incorrect. Elle doit surtout créer de la valeur.' }, { text: 'Une valeur significative au client', explanation: 'Correct. La valeur client est la première caractéristique.' }, { text: 'Plus d\'employés', explanation: 'Incorrect. Ce n\'est pas un critère.' }, { text: 'Des bureaux modernes', explanation: 'Incorrect. Une compétence clé crée de la valeur client.' }], correct: 1, generalExplanation: 'La première caractéristique d\'une compétence clé est la valeur pour le client.', order: 0 },
      { question: 'Les compétences clés doivent être :', options: [{ text: 'Faciles à imiter', explanation: 'Incorrect. Elles doivent être difficiles à imiter.' }, { text: 'Difficiles à imiter par les concurrents', explanation: 'Correct. L\'inimitabilité est cruciale.' }, { text: 'Temporaires', explanation: 'Incorrect. Elles doivent être durables.' }, { text: 'Simples et basiques', explanation: 'Incorrect. Les compétences stratégiques sont souvent complexes.' }], correct: 1, generalExplanation: 'L\'inimitabilité assure un avantage durable.', order: 1 },
      { question: 'Une compétence clé peut donner accès à :', options: [{ text: 'Un seul marché', explanation: 'Incorrect. Une compétence clé ouvre plusieurs marchés.' }, { text: 'Plusieurs marchés différents', explanation: 'Correct. C\'est une caractéristique des compétences clés.' }, { text: 'Aucun marché', explanation: 'Incorrect. Elle génère de la valeur marchande.' }, { text: 'Seulement le marché local', explanation: 'Incorrect. Les compétences clés ouvrent plusieurs marchés.' }], correct: 1, generalExplanation: 'Une vraie compétence clé peut être exploitée sur plusieurs marchés.', order: 2 },
      { question: 'Qui a développé le concept de compétences clés ?', options: [{ text: 'Michael Porter', explanation: 'Incorrect. Porter a développé les 5 forces.' }, { text: 'Peter Drucker', explanation: 'Incorrect. Drucker est un pionnier du management.' }, { text: 'C.K. Prahalad et Gary Hamel', explanation: 'Correct. Ils ont développé le concept en 1990.' }, { text: 'Philip Kotler', explanation: 'Incorrect. Kotler est connu pour le marketing.' }], correct: 2, generalExplanation: 'Prahalad et Hamel, article "The Core Competence of the Corporation" (1990).', order: 3 },
      { question: 'Comment protéger ses compétences clés ?', options: [{ text: 'Les garder secrètes', explanation: 'Incorrect. Le secret total est difficile.' }, { text: 'Investir continuellement dans leur développement', explanation: 'Correct. L\'innovation continue est la meilleure protection.' }, { text: 'Les vendre aux concurrents', explanation: 'Incorrect. Cela érode l\'avantage.' }, { text: 'Ne jamais les utiliser', explanation: 'Incorrect. Il faut les exploiter.' }], correct: 1, generalExplanation: 'La protection réside dans l\'évolution et l\'amélioration continues.', order: 4 },
    ],
  },
};

async function seedContent() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI manquant dans .env.local');
    process.exit(1);
  }
  try {
    await mongoose.connect(MONGODB_URI);
  } catch (err) {
    console.error('Impossible de se connecter à MongoDB:', err.message);
    process.exit(1);
  }
  console.log('Connected to MongoDB');

  for (const data of COURSES_DATA) {
    const { slug, title, description, order, color, bgColor, sections } = data;
    const course = await Course.findOneAndUpdate(
      { slug },
      { title, description, order, color, bgColor, sections },
      { new: true, upsert: true }
    );
    console.log('Cours mis à jour:', slug, `(${sections.length} sections)`);

    const quizData = QUIZZES_DATA[slug];
    if (quizData) {
      await Quiz.findOneAndUpdate(
        { courseId: course._id },
        { title: quizData.title, questions: quizData.questions },
        { new: true, upsert: true }
      );
      console.log('Quiz mis à jour:', slug, `(${quizData.questions.length} questions)`);
    }
  }

  await mongoose.disconnect();
  console.log('Seed contenu terminé.');
}

seedContent().catch((err) => {
  console.error(err);
  process.exit(1);
});
