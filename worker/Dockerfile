# Worker image. Built from the repo root (not ./worker) so it can generate the
# Prisma client from the single shared schema at backend/prisma.
FROM node:22-alpine

WORKDIR /app

# Workspace manifests + lockfile, install once at the root
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/
COPY worker/package*.json ./worker/

RUN npm ci --prefer-offline --no-audit --no-fund

# Prisma schema + client generation (worker shares the backend schema)
COPY backend/prisma ./backend/prisma
RUN npm run db:generate -w worker

# Worker source + build
COPY worker/src ./worker/src
COPY worker/tsconfig.json ./worker/

RUN npm run build -w worker

ENV NODE_ENV=production
EXPOSE 3002

CMD ["node", "worker/dist/index.js"]