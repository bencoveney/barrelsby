"use strict";
var chai_1 = require("chai");
var MockFs = require("mock-fs");
var TestUtilities = require("./test/utilities");
var FileTree = require("./fileTree");
describe("fileTree module has a", function () {
    describe("buildTree function that", function () {
        var result;
        var logged;
        beforeEach(function () {
            MockFs(TestUtilities.mockFsConfiguration());
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
            chai_1.assert.lengthOf(result.directories, 2);
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
            chai_1.assert.lengthOf(result.directories, 2);
            var subDirectory = result.directories[0];
            // Child shouldn't have an index.
            chai_1.assert.isUndefined(subDirectory.index);
        });
        it("should log useful information to the logger", function () {
            chai_1.assert.lengthOf(logged, 5);
            chai_1.assert.equal(logged[0], "Building directory tree for ./directory1");
            chai_1.assert.equal(logged[1], "Found existing index @ directory1/barrel.ts");
            chai_1.assert.equal(logged[2], "Building directory tree for directory1/directory2");
            chai_1.assert.equal(logged[3], "Building directory tree for directory1/directory2/directory4");
            chai_1.assert.equal(logged[4], "Building directory tree for directory1/directory3");
        });
    });
    describe("walkTree function that", function () {
        it("should should call the callback once for each directory in the tree", function () {
            var fakeTree = TestUtilities.mockDirectoryTree();
            // Build a collection all all directories.
            var allDirectories = [fakeTree];
            fakeTree.directories.forEach(function (directory) {
                // Child/grandchild directories.
                allDirectories = allDirectories.concat([directory]).concat(directory.directories);
            });
            var calledDirectories = [];
            var callback = function (directory) { return calledDirectories.push(directory); };
            FileTree.walkTree(fakeTree, callback);
            chai_1.assert.deepEqual(allDirectories, calledDirectories);
        });
    });
});
//# sourceMappingURL=fileTree.test.js.map