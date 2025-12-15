# 🚀 Deployment Guide - SaaS Foundry

## Overview

This guide covers deployment options for SaaS Foundry in different environments.

---

## Table of Contents

1. [Local Development](#local-development)
2. [Docker Deployment](#docker-deployment)
3. [GitHub Actions CI/CD](#github-actions-cicd)
4. [Cloud Deployment](#cloud-deployment)
5. [Environment Variables](#environment-variables)
6. [Monitoring & Logging](#monitoring--logging)

---

## Local Development

### Prerequisites
- Node.js 18+ or 20+
- npm 9+
- Git

### Setup

```bash
# Clone repository
git clone <repository-url>
cd saas-foundry

# Frontend setup
cd frontend
npm install
npm run dev  # Runs on http://localhost:5173

# Backend setup (new terminal)
cd backend
npm install
npx prisma generate
npm run dev  # Runs on http://localhost:5000

# Run tests
npm run test -- --run
```

### Available Scripts

**Frontend:**
```bash
npm run dev           # Start dev server
npm run build         # Production build
npm run preview       # Preview production build
npm run test          # Run tests in watch mode
npm run test -- --run # Run tests once
npm run test:coverage # Generate coverage report
npm run test:ui       # Open test UI
```

**Backend:**
```bash
npm run dev                  # Start dev server with auto-reload
npm run build               # Compile TypeScript
npm start                   # Run production server
npm run test                # Run tests
npm run test:coverage       # Generate coverage report
npm run prisma:generate     # Generate Prisma client
npm run prisma:migrate      # Run database migrations
npm run prisma:studio       # Open Prisma Studio GUI
```

---

## Docker Deployment

### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+

### Quick Start

```bash
# Build and run with Docker Compose
docker-compose up -d

# Access application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# Health check: http://localhost:5000/api/health

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop services
docker-compose down

# Remove volumes (including database)
docker-compose down -v
```

### Building Individual Images

**Backend:**
```bash
# Build image
docker build -t saas-foundry-backend:latest ./backend

# Run container
docker run -d \
  --name saas-backend \
  -p 5000:5000 \
  -e NODE_ENV=production \
  -e DATABASE_URL=file:./prisma/dev.db \
  -e FRONTEND_URL=http://localhost:3000 \
  saas-foundry-backend:latest

# View logs
docker logs -f saas-backend

# Stop container
docker stop saas-backend
```

**Frontend:**
```bash
# Build image
docker build -t saas-foundry-frontend:latest ./frontend

# Run container
docker run -d \
  --name saas-frontend \
  -p 3000:3000 \
  -e VITE_API_URL=http://localhost:5000/api \
  saas-foundry-frontend:latest
```

### Environment Variables in Docker

Create `.env` file in project root:

```env
# Backend
NODE_ENV=production
DATABASE_URL=file:./prisma/dev.db
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-secret-key-change-in-production
PORT=5000

# Frontend
VITE_API_URL=http://localhost:5000/api
```

### Health Checks

```bash
# Backend health check
curl http://localhost:5000/api/health

# Frontend check
curl http://localhost:3000
```

---

## GitHub Actions CI/CD

### Workflows Included

1. **Frontend Workflow** (`.github/workflows/frontend.yml`)
   - Installs dependencies
   - Type check with TypeScript
   - Runs tests with coverage
   - Builds application
   - Security scan (npm audit)

2. **Backend Workflow** (`.github/workflows/backend.yml`)
   - Installs dependencies
   - Type check with TypeScript
   - Runs tests with coverage
   - Builds application
   - Security scan
   - Integration tests
   - Docker image build

3. **Full Stack Workflow** (`.github/workflows/ci-cd.yml`)
   - Runs both frontend and backend pipelines
   - Tests on Node 18 and 20
   - Security checks
   - Code quality analysis
   - Generates status reports

### Triggering Workflows

Workflows trigger automatically on:
- Push to `main` or `develop` branch
- Pull requests to `main` or `develop`
- File changes in respective directories
- Weekly schedule (Full Stack CI/CD)

### Viewing Results

1. Go to GitHub repository
2. Click "Actions" tab
3. Select workflow
4. View step-by-step output
5. Download artifacts if needed

### Required GitHub Secrets

Set these in repository settings → Secrets and variables:

```
DOCKER_USERNAME      # Docker Hub username
DOCKER_PASSWORD      # Docker Hub token
REGISTRY_TOKEN       # Container registry token (optional)
DEPLOYMENT_KEY       # SSH key for deployment (optional)
```

---

## Cloud Deployment

### Vercel (Frontend)

```bash
# Connect repository
vercel link

# Deploy
vercel deploy --prod

# Set environment variables
vercel env add VITE_API_URL https://api.yourdomain.com
```

**vercel.json:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_URL": "@vite_api_url"
  }
}
```

### Heroku (Backend)

```bash
# Create app
heroku create your-app-name

# Set buildpack
heroku buildpacks:set heroku/nodejs

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

**Procfile:**
```
web: npm run build && npm start
release: npx prisma migrate deploy
```

### Railway (Full Stack)

1. Connect GitHub repository
2. Set environment variables:
   ```
   NODE_ENV=production
   DATABASE_URL=postgresql://...
   JWT_SECRET=your-secret
   FRONTEND_URL=https://your-frontend-domain.com
   ```
3. Deploy backend service
4. Deploy frontend service
5. Link services

### AWS (Full Stack)

**Using ECS:**
1. Push Docker images to ECR
2. Create ECS tasks
3. Create load balancer
4. Configure auto-scaling
5. Setup RDS for database

**Using Elastic Beanstalk:**
```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p "Node.js 20 running on 64bit Amazon Linux 2"

# Deploy
eb create production
eb deploy
```

---

## Environment Variables

### Backend (.env)

```env
# Server
NODE_ENV=development|production
PORT=5000

# Database
DATABASE_URL=file:./prisma/dev.db

# Authentication
JWT_SECRET=your-secret-key-minimum-32-characters
JWT_EXPIRY=7d

# CORS
FRONTEND_URL=http://localhost:5173

# Logging
LOG_LEVEL=debug|info|warn|error
```

### Frontend (.env.local)

```env
VITE_API_URL=http://localhost:5000/api
VITE_API_TIMEOUT=10000
VITE_APP_NAME=SaaS Foundry
```

---

## Monitoring & Logging

### Backend Monitoring

```bash
# View logs with timestamps
docker-compose logs -f --timestamps backend

# Monitor resource usage
docker stats saas-foundry-backend

# Health check endpoint
curl http://localhost:5000/api/health
```

### Error Tracking

Recommended services:
- [Sentry](https://sentry.io) - Error tracking
- [LogRocket](https://logrocket.com) - Session replay
- [Datadog](https://datadoghq.com) - Full stack monitoring

### Performance Monitoring

Frontend:
```typescript
// Google Analytics
import analytics from '@/utils/analytics'
analytics.trackEvent('task_created', { priority: 'HIGH' })
```

Backend:
```typescript
// Response time tracking
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${duration}ms`);
  });
  next();
});
```

---

## Scaling Recommendations

### Frontend
- Use CDN for static assets (CloudFlare, AWS CloudFront)
- Enable compression (gzip)
- Cache busting with hash in filenames
- Code splitting for lazy loading

### Backend
- Database indexing on frequently queried fields
- Redis for caching
- Rate limiting for API endpoints
- Horizontal scaling with load balancer
- Read replicas for database

### Database
- Regular backups (daily)
- Query optimization
- Proper indexing strategy
- Connection pooling (PgBouncer)
- Archive old data

---

## Security Checklist

- [x] Use HTTPS in production
- [x] Store secrets in environment variables
- [x] Enable CORS properly
- [x] Validate all inputs
- [x] Hash passwords with bcrypt
- [x] Use secure cookies (httpOnly, sameSite)
- [ ] Enable WAF (Web Application Firewall)
- [ ] Setup DDoS protection
- [ ] Regular security audits
- [ ] Keep dependencies updated
- [ ] Enable rate limiting
- [ ] Setup CSRF protection

---

## Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :5000  # Linux/Mac
netstat -ano | findstr :5000  # Windows

# Kill process
kill -9 <PID>  # Linux/Mac
taskkill /PID <PID> /F  # Windows
```

### Database Connection Error

```bash
# Reset database
cd backend
rm prisma/dev.db
npx prisma migrate deploy
```

### Docker Build Fails

```bash
# Clear cache and rebuild
docker-compose build --no-cache

# Check Docker disk space
docker system prune -a
```

### Frontend API Calls Fail

```bash
# Check CORS headers
curl -i -X OPTIONS http://localhost:5000/api/tasks

# Verify FRONTEND_URL env var
docker-compose exec backend printenv FRONTEND_URL
```

---

## Rollback Procedure

```bash
# If using git tags
git tag -l  # List versions

# Rollback to previous version
git checkout v0.8.0

# If using Docker images
docker run -d --name app-rollback saas-foundry:v0.8.0

# Database rollback
npx prisma migrate resolve --rolled-back migration_name
```

---

## Backup & Recovery

```bash
# Backup database
cp prisma/dev.db prisma/dev.db.backup

# Backup environment
cp .env .env.backup

# Docker volume backup
docker run --rm -v saas-foundry_backend-data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/backup.tar.gz -C /data .

# Restore
docker run --rm -v saas-foundry_backend-data:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/backup.tar.gz -C /data
```

---

## Support & Resources

- GitHub Issues: Report bugs and request features
- Discussions: Ask questions and share ideas
- Documentation: Check docs/ directory
- CI/CD Logs: View GitHub Actions logs for errors

---

**Last Updated:** December 15, 2025  
**Version:** v0.8.0+deployment
