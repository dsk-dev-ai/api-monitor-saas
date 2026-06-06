import cron from 'node-cron';
import dotenv from 'dotenv';
dotenv.config();

import { prisma } from './lib/prisma';
import { executeCheck } from './services/executor';
import { sendEmailAlert } from './services/alert-service';
import { logger } from './utils/logger';

const CHECK_INTERVAL = parseInt(process.env.CHECK_INTERVAL_SECONDS || '30');
const CLEANUP_DAYS = parseInt(process.env.CLEANUP_DAYS || '90');

interface Monitor {
  id: string;
  name: string;
  url: string;
  method: string;
  headers: any;
  body: string | null;
  interval: number;
  timeout: number;
  expectedStatus: number | null;
  expectedKeyword: string | null;
  region: string;
  userId: string;
  isActive: boolean;
  isPaused: boolean;
  user: {
    email: string;
  };
}

// Track last known status to detect changes
const lastStatusMap = new Map<string, string>();

async function runChecks() {
  try {
    logger.info('Starting check cycle...');

    // Fetch all active, non-paused monitors
    const monitors = await prisma.monitor.findMany({
      where: {
        isActive: true,
        isPaused: false,
      },
      include: {
        user: {
          select: { email: true },
        },
      },
    });

    logger.info(`Processing ${monitors.length} monitors`);

    // Group monitors by interval for efficiency
    const now = Date.now();
    const monitorsToCheck: Monitor[] = monitors.filter((m: Monitor) => {
      const lastCheck = lastStatusMap.get(`last_${m.id}`);
      if (!lastCheck) return true;
      return (now - parseInt(lastCheck)) >= m.interval * 1000;
    });

    // Process checks in parallel batches
    const BATCH_SIZE = 10;
    for (let i = 0; i < monitorsToCheck.length; i += BATCH_SIZE) {
      const batch = monitorsToCheck.slice(i, i + BATCH_SIZE);

      await Promise.all(
        batch.map(async (monitor: Monitor) => {
          try {
            const result = await executeCheck(
              monitor.url,
              monitor.method,
              (monitor.headers as Record<string, string>) || {},
              monitor.body || undefined,
              monitor.timeout * 1000,
              monitor.expectedStatus || undefined,
              monitor.expectedKeyword || undefined
            );

            // Store check result
            await prisma.check.create({
              data: {
                monitorId: monitor.id,
                status: result.status,
                statusCode: result.statusCode,
                responseTime: result.responseTime,
                error: result.error,
                region: monitor.region,
              },
            });

            // Update last check timestamp
            lastStatusMap.set(`last_${monitor.id}`, now.toString());

            // Detect status change
            const previousStatus = lastStatusMap.get(monitor.id);
            const currentStatus = result.status;

            if (previousStatus && previousStatus !== currentStatus) {
              logger.info(`Status change for ${monitor.name}: ${previousStatus} -> ${currentStatus}`);

              // Create alert record
              await prisma.alert.create({
                data: {
                  monitorId: monitor.id,
                  userId: monitor.userId,
                  type: 'email',
                  status: currentStatus === 'down' ? 'triggered' : 'resolved',
                  message: currentStatus === 'down'
                    ? `${monitor.name} is DOWN: ${result.error || 'No response'}`
                    : `${monitor.name} is back UP`,
                  details: {
                    statusCode: result.statusCode,
                    responseTime: result.responseTime,
                    error: result.error,
                  },
                },
              });

              // Send email notification
              if (monitor.user.email) {
                await sendEmailAlert(
                  monitor.user.email,
                  monitor.name,
                  monitor.url,
                  currentStatus === 'down' ? 'down' : 'up',
                  result.error,
                  result.responseTime,
                  result.statusCode
                );
              }

              // If resolved, update previous triggered alerts
              if (currentStatus === 'up') {
                await prisma.alert.updateMany({
                  where: {
                    monitorId: monitor.id,
                    status: 'triggered',
                  },
                  data: {
                    status: 'resolved',
                    resolvedAt: new Date(),
                  },
                });
              }
            }

            // Store current status
            lastStatusMap.set(monitor.id, currentStatus);

          } catch (error: any) {
            logger.error(`Error checking monitor ${monitor.name}`, { error: error.message });
          }
        })
      );
    }

    logger.info(`Check cycle completed. Processed ${monitorsToCheck.length} monitors`);

  } catch (error: any) {
    logger.error('Error in check cycle', { error: error.message });
  }
}

// Cleanup old checks
async function cleanupOldChecks() {
  try {
    const cutoff = new Date(Date.now() - CLEANUP_DAYS * 24 * 60 * 60 * 1000);
    const deleted = await prisma.check.deleteMany({
      where: {
        checkedAt: {
          lt: cutoff,
        },
      },
    });
    logger.info(`Cleaned up ${deleted.count} old checks`);
  } catch (error: any) {
    logger.error('Error cleaning up old checks', { error: error.message });
  }
}

// Main scheduler
async function main() {
  logger.info('🚀 API Monitor Worker starting...');
  logger.info(`Check interval: ${CHECK_INTERVAL}s`);
  logger.info(`Cleanup retention: ${CLEANUP_DAYS} days`);

  // Initial status load
  const recentChecks = await prisma.check.findMany({
    distinct: ['monitorId'],
    orderBy: { checkedAt: 'desc' },
    select: { monitorId: true, status: true },
  });

  recentChecks.forEach((check: any) => {
    lastStatusMap.set(check.monitorId, check.status);
  });

  logger.info(`Loaded ${recentChecks.length} monitor statuses`);

  // Schedule check runner - run every CHECK_INTERVAL seconds
  const intervalSeconds = Math.max(CHECK_INTERVAL, 30);
  logger.info(`Scheduling checks every ${intervalSeconds} seconds`);

  // Use setInterval instead of cron for sub-minute intervals
  setInterval(runChecks, intervalSeconds * 1000);

  // Schedule cleanup (daily at 3 AM)
  cron.schedule('0 3 * * *', cleanupOldChecks);

  // Run initial check immediately
  await runChecks();

  logger.info('✅ Worker scheduler running');
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

main().catch((error: any) => {
  logger.error('Fatal error starting worker', { error: error.message });
  process.exit(1);
});
