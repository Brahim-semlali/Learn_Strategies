# Installation StratQuest avec Docker

Ce guide permet de lancer **StratQuest** entièrement avec Docker (MongoDB, API, frontend) après avoir cloné ou récupéré le projet.

---

## Prérequis

- **Docker** et **Docker Compose** installés sur votre machine.
  - [Docker Desktop (Windows / Mac)](https://www.docker.com/products/docker-desktop/)
  - Ou [Docker Engine](https://docs.docker.com/engine/install/) + [Docker Compose](https://docs.docker.com/compose/install/) sous Linux.

Vérification :

```bash
docker --version
docker compose version
```

---

## 1. Récupérer le projet

```bash
git clone https://github.com/AmbitiousFlowDev/strat-quest.git
cd strat-quest
```

*(Ou décompresser l’archive du projet et ouvrir un terminal dans le dossier `strat-quest`.)*

---

## 2. Construire et démarrer les conteneurs

À la **racine du projet** (là où se trouve `docker-compose.yml`) :

```bash
docker compose up -d --build
```

- **`--build`** : construit les images (backend Next.js, frontend Vite) la première fois ou après modification du code.
- **`-d`** : lance les services en arrière-plan.

La première exécution peut prendre plusieurs minutes (téléchargement des images, installation des dépendances, build).

---

## 3. Créer le compte admin et les données (obligatoire)

Au **premier lancement**, la base MongoDB est vide. Il faut exécuter le script de seed **dans** le conteneur backend :

```bash
docker compose exec backend npm run seed:all
```

Cette commande :

- crée le compte **administrateur** ;
- insère les **cours** (VRIO, SWOT, Compétences clés) et les **quiz**.

Sans cette étape :

- la connexion avec le compte admin échouera (« email ou mot de passe incorrect ») ;
- les stratégies afficheront « Cours introuvable ».

Vous devez voir un message du type :  
`Compte admin créé: admin@stratquest.com / Admin123!`

---

## 4. Accéder à l’application

| Service   | URL (depuis votre navigateur) |
|-----------|--------------------------------|
| **Application (frontend)** | http://localhost:4173 |
| **API (backend)**          | http://localhost:3002 |

### Connexion admin

- **Email :** `admin@stratquest.com`  
- **Mot de passe :** `Admin123!`

---

## 5. Commandes utiles

| Action | Commande |
|--------|----------|
| Voir les logs (tous les services) | `docker compose logs -f` |
| Logs du backend uniquement | `docker compose logs -f backend` |
| Logs du frontend uniquement | `docker compose logs -f frontend` |
| Vérifier que les conteneurs tournent | `docker compose ps` |
| Arrêter les conteneurs | `docker compose down` |
| Arrêter et supprimer les données MongoDB | `docker compose down -v` |
| Reconstruire après modification du code | `docker compose up -d --build` |
| Relancer le seed (réinitialiser admin + cours) | `docker compose exec backend npm run seed:all` |

---

## 6. Ports utilisés

Les ports suivants doivent être **libres** sur votre machine :

| Port | Service |
|------|--------|
| **4173** | Frontend (interface web) |
| **3002** | API backend |
| **27018** | MongoDB (accès direct, ex. MongoDB Compass) |

Si un port est déjà utilisé, vous pouvez le modifier dans `docker-compose.yml` (par ex. `"3003:3001"` pour l’API, puis adapter `VITE_API_URL` pour le frontend et reconstruire).

---

## 7. Variables d’environnement (optionnel)

Par défaut, le backend utilise :

- **MONGODB_URI** : fourni par Docker Compose (connexion au conteneur MongoDB).
- **JWT_SECRET** : valeur par défaut dans le `docker-compose.yml`.

Pour personnaliser le **JWT_SECRET**, créez un fichier **`.env`** à la **racine du projet** (à côté de `docker-compose.yml`) :

```env
JWT_SECRET=votre-secret-long-et-aleatoire
```

Puis redémarrez :

```bash
docker compose down
docker compose up -d
```

---

## 8. Dépannage

| Problème | Solution |
|----------|----------|
| **« Port already allocated » / « bind: address already in use »** | Un autre programme ou conteneur utilise le port. Arrêtez-le ou changez le port dans `docker-compose.yml` (voir section 6). |
| **« email ou mot de passe incorrect »** | Exécutez le seed : `docker compose exec backend npm run seed:all`, puis connectez-vous avec `admin@stratquest.com` / `Admin123!`. |
| **« Cours introuvable » au clic sur une stratégie** | Même cause : base vide. Relancer `docker compose exec backend npm run seed:all`. |
| **« Cannot connect to the Docker daemon »** | Docker n’est pas démarré. Lancez Docker Desktop ou le service Docker. |
| **Page blanche ou erreur réseau sur le frontend** | Vérifiez que le backend est bien démarré (`docker compose ps`) et que vous accédez au frontend sur http://localhost:4173 (l’API est appelée sur le port 3002). |

---

## Récapitulatif des commandes (copier-coller)

```bash
# 1. Aller dans le projet
cd strat-quest

# 2. Démarrer tout
docker compose up -d --build

# 3. Créer l’admin et les cours (premier lancement)
docker compose exec backend npm run seed:all

# 4. Ouvrir l’application
# → http://localhost:4173
# → Connexion : admin@stratquest.com / Admin123!
```

---

Pour une installation **sans Docker** (Node.js + MongoDB en local), voir [SETUP.md](SETUP.md).
