# Instructions pour lancer le projet

## Étape 1 : Installer Node.js

Si Node.js n'est pas installé sur votre ordinateur :

1. Allez sur https://nodejs.org/
2. Téléchargez la version LTS (Long Term Support)
3. Installez Node.js en suivant l'assistant d'installation
4. **Important** : Cochez l'option "Add to PATH" pendant l'installation

## Étape 2 : Vérifier l'installation

Ouvrez un nouveau terminal (PowerShell ou CMD) et tapez :
```bash
node --version
npm --version
```

Si les deux commandes affichent des numéros de version, Node.js est correctement installé.

## Étape 3 : Installer les dépendances

Dans le terminal, naviguez vers le dossier du projet :
```bash
cd C:\Users\pc\Desktop\Strategie
```

Puis installez les dépendances :
```bash
npm install
```

Cette étape peut prendre quelques minutes la première fois.

## Étape 4 : Lancer le projet

Une fois l'installation terminée, lancez le serveur de développement :
```bash
npm run dev
```

Vous verrez un message comme :
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## Étape 5 : Ouvrir dans le navigateur

Ouvrez votre navigateur et allez sur : **http://localhost:5173**

## 🎉 C'est prêt !

Vous pouvez maintenant :
- Créer un compte (Signup)
- Vous connecter (Login)
- Accéder au Dashboard
- Voir le Classement
- Apprendre les stratégies

## Commandes utiles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Compile pour la production
- `npm run preview` - Prévisualise la version de production

## Problèmes courants

### "npm n'est pas reconnu"
→ Node.js n'est pas installé ou pas dans le PATH. Réinstallez Node.js et cochez "Add to PATH".

### Erreur de port déjà utilisé
→ Un autre processus utilise le port 5173. Fermez l'autre application ou changez le port dans vite.config.ts

### Erreurs de dépendances
→ Supprimez le dossier `node_modules` et le fichier `package-lock.json`, puis relancez `npm install`
