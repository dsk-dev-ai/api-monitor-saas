import { prisma } from '../config/database';
import { PLAN_LIMITS } from '../types';
import { AppError } from '../middleware/error';

export const monitorService = {
  /**
   * Get all monitors for a user with stats
   */
  async getMonitorsWithStats(userId: string) {
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

    return monitorsWithStats;
  },

  /**
   * Create a new monitor
   */
  async createMonitor(data: any, userId: string) {
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

    return monitor;
  },

  /**
   * Update a monitor
   */
  async updateMonitor(id: string, data: any, userId: string) {
    const existing = await prisma.monitor.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new AppError('Monitor not found', 404);
    }

    if (data.interval) {
      const subscription = await prisma.subscription.findUnique({
        where: { userId },
      });
      const plan = subscription?.plan || 'free';
      const limits = PLAN_LIMITS[plan];

      if (data.interval < limits.minInterval) {
        throw new AppError(
          `Minimum check interval for ${plan} plan is ${limits.minInterval} seconds`,
          400
        );
      }
    }

    const monitor = await prisma.monitor.update({
      where: { id },
      data,
    });

    return monitor;
  },

  /**
   * Delete a monitor
   */
  async deleteMonitor(id: string, userId: string) {
    const monitor = await prisma.monitor.findFirst({
      where: { id, userId },
    });

    if (!monitor) {
      throw new AppError('Monitor not found', 404);
    }

    await prisma.monitor.delete({ where: { id } });

    return { success: true, message: 'Monitor deleted successfully' };
  },

  /**
   * Pause a monitor
   */
  async pauseMonitor(id: string, userId: string) {
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

    return updated;
  },

  /**
   * Resume a monitor
   */
  async resumeMonitor(id: string, userId: string) {
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

    return updated;
  },

  /**
   * Get monitor checks history
   */
  async getMonitorChecks(id: string, userId: string, page: number, limit: number) {
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

    return {
      checks,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },
};