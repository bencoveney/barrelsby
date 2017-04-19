"use strict";
var chai_1 = require("chai");
var TestUtilities = require("../test/utilities");
var Modules = require("./modules");
describe("builder/modules module has a", function () {
    describe("loadDirectoryModules function that", function () {
        var directory;
        var logged;
        var options;
        beforeEach(function () {
            directory = TestUtilities.mockDirectoryTree();
            logged = [];
            options = TestUtilities.mockOptions(logged);
        });
        it("should identify modules from directories recursively", function () {
            var result = Modules.loadDirectoryModules(directory.directories[0], options);
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
        it("should identify directories that already contain a barrel", function () {
            // Set up a barrel.
            var targetDirectory = directory.directories[0];
            targetDirectory.index = targetDirectory.files[0];
            var result = Modules.loadDirectoryModules(directory.directories[0], options);
            chai_1.assert.lengthOf(result, 1);
            chai_1.assert.deepEqual(result[0], {
                name: "script.ts",
                path: "directory1/directory2/script.ts",
            });
        });
        it("should only include TypeScript files", function () {
            var result = Modules.loadDirectoryModules(directory, options);
            result.forEach(function (location) { return chai_1.assert.notEqual(location.name, "ignore.txt"); });
        });
        it("should only include files matching a whitelist option when specified", function () {
            options.include = ["directory2"];
            var result = Modules.loadDirectoryModules(directory, options);
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
        it("should exclude files matching a blacklist option when specified", function () {
            options.exclude = ["directory2"];
            var result = Modules.loadDirectoryModules(directory, options);
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
        it("should correctly handle both whitelist and blacklist options being set", function () {
            options.include = ["directory2"];
            options.exclude = ["directory4"];
            var result = Modules.loadDirectoryModules(directory, options);
            chai_1.assert.lengthOf(result, 1);
            chai_1.assert.deepEqual(result[0], {
                name: "script.ts",
                path: "directory1/directory2/script.ts",
            });
        });
        it("should log useful information to the logger", function () {
            // Set up a barrel.
            var indexedDirectory = directory.directories[0];
            indexedDirectory.index = indexedDirectory.files[0];
            Modules.loadDirectoryModules(directory, options);
            chai_1.assert.deepEqual(logged, [
                "Getting modules @ ./directory1",
                "Getting modules @ directory1/directory2",
                "Found existing index @ directory1/directory2/script.ts",
                "Getting modules @ directory1/directory3",
            ]);
        });
    });
});
//# sourceMappingURL=modules.test.js.map