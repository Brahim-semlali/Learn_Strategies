# Utiliser MongoDB en local (si Atlas est bloqué par le réseau)

Si vous avez **MongoNetworkError** (connexion à Atlas bloquée par le pare-feu, l’antivirus ou le FAI), vous pouvez faire tourner MongoDB **en local** sur votre PC.

---

## Avec Docker (recommandé)

1. **Installez Docker Desktop** pour Windows : https://www.docker.com/products/docker-desktop/

2. **Démarrez un conteneur MongoDB** :
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

3. **Dans `backend-next/.env.local`**, mettez :
   ```env
   MONGODB_URI=mongodb://localhost:27017/strat-quest
   JWT_SECRET=un-secret-jwt
   ```

4. **Testez** :
   ```bash
   npm run test-db
   npm run seed
   ```

5. **Arrêter le conteneur plus tard** :
   ```bash
   docker stop mongodb
   ```
   **Redémarrer** :
   ```bash
   docker start mongodb
   ```

---

## Sans Docker (MongoDB Community)

1. Téléchargez **MongoDB Community Server** pour Windows :  
   https://www.mongodb.com/try/download/community

2. Installez-le (par défaut sur le port **27017**).

3. Démarrez le service MongoDB (Services Windows ou `net start MongoDB`).

4. Dans **`.env.local`** :
   ```env
   MONGODB_URI=mongodb://localhost:27017/strat-quest
   JWT_SECRET=un-secret-jwt
   ```

5. Puis `npm run test-db` et `npm run seed`.

---

Une fois la connexion locale OK, vous pouvez développer normalement ; le seed et l’API utiliseront la base locale.
