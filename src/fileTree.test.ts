import MockFs from 'mock-fs';

import * as FileTree from './fileTree';
import * as TestUtilities from './testUtilities';
import { Directory } from './interfaces/directory.interface';
import { FileTreeLocation } from './interfaces/location.interface';

describe('fileTree module has a', () => {
  describe('buildTree function that', () => {
    let result: Directory;
    let logged: string[];
    let loggerSpy: jest.SpyInstance<void, [message?: any, ...optionalArgs: any[]]>;
    const barrelName = 'barrel.ts';
    beforeEach(() => {
      MockFs(TestUtilities.mockFsConfiguration());
      logged = [];
      const logger = TestUtilities.mockLogger(logged);
      loggerSpy = jest.spyOn(logger, 'debug');
      result = FileTree.buildTree('./directory1', barrelName, logger);
    });
    afterEach(() => {
      MockFs.restore();
    });
    it('should build a tree structure matching the file system directories', () => {
      // Check the current directory.
      expect(result.path).toEqual('./directory1');
      expect(result.name).toEqual('directory1');

      // Check for a child.
      expect(result.directories.length).toBe(2);
      const subDirectory = result.directories[0];

      // Check the child directory.
      expect(subDirectory.path).toEqual('directory1/directory2');
      expect(subDirectory.name).toEqual('directory2');
    });
    it('should enumerate each file in a directory', () => {
      expect(result.files.length).toBe(3);
      const testFile = (name: string) => {
        const files = result.files.filter(file => file.name === name);
        expect(files.length).toBe(1);
        const firstFile = files[0];
        expect(firstFile.path).toEqual(`directory1/${name}`);
        expect(firstFile.name).toEqual(name);
      };
      testFile('index.ts');
      testFile('ignore.txt');
      testFile(barrelName);
    });
    it('should identify existing barrels in a directory', () => {
      expect(result.barrel).not.toBeNull();

      const barrel = result.barrel as FileTreeLocation;

      // Test the barrel.
      expect(barrel.name).toEqual(barrelName);
      expect(barrel.path).toEqual('directory1/barrel.ts');

      // Test it is in the files list.
      expect(result.files.indexOf(barrel)).not.toEqual(-1);

      // Check for a child.
      expect(result.directories.length).toBe(2);
      const subDirectory = result.directories[0];

      // Child shouldn't have a barrel.
      expect(subDirectory.barrel).not.toBeDefined();
    });
    it('should log useful information to the logger', () => {
      expect(loggerSpy).toHaveBeenCalledTimes(5);
    });
  });
  describe('walkTree function that', () => {
    it('should should call the callback once for each directory in the tree', () => {
      const fakeTree: Directory = TestUtilities.mockDirectoryTree();

      // Build a collection all all directories.
      let allDirectories: Directory[] = [fakeTree];
      fakeTree.directories.forEach(directory => {
        // Child/grandchild directories.
        allDirectories = allDirectories.concat([directory]).concat(directory.directories);
      });

      const calledDirectories: Directory[] = [];
      const callback = (directory: Directory) => calledDirectories.push(directory);

      FileTree.walkTree(fakeTree, callback);

      expect(allDirectories).toEqual(calledDirectories);
    });
  });
});
