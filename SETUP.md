# Guide d'installation – StratQuest

Ce guide décrit les étapes pour cloner et lancer le projet StratQuest sur votre machine.

---

## 1. Prérequis

Installez les logiciels suivants avant de commencer :

| Logiciel      | Version   | Lien de téléchargement                    |
|---------------|-----------|-------------------------------------------|
| **Node.js**   | v18 ou +  | https://nodejs.org/                       |
| **npm**       | (inclus avec Node.js) | —                              |
| **MongoDB**   | 6+ ou Atlas | https://www.mongodb.com/try/download/community ou [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) |

---

## 2. Cloner le projet

```bash
git clone https://github.com/AmbitiousFlowDev/strat-quest.git
cd strat-quest
```

---

## 3. Configurer MongoDB

Choisissez une des options suivantes.

### Option A : MongoDB Atlas (recommandé, sans installation locale)

1. Créez un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un cluster gratuit (M0)
3. Dans **Database Access**, créez un utilisateur (nom + mot de passe)
4. Dans **Network Access**, ajoutez `0.0.0.0/0` pour autoriser les connexions
5. Cliquez sur **Connect** → **Drivers** et copiez l’URI de connexion

Exemple d’URI :

```
mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/strat-quest
```

### Option B : MongoDB en local

- **Installation manuelle :** installez [MongoDB Community](https://www.mongodb.com/try/download/community)
- **Avec Docker :**

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

URI par défaut : `mongodb://localhost:27017/strat-quest`

---

## 4. Backend (API)

### 4.1 Installer les dépendances

```bash
cd backend-next
npm install
```

### 4.2 Créer le fichier de configuration

Créez un fichier `.env.local` à la racine de `backend-next` :

```bash
# Copier le fichier exemple
cp .env.example .env.local

# Puis éditez .env.local et renseignez vos valeurs
```

Contenu de `.env.local` :

```
MONGODB_URI=mongodb://localhost:27017/strat-quest
JWT_SECRET=votre-secret-jwt-unique-et-long
```

- **MongoDB Atlas :** remplacez `MONGODB_URI` par l’URI fournie par Atlas
- **JWT_SECRET :** utilisez une chaîne aléatoire et longue (ex. `openssl rand -base64 32`)

### 4.3 Créer le compte admin et les données de base

```bash
npm run seed          # Crée le compte administrateur
npm run seed:content  # (Optionnel) Ajoute les cours et quiz
```

### 4.4 Lancer le backend

```bash
npm run dev
```

L’API tourne sur **http://localhost:3001**.

---

## 5. Frontend

Ouvrez un **nouveau terminal** à la racine du projet.

### 5.1 Installer les dépendances

```bash
cd frontend
npm install
```

### 5.2 Configuration (optionnelle)

Si l’API n’est pas sur `http://localhost:3001`, créez un fichier `.env` dans `frontend` :

```
VITE_API_URL=http://localhost:3001/api
```

*(Par défaut, le frontend utilise déjà cette URL.)*

### 5.3 Lancer le frontend

```bash
npm run dev
```

L’application tourne sur **http://localhost:5173**.

---

## 6. Vérifier que tout fonctionne

1. Ouvrez **http://localhost:5173** dans votre navigateur
2. Cliquez sur **Login**
3. Connectez-vous avec le compte admin :
   - **Email :** `admin@stratquest.com`
   - **Mot de passe :** `Admin123!`
4. Vous devriez accéder au dashboard et à la section Admin

---

## Récapitulatif des commandes

| Ordre | Emplacement   | Commande              |
|-------|---------------|------------------------|
| 1     | `backend-next`| `npm install`          |
| 2     | `backend-next`| Créer `.env.local`     |
| 3     | `backend-next`| `npm run seed`         |
| 4     | `backend-next`| `npm run seed:content` (optionnel) |
| 5     | `backend-next`| `npm run dev`          |
| 6     | `frontend`    | `npm install`          |
| 7     | `frontend`    | `npm run dev`          |

---

## Lancer tout le projet avec Docker

Si vous avez **Docker** et **Docker Compose** installés, vous pouvez lancer l’application complète (MongoDB + backend + frontend) en une commande.

### Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (ou Docker + Docker Compose)

### Commandes

À la **racine du projet** (`strat-quest`) :

```bash
# Construire et démarrer tous les services
docker compose up -d --build

# Premier lancement : créer le compte admin ET les cours/quiz (obligatoire)
docker compose exec backend npm run seed:all
```

Sans cette étape, la base est vide : connexion admin impossible et « Cours introuvable » au clic sur une stratégie.

### Accès

| Service   | URL                    |
|----------|------------------------|
| Frontend | http://localhost:4173  |
| API      | http://localhost:3002  |
| MongoDB  | localhost:27018         |

**Connexion admin (après avoir exécuté le seed) :** **admin@stratquest.com** / **Admin123!**

### Commandes utiles

```bash
# Voir les logs
docker compose logs -f

# Arrêter les conteneurs
docker compose down

# Arrêter et supprimer les données MongoDB
docker compose down -v
```

Pour personnaliser le `JWT_SECRET`, créez un fichier `.env` à la racine avec `JWT_SECRET=votre-secret` ; `docker compose` le lira automatiquement.

---

## Dépannage

| Problème | Solution |
|----------|----------|
| **« Impossible de joindre le serveur »** | Vérifiez que le backend tourne sur le port 3001 et que `VITE_API_URL` pointe vers `http://localhost:3001/api` |
| **Erreur MongoDB `querySrv ECONNREFUSED`** | Avec Atlas, utilisez le **Standard connection string** (non SRV) depuis la console Atlas |
| **Port 3001 ou 5173 déjà utilisé** | Changez le port ou arrêtez le processus qui l’utilise |
| **Erreur JWT / authentification** | Vérifiez que `JWT_SECRET` est défini dans `.env.local` du backend |

---

## Ressources

- [Backend – README détaillé](backend-next/README.md)
- [Structure du projet](STRUCTURE.md)
