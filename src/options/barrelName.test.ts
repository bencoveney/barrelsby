import Sinon from 'sinon';

import { getBarrelName } from './barrelName';
import { Logger } from './logger';
import { Signale } from 'signale';

describe('options/barrelName module has a', () => {
  describe('getBarrelName function that', () => {
    let spySandbox: sinon.SinonSandbox;
    let logger: Logger;
    let loggerSpy: Sinon.SinonSpy<[message?: any, ...optionalArgs: any[]], void>;
    beforeEach(() => {
      spySandbox = Sinon.createSandbox();
      logger = new Signale();
      loggerSpy = spySandbox.spy(logger, 'debug');
    });
    afterEach(() => {
      spySandbox.restore();
    });
    it('should ensure the name has .ts attached', () => {
      expect(getBarrelName('barrel.ts', logger)).toEqual('barrel.ts');
      expect(getBarrelName('barrel', logger)).toEqual('barrel.ts');
    });
    it('should log the barrel name', () => {
      getBarrelName('barrel.ts', logger);
      expect(loggerSpy.calledOnceWithExactly('Using name barrel.ts')).toBeTruthy();
    });
  });
});
