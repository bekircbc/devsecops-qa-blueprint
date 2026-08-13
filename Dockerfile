# ==============================================================================
# Build Stage: Multi-stage build to reduce final image size and attack surface
# ==============================================================================
FROM node:22-alpine AS builder

WORKDIR /app

# RUN apk update && apk upgrade --no-cache

# Copy dependency manifests
COPY package*.json ./

# Clean install including devDependencies for building
RUN npm ci

# Copy source code
COPY . .

# ==============================================================================
# Production Stage: Chainguard Zero-CVE Secure Minimal Runtime
# ==============================================================================
FROM cgr.dev/chainguard/node:latest AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# RUN apk update && apk upgrade --no-cache

# Security Best Practice: Run as non-root user
USER node

# Copy built artifacts and production dependencies from builder
COPY --chown=node:node --from=builder /app/package*.json ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/src ./src

EXPOSE 3000

CMD ["npm", "start"]