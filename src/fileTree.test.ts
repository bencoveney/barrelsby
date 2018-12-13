import { assert } from "chai";
import MockFs from "mock-fs";

import * as FileTree from "./fileTree";
import * as TestUtilities from "./testUtilities";
import { Directory, Location } from "./utilities";

describe("fileTree module has a", () => {
  describe("buildTree function that", () => {
    let result: Directory;
    let logged: string[];
    const barrelName = "barrel.ts";
    beforeEach(() => {
      MockFs(TestUtilities.mockFsConfiguration());
      logged = [];
      const logger = TestUtilities.mockLogger(logged);
      result = FileTree.buildTree("./directory1", barrelName, logger);
    });
    afterEach(() => {
      MockFs.restore();
    });
    it("should build a tree structure matching the file system directories", () => {
      // Check the current directory.
      assert.equal(result.path, "./directory1");
      assert.equal(result.name, "directory1");

      // Check for a child.
      assert.lengthOf(result.directories, 2);
      const subDirectory = result.directories[0];

      // Check the child directory.
      assert.equal(subDirectory.path, "directory1/directory2");
      assert.equal(subDirectory.name, "directory2");
    });
    it("should enumerate each file in a directory", () => {
      assert.lengthOf(result.files, 3);
      const testFile = (name: string) => {
        const files = result.files.filter(file => file.name === name);
        assert.lengthOf(files, 1);
        const firstFile = files[0];
        assert.equal(firstFile.path, `directory1/${name}`);
        assert.equal(firstFile.name, name);
      };
      testFile("index.ts");
      testFile("ignore.txt");
      testFile(barrelName);
    });
    it("should identify existing barrels in a directory", () => {
      assert.isNotNull(result.barrel);

      const barrel = result.barrel as Location;

      // Test the barrel.
      assert.equal(barrel.name, barrelName);
      assert.equal(barrel.path, "directory1/barrel.ts");

      // Test it is in the files list.
      assert.notEqual(result.files.indexOf(barrel), -1);

      // Check for a child.
      assert.lengthOf(result.directories, 2);
      const subDirectory = result.directories[0];

      // Child shouldn't have a barrel.
      assert.isUndefined(subDirectory.barrel);
    });
    it("should log useful information to the logger", () => {
      assert.sameMembers(logged, [
        "Building directory tree for ./directory1",
        "Found existing barrel @ directory1/barrel.ts",
        "Building directory tree for directory1/directory2",
        "Building directory tree for directory1/directory2/directory4",
        "Building directory tree for directory1/directory3"
      ]);
    });
  });
  describe("walkTree function that", () => {
    it("should should call the callback once for each directory in the tree", () => {
      const fakeTree: Directory = TestUtilities.mockDirectoryTree();

      // Build a collection all all directories.
      let allDirectories: Directory[] = [fakeTree];
      fakeTree.directories.forEach(directory => {
        // Child/grandchild directories.
        allDirectories = allDirectories
          .concat([directory])
          .concat(directory.directories);
      });

      const calledDirectories: Directory[] = [];
      const callback = (directory: Directory) =>
        calledDirectories.push(directory);

      FileTree.walkTree(fakeTree, callback);

      assert.deepEqual(allDirectories, calledDirectories);
    });
  });
});
