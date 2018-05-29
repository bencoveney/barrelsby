import {assert} from "chai";

import * as Modules from "./modules";
import {Options} from "./options";
import * as TestUtilities from "./testUtilities";
import {Directory} from "./utilities";

describe("builder/modules module has a", () => {
    describe("loadDirectoryModules function that", () => {
        let directory: Directory;
        let logged: string[];
        let options: Options;
        beforeEach(() => {
            directory = TestUtilities.mockDirectoryTree();
            logged = [];
            options = TestUtilities.mockOptions(logged);
        });
        it("should identify modules from directories recursively", () => {
            const result = Modules.loadDirectoryModules(directory.directories[0], options);
            assert.lengthOf(result, 2);
            assert.deepEqual(
                result[0],
                {
                    name: "script.ts",
                    path: "directory1/directory2/script.ts",
                },
            );
            assert.deepEqual(
                result[1],
                {
                    name: "deeplyNested.ts",
                    path: "directory1/directory2/directory4/deeplyNested.ts",
                },
            );
        });
        it("should identify directories that already contain a barrel", () => {
            // Set up a barrel.
            const targetDirectory = directory.directories[0];
            targetDirectory.barrel = targetDirectory.files[0];

            const result = Modules.loadDirectoryModules(directory.directories[0], options);
            assert.lengthOf(result, 1);
            assert.deepEqual(
                result[0],
                {
                    name: "script.ts",
                    path: "directory1/directory2/script.ts",
                },
            );
        });
        it("should only include TypeScript files", () => {
            const result = Modules.loadDirectoryModules(directory, options);
            result.forEach((location) => assert.notEqual(location.name, "ignore.txt"));
        });
        it("should log useful information to the logger", () => {
            // Set up a barrel.
            const indexedDirectory = directory.directories[0];
            indexedDirectory.barrel = indexedDirectory.files[0];

            Modules.loadDirectoryModules(directory, options);
            assert.deepEqual(
                logged,
                [
                    "Getting modules @ ./directory1",
                    "Getting modules @ directory1/directory2",
                    "Found existing barrel @ directory1/directory2/script.ts",
                    "Getting modules @ directory1/directory3",
                ],
            );
        });
    });
});
