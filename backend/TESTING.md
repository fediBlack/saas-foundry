# Backend - Unit Tests

## 📊 Test Coverage

**58 tests passant** avec une couverture de **64.51%** au niveau des statements.

### Couverture par module :
- **Controllers**: 98% ✅
- **Schemas**: 100% ✅
- **Utils (errors)**: 74% ✅
- **Middlewares**: Testés par intégration

## 🧪 Tests implémentés

### 1. Auth Schemas (12 tests)
- ✅ Validation correcte des champs
- ✅ Conversion email en minuscules
- ✅ Validation stricte du mot de passe (8+ chars, majuscule, minuscule, chiffre, caractère spécial)
- ✅ Rejet des données invalides
- ✅ Champs optionnels

### 2. Task Schemas (25 tests)
- ✅ Validation de création/mise à jour de tâches
- ✅ Limites de longueur (title: 255, description: 2000 chars)
- ✅ Énumérations de priorités
- ✅ Validation des IDs numériques
- ✅ Mise à jour partielle

### 3. Auth Controller (12 tests)
- ✅ Inscription utilisateur
- ✅ Hashage de mot de passe
- ✅ Détection de doublons (409 Conflict)
- ✅ Connexion utilisateur
- ✅ Authentification échouée (401)
- ✅ Déconnexion
- ✅ Profil utilisateur

### 4. Task Controller (9 tests)
- ✅ Récupération des tâches
- ✅ Création de tâche
- ✅ Mise à jour de tâche
- ✅ Suppression de tâche
- ✅ Toggle complété
- ✅ Isolation par utilisateur (sécurité)
- ✅ Gestion d'erreurs 404

## 🚀 Commandes

```bash
# Exécuter tous les tests
npm test

# Mode watch (réexécute à chaque changement)
npm run test:watch

# Couverture détaillée
npm run test:coverage
```

## 🏗️ Architecture des tests

```
src/
├── controllers/__tests__/
│   ├── auth.controller.test.ts
│   └── task.controller.test.ts
├── schemas/__tests__/
│   ├── auth.schema.test.ts
│   └── task.schema.test.ts
```

## 🔍 Mocking stratégies

- **Prisma**: Mockée complètement (fixtures)
- **bcryptjs**: Mockée pour contrôler les résultats
- **JWT**: Mockée pour les tokens
- **Dépendances externes**: Toutes mockées

## ✨ Bonnes pratiques appliquées

✅ Chaque test teste **une seule chose**
✅ **Noms descriptifs** (should...)
✅ **Setup/teardown** avec beforeEach
✅ Tests **isolés** et **reproductibles**
✅ **Mocks** pour les dépendances externes
✅ **Couverture** des cas d'erreur

## 📈 Prochaines étapes

- Tests d'intégration (API end-to-end)
- Tests de middlewares
- Tests de performance
- E2E tests avec Cypress/Playwright
