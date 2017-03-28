import {assert} from "chai";
import * as Mocha from "mocha";
import * as MockFs from "mock-fs";

import * as FileTree from "./fileTree";
import {Directory} from "./utilities";

describe("FileTree module has a", () => {
    describe("buildTree function that", () => {
        let result: Directory;
        let logged: string[];
        beforeEach(() => {
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
            assert.lengthOf(result.directories, 1);
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
            // Test the index.
            assert.equal(result.index.name, "barrel.ts");
            assert.equal(result.index.path, "directory1/barrel.ts");

            // Test it is in the files list.
            assert.notEqual(result.files.indexOf(result.index), -1);

            // Check for a child.
            assert.lengthOf(result.directories, 1);
            const subDirectory = result.directories[0];

            // Child shouldn't have an index.
            assert.isUndefined(subDirectory.index);
        });
        it("should log useful information to the logger", () => {
            assert.lengthOf(logged, 3);
            assert.equal(logged[0], "Building directory tree for ./directory1");
            assert.equal(logged[1], "Found existing index @ directory1/barrel.ts");
            assert.equal(logged[2], "Building directory tree for directory1/directory2");
        });
    });
    describe("walkTree function that", () => {
        it("should should call the callback once for each directory in the tree", () => {
            const fakeTree: Directory = {
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
            const allDirectories: Directory[] = [fakeTree].concat(fakeTree.directories);

            const calledDirectories: Directory[] = [];
            const callback = (directory: Directory) => calledDirectories.push(directory);

            FileTree.walkTree(fakeTree, callback);

            assert.deepEqual(allDirectories, calledDirectories);
        });
    });
});
