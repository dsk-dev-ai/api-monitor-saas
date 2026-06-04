FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
COPY backend/prisma ./backend/prisma
COPY worker/package.json ./worker/package.json
RUN npm ci --workspace=api-monitor-worker --include-workspace-root

COPY worker ./worker
WORKDIR /app/worker
RUN npx prisma generate --schema ../backend/prisma/schema.prisma
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY backend/prisma ./backend/prisma
COPY worker/package.json ./worker/package.json
RUN npm ci --omit=dev --workspace=api-monitor-worker --include-workspace-root

COPY --from=builder /app/worker/dist ./worker/dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

WORKDIR /app/worker

EXPOSE 3002

CMD ["node", "dist/index.js"]
