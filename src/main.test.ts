import { createBarrels } from '../bin/main.mjs';
import Sinon from 'sinon';
import * as Directory from './utils/directory.mjs';
import * as Builder from './utils/build-barrel.mjs';
import * as Logger from './utils/logger.mjs';

describe.skip('main module', () => {
  let spySandbox: Sinon.SinonSandbox;
  beforeEach(() => {
    spySandbox = Sinon.createSandbox();
  });
  afterEach(() => {
    spySandbox.restore();
  });
  it('should co-ordinate the main stages of the application', async () => {
    const args: any = {
      baseUrl: './',
      delete: true,
      directory: ['testRootPath'],
      exclude: ['directory4'],
      exportDefault: false,
      include: ['directory2'],
      local: true,
      location: 'top',
      name: 'inputBarrelName',
      noSemicolon: true,
      singleQuotes: true,
      structure: 'flat',
      verbose: true,
    };

    const builtTree: any = { mock: 'built tree' };
    const buildTreeSpy = spySandbox.stub(Directory, 'buildTree').returns(builtTree);

    const destinations: any = { mock: 'destinations' };
    const getDestinationsSpy = spySandbox.stub(Directory, 'getDestinations').returns(destinations);

    const purgeSpy = spySandbox.stub(Directory, 'purge');

    const buildBarrelsSpy = jest.spyOn(Builder, 'build');

    const quoteCharacter = "'";
    const semicolonCharacter = ';';

    const signale = Logger.getLogger();
    const getLoggerSpy = spySandbox.stub(Logger, 'getLogger').returns(signale);

    const barrelName = 'barrel.ts';
    const rootPath = './directory';

    const baseUrl = 'https://base-url.com/src/directory';
    await createBarrels(args);

    expect(getLoggerSpy.calledOnceWithExactly({ isVerbose: true })).toBeTruthy();
    expect(buildTreeSpy.calledOnceWithExactly(rootPath, barrelName, signale)).toBeTruthy();
    expect(getDestinationsSpy.calledOnceWithExactly(builtTree, args.location, barrelName, signale)).toBeTruthy();
    expect(purgeSpy.calledOnceWithExactly(builtTree, args.delete, barrelName, signale)).toBeTruthy();
    expect(buildBarrelsSpy).toHaveBeenCalledWith({
      destinations,
      quoteCharacter,
      semicolonCharacter,
      barrelName,
      logger: signale,
      baseUrl,
      exportDefault: args.exportDefault,
      structure: args.structure,
      local: args.local,
      include: args.include,
      exclude: [...args.exclude, 'node_modules'],
    });
  });
});
