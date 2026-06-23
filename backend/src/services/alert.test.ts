const mockPrisma = {
  alert: {
    create: jest.fn(),
    findFirst: jest.fn(),
    updateMany: jest.fn(),
  },
  monitor: {
    findFirst: jest.fn(),
  },
  user: {
    findFirst: jest.fn(),
  },
};

// Mock the prisma instance before importing the service
jest.mock('../config/database', () => ({
  prisma: mockPrisma,
}));

// Import the service after setting up the mock
import { alertService } from './alert';

describe('Alert Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createAlert', () => {
    it('should create an alert for status change', async () => {
      const alertData = {
        monitorId: '1',
        userId: 'user1',
        type: 'email',
        status: 'triggered',
        message: 'Test monitor is down',
      };
      mockPrisma.alert.create.mockResolvedValue({
        id: '1',
        ...alertData,
      });

      const result = await alertService.createAlert(alertData);

      expect(result).toHaveProperty('id', '1');
      expect(mockPrisma.alert.create).toHaveBeenCalledWith({
        data: alertData,
      });
    });
  });

  describe('resolveAlerts', () => {
    it('should resolve triggered alerts for a monitor', async () => {
      const monitorId = '1';
      mockPrisma.alert.updateMany.mockResolvedValue({
        count: 1,
      });

      const result = await alertService.resolveAlerts(monitorId);

      expect(result.count).toBe(1);
      expect(mockPrisma.alert.updateMany).toHaveBeenCalledWith({
        where: {
          monitorId,
          status: 'triggered',
        },
        data: {
          status: 'resolved',
          resolvedAt: expect.any(Date),
        },
      });
    });
  });
});
export {};
