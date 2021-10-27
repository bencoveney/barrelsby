"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const mock_fs_1 = __importDefault(require("mock-fs"));
const sinon_1 = __importDefault(require("sinon"));
const Builder = __importStar(require("./builder"));
const FileSystem = __importStar(require("./builders/fileSystem"));
const Flat = __importStar(require("./builders/flat"));
const Header = __importStar(require("./builders/header"));
const Modules = __importStar(require("./modules"));
const TestUtilities = __importStar(require("./testUtilities"));
const signale_1 = require("signale");
// Gets a location from a list by name.
function getLocationByName(locations, name) {
    return locations.filter((location) => location.name === name)[0];
}
describe("builder/builder module has a", () => {
    describe("buildBarrels function that", () => {
        let directory;
        let spySandbox;
        let loggerSpy;
        const logger = new signale_1.Signale();
        const runBuilder = (structure) => {
            loggerSpy = spySandbox.spy(logger, "debug");
            Builder.buildBarrels(directory.directories, '"', ";", "barrel.ts", logger, undefined, false, structure, false, [], []);
        };
        beforeEach(() => {
            (0, mock_fs_1.default)(TestUtilities.mockFsConfiguration());
            directory = TestUtilities.mockDirectoryTree();
            spySandbox = sinon_1.default.createSandbox();
            spySandbox
                .stub(FileSystem, "buildFileSystemBarrel")
                .returns("fileSystemContent");
            spySandbox.stub(Flat, "buildFlatBarrel").returns("flatContent");
            spySandbox.stub(Modules, "loadDirectoryModules").returns([]);
            spySandbox
                .stub(Header, "addHeaderPrefix")
                .callsFake((content) => `header: ${content}`);
        });
        afterEach(() => {
            mock_fs_1.default.restore();
            spySandbox.restore();
        });
        describe("uses the structure option and", () => {
            const testStructure = (structure, isFlat) => {
                runBuilder(structure);
                // TODO: Test arguments for barrel builder & loadDirectoryModules
                if (isFlat) {
                    sinon_1.default.assert.calledTwice(Flat.buildFlatBarrel);
                    sinon_1.default.assert.notCalled(FileSystem.buildFileSystemBarrel);
                }
                else {
                    sinon_1.default.assert.notCalled(Flat.buildFlatBarrel);
                    sinon_1.default.assert.calledTwice(FileSystem.buildFileSystemBarrel);
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
        it("should write each barrel's header and content to disk", () => {
            runBuilder("flat");
            const checkContent = (address) => {
                const result = fs_1.default.readFileSync(address, "utf8");
                expect(result).toEqual("header: flatContent");
            };
            checkContent("directory1/directory2/barrel.ts");
            checkContent("directory1/directory3/barrel.ts");
        });
        it("should update the directory structure with the new barrel", () => {
            runBuilder("flat");
            directory.directories.forEach((subDirectory) => {
                expect(subDirectory.barrel.name).toEqual("barrel.ts");
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
            expect(loggerSpy.callCount).toEqual(messages.length);
            messages.forEach((message, barrel) => {
                expect(loggerSpy.getCall(barrel).args[0]).toEqual(message);
            });
        });
    });
    describe("buildBarrels function with empty barrel content that", () => {
        let directory;
        let spySandbox;
        const logger = new signale_1.Signale();
        const runBuilder = () => {
            Builder.buildBarrels(directory.directories, '"', ";", "barrel.ts", logger, undefined, false, "flat", false, [], []);
        };
        beforeEach(() => {
            (0, mock_fs_1.default)(TestUtilities.mockFsConfiguration());
            directory = TestUtilities.mockDirectoryTree();
            spySandbox = sinon_1.default.createSandbox();
            spySandbox.stub(Flat, "buildFlatBarrel").returns("");
            spySandbox.stub(Modules, "loadDirectoryModules").returns([]);
        });
        afterEach(() => {
            mock_fs_1.default.restore();
            spySandbox.restore();
        });
        it("does not create an empty barrel", () => {
            runBuilder();
            const checkDoesNotExist = (address) => {
                expect(fs_1.default.existsSync(address)).toBe(false);
            };
            checkDoesNotExist("directory1/directory2/barrel.ts");
            checkDoesNotExist("directory1/directory3/barrel.ts");
        });
    });
    describe("buildImportPath function that", () => {
        let directory;
        beforeEach(() => {
            directory = TestUtilities.mockDirectoryTree();
        });
        it("should correctly build a path to a file in the same directory", () => {
            const target = getLocationByName(directory.files, "index.ts");
            const result = Builder.buildImportPath(directory, target, undefined);
            expect(result).toEqual("./index");
        });
        it("should correctly build a path to a file in a child directory", () => {
            const childDirectory = getLocationByName(directory.directories, "directory2");
            const target = getLocationByName(childDirectory.files, "script.ts");
            const result = Builder.buildImportPath(directory, target, undefined);
            expect(result).toEqual("./directory2/script");
        });
    });
    describe("getBasename function that", () => {
        it("should correctly strip .ts from the filename", () => {
            const fileName = "./random/path/file.ts";
            const result = Builder.getBasename(fileName);
            expect(result).toEqual("file");
        });
        it("should correctly strip .d.ts from the filename", () => {
            const fileName = "./random/path/file.d.ts";
            const result = Builder.getBasename(fileName);
            expect(result).toEqual("file");
        });
        it("should correctly strip .tsx from the filename", () => {
            const fileName = "./random/path/file.tsx";
            const result = Builder.getBasename(fileName);
            expect(result).toEqual("file");
        });
        it("should not strip extensions from non-typescript filenames", () => {
            const fileName = "./random/path/file.cs";
            const result = Builder.getBasename(fileName);
            expect(result).toEqual("file.cs");
        });
    });
});
//# sourceMappingURL=builder.test.js.map