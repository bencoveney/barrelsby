"use strict";
var chai_1 = require("chai");
var fs = require("fs");
var MockFs = require("mock-fs");
var Sinon = require("sinon");
var TestUtilities = require("../test/utilities");
var Builder = require("./builder");
var FileSystem = require("./fileSystem");
var Flat = require("./flat");
var Modules = require("./modules");
describe("builder/builder module has a", function () {
    describe("buildBarrels function that", function () {
        var directory;
        var spySandbox;
        var logger;
        var runBuilder = function (structure) {
            logger = spySandbox.spy();
            Builder.buildBarrels(directory.directories, {
                indexName: "barrel.ts",
                logger: logger,
                rootPath: ".",
                structure: structure,
            });
        };
        beforeEach(function () {
            MockFs(TestUtilities.mockFsConfiguration());
            directory = TestUtilities.mockDirectoryTree();
            spySandbox = Sinon.sandbox.create();
            spySandbox.stub(FileSystem, "buildFileSystemBarrel").returns("fileSystemContent");
            spySandbox.stub(Flat, "buildFlatBarrel").returns("flatContent");
            spySandbox.stub(Modules, "loadDirectoryModules").returns("loadedModules");
        });
        afterEach(function () {
            MockFs.restore();
            spySandbox.restore();
        });
        describe("uses the structure option and", function () {
            var testStructure = function (structure, isFlat) {
                runBuilder(structure);
                // TODO: Test arguments for barrel builder & loadDirectoryModules
                if (isFlat) {
                    Sinon.assert.calledTwice(Flat.buildFlatBarrel);
                    Sinon.assert.notCalled(FileSystem.buildFileSystemBarrel);
                }
                else {
                    Sinon.assert.notCalled(Flat.buildFlatBarrel);
                    Sinon.assert.calledTwice(FileSystem.buildFileSystemBarrel);
                }
            };
            it("should use the flat builder if in flat mode", function () {
                testStructure("flat", true);
            });
            it("should use the filesystem builder if in filesystem mode", function () {
                testStructure("filesystem", false);
            });
            it("should use the flat builder if no mode is specified", function () {
                testStructure(null, true);
            });
        });
        it("should write each barrel's content to disk", function () {
            runBuilder("flat");
            var checkContent = function (address) {
                var result = fs.readFileSync(address, "utf8");
                chai_1.assert.equal(result, "flatContent");
            };
            checkContent("directory1/directory2/barrel.ts");
            checkContent("directory1/directory3/barrel.ts");
        });
        it("should update the directory structure with the new barrel", function () {
            runBuilder("flat");
            directory.directories.forEach(function (subDirectory) {
                chai_1.assert.equal(subDirectory.index.name, "barrel.ts");
            });
        });
        it("should log useful information to the logger", function () {
            runBuilder("flat");
            var messages = [
                "Building barrel @ directory1/directory2",
                "Updating model index @ directory1/directory2/barrel.ts",
                "Building barrel @ directory1/directory3",
                "Updating model index @ directory1/directory3/barrel.ts",
            ];
            chai_1.assert.equal(logger.callCount, messages.length);
            messages.forEach(function (message, index) {
                chai_1.assert.equal(logger.getCall(index).args[0], message);
            });
        });
    });
});
//# sourceMappingURL=builder.test.js.map