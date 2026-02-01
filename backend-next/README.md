# StratQuest API (Next.js + MongoDB)

Backend de l'application StratQuest : API REST avec Next.js, authentification JWT et MongoDB.

## Prérequis

- Node.js 18+
- **MongoDB** : soit en local (port 27017), soit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (gratuit)

## Installation

```bash
cd backend-next
npm install
```

## MongoDB

Le seed et l’API ont besoin d’une base MongoDB.

- **Option A – MongoDB Atlas (cloud, sans install)**  
  1. Créez un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).  
  2. Créez un cluster gratuit et récupérez l’URI de connexion.  
  3. Dans `.env.local` (voir ci‑dessous), mettez :  
     `MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.xxxxx.mongodb.net/strat-quest`  
  **Si vous avez l’erreur `querySrv ECONNREFUSED`** (réseau ou DNS qui bloque le SRV) : dans Atlas, utilisez le **« Standard connection string »** (pas le SRV). Il ressemble à :  
  `MONGODB_URI=mongodb://USER:PASSWORD@cluster0-shard-00-00.xxxxx.mongodb.net:27017,cluster0-shard-00-01.xxxxx.mongodb.net:27017,cluster0-shard-00-02.xxxxx.mongodb.net:27017/strat-quest?ssl=true&replicaSet=atlas-xxx&authSource=admin`  
  (Copiez l’URI « Standard » depuis Atlas → Connect → Drivers → « Connection string ».)

- **Option B – MongoDB en local**  
  - Installez MongoDB Community ou lancez‑le avec Docker :  
    `docker run -d -p 27017:27017 --name mongodb mongo:latest`  
  - Sans `.env.local`, l’URI utilisée sera :  
    `mongodb://localhost:27017/strat-quest`

## Configuration

Créez un fichier `.env.local` à la racine de `backend-next` :

```
MONGODB_URI=mongodb://localhost:27017/strat-quest
JWT_SECRET=votre-secret-jwt-change-in-production
```

Pour Atlas, remplacez `MONGODB_URI` par l’URI fournie par le cluster.

## Lancer l'API

```bash
npm run dev
```

L'API est disponible sur **http://localhost:3001**.

## Compte admin

Un seul compte administrateur est prévu. Après avoir démarré MongoDB, exécutez le seed :

```bash
npm run seed
```

Cela crée le compte :

- **Email :** `admin@stratquest.com`
- **Mot de passe :** `Admin123!`

L'admin peut ensuite se connecter sur le frontend et accéder à la section **Admin** pour :

- Ajouter, modifier ou supprimer des **cours** et leur documentation (sections)
- Ajouter, modifier ou supprimer des **quiz** (questions par cours)

## Endpoints principaux

- `POST /api/auth/login` – Connexion
- `POST /api/auth/signup` – Inscription
- `GET /api/auth/me` – Utilisateur courant (Authorization: Bearer &lt;token&gt;)
- `GET /api/courses` – Liste des cours (public)
- `GET /api/courses/slug/:slug` – Cours par slug (public)
- `POST /api/courses` – Créer un cours (admin)
- `PUT /api/courses/:id` – Modifier un cours (admin)
- `DELETE /api/courses/:id` – Supprimer un cours (admin)
- `GET /api/quizzes?courseId=...` – Quiz d'un cours (public)
- `POST /api/quizzes` – Créer un quiz (admin)
- `PUT /api/quizzes/:id` – Modifier un quiz (admin)
- `DELETE /api/quizzes/:id` – Supprimer un quiz (admin)
- `GET /api/users/me/game` – État jeu (points, badges, streak)
- `PATCH /api/users/me/game` – Mettre à jour l'état jeu
- `GET /api/users/me/progress` – Progression par cours
- `PATCH /api/users/me/progress` – Mettre à jour la progression

## CORS

Le middleware autorise les requêtes depuis le frontend (origine dynamique ou `*` pour les API).
