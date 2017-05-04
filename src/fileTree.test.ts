import {assert} from "chai";
import * as MockFs from "mock-fs";

import * as TestUtilities from "./test/utilities";

import * as FileTree from "./fileTree";
import {Directory, Location} from "./utilities";

describe("fileTree module has a", () => {
    describe("buildTree function that", () => {
        let result: Directory;
        let logged: string[];
        beforeEach(() => {
            MockFs(TestUtilities.mockFsConfiguration());
            logged = [];
            const logger = (message: string) => logged.push(message);
            result = FileTree.buildTree(
                "./directory1",
                {
                    indexName: "barrel.ts",
                    logger,
                    rootPath: "some/path",
                },
            );
        });
        afterEach(() => {
            MockFs.restore();
        });
        it("should build a tree structure matching the file system directories", () => {
            // Check the current directory.
            assert.equal(result.path, "./directory1");
            assert.equal(result.name, "directory1");

            // Check for a child.
            assert.lengthOf(result.directories, 2);
            const subDirectory = result.directories[0];

            // Check the child directory.
            assert.equal(subDirectory.path, "directory1/directory2");
            assert.equal(subDirectory.name, "directory2");
        });
        it("should enumerate each file in a directory", () => {
            assert.lengthOf(result.files, 3);
            const testFile = (name: string) => {
                const files = result.files.filter((file) => file.name === name);
                assert.lengthOf(files, 1);
                const file = files[0];
                assert.equal(file.path, `directory1/${name}`);
                assert.equal(file.name, name);
            };
            testFile("index.ts");
            testFile("barrel.ts");
            testFile("ignore.txt");
        });
        it("should identify existing indexes in a directory", () => {
            assert.isNotNull(result.index);

            const index = result.index as Location;

            // Test the index.
            assert.equal(index.name, "barrel.ts");
            assert.equal(index.path, "directory1/barrel.ts");

            // Test it is in the files list.
            assert.notEqual(result.files.indexOf(index), -1);

            // Check for a child.
            assert.lengthOf(result.directories, 2);
            const subDirectory = result.directories[0];

            // Child shouldn't have an index.
            assert.isUndefined(subDirectory.index);
        });
        it("should log useful information to the logger", () => {
            assert.lengthOf(logged, 5);
            assert.equal(logged[0], "Building directory tree for ./directory1");
            assert.equal(logged[1], "Found existing index @ directory1/barrel.ts");
            assert.equal(logged[2], "Building directory tree for directory1/directory2");
            assert.equal(logged[3], "Building directory tree for directory1/directory2/directory4");
            assert.equal(logged[4], "Building directory tree for directory1/directory3");
        });
    });
    describe("walkTree function that", () => {
        it("should should call the callback once for each directory in the tree", () => {
            const fakeTree: Directory = TestUtilities.mockDirectoryTree();

            // Build a collection all all directories.
            let allDirectories: Directory[] = [fakeTree];
            fakeTree.directories.forEach((directory) => {
                // Child/grandchild directories.
                allDirectories = allDirectories.concat([directory]).concat(directory.directories);
            });

            const calledDirectories: Directory[] = [];
            const callback = (directory: Directory) => calledDirectories.push(directory);

            FileTree.walkTree(fakeTree, callback);

            assert.deepEqual(allDirectories, calledDirectories);
        });
    });
});
