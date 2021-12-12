import * as Modules from './modules';
import { Logger } from './options/logger';
import * as TestUtilities from './testUtilities';
import { Directory } from './interfaces/directory.interface';

describe('builder/modules module has a', () => {
  describe('loadDirectoryModules function that', () => {
    let directory: Directory;
    let logged: string[];
    let logger: Logger;
    let loggerSpy: jest.SpyInstance<void, [message?: any, ...optionalArgs: any[]]>;
    beforeEach(() => {
      directory = TestUtilities.mockDirectoryTree();
      logged = [];
      logger = TestUtilities.mockLogger(logged);
      loggerSpy = jest.spyOn(logger, 'debug');
    });
    it('should identify modules from directories recursively', () => {
      const result = Modules.loadDirectoryModules(directory.directories[0], logger, [], [], false);
      expect(result.length).toBe(2);
      expect(result[0]).toEqual({
        name: 'script.ts',
        path: 'directory1/directory2/script.ts',
      });
      expect(result[1]).toEqual({
        name: 'deeplyNested.ts',
        path: 'directory1/directory2/directory4/deeplyNested.ts',
      });
    });
    it('should not identify modules recursively if the local flag is set', () => {
      const result = Modules.loadDirectoryModules(directory.directories[0], logger, [], [], true);
      expect(result.length).toBe(1);
      expect(result[0]).toEqual({
        name: 'script.ts',
        path: 'directory1/directory2/script.ts',
      });
    });
    it('should identify directories that already contain a barrel', () => {
      // Set up a barrel.
      const targetDirectory = directory.directories[0];
      targetDirectory.barrel = targetDirectory.files[0];

      const result = Modules.loadDirectoryModules(directory.directories[0], logger, [], [], false);
      expect(result.length).toBe(1);
      expect(result[0]).toEqual({
        name: 'script.ts',
        path: 'directory1/directory2/script.ts',
      });
    });
    it('should only include TypeScript files', () => {
      const result = Modules.loadDirectoryModules(directory, logger, [], [], false);
      result.forEach(location => expect(location.name).not.toEqual('ignore.txt'));
    });
    it('should only include files matching a whitelist option when specified', () => {
      const result = Modules.loadDirectoryModules(directory, logger, ['directory2'], [], false);
      expect(result.length).toBe(2);
      expect(result[0]).toEqual({
        name: 'script.ts',
        path: 'directory1/directory2/script.ts',
      });
      expect(result[1]).toEqual({
        name: 'deeplyNested.ts',
        path: 'directory1/directory2/directory4/deeplyNested.ts',
      });
    });
    it('should exclude files matching a blacklist option when specified', () => {
      const result = Modules.loadDirectoryModules(directory, logger, [], ['directory2'], false);
      expect(result.length).toBe(3);
      expect(result[0]).toEqual({
        name: 'barrel.ts',
        path: 'directory1/barrel.ts',
      });
      expect(result[1]).toEqual({
        name: 'index.ts',
        path: 'directory1/index.ts',
      });
      expect(result[2]).toEqual({
        name: 'program.ts',
        path: 'directory1/directory3/program.ts',
      });
    });
    it('should correctly handle both whitelist and blacklist options being set', () => {
      const result = Modules.loadDirectoryModules(directory, logger, ['directory2'], ['directory4'], false);
      expect(result.length).toBe(1);
      expect(result[0]).toEqual({
        name: 'script.ts',
        path: 'directory1/directory2/script.ts',
      });
    });
    it('should log useful information to the logger', () => {
      // Set up a barrel.
      const indexedDirectory = directory.directories[0];
      indexedDirectory.barrel = indexedDirectory.files[0];

      Modules.loadDirectoryModules(directory, logger, [], [], false);
      expect(loggerSpy).toBeCalledTimes(4);
    });
  });
});
