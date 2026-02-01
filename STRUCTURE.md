# Structure du Projet StratQuest

## Organisation

```
strat-quest-master/
├── frontend/                 # Application React (Vite)
│   ├── src/
│   │   ├── app/
│   │   │   ├── pages/        # Pages par fonctionnalité
│   │   │   ├── layout/       # Layout, ProtectedRoute, AdminRoute
│   │   │   ├── context/      # AuthContext, GameContext
│   │   │   └── shared/       # API client, composants UI, figma
│   │   ├── styles/           # CSS (fonts, tailwind, theme)
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── backend-next/             # API Next.js + MongoDB
│   ├── app/api/              # Routes API (auth, courses, quizzes, users, rankings)
│   ├── lib/                  # auth, cors, mongodb
│   ├── models/               # Mongoose (Course, Quiz, User, etc.)
│   ├── scripts/              # seed-admin, seed-content
│   └── package.json
│
├── .gitignore
├── README.md
├── LICENSE.md
└── STRUCTURE.md
```

## Fichiers supprimés (nettoyage)

- **backend/** (Express) – Ancien backend inutilisé :
  - `index.js` était vide
  - Structure incompatible avec le frontend (News vs Courses)
  - Le frontend utilise uniquement `backend-next` (port 3001)
