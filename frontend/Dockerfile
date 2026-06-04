FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/package.json
RUN npm ci --workspace=api-monitor-frontend --include-workspace-root

COPY frontend ./frontend
WORKDIR /app/frontend
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app/frontend/.next/standalone ./
COPY --from=builder /app/frontend/.next/static ./frontend/.next/static

EXPOSE 3000

CMD ["node", "frontend/server.js"]
