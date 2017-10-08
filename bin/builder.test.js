"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const fs = require("fs");
const MockFs = require("mock-fs");
const Sinon = require("sinon");
const Builder = require("./builder");
const FileSystem = require("./builders/fileSystem");
const Flat = require("./builders/flat");
const Modules = require("./modules");
const TestUtilities = require("./testUtilities");
// Gets a location from a list by name.
function getLocationByName(locations, name) {
    return locations.filter((location) => location.name === name)[0];
}
describe("builder/builder module has a", () => {
    describe("buildBarrels function that", () => {
        let directory;
        let spySandbox;
        let logger;
        const runBuilder = (structure) => {
            logger = spySandbox.spy();
            Builder.buildBarrels(directory.directories, {
                barrelName: "barrel.ts",
                logger,
                quoteCharacter: "\"",
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
                chai_1.assert.equal(subDirectory.barrel.name, "barrel.ts");
            });
        });
        it("should log useful information to the logger", () => {
            runBuilder("flat");
            const messages = [
                "Building barrel @ directory1/directory2",
                "Updating model barrel @ directory1/directory2/barrel.ts",
                "Building barrel @ directory1/directory3",
                "Updating model barrel @ directory1/directory3/barrel.ts",
            ];
            chai_1.assert.equal(logger.callCount, messages.length);
            messages.forEach((message, barrel) => {
                chai_1.assert.equal(logger.getCall(barrel).args[0], message);
            });
        });
    });
    describe("buildImportPath function that", () => {
        let directory;
        beforeEach(() => {
            directory = TestUtilities.mockDirectoryTree();
        });
        it("should correctly build a path to a file in the same directory", () => {
            const target = getLocationByName(directory.files, "index.ts");
            const result = Builder.buildImportPath(directory, target);
            chai_1.assert.equal(result, "./index");
        });
        it("should correctly build a path to a file in a child directory", () => {
            const childDirectory = getLocationByName(directory.directories, "directory2");
            const target = getLocationByName(childDirectory.files, "script.ts");
            const result = Builder.buildImportPath(directory, target);
            chai_1.assert.equal(result, "./directory2/script");
        });
    });
    describe("getBasename function that", () => {
        it("should correctly strip .ts from the filename", () => {
            const fileName = "./random/path/file.ts";
            const result = Builder.getBasename(fileName);
            chai_1.assert.equal(result, "file");
        });
        it("should correctly strip .tsx from the filename", () => {
            const fileName = "./random/path/file.tsx";
            const result = Builder.getBasename(fileName);
            chai_1.assert.equal(result, "file");
        });
        it("should not strip extensions from non-typescript filenames", () => {
            const fileName = "./random/path/file.cs";
            const result = Builder.getBasename(fileName);
            chai_1.assert.equal(result, "file.cs");
        });
    });
});
//# sourceMappingURL=builder.test.js.map