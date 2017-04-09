import {assert} from "chai";
import * as fs from "fs";
import * as Mocha from "mocha";
import * as MockFs from "mock-fs";
import * as Sinon from "sinon";

import {StructureOption} from "../options";
import * as TestUtilities from "../test/utilities";
import {Directory} from "../utilities";
import * as Builder from "./builder";
import * as FileSystem from "./fileSystem";
import * as Flat from "./flat";
import * as Modules from "./modules";

describe("builder/builder module has a", () => {
    describe("buildBarrels function that", () => {
        let directory: Directory;
        let spySandbox: sinon.SinonSandbox;
        let logger: Sinon.SinonSpy;
        const runBuilder = (structure: StructureOption) => {
            logger = spySandbox.spy();
            Builder.buildBarrels(
                directory.directories,
                {
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
            const testStructure = (structure: StructureOption, isFlat: boolean) => {
                runBuilder(structure);
                if (isFlat) {
                    Sinon.assert.calledTwice(Flat.buildFlatBarrel as Sinon.SinonSpy);
                    Sinon.assert.notCalled(FileSystem.buildFileSystemBarrel as Sinon.SinonSpy);
                } else {
                    Sinon.assert.notCalled(Flat.buildFlatBarrel as Sinon.SinonSpy);
                    Sinon.assert.calledTwice(FileSystem.buildFileSystemBarrel as Sinon.SinonSpy);
                }
            };
            it("should use the flat builder if in flat mode", () => {
                testStructure("flat", true);
            });
            it("should use the filesystem builder if in filesystem mode", () => {
                testStructure("filesystem", false);
            });
            it("should use the flat builder if no mode is specified", () => {
                testStructure(null, true);
            });
        });
        it("should write each barrel's content to disk", () => {
            runBuilder("flat");
            const checkContent = (address: string) => {
                const result = fs.readFileSync(address, "utf8");
                assert.equal(result, "flatContent");
            };
            checkContent("directory1/directory2/barrel.ts");
            checkContent("directory1/directory3/barrel.ts");
        });
        it("should update the directory structure with the new barrel", () => {
            runBuilder("flat");
            directory.directories.forEach((subDirectory: Directory) => {
                assert.equal(subDirectory.index.name, "barrel.ts");
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
            assert.equal(logger.callCount, messages.length);
            messages.forEach((message: string, index: number) => {
                assert.equal(logger.getCall(index).args[0], message);
            });
        });
    });
});
