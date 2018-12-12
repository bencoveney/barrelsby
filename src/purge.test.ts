import { assert } from "chai";
import fs from "fs";
import MockFs from "mock-fs";

import { Logger } from "./options/logger";
import { Options } from "./options/options";
import * as Purge from "./purge";
import * as TestUtilities from "./testUtilities";
import { Directory } from "./utilities";

describe("purge module has a", () => {
  describe("purge function that", () => {
    let directory: Directory;
    let options: Options;
    let logged: string[];
    let logger: Logger;
    const barrelName = "barrel.ts";
    beforeEach(() => {
      MockFs(TestUtilities.mockFsConfiguration());
      directory = TestUtilities.mockDirectoryTree();
      logged = [];
      options = TestUtilities.mockOptions();
      logger = TestUtilities.mockLogger(logged);
    });
    afterEach(() => {
      MockFs.restore();
    });
    it("should delete existing barrels if the delete flag is enabled", () => {
      options.delete = true;
      Purge.purge(directory, options, barrelName, logger);

      // Check directory has been manipulated.
      assert.lengthOf(directory.files, 2);
      assert.lengthOf(
        directory.files.filter(file => file.name === "barrel.ts"),
        0
      );

      // Check FS has been manipulated.
      assert.isNotOk(fs.existsSync("directory1/barrel.ts"));
    });
    it("should do nothing if the delete flag is disabled", () => {
      options.delete = false;
      Purge.purge(directory, options, barrelName, logger);

      // Check directory has not been manipulated.
      assert.lengthOf(directory.files, 3);
      assert.lengthOf(
        directory.files.filter(file => file.name === "barrel.ts"),
        1
      );

      // Check FS has not been manipulated.
      assert.isOk(fs.existsSync("directory1/barrel.ts"));
    });
    it("should log useful information to the logger", () => {
      options.delete = true;
      Purge.purge(directory, options, barrelName, logger);

      assert.sameMembers(logged, [
        "Deleting existing barrel @ directory1/barrel.ts"
      ]);
    });
  });
});
