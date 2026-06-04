import { prisma } from '../config/database';

export const checkService = {
  /**
   * Store a check result
   */
  async storeCheckResult(data: any) {
    return await prisma.check.create({
      data,
    });
  },

  /**
   * Get check count for a monitor
   */
  async countChecks(monitorId: string) {
    return await prisma.check.count({
      where: { monitorId: monitorId },
    });
  },

  /**
   * Get up check count for a monitor
   */
  async countUpChecks(monitorId: string) {
    return await prisma.check.count({
      where: {
        monitorId: monitorId,
        status: 'up',
      },
    });
  },

  /**
   * Get check history for a monitor
   */
  async getCheckHistory(monitorId: string, limit: number) {
    return await prisma.check.findMany({
      where: { monitorId: monitorId },
      orderBy: { checkedAt: 'desc' },
      take: limit,
    });
  },

  /**
   * Get average response time for a monitor
   */
  async getAvgResponseTime(monitorId: string) {
    const result = await prisma.check.aggregate({
      where: { monitorId: monitorId },
      _avg: { responseTime: true },
    });

    return result._avg.responseTime || 0;
  },

  /**
   * Get response time percentiles for a monitor
   */
  async getResponseTimePercentiles(monitorId: string, days: number) {
    const daysAgo = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const percentiles = await prisma.$queryRaw`
      SELECT 
        PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY response_time) as p50,
        PERCENTILE_CONT(0.90) WITHIN GROUP (ORDER BY response_time) as p90,
        PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY response_time) as p95,
        PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY response_time) as p99
      FROM checks
      WHERE monitor_id = ${monitorId} AND checked_at >= ${daysAgo}
    `;

    return percentiles[0] || null;
  },

  /**
   * Get daily stats for a monitor
   */
  async getDailyStats(monitorId: string, days: number) {
    const daysAgo = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

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
      WHERE monitor_id = ${monitorId} AND checked_at >= ${daysAgo}
      GROUP BY DATE(checked_at)
      ORDER BY date DESC
    `;

    return dailyStats;
  },
};