# Combined API + Worker image for free-tier single-service hosting (Render).
#
# Runs the Express API (port 3001) and the monitoring worker in one container
# so a single free web service can serve both. A scheduled cron pings /health
# to keep the free instance awake on platforms that sleep on idle (e.g. Render).
FROM node:22-slim

RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Use npm registry mirror for better connectivity
RUN npm config set registry https://registry.npmmirror.com || true
RUN npm config set fetch-retries 5
RUN npm config set fetch-retry-mintimeout 20000
RUN npm config set fetch-retry-maxtimeout 120000

# Copy workspace manifests + lockfile, install once at the root
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY worker/package*.json ./worker/
COPY frontend/package*.json ./frontend/
RUN npm ci --prefer-offline --no-audit --no-fund --workspaces=false && npm ci --prefer-offline --no-audit --no-fund

# Prisma schemas + generation (backend and worker share the same DB schema)
COPY backend/prisma ./backend/prisma
COPY worker/prisma ./worker/prisma
RUN npm run db:generate -w backend && npm run db:generate -w worker

# Source + builds
COPY . .
RUN npm run build -w backend && npm run build -w worker

ENV NODE_ENV=production
EXPOSE 3001

COPY docker/start-combined.sh /usr/local/bin/start-combined.sh
RUN chmod +x /usr/local/bin/start-combined.sh

CMD ["/usr/local/bin/start-combined.sh"]