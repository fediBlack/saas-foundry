# SaaS Foundry - Task Management Application

Une application SaaS moderne pour la gestion de tâches avec authentification sécurisée, validation stricte et tests complets.

**Status:** ✅ **PRODUCTION READY** | **Version:** v0.8.0

## 📋 Vue d'ensemble

SaaS Foundry est une application complète composée de :

- **Backend** - API REST avec Express, Prisma, JWT, Zod
- **Frontend** - Interface Vue 3 avec TypeScript
- **UI Kit** - Composants réutilisables
- **Tests** - 90+ tests unitaires et d'intégration

## 🚀 Features

### ✅ Phase 1: Architecture & Setup (v0.4.0)
- Centralized TypeScript type definitions
- Axios API client with interceptors
- Reusable composables (useApi, useTasks)
- Pinia state management (auth, task)
- Vue Router with protected routes

### ✅ Phase 2: Reusable Components (v0.5.0)
- 6 reusable UI components
- 2 layout systems (AppLayout, AuthLayout)
- Responsive design with Tailwind CSS
- Refactored views (clean code)
- Mobile-first architecture

### ✅ Phase 3: Validation & Testing (v0.7.0)
- Zod schemas for validation
- Client-side form validation
- Vitest test suite (32 tests)
- Environment configuration
- Password requirements enforcement

### ✅ Phase 4: Full Stack Integration (v0.8.0)
- Frontend ↔ Backend communication verified
- All CRUD operations tested end-to-end
- Comprehensive API documentation
- Integration test suite
- Both servers running simultaneously

### Security
- Mots de passe hashés (bcryptjs)
- JWT authentication
- httpOnly cookies + sameSite strict
- Validation des inputs (client + server)
- Isolation des données par utilisateur
- CORS configuration

## 📦 Structure du projet

```
saas-foundry/
├── frontend/                # Vue 3 + TypeScript
│   ├── src/
│   │   ├── __tests__/       # Unit + integration tests
│   │   ├── components/      # Reusable Vue components
│   │   ├── composables/     # Vue composition functions
│   │   ├── layouts/         # Layout wrappers
│   │   ├── router/          # Vue Router config
│   │   ├── schemas/         # Zod validation
│   │   ├── stores/          # Pinia state
│   │   ├── types/           # TypeScript definitions
│   │   ├── utils/           # Utilities
│   │   └── views/           # Page components
│   ├── vitest.config.ts     # Test config
│   ├── vite.config.ts       # Build config
│   └── package.json         # Dependencies
│
├── backend/                 # Express.js API
│   ├── src/
│   │   ├── controllers/     # Business logic
│   │   ├── routes/          # Route definitions
│   │   ├── middlewares/     # Auth, validation, errors
│   │   ├── schemas/         # Zod validation
│   │   ├── types/           # TypeScript interfaces
│   │   ├── utils/           # Utilities
│   │   └── index.ts         # Express setup
│   ├── prisma/              # Database ORM
│   ├── jest.config.js       # Test config
│   └── package.json         # Dependencies
│
├── vue3-ui-kit/             # Custom component library
├── API_DOCUMENTATION.md     # Complete API reference
├── PROJECT_SUMMARY.md       # Detailed project info
├── PHASE_4_INTEGRATION.md   # Integration status
└── README.md                # This file
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
