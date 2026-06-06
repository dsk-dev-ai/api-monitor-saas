FROM node:20-alpine AS builder

WORKDIR /app

# Use npm registry mirror for better connectivity
RUN npm config set registry https://registry.npmmirror.com || true
RUN npm config set fetch-retries 5
RUN npm config set fetch-retry-mintimeout 20000
RUN npm config set fetch-retry-maxtimeout 120000

# Copy package.json and install deps
COPY package.json ./
RUN npm install --prefer-offline --no-audit --no-fund

# Copy prisma schema and generate client BEFORE building
COPY prisma ./prisma/
RUN npx prisma generate

# Copy source code and build
COPY . .
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

RUN npm config set registry https://registry.npmmirror.com || true

COPY package.json ./
RUN npm install --omit=dev --prefer-offline --no-audit --no-fund

# Copy built files and prisma client
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

RUN npx prisma generate

EXPOSE 3001

CMD ["node", "dist/server.js"]
