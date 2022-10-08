import fs from 'fs';
import MockFs from 'mock-fs';
import Sinon from 'sinon';

import { build, buildImportPath, getBasename } from './builder';
import * as FileSystem from './builders/fileSystem';
import * as Flat from './builders/flat';
import * as Header from './builders/header';
import * as Modules from './modules';
import { StructureOption } from './options/options';
import * as TestUtilities from './testUtilities';
import { Directory } from './interfaces/directory.interface';
import { FileTreeLocation } from './interfaces/location.interface';
import { Signale } from 'signale';
import { BaseUrl } from './options/baseUrl';
import { Logger } from './options/logger';
import { SemicolonCharacter } from './options/noSemicolon';
import { QuoteCharacter } from './options/quoteCharacter';
import * as BuildBarrelModule from './tasks/BuildBarrel';

// Gets a location from a list by name.
function getLocationByName(locations: FileTreeLocation[], name: string): FileTreeLocation {
  return locations.filter(location => location.name === name)[0];
}

describe('builder/builder module has a', () => {
  describe('buildBarrels function that', () => {
    let directory: Directory;
    let spySandbox: sinon.SinonSandbox;
    let loggerSpy: Sinon.SinonSpy<[message?: any, ...optionalArgs: any[]], void>;
    let builderSpy: Sinon.SinonSpy<
      [
        {
          addHeader: boolean;
          directory: Directory;
          barrelType: StructureOption;
          quoteCharacter: QuoteCharacter;
          semicolonCharacter: SemicolonCharacter;
          barrelName: string;
          logger: Logger;
          // Gets a location from a list by name.
          baseUrl: BaseUrl;
          exportDefault: boolean;
          local: boolean;
          include: string[];
          exclude: string[];
        }
      ],
      void
    >;
    const logger = new Signale();
    const runBuilder = (structure: StructureOption | undefined) => {
      loggerSpy = spySandbox.spy(logger, 'debug');
      builderSpy = spySandbox.spy(BuildBarrelModule, 'buildBarrel');
      build({
        addHeader: true,
        destinations: directory.directories,
        quoteCharacter: '"',
        semicolonCharacter: ';',
        barrelName: 'barrel.ts',
        logger,
        baseUrl: undefined,
        exportDefault: false,
        structure,
        local: false,
        include: [],
        exclude: [],
      });
    };
    beforeEach(() => {
      MockFs(TestUtilities.mockFsConfiguration());
      directory = TestUtilities.mockDirectoryTree();
      spySandbox = Sinon.createSandbox();
      spySandbox.stub(FileSystem, 'buildFileSystemBarrel').returns('fileSystemContent');
      spySandbox.stub(Flat, 'buildFlatBarrel').returns('flatContent');
      spySandbox.stub(Modules, 'loadDirectoryModules').returns([]);
      spySandbox.stub(Header, 'addHeaderPrefix').callsFake((content: string) => `header: ${content}`);
    });
    afterEach(() => {
      MockFs.restore();
      spySandbox.restore();
    });
    describe('uses the structure option and', () => {
      const testStructure = (structure: StructureOption | undefined, isFlat: boolean) => {
        runBuilder(structure);
        // TODO: Test arguments for barrel builder & loadDirectoryModules
        if (isFlat) {
          Sinon.assert.calledTwice(Flat.buildFlatBarrel as Sinon.SinonSpy);
          Sinon.assert.notCalled(FileSystem.buildFileSystemBarrel as Sinon.SinonSpy);
        } else {
          Sinon.assert.notCalled(Flat.buildFlatBarrel as Sinon.SinonSpy);
          Sinon.assert.calledTwice(FileSystem.buildFileSystemBarrel as Sinon.SinonSpy);
        }
      };
      it('should use the flat builder if in flat mode', () => {
        testStructure(StructureOption.FLAT, true);
      });
      it('should use the filesystem builder if in filesystem mode', () => {
        testStructure(StructureOption.FILESYSTEM, false);
      });
      it('should use the flat builder if no mode is specified', () => {
        testStructure(undefined, true);
      });
    });
    it("should write each barrel's header and content to disk", () => {
      runBuilder(StructureOption.FLAT);
      const checkContent = (address: string) => {
        const result = fs.readFileSync(address, 'utf8');
        expect(result).toEqual('header: flatContent');
      };
      checkContent('directory1/directory2/barrel.ts');
      checkContent('directory1/directory3/barrel.ts');
    });
    it('should update the directory structure with the new barrel', () => {
      runBuilder(StructureOption.FLAT);
      directory.directories.forEach((subDirectory: Directory) => {
        expect((subDirectory.barrel as FileTreeLocation).name).toEqual('barrel.ts');
      });
    });
    it('should log useful information to the logger', () => {
      runBuilder(StructureOption.FLAT);
      const messages = [
        'Building barrel @ directory1/directory2',
        'Updating model barrel @ directory1/directory2/barrel.ts',
        'Building barrel @ directory1/directory3',
        'Updating model barrel @ directory1/directory3/barrel.ts',
      ];
      expect(loggerSpy.callCount).toEqual(4);
      messages.forEach((message: string, barrel: number) => {
        expect(loggerSpy.getCall(barrel).args[0]).toEqual(message);
      });
    });
    it('should run the amount of times as the directory options length', () => {
      runBuilder(StructureOption.FLAT);
      expect(builderSpy.callCount).toBe(directory.directories.length);
    });
  });
  describe('buildBarrels function with empty barrel content that', () => {
    let directory: Directory;
    let spySandbox: sinon.SinonSandbox;
    const logger = new Signale();
    const runBuilder = () => {
      build({
        addHeader: true,
        destinations: directory.directories,
        quoteCharacter: '"',
        semicolonCharacter: ';',
        barrelName: 'barrel.ts',
        logger,
        baseUrl: undefined,
        exportDefault: false,
        structure: StructureOption.FLAT,
        local: false,
        include: [],
        exclude: [],
      });
    };
    beforeEach(() => {
      MockFs(TestUtilities.mockFsConfiguration());
      directory = TestUtilities.mockDirectoryTree();
      spySandbox = Sinon.createSandbox();
      spySandbox.stub(Flat, 'buildFlatBarrel').returns('');
      spySandbox.stub(Modules, 'loadDirectoryModules').returns([]);
    });
    afterEach(() => {
      MockFs.restore();
      spySandbox.restore();
    });
    it('does not create an empty barrel', () => {
      runBuilder();
      const checkDoesNotExist = (address: string) => {
        expect(fs.existsSync(address)).toBe(false);
      };
      checkDoesNotExist('directory1/directory2/barrel.ts');
      checkDoesNotExist('directory1/directory3/barrel.ts');
    });
  });
  describe('buildImportPath function that', () => {
    let directory: Directory;
    beforeEach(() => {
      directory = TestUtilities.mockDirectoryTree();
    });
    it('should correctly build a path to a file in the same directory', () => {
      const target = getLocationByName(directory.files, 'index.ts');
      const result = buildImportPath(directory, target, undefined);
      expect(result).toEqual('./index');
    });
    it('should correctly build a path to a file in a child directory', () => {
      const childDirectory = getLocationByName(directory.directories, 'directory2') as Directory;
      const target = getLocationByName(childDirectory.files, 'script.ts');
      const result = buildImportPath(directory, target, undefined);
      expect(result).toEqual('./directory2/script');
    });
  });
  describe('getBasename function that', () => {
    it('should correctly strip .ts from the filename', () => {
      const fileName = './random/path/file.ts';
      const result = getBasename(fileName);
      expect(result).toEqual('file');
    });
    it('should correctly strip .d.ts from the filename', () => {
      const fileName = './random/path/file.d.ts';
      const result = getBasename(fileName);
      expect(result).toEqual('file');
    });
    it('should correctly strip .tsx from the filename', () => {
      const fileName = './random/path/file.tsx';
      const result = getBasename(fileName);
      expect(result).toEqual('file');
    });
    it('should not strip extensions from non-typescript filenames', () => {
      const fileName = './random/path/file.cs';
      const result = getBasename(fileName);
      expect(result).toEqual('file.cs');
    });
  });
});
