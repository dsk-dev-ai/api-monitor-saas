FROM node:20-alpine AS builder

WORKDIR /app

# Use npm registry mirror for better connectivity
RUN npm config set registry https://registry.npmmirror.com || true
RUN npm config set fetch-retries 5
RUN npm config set fetch-retry-mintimeout 20000
RUN npm config set fetch-retry-maxtimeout 120000

COPY package.json ./
RUN npm install --prefer-offline --no-audit --no-fund

COPY . .
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
