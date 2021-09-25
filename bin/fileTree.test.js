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
const chai_1 = require("chai");
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
            chai_1.assert.equal(result.path, "./directory1");
            chai_1.assert.equal(result.name, "directory1");
            // Check for a child.
            chai_1.assert.lengthOf(result.directories, 2);
            const subDirectory = result.directories[0];
            // Check the child directory.
            chai_1.assert.equal(subDirectory.path, "directory1/directory2");
            chai_1.assert.equal(subDirectory.name, "directory2");
        });
        it("should enumerate each file in a directory", () => {
            chai_1.assert.lengthOf(result.files, 3);
            const testFile = (name) => {
                const files = result.files.filter((file) => file.name === name);
                chai_1.assert.lengthOf(files, 1);
                const firstFile = files[0];
                chai_1.assert.equal(firstFile.path, `directory1/${name}`);
                chai_1.assert.equal(firstFile.name, name);
            };
            testFile("index.ts");
            testFile("ignore.txt");
            testFile(barrelName);
        });
        it("should identify existing barrels in a directory", () => {
            chai_1.assert.isNotNull(result.barrel);
            const barrel = result.barrel;
            // Test the barrel.
            chai_1.assert.equal(barrel.name, barrelName);
            chai_1.assert.equal(barrel.path, "directory1/barrel.ts");
            // Test it is in the files list.
            chai_1.assert.notEqual(result.files.indexOf(barrel), -1);
            // Check for a child.
            chai_1.assert.lengthOf(result.directories, 2);
            const subDirectory = result.directories[0];
            // Child shouldn't have a barrel.
            chai_1.assert.isUndefined(subDirectory.barrel);
        });
        it("should log useful information to the logger", () => {
            chai_1.assert.sameMembers(logged, [
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
            chai_1.assert.deepEqual(allDirectories, calledDirectories);
        });
    });
});
//# sourceMappingURL=fileTree.test.js.map