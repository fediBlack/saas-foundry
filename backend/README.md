# SaaS Backend API

API REST professionnelle pour la gestion de tâches avec authentification sécurisée.

## 🚀 Features

✅ **Authentification JWT** - Tokens sécurisés avec cookies httpOnly
✅ **Validation stricte** - Zod pour validation côté serveur
✅ **Gestion d'erreurs** - Centralisée et structurée
✅ **Tests complets** - 58 tests unitaires (64% couverture)
✅ **Type-safe** - TypeScript strict
✅ **Production-ready** - Sécurité et bonnes pratiques

## 📋 Endpoints

### Authentication
```
POST   /api/auth/register    - Créer un compte
POST   /api/auth/login       - Se connecter
POST   /api/auth/logout      - Se déconnecter
GET    /api/auth/me          - Profil utilisateur
```

### Tasks
```
GET    /api/tasks            - Lister les tâches
GET    /api/tasks/:id        - Détails d'une tâche
POST   /api/tasks            - Créer une tâche
PUT    /api/tasks/:id        - Mettre à jour
DELETE /api/tasks/:id        - Supprimer
PATCH  /api/tasks/:id/toggle - Basculer complété
```

## 🛠️ Installation

```bash
# Installer les dépendances
npm install

# Configurer la base de données
npm run prisma:migrate

# Générer le client Prisma
npm run prisma:generate
```

## 📝 Variables d'environnement

```env
PORT=5000
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"
```

## 🏃 Commandes

```bash
# Développement
npm run dev

# Build
npm build

# Production
npm start

# Tests
npm test                 # Tous les tests
npm run test:watch      # Mode watch
npm run test:coverage   # Rapport de couverture

# Base de données
npm run prisma:studio   # Interface Prisma
npm run prisma:migrate  # Migration
```

## 📚 Documentation

- [Validation System](./VALIDATION.md) - Schémas Zod et validation
- [Testing Guide](./TESTING.md) - Structure et couverture des tests

## 🔐 Sécurité

- ✅ Mots de passe hashés avec bcryptjs
- ✅ Cookies httpOnly + sameSite strict
- ✅ CORS configuré
- ✅ Validation stricte des inputs
- ✅ Isolation des données par utilisateur

## 📊 Architecture

```
src/
├── controllers/          # Logique métier
├── routes/              # Définition des routes
├── middlewares/         # Auth, validation, erreurs
├── schemas/             # Validation Zod
├── types/               # Types TypeScript
├── utils/               # JWT, Prisma, Erreurs
└── index.ts             # Point d'entrée
```

## 🧪 Tests

```bash
npm test                    # Exécuter les tests
npm run test:coverage       # Couverture détaillée
```

**Couverture actuelle**: 64.51% (58 tests)

## 📦 Dépendances principales

- **express** - Framework HTTP
- **prisma** - ORM
- **zod** - Validation
- **bcryptjs** - Hashage de mots de passe
- **jsonwebtoken** - JWT
- **jest** - Tests unitaires

## 🚀 Déploiement

Le backend est prêt pour :
- ✅ Docker
- ✅ Heroku
- ✅ AWS
- ✅ Vercel
- ✅ Railway

Voir `.env.example` pour la configuration de base.

## 📝 License

ISC

## 👥 Author

fediBlack

---

**Status**: ✅ Production-ready avec tests complets
