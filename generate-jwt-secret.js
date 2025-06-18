#!/usr/bin/env node

/**
 * Générateur de JWT_SECRET sécurisé
 * 
 * Ce script génère un JWT_SECRET cryptographiquement sécurisé
 * pour votre application Markdown Editor.
 */

const crypto = require('crypto');

console.log('🔐 Générateur de JWT_SECRET sécurisé\n');

// Méthode 1: Génération avec crypto.randomBytes (recommandée)
const jwtSecret1 = crypto.randomBytes(64).toString('hex');
console.log('Méthode 1 - crypto.randomBytes (64 bytes, hex):');
console.log(`JWT_SECRET="${jwtSecret1}"\n`);

// Méthode 2: Génération avec crypto.randomBytes (base64)
const jwtSecret2 = crypto.randomBytes(64).toString('base64');
console.log('Méthode 2 - crypto.randomBytes (64 bytes, base64):');
console.log(`JWT_SECRET="${jwtSecret2}"\n`);

// Méthode 3: Génération avec crypto.randomUUID (plus courte mais suffisante)
const jwtSecret3 = crypto.randomUUID() + crypto.randomUUID();
console.log('Méthode 3 - Double UUID:');
console.log(`JWT_SECRET="${jwtSecret3}"\n`);

// Méthode 4: Génération avec caractères alphanumériques
function generateAlphanumeric(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const jwtSecret4 = generateAlphanumeric(64);
console.log('Méthode 4 - Alphanumeric (64 caractères):');
console.log(`JWT_SECRET="${jwtSecret4}"\n`);

console.log('💡 Conseils de sécurité:');
console.log('• Utilisez la Méthode 1 ou 2 (crypto.randomBytes) - recommandée');
console.log('• Stockez le secret dans les variables d\'environnement Vercel');
console.log('• Ne committez JAMAIS le secret dans votre code source');
console.log('• Utilisez un secret différent pour chaque environnement (dev/prod)');
console.log('• Changez le secret si vous soupçonnez une compromission\n');

console.log('🚀 Comment utiliser:');
console.log('1. Copiez une des valeurs JWT_SECRET ci-dessus');
console.log('2. Dans Vercel: Project Settings > Environment Variables');
console.log('3. Ajoutez: JWT_SECRET = [la valeur copiée]');
console.log('4. Redéployez votre application');
