"use strict";
const chai_1 = require("chai");
const fs = require("fs");
const MockFs = require("mock-fs");
const Sinon = require("sinon");
const TestUtilities = require("../test/utilities");
const Builder = require("./builder");
const FileSystem = require("./fileSystem");
const Flat = require("./flat");
const Modules = require("./modules");
describe("builder/builder module has a", () => {
    describe("buildBarrels function that", () => {
        let directory;
        let spySandbox;
        let logger;
        const runBuilder = (structure) => {
            logger = spySandbox.spy();
            Builder.buildBarrels(directory.directories, {
                indexName: "barrel.ts",
                logger,
                rootPath: ".",
                structure,
            });
        };
        beforeEach(() => {
            MockFs(TestUtilities.mockFsConfiguration());
            directory = TestUtilities.mockDirectoryTree();
            spySandbox = Sinon.sandbox.create();
            spySandbox.stub(FileSystem, "buildFileSystemBarrel").returns("fileSystemContent");
            spySandbox.stub(Flat, "buildFlatBarrel").returns("flatContent");
            spySandbox.stub(Modules, "loadDirectoryModules").returns("loadedModules");
        });
        afterEach(() => {
            MockFs.restore();
            spySandbox.restore();
        });
        describe("uses the structure option and", () => {
            const testStructure = (structure, isFlat) => {
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
            it("should use the flat builder if in flat mode", () => {
                testStructure("flat", true);
            });
            it("should use the filesystem builder if in filesystem mode", () => {
                testStructure("filesystem", false);
            });
            it("should use the flat builder if no mode is specified", () => {
                testStructure(undefined, true);
            });
        });
        it("should write each barrel's content to disk", () => {
            runBuilder("flat");
            const checkContent = (address) => {
                const result = fs.readFileSync(address, "utf8");
                chai_1.assert.equal(result, "flatContent");
            };
            checkContent("directory1/directory2/barrel.ts");
            checkContent("directory1/directory3/barrel.ts");
        });
        it("should update the directory structure with the new barrel", () => {
            runBuilder("flat");
            directory.directories.forEach((subDirectory) => {
                chai_1.assert.equal(subDirectory.index.name, "barrel.ts");
            });
        });
        it("should log useful information to the logger", () => {
            runBuilder("flat");
            const messages = [
                "Building barrel @ directory1/directory2",
                "Updating model index @ directory1/directory2/barrel.ts",
                "Building barrel @ directory1/directory3",
                "Updating model index @ directory1/directory3/barrel.ts",
            ];
            chai_1.assert.equal(logger.callCount, messages.length);
            messages.forEach((message, index) => {
                chai_1.assert.equal(logger.getCall(index).args[0], message);
            });
        });
    });
});
//# sourceMappingURL=builder.test.js.map