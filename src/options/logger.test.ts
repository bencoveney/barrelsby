import { getLogger } from './logger';
import { Signale } from 'signale';

describe('options/logger module has a', () => {
  describe('getLogger function that', () => {
    it('should get the correct logger', () => {
      // tslint:disable:no-console
      const verboseLogger = getLogger({ isVerbose: true });
      expect(verboseLogger).toBeInstanceOf(Signale);

      const silentLogger = getLogger({ isVerbose: false });
      expect(silentLogger).toBeInstanceOf(Signale);
      expect(silentLogger).toBeDefined();
      // tslint:enable:no-console
    });
  });
});
