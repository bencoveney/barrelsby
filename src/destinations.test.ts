import * as Destinations from './destinations';
import { Logger } from './options/logger';
import { LocationOption } from './options/options';
import * as TestUtilities from './testUtilities';
import { Signale } from 'signale';
import { Directory } from './interfaces/directory.interface';

describe('destinations module has a', () => {
  describe('getDestinations function that', () => {
    let directory: Directory;
    let destinations: Directory[];
    const barrelName = 'barrel.ts';
    const testMode = (mode: LocationOption, getExpectedDestinations: () => Directory[]) => {
      describe(`when in '${mode}' mode`, () => {
        let logged: string[];
        let logger: Logger = new Signale();
        let loggerSpy: jest.SpyInstance<void, [message?: any, ...optionalArgs: any[]]>;
        beforeEach(() => {
          logged = [];
          logger = TestUtilities.mockLogger(logged);
          loggerSpy = jest.spyOn(logger, 'debug');
          destinations = Destinations.getDestinations(directory, mode, barrelName, logger);
        });
        it('should select the correct destinations', () => {
          expect(destinations).toEqual(getExpectedDestinations());
        });
        it('should log useful information to the logger', () => {
          expect(loggerSpy).toHaveBeenCalled();
        });
      });
    };
    beforeEach(() => {
      directory = TestUtilities.mockDirectoryTree();
    });
    testMode('top', () => [directory]);
    testMode('below', () => directory.directories);
    testMode('all', () => [
      directory.directories[0].directories[0],
      directory.directories[0],
      directory.directories[1],
      directory,
    ]);
    testMode('replace', () => [directory]);
    testMode('branch', () => [directory.directories[0], directory]);
  });
});
