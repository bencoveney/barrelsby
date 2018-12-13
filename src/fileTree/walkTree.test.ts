import { assert } from "chai";

import { Directory } from "../fileTree/directory";
import * as TestUtilities from "../testUtilities";
import * as WalkTree from "./walkTree";

describe("walkTree module has a", () => {
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

      WalkTree.walkTree(fakeTree, callback);

      assert.deepEqual(allDirectories, calledDirectories);
    });
  });
});
