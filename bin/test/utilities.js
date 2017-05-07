"use strict";
const chai_1 = require("chai");
const tslint_1 = require("tslint");
function mockFsConfiguration() {
    return {
        "code.ts": "export const code = 'Hello Saturn!'",
        "directory1": {
            "barrel.ts": "export const code = 'Hello Graham!'",
            "directory2": {
                "directory4": {
                    "deeplyNested.ts": "export const code = 'Heya Wurrl",
                },
                "script.ts": "export const code = 'Hello Detroit!'",
            },
            "directory3": {
                "program.ts": "export const code = 'Hello Detroit!'",
            },
            "ignore.txt": "export const code = 'Goodbye World!'",
            "index.ts": "export const code = 'Hello World!'",
        },
    };
}
exports.mockFsConfiguration = mockFsConfiguration;
function mockDirectoryTree() {
    return {
        directories: [
            {
                directories: [
                    {
                        directories: [],
                        files: [
                            {
                                name: "deeplyNested.ts",
                                path: "directory1/directory2/directory4/deeplyNested.ts",
                            },
                        ],
                        name: "directory4",
                        path: "directory1/directory2/directory4",
                    },
                ],
                files: [
                    {
                        name: "script.ts",
                        path: "directory1/directory2/script.ts",
                    },
                ],
                name: "directory2",
                path: "directory1/directory2",
            },
            {
                directories: [],
                files: [
                    {
                        name: "program.ts",
                        path: "directory1/directory3/program.ts",
                    },
                ],
                name: "directory3",
                path: "directory1/directory3",
            },
        ],
        files: [
            {
                name: "barrel.ts",
                path: "directory1/barrel.ts",
            },
            {
                name: "ignore.txt",
                path: "directory1/ignore.txt",
            },
            {
                name: "index.ts",
                path: "directory1/index.ts",
            },
        ],
        name: "directory1",
        path: "./directory1",
    };
}
exports.mockDirectoryTree = mockDirectoryTree;
// Gets a mock Options object.
function mockOptions(loggerTarget) {
    return {
        barrelName: "barrel.ts",
        logger: (message) => loggerTarget.push(message),
        rootPath: "some/path",
    };
}
exports.mockOptions = mockOptions;
// Multiline string assertion to give more useful output messages.
function assertMultiLine(actual, expected) {
    const actualParts = actual.split("\n");
    const expectParts = expected.split("\n");
    chai_1.assert.equal(actualParts.length, expectParts.length, "Different numbers of lines");
    actualParts.forEach((actualPart, index) => {
        chai_1.assert.equal(actualPart, expectParts[index]);
    });
}
exports.assertMultiLine = assertMultiLine;
// Runs tslint against the specified file and checks there are no errors.
function tslint(content) {
    const linter = new tslint_1.Linter({ fix: false, formatter: "json" });
    const configuration = tslint_1.Configuration.loadConfigurationFromPath("./tslint.json");
    linter.lint("test_output.ts", content, configuration);
    const failures = linter.getResult().failures.map((failure) => `${failure.getRuleName()} ${failure.getStartPosition().getLineAndCharacter().line}`);
    chai_1.assert.deepEqual(failures, []);
}
exports.tslint = tslint;
//# sourceMappingURL=utilities.js.map