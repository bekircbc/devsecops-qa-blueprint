# ==============================================================================
# Build Stage: Multi-stage build to reduce final image size and attack surface
# ==============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Clean install including devDependencies for building
RUN npm ci

# Copy source code
COPY . .

# ==============================================================================
# Production Stage: Minimal, secure runtime environment
# ==============================================================================
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Security Best Practice: Run as non-root user
USER node

# Copy built artifacts and production dependencies from builder
COPY --chown=node:node --from=builder /app/package*.json ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/src ./src

EXPOSE 3000

CMD ["npm", "start"]