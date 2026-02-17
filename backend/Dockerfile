# Multi-stage Docker build for Node.js API
# INTERVIEW POINT: Demonstrates containerization knowledge

# Stage 1: Build (install dependencies)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Production (lean image)
FROM node:20-alpine
WORKDIR /app

# Security: Don't run as root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001

# Copy dependencies from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy source code
COPY . .

# Create logs & data directories
RUN mkdir -p logs data && chown -R nodeuser:nodejs logs data

USER nodeuser

EXPOSE 5000

ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

CMD ["node", "server.js"]
