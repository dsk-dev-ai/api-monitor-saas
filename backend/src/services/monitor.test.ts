const mockPrisma = {
  monitor: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  check: {
    count: jest.fn(),
    findMany: jest.fn(),
    aggregate: jest.fn(),
  },
  alert: {
    findFirst: jest.fn(),
    create: jest.fn(),
    updateMany: jest.fn(),
  },
  subscription: {
    findUnique: jest.fn(),
  },
  $queryRaw: jest.fn(),
};

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://user:password@localhost:5432/api_monitor_test';
process.env.SUPABASE_URL = 'https://example.supabase.co';
process.env.SUPABASE_ANON_KEY = 'test-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
process.env.JWT_SECRET = 'test-jwt-secret-with-at-least-32-characters';

// Mock the prisma instance before importing the service
jest.mock('../config/database', () => ({
  prisma: mockPrisma,
}));

// Import the service after setting up the mock
import { monitorService } from './monitor';

describe('Monitor Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getMonitorsWithStats', () => {
    it('should return monitors with stats', async () => {
      // Mock data
      const mockMonitors = [
        {
          id: '1',
          name: 'Test Monitor',
          url: 'https://example.com',
          userId: 'user1',
          checks: [
            { status: 'up', responseTime: 100 },
            { status: 'up', responseTime: 150 },
          ],
        },
      ];

      mockPrisma.monitor.findMany.mockResolvedValue(mockMonitors);
      mockPrisma.check.count.mockResolvedValue(2);
      mockPrisma.check.count.mockResolvedValueOnce(2); // totalChecks
      mockPrisma.check.count.mockResolvedValueOnce(2); // upChecks

      // Call the service method
      const result = await monitorService.getMonitorsWithStats('user1');

      // Assertions
      expect(result).toHaveLength(1);
      expect(result[0].uptime24h).toBe(100);
      expect(mockPrisma.monitor.findMany).toHaveBeenCalledWith({
        where: { userId: 'user1' },
        include: {
          checks: { orderBy: { checkedAt: 'desc' }, take: 1 },
          _count: { select: { checks: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('createMonitor', () => {
    it('should create a monitor', async () => {
      const monitorData = {
        name: 'Test Monitor',
        url: 'https://example.com',
        method: 'GET',
        interval: 300,
        timeout: 30,
      };

      mockPrisma.subscription.findUnique.mockResolvedValue({ plan: 'free' });
      mockPrisma.monitor.count.mockResolvedValue(0);
      mockPrisma.monitor.create.mockResolvedValue({
        id: '1',
        ...monitorData,
        userId: 'user1',
      });

      const result = await monitorService.createMonitor(monitorData, 'user1');

      expect(result).toHaveProperty('id', '1');
      expect(mockPrisma.monitor.create).toHaveBeenCalledWith({
        data: {
          ...monitorData,
          userId: 'user1',
        },
      });
    });
  });
});
export {};
