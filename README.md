
# 📝 Markdown Editor avec Authentification

Un éditeur de markdown moderne avec authentification utilisateur et sauvegarde en base PostgreSQL.

## 🚀 Fonctionnalités

### ✨ Éditeur
- **Éditeur Monaco** (même moteur que VS Code)
- **Prévisualisation live** côte à côte  
- **Syntax highlighting** pour les blocs de code
- **Support GitHub Flavored Markdown**
- **Interface responsive** (mobile/desktop)
- **Thème sombre/clair**

### 👤 Authentification
- **Inscription/Connexion** sécurisée
- **JWT tokens** pour l'authentification
- **Hash des mots de passe** avec bcrypt

### 💾 Gestion des documents
- **Sauvegarde** automatique en PostgreSQL
- **Création/Édition/Suppression** de documents
- **Documents publics** partageables
- **Liste** de tous vos documents

## 🏗️ Architecture

```
markdown-editor/
├── client/          # Frontend React + TypeScript + Vite
├── server/          # Backend Node.js + Express + Prisma
├── shared/          # Types TypeScript partagés
└── docker-compose.yml # PostgreSQL + Adminer
```

## 🛠️ Installation

### Prérequis
- **Node.js** 18+ et pnpm/ppnpm
- **Docker** et Docker Compose
- **Git**

### 1. Clone le projet
```bash
git clone https://github.com/jiordiviera/markdown-editor
cd markdown-editor
```

### 2. Démarrer PostgreSQL
```bash
docker-compose up -d
```

### 3. Installer les dépendances
```bash
pnpm run install:all
```

### 4. Setup de la base de données
```bash
pnpm run db:setup
```

### 5. Démarrer le développement
```bash
pnpm run dev
```

L'application sera disponible sur :
- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:3001
- **Adminer (DB admin)** : http://localhost:8080

## 📱 Utilisation

1. **Créer un compte** ou se connecter
2. **Créer un document** avec le bouton "+"
3. **Éditer** en markdown dans le panneau gauche
4. **Voir le rendu** en temps réel à droite
5. **Sauvegarder** automatiquement
6. **Partager** en rendant public

## 🔧 Scripts disponibles

```bash
# Développement
pnpm run dev                 # Démarre client + serveur
pnpm run dev:client         # Client seulement
pnpm run dev:server         # Serveur seulement

# Build
pnpm run build              # Build client + serveur
pnpm run build:client       # Build client seulement
pnpm run build:server       # Build serveur seulement

# Base de données
pnpm run db:setup           # Init + migrate
pnpm run db:studio          # Interface Prisma Studio
```

## 🌐 API Endpoints

### Auth
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion

### Documents
- `GET /api/documents` - Liste des documents
- `GET /api/documents/:id` - Récupérer un document
- `POST /api/documents` - Créer un document
- `PUT /api/documents/:id` - Mettre à jour un document
- `DELETE /api/documents/:id` - Supprimer un document
- `GET /api/documents/public/:id` - Document public

## 🚀 Déploiement

### Variables d'environnement

Créer un fichier `.env` dans `/server` :

```env
DATABASE_URL="postgresql://user:password@host:5432/db"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV="production"
FRONTEND_URL="https://yourdomain.com"
```

### Docker
```bash
# Build les images
docker-compose -f docker-compose.prod.yml build

# Démarrer
docker-compose -f docker-compose.prod.yml up -d
```

## 🔒 Sécurité

- **Mots de passe** hashés avec bcrypt (12 rounds)
- **JWT tokens** avec expiration
- **Rate limiting** (100 req/15min)
- **Helmet.js** pour les headers HTTP
- **CORS** configuré
- **Validation** des données avec Zod

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📄 Licence

MIT License - voir le fichier [LICENSE](LICENSE)

---

Fait avec ❤️ par [jiordiviera](https://github.com/jiordiviera)

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
