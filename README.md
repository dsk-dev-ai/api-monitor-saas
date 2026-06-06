<div align="center">

# 🔍 API Monitor SaaS v1.2

**Production-Ready API & Website Uptime Monitoring Platform**

[![Version](https://img.shields.io/badge/version-1.2.0-blue.svg)](https://github.com/dsk-dev-ai/api-monitor-saas/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![Express](https://img.shields.io/badge/Express-4.18-lightgrey)](https://expressjs.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)](https://postgresql.org)

</div>

---

## 🚀 What's New in v1.0

API Monitor SaaS v1.2 is a **complete rewrite** with production-grade architecture, featuring:

- ✅ **Real-time Dashboard** — Live uptime tracking with beautiful charts
- ✅ **Advanced Analytics** — Response time percentiles, trends, distribution
- ✅ **Smart Alerting** — Email notifications with status change detection
- ✅ **Stripe Billing** — Free, Basic ($9/mo), Pro ($29/mo) plans
- ✅ **Public Status Pages** — Shareable status pages for your monitors
- ✅ **Docker Deployment** — One-command production deploy
- ✅ **Ubuntu 24.04 Ready** — Complete server setup guide

---

## 🏗️ Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Next.js   │────▶│   Express   │────▶│  PostgreSQL │
│  Frontend   │     │    API      │     │  (Supabase) │
│  Port 3000  │◄────│  Port 3001  │◄────│             │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                    ┌──────┴──────┐
                    │   Worker    │
                    │  Port 3002  │
                    │  (Cron)     │
                    └─────────────┘
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, Tailwind CSS, shadcn/ui, Recharts, Zustand |
| **Backend** | Node.js 20, Express.js, Prisma ORM, Zod, Winston |
| **Worker** | Node.js, Axios, node-cron, BullMQ |
| **Database** | PostgreSQL 16 (Supabase) |
| **Auth** | Supabase Auth (JWT) |
| **Payments** | Stripe (Checkout + Billing Portal) |
| **Email** | Resend API |
| **Cache/Queue** | Redis 7 |
| **Proxy** | NGINX |
| **SSL** | Let's Encrypt |
| **Deploy** | Docker Compose |

---

## 📦 Quick Start

### Prerequisites
- Ubuntu 24.04 LTS (or any Linux/macOS/Windows with Docker)
- Node.js 20+
- Docker & Docker Compose
- Supabase account
- Stripe account (for billing)
- Resend account (for email alerts)

### 1. Clone Repository

```bash
git clone https://github.com/dsk-dev-ai/api-monitor-saas.git
cd api-monitor-saas
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit with your credentials
nano .env
```

### 3. Start with Docker (Recommended)

```bash
# Start all services
docker compose up -d

# Run database migrations
docker compose exec backend npx prisma db push

# Access the app
# Frontend: http://localhost:3000
# API: http://localhost:3001
# API Docs: http://localhost:3001/api/v1
```

### 4. Manual Setup (Development)

```bash
# Install dependencies
npm install

# Database setup
cd backend && npx prisma db push && cd ..

# Start services
npm run dev
```

---

## 🗂️ Project Structure

```
api-monitor-saas/
├── frontend/              # Next.js 14 Application
│   ├── app/               # App Router pages
│   ├── components/        # UI components (shadcn/ui)
│   ├── hooks/             # React hooks
│   └── lib/               # Utilities, API client
├── backend/               # Express API Server
│   ├── src/routes/        # API routes
│   ├── src/middleware/    # Auth, error handling
│   ├── src/config/        # Database, Supabase
│   └── prisma/            # Database schema
├── worker/                # Monitoring Worker
│   ├── src/services/      # HTTP executor, alerts
│   └── src/index.ts       # Cron scheduler
├── nginx/                 # Reverse proxy config
├── scripts/               # Ubuntu setup, deploy, backup
└── .github/workflows/     # CI/CD pipelines
```

---

## 🔧 Configuration

### Supabase Setup
1. Create project at [supabase.com](https://supabase.com)
2. Copy Project URL and API keys to `.env`
3. Enable Email provider in Authentication settings
4. Configure redirect URLs

### Stripe Setup
1. Create products: Free, Basic ($9/mo), Pro ($29/mo)
2. Copy Price IDs to `.env`
3. Configure webhook endpoint: `/api/v1/billing/webhook`
4. Copy Webhook Secret to `.env`

### Resend Setup
1. Sign up at [resend.com](https://resend.com)
2. Verify your domain
3. Copy API key to `.env`

---

## 🌿 Git Workflow

```bash
# Feature development
git checkout develop
git pull origin develop
git checkout -b feature/my-feature
# ... code ...
git commit -m "feat: add new feature"
git push origin feature/my-feature
gh pr create --base develop

# Release
git checkout -b release/v1.2.0
git checkout main
git merge release/v1.2.0
git tag -a v1.2.0 -m "Release v1.2.0"
git push origin main --tags
```

---

## 🐳 Docker Deployment

```bash
# Production
docker compose -f docker-compose.prod.yml up -d

# View logs
docker compose -f docker-compose.prod.yml logs -f

# Restart
docker compose -f docker-compose.prod.yml restart

# Update
./scripts/deploy.sh v1.2.0 production
```

---

## 🖥️ Ubuntu 24.04 Production Setup

```bash
# Run automated setup
bash scripts/setup-ubuntu.sh

# Or follow UBUNTU_SETUP_GUIDE.md for detailed steps
```

---

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/auth/signup` | POST | Create account |
| `/api/v1/auth/signin` | POST | Sign in |
| `/api/v1/auth/me` | GET | Get current user |
| `/api/v1/monitors` | GET/POST | List/Create monitors |
| `/api/v1/monitors/:id` | GET/PATCH/DELETE | Monitor CRUD |
| `/api/v1/analytics/overview` | GET | Dashboard stats |
| `/api/v1/billing/plans` | GET | Available plans |
| `/api/v1/billing/checkout` | POST | Stripe checkout |
| `/api/v1/status-pages/public/:slug` | GET | Public status page |

---

## 🧪 Testing

```bash
# Backend tests
cd backend && npm test

# Frontend build check
cd frontend && npm run build

# E2E tests (coming in v1.1)
# cd frontend && npx playwright test
```

---

## 📈 Roadmap

- [x] v1.0 — MVP with monitoring, alerts, billing
- [x] v1.2 — Stabilization release, build fixes, Supabase compatibility, Prisma fixes
- [ ] v1.3 — Teams & organizations, Slack webhooks
- [ ] v1.4 — API tokens, advanced analytics
- [ ] v2.0 — Multi-region monitoring, PagerDuty, horizontal scaling

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) file.

---

<div align="center">

**Built with ❤️ by [dsk-dev-ai](https://github.com/dsk-dev-ai)**

⭐ Star this repo if you find it useful!

</div>
