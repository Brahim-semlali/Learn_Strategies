# Connexion MongoDB Atlas – dépannage

Si vous avez **"IP n'est pas autorisée"** alors que vous avez déjà **Allow Access from Anywhere (0.0.0.0/0)** :

1. L’erreur peut en réalité venir du **mot de passe**, du **replicaSet** ou du **réseau**.
2. Utilisez l’**URI exacte** fournie par Atlas.

---

## Récupérer l’URI Standard dans Atlas

1. Allez sur **https://cloud.mongodb.com** et connectez-vous.
2. Menu de gauche : **Database**.
3. Sur votre cluster (**cluster0**), cliquez sur **Connect**.
4. Choisissez **Drivers** (ou “Connect your application”).
5. **Driver** : Node.js, **Version** : 5.5 or later (ou la plus récente).
6. En bas, vous voyez une **connection string**.
7. Cliquez sur **“I have a connection string”** ou sur le lien **“Choose a connection method”** pour voir les deux options :
   - **SRV** : `mongodb+srv://...` (peut être bloqué par votre réseau → querySrv ECONNREFUSED).
   - **Standard** : `mongodb://...` avec plusieurs hosts → **utilisez celle-ci**.
8. Si vous ne voyez que le SRV : dans la zone de texte de l’URI, remplacez **`mongodb+srv://`** par **`mongodb://`** et regardez si Atlas propose une variante “Standard” ou copiez l’URI et adaptez (voir ci-dessous).
9. **Standard** ressemble à :
   ```
   mongodb://admin:<password>@cluster0-shard-00-00.2vnia1r.mongodb.net:27017,cluster0-shard-00-01.2vnia1r.mongodb.net:27017,cluster0-shard-00-02.2vnia1r.mongodb.net:27017/?ssl=true&replicaSet=atlasXXXXXX-shard-0&authSource=admin
   ```
10. **Copiez cette URI**.
11. Remplacez **`<password>`** par le **vrai mot de passe** de l’utilisateur **admin** (Database Access).
12. Si le mot de passe contient **@**, **#**, **:**, etc. → encodez pour l’URL (ex. `@` → `%40`).
13. **Ajoutez le nom de la base** avant le `?` :  
    Remplacez `/?ssl=true` par **`/strat-quest?ssl=true`**.
14. Collez le résultat dans **`.env.local`** :
    ```
    MONGODB_URI=mongodb://admin:VOTRE_MOT_DE_PASSE@cluster0-shard-00-00....
    JWT_SECRET=un-secret-jwt
    ```

---

## Vérifier l’utilisateur et le mot de passe

1. Atlas → **Database Access** (menu gauche).
2. L’utilisateur **admin** doit exister.
3. Cliquez sur **Edit** (crayon) → **Edit Password** si besoin.
4. Le mot de passe dans **`.env.local`** doit être **exactement** celui-ci (et encodé en URL si caractères spéciaux).

---

## Tester la connexion

```bash
npm run test-db
```

Ce script affiche l’erreur réelle (authentification, replica set, etc.) au lieu du message générique “whitelist”.
