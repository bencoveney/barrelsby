"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Modules = require("./modules");
const TestUtilities = require("./testUtilities");
describe("builder/modules module has a", () => {
    describe("loadDirectoryModules function that", () => {
        let directory;
        let logged;
        let options;
        beforeEach(() => {
            directory = TestUtilities.mockDirectoryTree();
            logged = [];
            options = TestUtilities.mockOptions(logged);
        });
        it("should identify modules from directories recursively", () => {
            const result = Modules.loadDirectoryModules(directory.directories[0], options);
            chai_1.assert.lengthOf(result, 2);
            chai_1.assert.deepEqual(result[0], {
                name: "script.ts",
                path: "directory1/directory2/script.ts",
            });
            chai_1.assert.deepEqual(result[1], {
                name: "deeplyNested.ts",
                path: "directory1/directory2/directory4/deeplyNested.ts",
            });
        });
        it("should identify directories that already contain a barrel", () => {
            // Set up a barrel.
            const targetDirectory = directory.directories[0];
            targetDirectory.barrel = targetDirectory.files[0];
            const result = Modules.loadDirectoryModules(directory.directories[0], options);
            chai_1.assert.lengthOf(result, 1);
            chai_1.assert.deepEqual(result[0], {
                name: "script.ts",
                path: "directory1/directory2/script.ts",
            });
        });
        it("should only include TypeScript files", () => {
            const result = Modules.loadDirectoryModules(directory, options);
            result.forEach((location) => chai_1.assert.notEqual(location.name, "ignore.txt"));
        });
        it("should only include files matching a whitelist option when specified", () => {
            options.include = ["directory2"];
            const result = Modules.loadDirectoryModules(directory, options);
            chai_1.assert.lengthOf(result, 2);
            chai_1.assert.deepEqual(result[0], {
                name: "script.ts",
                path: "directory1/directory2/script.ts",
            });
            chai_1.assert.deepEqual(result[1], {
                name: "deeplyNested.ts",
                path: "directory1/directory2/directory4/deeplyNested.ts",
            });
        });
        it("should exclude files matching a blacklist option when specified", () => {
            options.exclude = ["directory2"];
            const result = Modules.loadDirectoryModules(directory, options);
            chai_1.assert.lengthOf(result, 3);
            chai_1.assert.deepEqual(result[0], {
                name: "barrel.ts",
                path: "directory1/barrel.ts",
            });
            chai_1.assert.deepEqual(result[1], {
                name: "index.ts",
                path: "directory1/index.ts",
            });
            chai_1.assert.deepEqual(result[2], {
                name: "program.ts",
                path: "directory1/directory3/program.ts",
            });
        });
        it("should correctly handle both whitelist and blacklist options being set", () => {
            options.include = ["directory2"];
            options.exclude = ["directory4"];
            const result = Modules.loadDirectoryModules(directory, options);
            chai_1.assert.lengthOf(result, 1);
            chai_1.assert.deepEqual(result[0], {
                name: "script.ts",
                path: "directory1/directory2/script.ts",
            });
        });
        it("should log useful information to the logger", () => {
            // Set up a barrel.
            const indexedDirectory = directory.directories[0];
            indexedDirectory.barrel = indexedDirectory.files[0];
            Modules.loadDirectoryModules(directory, options);
            chai_1.assert.deepEqual(logged, [
                "Getting modules @ ./directory1",
                "Getting modules @ directory1/directory2",
                "Found existing barrel @ directory1/directory2/script.ts",
                "Getting modules @ directory1/directory3",
            ]);
        });
    });
});
//# sourceMappingURL=modules.test.js.map