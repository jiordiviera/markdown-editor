#!/bin/bash

# Script pour générer un JWT_SECRET sécurisé
# Utilisation: ./generate-jwt-secret.sh

echo "🔐 Génération d'un JWT_SECRET sécurisé..."
echo ""

# Méthode 1: OpenSSL (recommandée)
echo "1. Avec OpenSSL (64 caractères) :"
JWT_SECRET_1=$(openssl rand -base64 64 | tr -d '\n')
echo "JWT_SECRET=\"$JWT_SECRET_1\""
echo ""

# Méthode 2: OpenSSL hex (plus court)
echo "2. Avec OpenSSL hex (32 octets) :"
JWT_SECRET_2=$(openssl rand -hex 32)
echo "JWT_SECRET=\"$JWT_SECRET_2\""
echo ""

# Méthode 3: Utiliser /dev/urandom
echo "3. Avec /dev/urandom :"
JWT_SECRET_3=$(head -c 32 /dev/urandom | base64 | tr -d '\n')
echo "JWT_SECRET=\"$JWT_SECRET_3\""
echo ""

# Méthode 4: Utiliser Node.js crypto
echo "4. Avec Node.js crypto :"
JWT_SECRET_4=$(node -e "console.log(require('crypto').randomBytes(64).toString('base64'))")
echo "JWT_SECRET=\"$JWT_SECRET_4\""
echo ""

echo "📋 Copiez l'une de ces clés dans vos variables d'environnement Vercel"
echo "💡 Recommandation: Utilisez la méthode 1 ou 4 pour plus de sécurité"
echo ""
echo "🔗 Variables d'environnement Vercel:"
echo "   https://vercel.com/docs/concepts/projects/environment-variables"
