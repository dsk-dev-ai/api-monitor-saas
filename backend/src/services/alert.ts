import { prisma } from '../config/database';

export const alertService = {
  /**
   * Create an alert
   */
  async createAlert(data: any) {
    return await prisma.alert.create({
      data,
    });
  },

  /**
   * Get latest alert for a monitor
   */
  async getLatestAlert(monitorId: string) {
    return await prisma.alert.findFirst({
      where: {
        monitorId: monitorId,
        status: 'triggered',
      },
      orderBy: { sentAt: 'desc' },
      select: { sentAt: true, message: true },
    });
  },

  /**
   * Resolve all triggered alerts for a monitor
   */
  async resolveAlerts(monitorId: string) {
    return await prisma.alert.updateMany({
      where: {
        monitorId: monitorId,
        status: 'triggered',
      },
      data: {
        status: 'resolved',
        resolvedAt: new Date(),
      },
    });
  },

  /**
   * Get alerts for a user
   */
  async getUserAlerts(userId: string, limit: number) {
    return await prisma.alert.findMany({
      where: { userId: userId },
      orderBy: { sentAt: 'desc' },
      take: limit,
    });
  },

  /**
   * Get alert count for a user
   */
  async getUserAlertCount(userId: string) {
    return await prisma.alert.count({
      where: { userId: userId },
    });
  },
};