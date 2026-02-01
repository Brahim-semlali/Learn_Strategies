/**
 * Test de connexion MongoDB - affiche l'erreur réelle (souvent différente du message "whitelist")
 * Usage: node scripts/test-connection.js
 */
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI manquant dans .env.local');
  process.exit(1);
}

// Masquer le mot de passe dans les logs
const safeUri = uri.replace(/:([^@]+)@/, ':****@');
console.log('Connexion à MongoDB...');
console.log('URI (mot de passe masqué):', safeUri);
console.log('');

mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 })
  .then(() => {
    console.log('OK - Connexion réussie.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('ERREUR détaillée:');
    console.error('  Nom:', err.name);
    console.error('  Message:', err.message);
    const hasNetworkError = err.reason && err.reason.servers && [...err.reason.servers.values()].some(s => s.error);
    let netErr = null;
    if (hasNetworkError) {
      const firstServer = [...err.reason.servers.values()][0];
      netErr = firstServer && firstServer.error;
      if (netErr) {
        console.error('  Erreur réseau réelle:', netErr.message || netErr);
      }
    }
    console.error('');
    if (err.message && err.message.includes('authentication')) {
      console.error('=> Mot de passe ou utilisateur incorrect. Vérifiez Database Access dans Atlas.');
    } else if (err.message && err.message.includes('replicaSet')) {
      console.error('=> Récupérez l\'URI complète dans Atlas : Connect → Drivers → Standard connection string');
    } else if (hasNetworkError || (err.reason && err.reason.servers)) {
      const netMsg = netErr ? (netErr.message || '') : '';
      const dnsFail = (err.message && err.message.includes('ENOTFOUND')) || (typeof netMsg === 'string' && netMsg.includes('ENOTFOUND'));
      if (dnsFail) {
        console.error('=> DNS : votre réseau ne résout pas les noms Atlas (ENOTFOUND).');
        console.error('   Solutions :');
        console.error('   1) Changer le DNS Windows : 8.8.8.8 (Google) ou 1.1.1.1 (Cloudflare)');
        console.error('   2) OU utiliser MongoDB en LOCAL (voir ci-dessous)');
      } else {
        console.error('=> Connexion RÉSEAU bloquée (pare-feu / port 27017).');
        console.error('   À essayer : antivirus, pare-feu Windows, ou autre réseau (4G).');
      }
      console.error('');
      console.error('   MongoDB en local (contournement) :');
      console.error('   - Docker : docker run -d -p 27017:27017 --name mongodb mongo:latest');
      console.error('   - Puis dans .env.local : MONGODB_URI=mongodb://localhost:27017/strat-quest');
    }
    process.exit(1);
  });
