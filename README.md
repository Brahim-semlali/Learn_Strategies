# Strat Quest: A Gamified Mobile Cloud-Based LMS (GMCLMS)

StratQuest is a web and mobile-responsive application designed to gamify the learning of complex business strategy concepts. Leveraging a React frontend and Next.js API backend, we move beyond passive reading to an interactive environment where users learn by "doing".

## 📖 Project Overview

The application creates an immersive learning environment using the **Narrative Wrapper** technique. The user is cast as a newly appointed **Chief Strategy Officer (CSO)** of a failing tech startup and must save the company by applying strategic models.

The pedagogical approach is grounded in the **8-Pointed Higher Education Gamification Star framework** proposed by Murillo-Zamorano et al. (2023), and the technical architecture follows the **GMCLMS** model described by Ahmed et al. (2025).

## 🏗 Project Structure

```
strat-quest-master/
├── frontend/          # React + Vite (UI principale)
├── backend-next/      # API Next.js + MongoDB (port 3001)
├── LICENSE.md
└── README.md
```

- **frontend/** – React 18, Vite, Tailwind, shadcn/ui. Gère l'interface utilisateur, les stratégies (VRIO, SWOT, Core Competence), quiz, classements, profils.
- **backend-next/** – API REST Next.js, authentification JWT, MongoDB. Cours, quiz, utilisateurs, points, classements.

## 🛠 Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend:** Next.js API Routes (Node.js)
- **Database:** MongoDB (local ou Atlas)

## 🚀 Installation & Setup

### Option A : Installation avec Docker (recommandé)

Si vous avez **Docker** et **Docker Compose**, vous pouvez tout lancer en quelques commandes :

```bash
git clone https://github.com/AmbitiousFlowDev/strat-quest.git
cd strat-quest
docker compose up -d --build
docker compose exec backend npm run seed:all
```

Puis ouvrir **http://localhost:4173** et se connecter avec **admin@stratquest.com** / **Admin123!**

→ **Guide complet (commandes, dépannage, ports) :** [DOCKER.md](DOCKER.md)

---

### Option B : Installation manuelle (Node.js + MongoDB)

> **Guide détaillé :** voir [SETUP.md](SETUP.md) pour les étapes complètes de clonage et démarrage.

### Prerequisites

- Node.js (v18+)
- npm or yarn
- MongoDB (local ou Atlas)

### 1. Backend (API)

```bash
cd backend-next
npm install
# Créer .env.local avec MONGODB_URI et JWT_SECRET (voir backend-next/README.md)
npm run seed        # Créer le compte admin
npm run seed:content  # Optionnel : contenu des cours
npm run dev         # Démarre sur http://localhost:3001
```

### 2. Frontend

```bash
cd frontend
npm install
# Optionnel : créer .env avec VITE_API_URL=http://localhost:3001/api si différent
npm run dev         # Démarre sur http://localhost:5173
```

### 3. Accès

- **Frontend :** http://localhost:5173
- **API :** http://localhost:3001
- **Compte admin :** `admin@stratquest.com` / `Admin123!` (après `npm run seed`)

## 🎮 Features

- **Leaderboards** – Classements des joueurs
- **XP & Leveling** – Suivi de la progression et des achievements
- **Stratégies** – VRIO, SWOT, Core Competence avec quiz
- **Certificats** – PDF après complétion des cours
- **Admin** – Gestion des cours et quiz

## 📚 References

1. Murillo-Zamorano et al. (2023): Gamification in higher education.
2. Ahmed et al. (2025): GMCLMS Architecture.
3. Dai et al. (2025): Gamified learning impact meta-analysis.
4. Ramsudeen (2025): Strategic Analytical Planning Tools.

**Team 4** – *Learning by Doing*.
