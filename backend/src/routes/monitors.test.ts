import { createMonitorSchema, updateMonitorSchema } from './monitors';

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

    it.each(['file:///etc/passwd', 'ftp://example.com', 'gopher://example.com', 'ws://example.com'])(
      'should reject a %s target',
      (url) => {
        const result = createMonitorSchema.safeParse({ name: 'Test Monitor', url });
        expect(result.success).toBe(false);
      }
    );

    it.each([
      'http://example.com',
      'https://example.com',
      'HTTPS://example.com',
      'https://example.com:8443/health?x=1',
    ])('should accept %s', (url) => {
      expect(createMonitorSchema.safeParse({ name: 'Test Monitor', url }).success).toBe(true);
    });

    it('should accept a syntactically valid but internal URL, because the worker policy enforces that', () => {
      // Deliberate. This schema checks shape and scheme only. A private or metadata
      // address is syntactically valid and is refused at request time by
      // worker/src/security, not here. Asserting rejection here would be a false claim
      // about where the boundary is.
      const result = createMonitorSchema.safeParse({
        name: 'Internal',
        url: 'http://169.254.169.254/latest/meta-data/',
      });
      expect(result.success).toBe(true);
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