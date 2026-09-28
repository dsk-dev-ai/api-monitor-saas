import { AuthProvider } from './provider';
import {
  getAuthProvider,
  isExternalAuthProvider,
  resetAuthProviderForTests,
} from './index';

const ORIGINAL_ENV = { ...process.env };

const stubProvider = (name: string): AuthProvider => ({
  name,
  verifyToken: jest.fn().mockResolvedValue(null),
});

/**
 * These tests cover the resolver only. The bundled Supabase provider is verified through
 * the Docker stack and the live Supabase deployment, because constructing it requires real
 * Supabase configuration and this file must stay runnable with no environment set.
 */
describe('auth provider resolution', () => {
  beforeEach(() => {
    resetAuthProviderForTests();
    delete process.env.AUTH_PROVIDER_MODULE;
  });

  afterAll(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  describe('default selection', () => {
    it('should not report an external provider when AUTH_PROVIDER_MODULE is unset', () => {
      expect(isExternalAuthProvider()).toBe(false);
    });

    it('should not report an external provider when AUTH_PROVIDER_MODULE is blank', () => {
      process.env.AUTH_PROVIDER_MODULE = '   ';
      expect(isExternalAuthProvider()).toBe(false);
    });

    it('should select the bundled Supabase provider by default', () => {
      process.env.SUPABASE_URL = 'https://project.supabase.co';
      process.env.SUPABASE_ANON_KEY = 'anon-key';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-key';

      expect(getAuthProvider().name).toBe('supabase');
    });
  });

  describe('external provider selection', () => {
    it('should report an external provider when AUTH_PROVIDER_MODULE is set', () => {
      process.env.AUTH_PROVIDER_MODULE = './test-fixture-provider';
      expect(isExternalAuthProvider()).toBe(true);
    });

    it('should load a provider from a default export', () => {
      const provider = stubProvider('enterprise');
      process.env.AUTH_PROVIDER_MODULE = './external/default-export';
      jest.doMock(
        './external/default-export',
        () => ({ __esModule: true, default: provider }),
        { virtual: true }
      );

      expect(getAuthProvider()).toBe(provider);
      expect(getAuthProvider().name).toBe('enterprise');

      jest.dontMock('./external/default-export');
    });

    it('should load a provider from a named authProvider export', () => {
      const provider = stubProvider('enterprise-named');
      process.env.AUTH_PROVIDER_MODULE = './external/named-export';
      jest.doMock(
        './external/named-export',
        () => ({ __esModule: true, authProvider: provider }),
        { virtual: true }
      );

      expect(getAuthProvider().name).toBe('enterprise-named');

      jest.dontMock('./external/named-export');
    });

    it('should load a provider from a CommonJS module.exports', () => {
      const provider = stubProvider('enterprise-cjs');
      process.env.AUTH_PROVIDER_MODULE = './external/cjs-export';
      jest.doMock('./external/cjs-export', () => provider, { virtual: true });

      expect(getAuthProvider().name).toBe('enterprise-cjs');

      jest.dontMock('./external/cjs-export');
    });

    it('should cache the provider rather than re-resolving on every request', () => {
      const provider = stubProvider('enterprise-cached');
      process.env.AUTH_PROVIDER_MODULE = './external/cached';
      jest.doMock('./external/cached', () => ({ __esModule: true, default: provider }), {
        virtual: true,
      });

      expect(getAuthProvider()).toBe(getAuthProvider());

      jest.dontMock('./external/cached');
    });
  });

  describe('misconfiguration', () => {
    it('should fail loudly when the configured module cannot be loaded', () => {
      process.env.AUTH_PROVIDER_MODULE = './external/does-not-exist';

      expect(() => getAuthProvider()).toThrow(/could not be loaded/);
    });

    it('should name the offending module so the mistake is obvious', () => {
      process.env.AUTH_PROVIDER_MODULE = './external/does-not-exist';

      expect(() => getAuthProvider()).toThrow(/external\/does-not-exist/);
    });

    it('should reject a module that does not export a provider', () => {
      process.env.AUTH_PROVIDER_MODULE = './external/wrong-shape';
      jest.doMock('./external/wrong-shape', () => ({ __esModule: true }), {
        virtual: true,
      });

      expect(() => getAuthProvider()).toThrow(/does not export an auth provider/);

      jest.dontMock('./external/wrong-shape');
    });

    it('should reject a provider that is missing verifyToken', () => {
      process.env.AUTH_PROVIDER_MODULE = './external/incomplete';
      jest.doMock(
        './external/incomplete',
        () => ({ __esModule: true, default: { name: 'broken' } }),
        { virtual: true }
      );

      expect(() => getAuthProvider()).toThrow(/does not export an auth provider/);

      jest.dontMock('./external/incomplete');
    });

    it('should not silently fall back to Supabase when the module is broken', () => {
      process.env.AUTH_PROVIDER_MODULE = './external/does-not-exist';

      expect(() => getAuthProvider()).toThrow();
      // The failure is not swallowed into the default, which would authenticate the
      // Enterprise deployment against the wrong identity system instead of failing.
      expect(isExternalAuthProvider()).toBe(true);
    });
  });
});
