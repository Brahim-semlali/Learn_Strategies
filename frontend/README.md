# StrategyLearn

Application d'apprentissage des stratégies d'entreprise avec authentification, dashboard et classements.

## 🚀 Démarrage rapide

### Option 1 : Utiliser le script batch (Windows)
Double-cliquez sur `start.bat` dans le dossier du projet.

### Option 2 : Utiliser les commandes manuelles

1. **Installer Node.js** (si pas déjà installé)
   - Téléchargez depuis [nodejs.org](https://nodejs.org/)
   - Version recommandée : 18.x ou supérieure

2. **Ouvrir un terminal** dans le dossier du projet

3. **Installer les dépendances** :
```bash
npm install
```

4. **Lancer le projet** :
```bash
npm run dev
```

Le projet sera accessible sur **http://localhost:5173**

## 📋 Prérequis

- Node.js (version 18 ou supérieure)
- npm (inclus avec Node.js)

## Scripts disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Compile le projet pour la production
- `npm run preview` - Prévisualise la version de production
- `npm run lint` - Vérifie le code avec ESLint

## Structure du projet

```
src/
  app/
    components/     # Composants React
    context/        # Contextes (Auth, Game)
    App.tsx         # Composant principal
  styles/           # Fichiers CSS
  main.tsx          # Point d'entrée
```

## Fonctionnalités

- ✅ Authentification (Login/Signup)
- ✅ Dashboard avec statistiques
- ✅ Classement des joueurs
- ✅ Apprentissage des stratégies (VRIO, SWOT, Core Competence)
- ✅ Quiz interactifs
- ✅ Système de points et badges
- ✅ Navigation avec sidebar

## Technologies utilisées

- React 18
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Motion (animations)
- Radix UI (composants)
