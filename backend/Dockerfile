FROM node:20-alpine AS builder

WORKDIR /app

# Create .env file FIRST before anything else
RUN echo "DATABASE_URL=file:./dev.db" > .env

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source (this will include .env that we created, but we overwrite it)
COPY . .

# Make sure .env exists for Prisma
RUN echo "DATABASE_URL=file:./dev.db" > .env

# Generate Prisma client with explicit path
RUN DATABASE_URL=file:./dev.db npx prisma generate

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install only production dependencies
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev && \
    npm cache clean --force

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

EXPOSE 5000

CMD ["node", "dist/index.js"]
