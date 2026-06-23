# API Monitor SaaS v2.0 — Advanced Architecture
## Ubuntu 24.04 LTS | Production-Grade | Microservices-Ready

---

## 1. SYSTEM ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Web App    │  │  Mobile App  │  │   CLI Tool   │  │  Public API  │   │
│  │   Next.js    │  │   (Future)   │  │   (Future)   │  │   REST/Graph │   │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘   │
└─────────┼─────────────────┼─────────────────┼─────────────────┼─────────────┘
          │                 │                 │                 │
          └─────────────────┴─────────────────┴─────────────────┘
                                    │
                         ┌──────────┴──────────┐
                         │   Cloudflare CDN  │  (SSL/Edge Cache/DDoS)
                         └──────────┬──────────┘
                                    │
┌───────────────────────────────────┴─────────────────────────────────────────┐
│                           GATEWAY LAYER                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         NGINX Reverse Proxy                          │   │
│  │  • SSL Termination | Rate Limiting | Load Balancing | Static Assets  │   │
│  └─────────────────────────────┬───────────────────────────────────────┘   │
└────────────────────────────────┼────────────────────────────────────────────┘
                                 │
┌────────────────────────────────┼────────────────────────────────────────────┐
│                      APPLICATION LAYER (Docker Swarm)                        │
│                                                                               │
│  ┌─────────────────────┐    ┌─────────────────────┐    ┌──────────────────┐  │
│  │   API Gateway       │    │   Worker Service    │    │  Webhook Service │  │
│  │   (Express.js)      │    │   (Node.js Cron)    │    │  (Express.js)    │  │
│  │   Port: 3001        │    │   Port: 3002        │    │  Port: 3003      │  │
│  │   • Auth            │    │   • Health Checks   │    │  • Stripe Webhook│  │
│  │   • Monitors CRUD   │    │   • Alert Dispatch  │    │  • Email Webhook │  │
│  │   • Analytics       │    │   • Log Aggregation │    │  • Slack Webhook │  │
│  │   • Billing         │    │                     │    │                  │  │
│  └──────────┬──────────┘    └──────────┬──────────┘    └────────┬─────────┘  │
│             │                          │                      │             │
│             └──────────────────────────┼──────────────────────┘             │
│                                        │                                    │
│  ┌─────────────────────────────────────┴─────────────────────────────────┐  │
│  │                    Message Queue (Redis/BullMQ)                      │  │
│  │  • Check Jobs Queue | Alert Jobs Queue | Email Queue | Webhook Queue │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                 │
┌────────────────────────────────┼────────────────────────────────────────────┐
│                      DATA LAYER (Managed Services)                         │
│                                                                               │
│  ┌─────────────────────┐    ┌─────────────────────┐    ┌──────────────────┐  │
│  │   PostgreSQL        │    │   Redis Cache       │    │  Object Storage  │  │
│  │   (Supabase/        │    │   (Upstash/         │    │  (Cloudflare R2  │  │
│  │    Self-hosted)     │    │    Self-hosted)     │    │   /AWS S3)       │  │
│  │   • Prisma ORM      │    │   • Session Store   │    │  • Log Backups   │  │
│  │   • Multi-tenant    │    │   • Job Queue       │    │  • Exports       │  │
│  │   • Row-level       │    │   • Rate Limiting   │    │                  │  │
│  │     Security        │    │   • Pub/Sub         │    │                  │  │
│  └─────────────────────┘    └─────────────────────┘    └──────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                 │
┌────────────────────────────────┼────────────────────────────────────────────┐
│                      EXTERNAL SERVICES LAYER                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Supabase   │  │    Stripe    │  │    Resend    │  │   Slack API  │   │
│  │   Auth       │  │   Payments   │  │   Email      │  │   Alerts     │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. TECHNOLOGY STACK

### Core Infrastructure
| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| OS | Ubuntu Server | 24.04 LTS | Host OS |
| Container | Docker | 27.x | Containerization |
| Orchestration | Docker Swarm | Built-in | Service orchestration |
| Reverse Proxy | NGINX | 1.24 | SSL, Load Balancing |
| Process Manager | PM2 | 5.3 | Node.js process management |

### Backend Stack
| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Runtime | Node.js | 20 LTS | JavaScript runtime |
| Framework | Express.js | 4.18 | API framework |
| ORM | Prisma | 5.7 | Database ORM |
| Validation | Zod | 3.22 | Schema validation |
| Queue | BullMQ | 5.1 | Job queue (Redis) |
| Auth | Supabase Auth | 2.39 | JWT authentication |

### Frontend Stack
| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Framework | Next.js | 14 (App Router) | React framework |
| Styling | Tailwind CSS | 3.4 | Utility-first CSS |
| UI Components | shadcn/ui | Latest | Accessible components |
| Charts | Recharts | 2.10 | Data visualization |
| State | Zustand | 4.4 | Global state management |
| Icons | Lucide React | Latest | Icon library |

### Database & Storage
| Component | Technology | Purpose |
|-----------|-----------|---------|
| Primary DB | PostgreSQL 16 | Relational data |
| Cache | Redis 7 | Sessions, queues, caching |
| Search | PostgreSQL FTS | Full-text search |
| Backups | pg_dump + R2 | Automated backups |

### DevOps & Monitoring
| Component | Technology | Purpose |
|-----------|-----------|---------|
| CI/CD | GitHub Actions | Automated testing & deploy |
| Monitoring | Prometheus + Grafana | Metrics & dashboards |
| Logging | Winston + Loki | Structured logging |
| Alerting | Alertmanager | Infrastructure alerts |

---

## 3. DATABASE SCHEMA (Prisma)

```prisma
// Core Entities
User → Subscription (1:1)
User → Monitor (1:N)
User → StatusPage (1:N)
User → Alert (1:N)
User → TeamMember (1:N) [Future]

Monitor → Check (1:N)
Monitor → Alert (1:N)
Monitor → StatusPageItem (1:N)

StatusPage → StatusPageItem (1:N)
```

### Entity Relationships
- **User**: Central entity. All data scoped to user (multi-tenant via Row Level Security)
- **Monitor**: HTTP endpoint configuration. Belongs to User.
- **Check**: Individual health check result. Belongs to Monitor.
- **Alert**: Notification record. Belongs to User + Monitor.
- **Subscription**: Stripe billing data. Belongs to User.
- **StatusPage**: Public-facing status page. Belongs to User.

---

## 4. API DESIGN (RESTful + Versioned)

```
Base URL: /api/v1

Auth:
  POST /api/v1/auth/signup
  POST /api/v1/auth/signin
  POST /api/v1/auth/signout
  GET  /api/v1/auth/me
  POST /api/v1/auth/reset-password

Monitors:
  GET    /api/v1/monitors              (List with stats)
  POST   /api/v1/monitors              (Create)
  GET    /api/v1/monitors/:id          (Detail with history)
  PATCH  /api/v1/monitors/:id          (Update)
  DELETE /api/v1/monitors/:id          (Delete)
  GET    /api/v1/monitors/:id/checks   (Check history)
  POST   /api/v1/monitors/:id/pause    (Pause monitoring)
  POST   /api/v1/monitors/:id/resume   (Resume monitoring)

Analytics:
  GET    /api/v1/analytics/overview    (Dashboard overview)
  GET    /api/v1/analytics/uptime      (Uptime reports)
  GET    /api/v1/analytics/response-time (Response time trends)

Billing:
  GET    /api/v1/billing/subscription  (Current plan)
  POST   /api/v1/billing/checkout      (Stripe checkout)
  POST   /api/v1/billing/portal        (Billing portal)
  POST   /api/v1/billing/webhook       (Stripe webhook)

Status Pages (Public):
  GET    /api/v1/status-pages          (List)
  POST   /api/v1/status-pages          (Create)
  GET    /api/v1/status-pages/:slug    (Public status page)

Alerts:
  GET    /api/v1/alerts                (Alert history)
  PATCH  /api/v1/alerts/:id/acknowledge (Acknowledge alert)
```

---

## 5. SECURITY ARCHITECTURE

### Authentication Flow
```
1. Client → Supabase Auth (email/password or OAuth)
2. Supabase returns JWT access_token + refresh_token
3. Client stores tokens (httpOnly cookie preferred)
4. Client sends Authorization: Bearer <token> with each request
5. Backend verifies JWT via Supabase auth.getUser(token)
6. Backend creates/updates local User record
```

### Authorization (RBAC)
```
Roles:
  - free: 5 monitors, 5min interval, email alerts only
  - basic: 20 monitors, 1min interval, status pages
  - pro: 100 monitors, 30sec interval, all features
  - admin: Internal admin access (future)
```

### Data Protection
- Row Level Security (RLS) on PostgreSQL
- API Rate Limiting (100 req/15min per IP, stricter for auth)
- Input validation via Zod schemas
- SQL injection prevention via Prisma parameterized queries
- XSS protection via helmet.js headers
- CORS configured for specific origins only

---

## 6. MONITORING WORKER ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                    WORKER SERVICE (Port 3002)                │
│                                                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐  │
│  │ Job Scheduler│    │ Job Processor│    │ Alert Dispatcher│  │
│  │ (node-cron)  │    │ (BullMQ)    │    │ (Resend/Slack)  │  │
│  │              │    │             │    │                 │  │
│  │ Every 30s:  │    │ 1. HTTP req │    │ 1. Check status │  │
│  │ Fetch active │    │ 2. Measure  │    │ 2. If down:     │  │
│  │ monitors    │    │ 3. Store    │    │    Send email   │  │
│  │ Create jobs │    │ 4. Queue    │    │ 3. If resolved: │  │
│  │             │    │    alert    │    │    Send resolve │  │
│  └─────────────┘    └─────────────┘    └─────────────────┘  │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │              Redis Queue (BullMQ)                       ││
│  │  • check-queue: Process health checks                   ││
│  │  • alert-queue: Send notifications                      ││
│  │  • retry-queue: Failed check retries                    ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Check Logic
```
1. Fetch all active monitors from DB
2. Group by interval (30s, 60s, 300s)
3. For each monitor:
   a. Send HTTP request (respect timeout)
   b. Measure response time
   c. Validate status code
   d. Validate expected keyword (if set)
   e. Store result in DB
   f. If status changed (up→down or down→up):
      - Create Alert record
      - Queue alert notification
4. Cleanup old checks (retain 90 days)
```

---

## 7. DEPLOYMENT ARCHITECTURE (Ubuntu 24.04)

### Single Server Setup (MVP)
```
Ubuntu 24.04 LTS Server
├── Docker Engine 27.x
├── Docker Compose (development)
├── Docker Swarm (production)
│   ├── api-monitor-api (replica: 2)
│   ├── api-monitor-worker (replica: 1)
│   ├── api-monitor-web (replica: 2)
│   ├── nginx (load balancer)
│   ├── postgres (managed or container)
│   └── redis (cache + queue)
├── NGINX (host level, SSL termination)
├── PM2 (fallback process manager)
└── UFW Firewall
```

### Directory Structure on Server
```
/opt/api-monitor/
├── docker/
│   ├── docker-compose.yml
│   ├── docker-compose.prod.yml
│   ├── nginx/
│   │   ├── nginx.conf
│   │   └── ssl/
│   └── scripts/
│       ├── deploy.sh
│       ├── backup.sh
│       └── health-check.sh
├── releases/
│   ├── v1.0.0/
│   ├── v1.0.1/
│   └── current → v1.0.1
├── logs/
│   ├── nginx/
│   ├── app/
│   └── worker/
└── backups/
    ├── daily/
    └── weekly/
```

---

## 8. GIT BRANCHING STRATEGY (GitFlow Simplified)

```
main          ────────────────────────────────────────────────
              │         │         │         │         │
              ▼         ▼         ▼         ▼         ▼
release/v1.0  ●────────●────────●────────●────────●
              │        /│        /│        /│
              ▼       / ▼       / ▼       / ▼
feature/      ●──────●  ●──────●  ●──────●  ●──────●
  backend     │      │  │      │  │      │  │      │
              ▼      ▼  ▼      ▼  ▼      ▼  ▼      ▼
feature/      ●──────●  ●──────●  ●──────●  ●──────●
  frontend    │      │  │      │  │      │  │      │
              ▼      ▼  ▼      ▼  ▼      ▼  ▼      ▼
feature/      ●──────●  ●──────●  ●──────●  ●──────●
  worker      │      │  │      │  │      │  │      │
              ▼      ▼  ▼      ▼  ▼      ▼  ▼      ▼
hotfix/       ●──────●  ●──────●  ●──────●  ●──────●
              │      │  │      │  │      │  │      │
              ▼      ▼  ▼      ▼  ▼      ▼  ▼      ▼
develop       ●─────────────────────────────────────────────
```

### Branch Rules
- **main**: Production-ready code only. Tagged releases.
- **develop**: Integration branch. All features merge here first.
- **feature/***: Individual feature branches. Created from develop.
- **release/vX.Y**: Release preparation. Bug fixes only.
- **hotfix/***: Critical production fixes. Created from main.

### Commit Convention
```
feat: add user authentication
fix: resolve monitor timeout issue
docs: update API documentation
style: format code with prettier
refactor: simplify check logic
test: add monitor unit tests
chore: update dependencies
perf: optimize database queries
```

---

## 9. SCALING ROADMAP

### Phase 1: MVP (Current)
- Single server, Docker Compose
- 1 API instance, 1 Worker instance
- PostgreSQL container
- Redis container
- ~1000 monitors supported

### Phase 2: Growth (3-6 months)
- Docker Swarm multi-node
- API: 3 replicas, Worker: 2 replicas
- Managed PostgreSQL (Supabase/RDS)
- Managed Redis (Upstash/ElastiCache)
- CDN for static assets
- ~10000 monitors supported

### Phase 3: Scale (6-12 months)
- Kubernetes cluster
- Regional worker deployments
- Read replicas for analytics
- Kafka for event streaming
- ~100000 monitors supported

---

## 10. DISASTER RECOVERY

### Backup Strategy
- **Database**: Daily pg_dump at 2 AM UTC, retain 30 days
- **Config**: Git repository (infrastructure as code)
- **Logs**: 90-day retention in object storage
- **Recovery Time Objective (RTO)**: 1 hour
- **Recovery Point Objective (RPO)**: 24 hours

### Failover
- Database: PostgreSQL streaming replication (future)
- API: Docker Swarm auto-restart + health checks
- Worker: Multiple instances with job locking (BullMQ)
- Alerts: Queue-based, survives worker restarts
