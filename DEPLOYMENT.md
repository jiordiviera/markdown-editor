# Déploiement sur Vercel

Ce projet est configuré pour être déployé sur Vercel avec une base de données PostgreSQL externe.

## Prérequis

1. **Base de données PostgreSQL** : Vous devez avoir une base de données PostgreSQL accessible depuis Internet. Options recommandées :
   - **Neon** (gratuit) : https://neon.tech/
   - **Supabase** (gratuit) : https://supabase.com/
   - **PlanetScale** : https://planetscale.com/
   - **Railway** : https://railway.app/

2. **Compte Vercel** : https://vercel.com/

## Instructions de déploiement

### 1. Préparer la base de données

Si vous utilisez une base de données locale, vous devez d'abord la migrer vers un service cloud :

```bash
# Exporter votre base de données locale
pg_dump -h localhost -U your_username -d markdown_editor > backup.sql

# Importer dans votre nouvelle base de données cloud
psql "postgresql://username:password@hostname:port/database" < backup.sql
```

### 2. Configurer Vercel

1. **Connecter votre repo** :
   - Allez sur https://vercel.com/
   - Importez votre projet GitHub
   - Sélectionnez ce repository

2. **Variables d'environnement** :
   Dans les paramètres Vercel, ajoutez ces variables :

   ```
   DATABASE_URL=postgresql://username:password@hostname:port/database
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   ```

3. **Configuration du build** :
   - Root Directory: `./`
   - Build Command: `cd client && npm run build`
   - Output Directory: `client/dist`

### 3. Déployer

1. **Push vers GitHub** :
   ```bash
   git add .
   git commit -m "Configure for Vercel deployment"
   git push origin main
   ```

2. **Auto-déploiement** :
   Vercel déploiera automatiquement à chaque push sur la branche main.

### 4. Après le déploiement

1. **Migrations Prisma** :
   Après le premier déploiement, vous devrez peut-être exécuter les migrations :
   ```bash
   # Localement, avec l'URL de production
   DATABASE_URL="your-production-url" npx prisma migrate deploy
   ```

2. **Vérifier l'API** :
   - Accédez à `https://your-app.vercel.app/api/health`
   - Vous devriez voir : `{"status":"OK","timestamp":"..."}`

## Structure du projet pour Vercel

```
├── api/                 # API serverless pour Vercel
│   ├── index.ts        # Point d'entrée API
│   ├── routes/         # Routes Express
│   ├── middleware/     # Middleware Express
│   └── schema.prisma   # Schema Prisma
├── client/             # Frontend React
│   ├── src/
│   └── dist/          # Build output
└── vercel.json        # Configuration Vercel
```

## Services de base de données recommandés

### Neon (Recommandé - Gratuit)
```
1. Créer un compte sur https://neon.tech/
2. Créer une nouvelle base de données
3. Copier l'URL de connexion
4. Ajouter à vos variables d'environnement Vercel
```

### Supabase
```
1. Créer un compte sur https://supabase.com/
2. Créer un nouveau projet
3. Aller dans Settings > Database
4. Copier l'URL de connexion PostgreSQL
5. Ajouter à vos variables d'environnement Vercel
```

## Troubleshooting

### Erreur de connexion à la base de données
- Vérifiez que votre DATABASE_URL est correcte
- Assurez-vous que la base de données accepte les connexions externes
- Vérifiez les permissions de votre utilisateur de base de données

### Erreur 504 (Timeout)
- Les fonctions Vercel ont une limite de temps (30s par défaut)
- Si vos requêtes sont lentes, optimisez vos requêtes Prisma

### CORS Errors
- Vérifiez que votre domaine est bien configuré dans la liste CORS de l'API
- L'API est configurée pour accepter les requêtes de votre domaine Vercel

## Surveillance et logs

- **Logs Vercel** : https://vercel.com/dashboard
- **Fonction logs** : Cliquez sur votre fonction dans le dashboard
- **Monitoring** : Utilisez Vercel Analytics pour surveiller les performances
