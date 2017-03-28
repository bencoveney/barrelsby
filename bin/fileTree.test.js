"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var MockFs = require("mock-fs");
var FileTree = require("./fileTree");
describe("FileTree module has a", function () {
    describe("buildTree function that", function () {
        var result;
        var logged;
        beforeEach(function () {
            MockFs({
                "code.ts": "export const code = 'Hello Saturn!'",
                "directory1": {
                    "barrel.ts": "export const code = 'Hello Graham!'",
                    "directory2": {
                        "script.ts": "export const code = 'Hello Detroit!'",
                    },
                    "ignore.txt": "export const code = 'Goodbye World!'",
                    "index.ts": "export const code = 'Hello World!'",
                },
            });
            logged = [];
            var logger = function (message) { return logged.push(message); };
            result = FileTree.buildTree("./directory1", {
                indexName: "barrel.ts",
                logger: logger,
                rootPath: "some/path",
            });
        });
        afterEach(function () {
            MockFs.restore();
        });
        it("should build a tree structure matching the file system directories", function () {
            // Check the current directory.
            chai_1.assert.equal(result.path, "./directory1");
            chai_1.assert.equal(result.name, "directory1");
            // Check for a child.
            chai_1.assert.lengthOf(result.directories, 1);
            var subDirectory = result.directories[0];
            // Check the child directory.
            chai_1.assert.equal(subDirectory.path, "directory1/directory2");
            chai_1.assert.equal(subDirectory.name, "directory2");
        });
        it("should enumerate each file in a directory", function () {
            chai_1.assert.lengthOf(result.files, 3);
            var testFile = function (name) {
                var files = result.files.filter(function (file) { return file.name === name; });
                chai_1.assert.lengthOf(files, 1);
                var file = files[0];
                chai_1.assert.equal(file.path, "directory1/" + name);
                chai_1.assert.equal(file.name, name);
            };
            testFile("index.ts");
            testFile("barrel.ts");
            testFile("ignore.txt");
        });
        it("should identify existing indexes in a directory", function () {
            // Test the index.
            chai_1.assert.equal(result.index.name, "barrel.ts");
            chai_1.assert.equal(result.index.path, "directory1/barrel.ts");
            // Test it is in the files list.
            chai_1.assert.notEqual(result.files.indexOf(result.index), -1);
            // Check for a child.
            chai_1.assert.lengthOf(result.directories, 1);
            var subDirectory = result.directories[0];
            // Child shouldn't have an index.
            chai_1.assert.isUndefined(subDirectory.index);
        });
        it("should log useful information to the logger", function () {
            chai_1.assert.lengthOf(logged, 3);
            chai_1.assert.equal(logged[0], "Building directory tree for ./directory1");
            chai_1.assert.equal(logged[1], "Found existing index @ directory1/barrel.ts");
            chai_1.assert.equal(logged[2], "Building directory tree for directory1/directory2");
        });
    });
    describe("walkTree function that", function () {
        it("should should call the callback once for each directory in the tree", function () {
            var fakeTree = {
                directories: [
                    {
                        directories: [],
                        files: [],
                        name: "directory2",
                        path: "directory1/directory2",
                    },
                    {
                        directories: [],
                        files: [],
                        name: "directory3",
                        path: "directory1/directory3",
                    },
                ],
                files: [
                    {
                        name: "file1.ts",
                        path: "directory1/file1.ts",
                    },
                ],
                name: "directory1",
                path: "./directory1",
            };
            var allDirectories = [fakeTree].concat(fakeTree.directories);
            var calledDirectories = [];
            var callback = function (directory) { return calledDirectories.push(directory); };
            FileTree.walkTree(fakeTree, callback);
            chai_1.assert.deepEqual(allDirectories, calledDirectories);
        });
    });
});
