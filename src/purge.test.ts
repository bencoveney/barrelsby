import fs from 'fs';
import MockFs from 'mock-fs';

import { Logger } from './options/logger';
import * as Purge from './purge';
import * as TestUtilities from './testUtilities';
import { Directory } from './interfaces/directory.interface';

describe('purge module has a', () => {
  describe('purge function that', () => {
    let directory: Directory;
    let logged: string[];
    let logger: Logger;
    let loggerSpy: jest.SpyInstance<void, [message?: any, ...optionalArgs: any[]]>;
    const barrelName = 'barrel.ts';
    beforeEach(() => {
      MockFs(TestUtilities.mockFsConfiguration());
      directory = TestUtilities.mockDirectoryTree();
      logged = [];
      logger = TestUtilities.mockLogger(logged);
      loggerSpy = jest.spyOn(logger, 'debug');
    });
    afterEach(() => {
      MockFs.restore();
    });
    it('should delete existing barrels if the delete flag is enabled', () => {
      Purge.purge(directory, true, barrelName, logger);

      // Check directory has been manipulated.
      expect(directory.files.length).toBe(2);
      expect(directory.files.filter(file => file.name === 'barrel.ts').length).toBe(0);

      // Check FS has been manipulated.
      expect(fs.existsSync('directory1/barrel.ts')).toBeFalsy();
    });
    it('should do nothing if the delete flag is disabled', () => {
      Purge.purge(directory, false, barrelName, logger);

      // Check directory has not been manipulated.
      expect(directory.files.length).toBe(3);
      expect(directory.files.filter(file => file.name === 'barrel.ts').length).toBe(1);

      // Check FS has not been manipulated.
      expect(fs.existsSync('directory1/barrel.ts')).toBeTruthy();
    });
    it('should log useful information to the logger', () => {
      Purge.purge(directory, true, barrelName, logger);

      expect(loggerSpy).toHaveBeenCalledTimes(2);
    });
  });
});
