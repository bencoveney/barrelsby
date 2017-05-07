import {assert} from "chai";
import * as fs from "fs";
import * as MockFs from "mock-fs";

import * as TestUtilities from "./testUtilities";

import {Options} from "./options";
import * as Purge from "./purge";
import {Directory} from "./utilities";

describe("purge module has a", () => {
    describe("purge function that", () => {
        let directory: Directory;
        let options: Options;
        let logged: string[];
        beforeEach(() => {
            MockFs(TestUtilities.mockFsConfiguration());
            directory = TestUtilities.mockDirectoryTree();
            logged = [];
            options = TestUtilities.mockOptions(logged);
        });
        afterEach(() => {
            MockFs.restore();
        });
        it("should delete existing barrels if the delete flag is enabled", () => {
            options.delete = true;
            Purge.purge(directory, options);

            // Check directory has been manipulated.
            assert.lengthOf(directory.files, 2);
            assert.lengthOf(directory.files.filter((file) => file.name === "barrel.ts"), 0);

            // Check FS has been manipulated.
            assert.isNotOk(fs.existsSync("directory1/barrel.ts"));
        });
        it("should do nothing if the delete flag is disabled", () => {
            options.delete = false;
            Purge.purge(directory, options);

            // Check directory has not been manipulated.
            assert.lengthOf(directory.files, 3);
            assert.lengthOf(directory.files.filter((file) => file.name === "barrel.ts"), 1);

            // Check FS has not been manipulated.
            assert.isOk(fs.existsSync("directory1/barrel.ts"));
        });
        it("should log useful information to the logger", () => {
            options.delete = true;
            Purge.purge(directory, options);

            assert.sameMembers(logged, ["Deleting existing barrel @ directory1/barrel.ts"]);
        });
    });
});
