# SaaS Foundry - Task Management Application

Une application SaaS moderne pour la gestion de tâches avec authentification sécurisée, validation stricte et tests complets.

## 📋 Vue d'ensemble

SaaS Foundry est une application complète composée de :

- **Backend** - API REST avec Express, Prisma, JWT, Zod
- **Frontend** - Interface Vue 3 avec TypeScript
- **UI Kit** - Composants réutilisables

## 🚀 Features

### ✅ Backend
- Authentification JWT + Cookies sécurisés
- Validation stricte avec Zod
- 58 tests unitaires (64.51% coverage)
- Gestion d'erreurs centralisée
- Base de données SQLite avec Prisma
- Type-safe avec TypeScript strict

### ✅ Frontend
- Vue 3 + TypeScript
- UI Kit composants
- State management avec Pinia
- Système de routing

### ✅ Sécurité
- Mots de passe hashés (bcryptjs)
- JWT authentication
- httpOnly cookies + sameSite strict
- Validation des inputs
- Isolation des données par utilisateur

## 📦 Structure du projet

```
saas-foundry/
├── backend/                # API REST
│   ├── src/
│   │   ├── controllers/    # Logique métier
│   │   ├── routes/         # Routes API
│   │   ├── middlewares/    # Auth, validation, erreurs
│   │   ├── schemas/        # Validation Zod
│   │   ├── types/          # Types TypeScript
│   │   ├── utils/          # JWT, Prisma, Erreurs
│   │   └── index.ts        # Point d'entrée
│   ├── prisma/             # ORM configuration
│   ├── jest.config.js      # Tests config
│   ├── package.json        # Dépendances
│   ├── README.md           # Documentation backend
│   ├── VALIDATION.md       # Système de validation
│   └── TESTING.md          # Guide des tests
│
├── frontend/               # Application Vue 3
│   ├── src/
│   │   ├── components/     # Composants Vue
│   │   ├── views/          # Pages
│   │   ├── stores/         # Pinia stores
│   │   ├── router/         # Routing
│   │   └── main.ts         # Point d'entrée
│   ├── package.json        # Dépendances
│   └── vite.config.ts      # Vite configuration
│
└── README.md               # Ce fichier
```

## 🛠️ Installation

### Prerequisites
- Node.js >= 16
- npm ou yarn

### Backend Setup

```bash
cd backend

# Installer les dépendances
npm install

# Configurer la base de données
npm run prisma:migrate

# Générer le client Prisma
npm run prisma:generate

# Créer .env
cp .env.example .env
```

### Frontend Setup

```bash
cd frontend

# Installer les dépendances
npm install

# Créer .env
echo "VITE_API_URL=http://localhost:5000/api" > .env.local
```

## 🏃 Commandes

### Backend
```bash
cd backend

# Développement
npm run dev

# Tests
npm test
npm run test:coverage
npm run test:watch

# Build
npm run build

# Production
npm start

# Base de données
npm run prisma:studio
npm run prisma:migrate
```

### Frontend
```bash
cd frontend

# Développement
npm run dev

# Build
npm run build

# Preview
npm run preview
```

## 📚 Endpoints API

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

## 🧪 Tests

Le backend inclut une suite complète de tests :

```bash
cd backend

# Exécuter les tests
npm test

# Voir la couverture
npm run test:coverage

# Mode watch
npm run test:watch
```

**Coverage actuelle**: 64.51% (58 tests)

## 🔐 Sécurité

- ✅ JWT authentication
- ✅ bcryptjs password hashing
- ✅ httpOnly cookies + sameSite strict
- ✅ CORS configuré
- ✅ Validation stricte des inputs (Zod)
- ✅ Isolation des données par utilisateur
- ✅ Error handling sans leak d'info

## 📖 Documentation

Chaque module a sa propre documentation :

- **Backend** - `backend/README.md`
- **Validation** - `backend/VALIDATION.md`
- **Tests** - `backend/TESTING.md`

## 🤝 Contributing

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📝 License

ISC

## 👥 Author

fediBlack

---

**Status**: ✅ Production-ready avec tests complets

Last updated: 2025-12-15
