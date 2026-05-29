# ── Stage 1: Build ────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for layer caching
COPY package*.json ./
RUN npm ci --only=production=false

# Copy source and compile TypeScript
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ── Stage 2: Production image ──────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

# Only copy production deps
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy compiled JS from builder stage
COPY --from=builder /app/dist ./dist

# Cloud Run uses PORT env var (default 8080)
ENV PORT=8080
ENV NODE_ENV=production

EXPOSE 8080

CMD ["node", "dist/index.js"]
