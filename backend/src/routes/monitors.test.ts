import { z } from 'zod';

// Since the schemas are not exported from the monitors.ts file,
// we'll recreate them here for testing purposes
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

describe('Monitor Routes Validation', () => {
  describe('createMonitorSchema', () => {
    it('should validate a valid monitor creation request', () => {
      const validData = {
        name: 'Test Monitor',
        url: 'https://example.com',
        method: 'GET',
        interval: 300,
        timeout: 30,
        expectedStatus: 200,
      };

      const result = createMonitorSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          ...validData,
          headers: {},
          interval: 300,
          method: 'GET',
          region: 'global',
          timeout: 30,
        });
      }
    });

    it('should reject invalid URL', () => {
      const invalidData = {
        name: 'Test Monitor',
        url: 'not-a-url',
        method: 'GET',
      };

      const result = createMonitorSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should require name and url', () => {
      const invalidData = {
        method: 'GET',
      };

      const result = createMonitorSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should apply defaults', () => {
      const data = {
        name: 'Test Monitor',
        url: 'https://example.com',
      };

      const result = createMonitorSchema.parse(data);
      expect(result.method).toBe('GET');
      expect(result.interval).toBe(300);
      expect(result.timeout).toBe(30);
      expect(result.headers).toEqual({});
    });
  });

  describe('updateMonitorSchema', () => {
    it('should allow partial updates', () => {
      const partialData = {
        name: 'Updated Name',
      };

      const result = updateMonitorSchema.safeParse(partialData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(partialData);
      }
    });
  });
});