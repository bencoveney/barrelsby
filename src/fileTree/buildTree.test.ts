import { assert } from "chai";
import MockFs from "mock-fs";

import { Directory } from "../fileTree/directory";
import { Location } from "../fileTree/location";
import * as TestUtilities from "../testUtilities";
import * as BuildTree from "./buildTree";

describe("buildTree module has a", () => {
  describe("buildTree function that", () => {
    let result: Directory;
    let logged: string[];
    const barrelName = "barrel.ts";
    beforeEach(() => {
      MockFs(TestUtilities.mockFsConfiguration());
      logged = [];
      const logger = TestUtilities.mockLogger(logged);
      result = BuildTree.buildTree("./directory1", barrelName, logger);
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
});
