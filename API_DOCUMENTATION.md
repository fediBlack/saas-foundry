# 📚 API Documentation - SaaS Foundry

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require either:
- JWT token in `Authorization` header: `Authorization: Bearer <token>`
- Cookie stored automatically from login response

## Endpoints

### Authentication

#### Register User
```
POST /auth/register

Request Body:
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "Optional Name"
}

Response (200):
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "Optional Name",
    "createdAt": "2024-12-15T10:00:00Z"
  }
}

Error (400):
- Invalid email format
- Weak password (< 8 chars, missing uppercase/lowercase/digit/special char)
- Email already exists
```

#### Login
```
POST /auth/login

Request Body:
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response (200):
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "User Name",
    "createdAt": "2024-12-15T10:00:00Z"
  }
}

Cookies:
- auth_token: JWT token (httpOnly, secure, sameSite: strict)

Error (401):
- Invalid credentials
```

#### Get Current User
```
GET /auth/me

Headers:
Authorization: Bearer <token>

Response (200):
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "User Name",
    "createdAt": "2024-12-15T10:00:00Z"
  }
}

Error (401):
- Missing or invalid token
```

#### Logout
```
POST /auth/logout

Headers:
Authorization: Bearer <token>

Response (200):
{
  "message": "Logged out successfully"
}

Cookies:
- auth_token: Cleared (expires immediately)
```

---

### Tasks

#### List All Tasks
```
GET /tasks

Headers:
Authorization: Bearer <token>

Query Parameters:
- priority: LOW|MEDIUM|HIGH (optional filter)
- completed: true|false (optional filter)
- sortBy: title|createdAt|priority (optional)
- order: asc|desc (optional, default: desc)

Response (200):
{
  "tasks": [
    {
      "id": 1,
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "priority": "MEDIUM",
      "completed": false,
      "userId": 1,
      "createdAt": "2024-12-15T10:00:00Z",
      "updatedAt": "2024-12-15T10:00:00Z"
    }
  ],
  "count": 1
}

Error (401):
- Missing or invalid token
```

#### Get Single Task
```
GET /tasks/:id

Headers:
Authorization: Bearer <token>

Path Parameters:
- id: Task ID (number)

Response (200):
{
  "task": {
    "id": 1,
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "priority": "MEDIUM",
    "completed": false,
    "userId": 1,
    "createdAt": "2024-12-15T10:00:00Z",
    "updatedAt": "2024-12-15T10:00:00Z"
  }
}

Error (404):
- Task not found or doesn't belong to user
Error (401):
- Missing or invalid token
```

#### Create Task
```
POST /tasks

Headers:
Authorization: Bearer <token>

Request Body:
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "priority": "MEDIUM"
}

Response (200):
{
  "task": {
    "id": 1,
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "priority": "MEDIUM",
    "completed": false,
    "userId": 1,
    "createdAt": "2024-12-15T10:00:00Z",
    "updatedAt": "2024-12-15T10:00:00Z"
  }
}

Validation Rules:
- title: Required, 3-255 characters
- description: Optional, max 2000 characters
- priority: Required, one of LOW|MEDIUM|HIGH

Error (400):
- Validation failed
Error (401):
- Missing or invalid token
```

#### Update Task
```
PUT /tasks/:id

Headers:
Authorization: Bearer <token>

Path Parameters:
- id: Task ID (number)

Request Body (all optional):
{
  "title": "Updated title",
  "description": "Updated description",
  "completed": true,
  "priority": "HIGH"
}

Response (200):
{
  "task": {
    "id": 1,
    "title": "Updated title",
    "description": "Updated description",
    "priority": "HIGH",
    "completed": true,
    "userId": 1,
    "createdAt": "2024-12-15T10:00:00Z",
    "updatedAt": "2024-12-15T10:05:00Z"
  }
}

Validation Rules:
- title: Optional, 3-255 characters if provided
- description: Optional, max 2000 characters
- completed: Optional, boolean
- priority: Optional, one of LOW|MEDIUM|HIGH

Error (404):
- Task not found or doesn't belong to user
Error (400):
- Validation failed
Error (401):
- Missing or invalid token
```

#### Toggle Task Completion
```
PATCH /tasks/:id/toggle

Headers:
Authorization: Bearer <token>

Path Parameters:
- id: Task ID (number)

Response (200):
{
  "task": {
    "id": 1,
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "priority": "MEDIUM",
    "completed": true,  // Toggled from false
    "userId": 1,
    "createdAt": "2024-12-15T10:00:00Z",
    "updatedAt": "2024-12-15T10:05:00Z"
  }
}

Error (404):
- Task not found or doesn't belong to user
Error (401):
- Missing or invalid token
```

#### Delete Task
```
DELETE /tasks/:id

Headers:
Authorization: Bearer <token>

Path Parameters:
- id: Task ID (number)

Response (200):
{
  "message": "Task deleted successfully"
}

Error (404):
- Task not found or doesn't belong to user
Error (401):
- Missing or invalid token
```

---

### Health Check

#### Server Status
```
GET /health

Response (200):
{
  "status": "ok",
  "message": "Server is running"
}
```

---

## Error Responses

### Validation Error (400)
```json
{
  "error": "Validation Error",
  "message": "Invalid request data",
  "issues": [
    {
      "path": "email",
      "message": "Invalid email address"
    },
    {
      "path": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

### Authentication Error (401)
```json
{
  "error": "Unauthorized",
  "message": "Missing or invalid authentication token"
}
```

### Not Found Error (404)
```json
{
  "error": "Not Found",
  "message": "Task with ID 999 not found"
}
```

### Server Error (500)
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

---

## Password Requirements

Passwords must meet these criteria:
- ✅ At least 8 characters long
- ✅ At least one uppercase letter (A-Z)
- ✅ At least one lowercase letter (a-z)
- ✅ At least one digit (0-9)
- ✅ At least one special character (!@#$%^&*()_+-=[]{}; ':"\\|,.<>/?）

### Example Valid Passwords:
- `SecurePass123!`
- `MyP@ssw0rd`
- `Test#Pass2024`

### Example Invalid Passwords:
- `password` - no uppercase, no digit, no special char
- `Password` - no digit, no special char
- `Pass1` - too short, no special char
- `PASSWORD123!` - no lowercase

---

## CORS Configuration

Requests from these origins are allowed:
- `http://localhost:5173` (Development)
- `http://localhost:3000` (Alternative port)
- Configure `FRONTEND_URL` env variable for other origins

Credentials mode is enabled - cookies are sent with requests.

---

## Rate Limiting

Currently no rate limiting is implemented. This is recommended for production.

---

## Best Practices

### Request Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

### Cookie Handling
- Tokens are automatically sent via httpOnly cookies
- Manual Authorization header also works
- Use whichever is more convenient for your client

### Error Handling
Always check the `status` code:
- 2xx = Success
- 4xx = Client error (fix your request)
- 5xx = Server error (retry or contact support)

### Pagination (Coming Soon)
```
GET /tasks?page=1&limit=20
```

---

## Testing the API

### Using cURL
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123!"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123!"}' \
  -c cookies.txt

# Create Task (with cookie)
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"title":"Buy milk","priority":"HIGH"}'
```

### Using Postman
1. Import the OpenAPI/Swagger spec (when available)
2. Set environment variables:
   - `BASE_URL`: `http://localhost:5000/api`
   - `TOKEN`: (auto-populated after login)
3. Use pre-request scripts to handle authentication

### Using Frontend Client
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true
});

// Register
await api.post('/auth/register', {
  email: 'test@example.com',
  password: 'TestPass123!'
});

// Login
await api.post('/auth/login', {
  email: 'test@example.com',
  password: 'TestPass123!'
});

// Create task
await api.post('/tasks', {
  title: 'Buy milk',
  priority: 'HIGH'
});
```

---

## Roadmap

### Planned Features
- [ ] OpenAPI/Swagger documentation
- [ ] Rate limiting (express-rate-limit)
- [ ] Pagination support
- [ ] Advanced filtering
- [ ] Task categories/labels
- [ ] Recurring tasks
- [ ] Task reminders/notifications
- [ ] Sharing tasks with other users
- [ ] Email verification
- [ ] Password reset flow
- [ ] Two-factor authentication (2FA)

---

## Version History

### v1.0.0 (Current)
- Basic authentication (register, login, logout)
- Task CRUD operations
- JWT token-based security
- Input validation with Zod
- Comprehensive error handling
- 58+ unit tests

---

## Support

For issues or questions:
1. Check the error message and status code
2. Refer to this documentation
3. Check the backend logs in terminal
4. Open an issue in the repository
