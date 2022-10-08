import * as Destinations from './destinations';
import * as FileTree from './fileTree';
import { Barrelsby } from './index';
import * as BarrelName from './options/barrelName';
import * as BaseUrl from './options/baseUrl';
import * as Logger from './options/logger';
import * as NoSemicolon from './options/noSemicolon';
import * as QuoteCharacter from './options/quoteCharacter';
import * as RootPath from './options/rootPath';
import * as Purge from './purge';
import Sinon from 'sinon';
import * as Builder from './builder';

describe('main module', () => {
  let spySandbox: Sinon.SinonSandbox;
  beforeEach(() => {
    spySandbox = Sinon.createSandbox();
  });
  afterEach(() => {
    spySandbox.restore();
  });
  it('should co-ordinate the main stages of the application', () => {
    const args: any = {
      noHeader: false,
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
    const buildTreeSpy = spySandbox.stub(FileTree, 'buildTree').returns(builtTree);

    const destinations: any = { mock: 'destinations' };
    const getDestinationsSpy = spySandbox.stub(Destinations, 'getDestinations').returns(destinations);

    const purgeSpy = spySandbox.stub(Purge, 'purge');

    const buildBarrelsSpy = jest.spyOn(Builder, 'build');

    const quoteCharacter = "'";
    const getQuoteCharacterSpy = spySandbox.stub(QuoteCharacter, 'getQuoteCharacter').returns(quoteCharacter);

    const semicolonCharacter = ';';
    const getSemicolonCharacterSpy = spySandbox.stub(NoSemicolon, 'getSemicolonCharacter').returns(semicolonCharacter);

    const signale = Logger.getLogger();
    const getLoggerSpy = spySandbox.stub(Logger, 'getLogger').returns(signale);

    const barrelName = 'barrel.ts';
    const getBarrelNameSpy = spySandbox.stub(BarrelName, 'getBarrelName').returns(barrelName);

    const rootPath = './directory';
    const resolveRootPathSpy = spySandbox.stub(RootPath, 'resolveRootPath').returns(rootPath);

    const baseUrl = 'https://base-url.com/src/directory';
    const getCombinedBaseUrlSpy = spySandbox.stub(BaseUrl, 'getCombinedBaseUrl').returns(baseUrl);

    Barrelsby(args);

    expect(getQuoteCharacterSpy.calledOnceWithExactly(true)).toBeTruthy();
    expect(getSemicolonCharacterSpy.calledOnceWithExactly(true)).toBeTruthy();
    expect(getLoggerSpy.calledOnceWithExactly({ isVerbose: true })).toBeTruthy();
    expect(getBarrelNameSpy.calledOnceWithExactly(args.name, signale)).toBeTruthy();
    expect(resolveRootPathSpy.calledWithExactly('testRootPath')).toBeTruthy();
    expect(getCombinedBaseUrlSpy.calledOnceWithExactly(rootPath, args.baseUrl)).toBeTruthy();
    expect(buildTreeSpy.calledOnceWithExactly(rootPath, barrelName, signale)).toBeTruthy();
    expect(getDestinationsSpy.calledOnceWithExactly(builtTree, args.location, barrelName, signale)).toBeTruthy();
    expect(purgeSpy.calledOnceWithExactly(builtTree, args.delete, barrelName, signale)).toBeTruthy();
    expect(buildBarrelsSpy).toHaveBeenCalledWith({
      addHeader: true,
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
