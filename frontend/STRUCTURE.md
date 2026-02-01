# Structure du Projet StratQuest (Frontend)

## 📁 Organisation des fichiers

```
src/app/
├── pages/                    # Pages de l'application organisées par fonctionnalité
│   ├── auth/                 # Authentification
│   │   ├── LoginPage.tsx
│   │   └── SignupPage.tsx
│   ├── dashboard/            # Tableau de bord
│   │   └── DashboardPage.tsx
│   ├── rankings/             # Classement
│   │   └── RankingsPage.tsx
│   ├── profile/              # Profil utilisateur
│   │   └── ProfilePage.tsx
│   └── strategies/           # Stratégies d'apprentissage
│       ├── HomePage.tsx      # Liste des stratégies
│       ├── LearningPage.tsx  # Apprentissage d'une stratégie
│       └── QuizPage.tsx      # Quiz d'une stratégie
│
├── layout/                   # Composants de layout
│   ├── Layout.tsx            # Layout principal avec sidebar
│   └── ProtectedRoute.tsx   # Route protégée
│
├── shared/                   # Composants et utilitaires partagés
│   └── components/
│       ├── ui/               # Composants UI (shadcn/ui)
│       ├── figma/            # Composants Figma
│       └── GameAuthSync.tsx  # Synchronisation Game/Auth
│
├── context/                  # Contextes React
│   ├── AuthContext.tsx       # Gestion de l'authentification
│   └── GameContext.tsx      # Gestion du jeu (points, badges, etc.)
│
└── App.tsx                   # Point d'entrée de l'application
```

## 🎯 Organisation par fonctionnalité

### Pages d'authentification (`pages/auth/`)
- **LoginPage** : Connexion utilisateur
- **SignupPage** : Inscription utilisateur

### Pages principales (`pages/`)
- **dashboard/** : Vue d'ensemble avec statistiques
- **rankings/** : Classement des joueurs
- **profile/** : Profil et progression de l'utilisateur
- **strategies/** : Apprentissage des stratégies (VRIO, SWOT, Core Competence)

### Layout (`layout/`)
- **Layout** : Layout principal avec sidebar et navigation
- **ProtectedRoute** : Wrapper pour routes protégées

### Composants partagés (`shared/`)
- **components/ui/** : Bibliothèque de composants UI réutilisables
- **components/figma/** : Composants spécifiques Figma
- **GameAuthSync** : Synchronisation entre GameContext et AuthContext

## 📝 Imports

Tous les imports utilisent l'alias `@/` qui pointe vers `src/` :

```typescript
// Exemples d'imports
import { LoginPage } from '@/app/pages/auth/LoginPage';
import { DashboardPage } from '@/app/pages/dashboard/DashboardPage';
import { Layout } from '@/app/layout/Layout';
import { Button } from '@/app/shared/components/ui/button';
import { useAuth } from '@/app/context/AuthContext';
```

## 🔄 Routes

- `/login` - Page de connexion (publique)
- `/signup` - Page d'inscription (publique)
- `/dashboard` - Tableau de bord (protégée)
- `/rankings` - Classement (protégée)
- `/` - Liste des stratégies (protégée)
- `/learn/:strategy` - Apprendre une stratégie (protégée)
- `/quiz/:strategy` - Quiz d'une stratégie (protégée)
- `/profile` - Profil utilisateur (protégée)

## 🎨 Stratégies disponibles

1. **VRIO** - Value, Rarity, Imitability, Organization
2. **SWOT** - Strengths, Weaknesses, Opportunities, Threats
3. **Core Competence** - Compétences clés distinctives
