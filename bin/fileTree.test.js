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
const mock_fs_1 = __importDefault(require("mock-fs"));
const FileTree = __importStar(require("./fileTree"));
const TestUtilities = __importStar(require("./testUtilities"));
describe("fileTree module has a", () => {
    describe("buildTree function that", () => {
        let result;
        let logged;
        const barrelName = "barrel.ts";
        beforeEach(() => {
            (0, mock_fs_1.default)(TestUtilities.mockFsConfiguration());
            logged = [];
            const logger = TestUtilities.mockLogger(logged);
            result = FileTree.buildTree("./directory1", barrelName, logger);
        });
        afterEach(() => {
            mock_fs_1.default.restore();
        });
        it("should build a tree structure matching the file system directories", () => {
            // Check the current directory.
            expect(result.path).toEqual("./directory1");
            expect(result.name).toEqual("directory1");
            // Check for a child.
            expect(result.directories.length).toBe(2);
            const subDirectory = result.directories[0];
            // Check the child directory.
            expect(subDirectory.path).toEqual("directory1/directory2");
            expect(subDirectory.name).toEqual("directory2");
        });
        it("should enumerate each file in a directory", () => {
            expect(result.files.length).toBe(3);
            const testFile = (name) => {
                const files = result.files.filter((file) => file.name === name);
                expect(files.length).toBe(1);
                const firstFile = files[0];
                expect(firstFile.path).toEqual(`directory1/${name}`);
                expect(firstFile.name).toEqual(name);
            };
            testFile("index.ts");
            testFile("ignore.txt");
            testFile(barrelName);
        });
        it("should identify existing barrels in a directory", () => {
            expect(result.barrel).not.toBeNull();
            const barrel = result.barrel;
            // Test the barrel.
            expect(barrel.name).toEqual(barrelName);
            expect(barrel.path).toEqual("directory1/barrel.ts");
            // Test it is in the files list.
            expect(result.files.indexOf(barrel)).not.toEqual(-1);
            // Check for a child.
            expect(result.directories.length).toBe(2);
            const subDirectory = result.directories[0];
            // Child shouldn't have a barrel.
            expect(subDirectory.barrel).not.toBeDefined();
        });
        it("should log useful information to the logger", () => {
            expect(logged).toEqual([
                "Building directory tree for ./directory1",
                "Found existing barrel @ directory1/barrel.ts",
                "Building directory tree for directory1/directory2",
                "Building directory tree for directory1/directory2/directory4",
                "Building directory tree for directory1/directory3",
            ]);
        });
    });
    describe("walkTree function that", () => {
        it("should should call the callback once for each directory in the tree", () => {
            const fakeTree = TestUtilities.mockDirectoryTree();
            // Build a collection all all directories.
            let allDirectories = [fakeTree];
            fakeTree.directories.forEach((directory) => {
                // Child/grandchild directories.
                allDirectories = allDirectories
                    .concat([directory])
                    .concat(directory.directories);
            });
            const calledDirectories = [];
            const callback = (directory) => calledDirectories.push(directory);
            FileTree.walkTree(fakeTree, callback);
            expect(allDirectories).toEqual(calledDirectories);
        });
    });
});
//# sourceMappingURL=fileTree.test.js.map