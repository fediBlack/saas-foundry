# Backend - Validation & Error Handling

## 🔐 Validation System

Ce projet utilise **Zod** pour la validation stricte des données. Chaque endpoint valide automatiquement les données entrantes.

### Schémas de validation

#### Auth Endpoints

**POST /api/auth/register**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

Validations:
- `email`: Email valide, requis, converti en minuscules
- `password`: Min 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial (@$!%*?&)
- `name`: Min 2 caractères, optionnel

**POST /api/auth/login**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

#### Task Endpoints

**POST /api/tasks**
```json
{
  "title": "My Task",
  "description": "Task description",
  "priority": "HIGH"
}
```

Validations:
- `title`: 1-255 caractères, requis
- `description`: Max 2000 caractères, optionnel
- `priority`: Enum (LOW, MEDIUM, HIGH)

**PUT /api/tasks/:id**
```json
{
  "title": "Updated Task",
  "completed": true
}
```

## 🚨 Error Handling

Les erreurs sont centralisées et structurées:

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "password",
      "message": "Password must contain: uppercase, lowercase, number, and special character"
    }
  ]
}
```

### Types d'erreurs

- **ValidationError** (400): Données invalides
- **AuthenticationError** (401): Authentification échouée
- **ConflictError** (409): Ressource déjà existante
- **NotFoundError** (404): Ressource non trouvée
- **AppError** (500): Erreur serveur générique

## ✨ Features

✅ Validation Zod complète
✅ Middleware de validation réutilisable
✅ Gestion d'erreurs centralisée
✅ Messages d'erreur détaillés
✅ Sécurité des cookies améliorée (sameSite: strict)

## 🚀 Prochaines étapes recommandées

- Tests unitaires avec Jest
- Email verification
- Rate limiting
- Refresh tokens
