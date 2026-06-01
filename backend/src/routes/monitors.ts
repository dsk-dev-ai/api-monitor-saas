import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database';
import { authMiddleware } from '../middleware/auth';
import { PLAN_LIMITS } from '../types';
import { asyncHandler, AppError } from '../middleware/error';

const router = Router();

const createMonitorSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  url: z.string().url('Invalid URL'),
  method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD']).default('GET'),
  headers: z.record(z.string()).optional().default({}),
  body: z.string().optional(),
  interval: z.number().int().min(30).max(3600).default(300),
  timeout: z.number().int().min(5).max(120).default(30),
  expectedStatus: z.number().int().min(100).max(599).optional(),
  expectedKeyword: z.string().optional(),
  region: z.string().default('global'),
});

const updateMonitorSchema = createMonitorSchema.partial();

// Get all monitors with stats
router.get('/', authMiddleware, asyncHandler(async (req, res) => {
  const userId = req.user!.id;

  const monitors = await prisma.monitor.findMany({
    where: { userId },
    include: {
      checks: {
        orderBy: { checkedAt: 'desc' },
        take: 1,
      },
      _count: {
        select: { checks: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const monitorsWithStats = await Promise.all(
    monitors.map(async (monitor) => {
      const totalChecks = await prisma.check.count({
        where: { monitorId: monitor.id },
      });

      const upChecks = await prisma.check.count({
        where: {
          monitorId: monitor.id,
          status: 'up',
        },
      });

      const uptime24h = totalChecks > 0 ? (upChecks / totalChecks) * 100 : 100;

      // Get last 24h history for sparkline
      const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const history = await prisma.check.findMany({
        where: {
          monitorId: monitor.id,
          checkedAt: { gte: last24h },
        },
        orderBy: { checkedAt: 'asc' },
        select: {
          status: true,
          responseTime: true,
          checkedAt: true,
          statusCode: true,
        },
      });

      // Get latest down alert if any
      const latestAlert = await prisma.alert.findFirst({
        where: {
          monitorId: monitor.id,
          status: 'triggered',
        },
        orderBy: { sentAt: 'desc' },
        select: { sentAt: true, message: true },
      });

      return {
        ...monitor,
        uptime24h: Math.round(uptime24h * 100) / 100,
        lastCheck: monitor.checks[0] || null,
        totalChecks,
        upChecks,
        history,
        latestAlert,
      };
    })
  );

  res.json({
    monitors: monitorsWithStats,
    total: monitors.length,
  });
}));

// Get monitor detail with full analytics
router.get('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user!.id;

  const monitor = await prisma.monitor.findFirst({
    where: { id, userId },
    include: {
      checks: {
        orderBy: { checkedAt: 'desc' },
        take: 100,
      },
      alerts: {
        orderBy: { sentAt: 'desc' },
        take: 20,
      },
    },
  });

  if (!monitor) {
    throw new AppError('Monitor not found', 404);
  }

  // Calculate comprehensive stats
  const totalChecks = await prisma.check.count({
    where: { monitorId: id },
  });

  const upChecks = await prisma.check.count({
    where: { monitorId: id, status: 'up' },
  });

  const downChecks = await prisma.check.count({
    where: { monitorId: id, status: 'down' },
  });

  const degradedChecks = await prisma.check.count({
    where: { monitorId: id, status: 'degraded' },
  });

  const avgResponseTime = totalChecks > 0
    ? await prisma.check.aggregate({
        where: { monitorId: id },
        _avg: { responseTime: true },
      })
    : { _avg: { responseTime: 0 } };

  const maxResponseTime = await prisma.check.aggregate({
    where: { monitorId: id },
    _max: { responseTime: true },
  });

  const minResponseTime = await prisma.check.aggregate({
    where: { monitorId: id },
    _min: { responseTime: true },
  });

  // Daily stats for last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const dailyStats = await prisma.$queryRaw`
    SELECT 
      DATE(checked_at) as date,
      COUNT(*)::int as total,
      SUM(CASE WHEN status = 'up' THEN 1 ELSE 0 END)::int as up_count,
      SUM(CASE WHEN status = 'down' THEN 1 ELSE 0 END)::int as down_count,
      AVG(response_time)::float as avg_response_time,
      MAX(response_time)::int as max_response_time,
      MIN(response_time)::int as min_response_time
    FROM checks
    WHERE monitor_id = ${id} AND checked_at >= ${thirtyDaysAgo}
    GROUP BY DATE(checked_at)
    ORDER BY date DESC
  `;

  // Response time distribution (percentiles)
  const percentiles = await prisma.$queryRaw`
    SELECT 
      PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY response_time) as p50,
      PERCENTILE_CONT(0.90) WITHIN GROUP (ORDER BY response_time) as p90,
      PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY response_time) as p95,
      PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY response_time) as p99
    FROM checks
    WHERE monitor_id = ${id} AND checked_at >= ${thirtyDaysAgo}
  `;

  res.json({
    ...monitor,
    stats: {
      uptime: totalChecks > 0 ? Math.round((upChecks / totalChecks) * 10000) / 100 : 100,
      avgResponseTime: Math.round(avgResponseTime._avg.responseTime || 0),
      maxResponseTime: maxResponseTime._max.responseTime || 0,
      minResponseTime: minResponseTime._min.responseTime || 0,
      totalChecks,
      upChecks,
      downChecks,
      degradedChecks,
      percentiles: percentiles[0] || null,
    },
    dailyStats,
  });
}));

// Create monitor
router.post('/', authMiddleware, asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  const data = createMonitorSchema.parse(req.body);

  // Check plan limits
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  const plan = subscription?.plan || 'free';
  const limits = PLAN_LIMITS[plan];

  const currentMonitors = await prisma.monitor.count({
    where: { userId },
  });

  if (currentMonitors >= limits.maxMonitors) {
    throw new AppError(
      `Monitor limit reached for ${plan} plan (${limits.maxMonitors} max). Upgrade to add more.`,
      403
    );
  }

  if (data.interval < limits.minInterval) {
    throw new AppError(
      `Minimum check interval for ${plan} plan is ${limits.minInterval} seconds`,
      400
    );
  }

  const monitor = await prisma.monitor.create({
    data: {
      ...data,
      userId,
    },
  });

  res.status(201).json(monitor);
}));

// Update monitor
router.patch('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user!.id;
  const updateData = updateMonitorSchema.parse(req.body);

  const existing = await prisma.monitor.findFirst({
    where: { id, userId },
  });

  if (!existing) {
    throw new AppError('Monitor not found', 404);
  }

  if (updateData.interval) {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });
    const plan = subscription?.plan || 'free';
    const limits = PLAN_LIMITS[plan];

    if (updateData.interval < limits.minInterval) {
      throw new AppError(
        `Minimum check interval for ${plan} plan is ${limits.minInterval} seconds`,
        400
      );
    }
  }

  const monitor = await prisma.monitor.update({
    where: { id },
    data: updateData,
  });

  res.json(monitor);
}));

// Delete monitor
router.delete('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user!.id;

  const monitor = await prisma.monitor.findFirst({
    where: { id, userId },
  });

  if (!monitor) {
    throw new AppError('Monitor not found', 404);
  }

  await prisma.monitor.delete({ where: { id } });

  res.json({ success: true, message: 'Monitor deleted successfully' });
}));

// Pause monitor
router.post('/:id/pause', authMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user!.id;

  const monitor = await prisma.monitor.findFirst({
    where: { id, userId },
  });

  if (!monitor) {
    throw new AppError('Monitor not found', 404);
  }

  const updated = await prisma.monitor.update({
    where: { id },
    data: { isPaused: true, isActive: false },
  });

  res.json(updated);
}));

// Resume monitor
router.post('/:id/resume', authMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user!.id;

  const monitor = await prisma.monitor.findFirst({
    where: { id, userId },
  });

  if (!monitor) {
    throw new AppError('Monitor not found', 404);
  }

  const updated = await prisma.monitor.update({
    where: { id },
    data: { isPaused: false, isActive: true },
  });

  res.json(updated);
}));

// Get monitor checks history
router.get('/:id/checks', authMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user!.id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);

  const monitor = await prisma.monitor.findFirst({
    where: { id, userId },
  });

  if (!monitor) {
    throw new AppError('Monitor not found', 404);
  }

  const [checks, total] = await Promise.all([
    prisma.check.findMany({
      where: { monitorId: id },
      orderBy: { checkedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.check.count({
      where: { monitorId: id },
    }),
  ]);

  res.json({
    checks,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }));
}));

export default router;
