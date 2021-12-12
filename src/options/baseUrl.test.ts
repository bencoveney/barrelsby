import { getCombinedBaseUrl } from './baseUrl';

describe('options/baseUrl module has a', () => {
  describe('getCombinedBaseUrl function that', () => {
    it('should resolve the correct baseUrl', () => {
      expect(getCombinedBaseUrl('.', 'base/url') as string).toMatch(/base[\\/]url$/);
      expect(getCombinedBaseUrl('.', undefined)).not.toBeDefined();
    });
  });
});
