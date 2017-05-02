"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
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
        indexName: "barrel.ts",
        logger: function (message) { return loggerTarget.push(message); },
        rootPath: "some/path",
    };
}
exports.mockOptions = mockOptions;
// Gets a location from a list by name.
function getLocationByName(locations, name) {
    return locations.filter(function (location) { return location.name === name; })[0];
}
exports.getLocationByName = getLocationByName;
// Multiline string assertion to give more useful output messages.
function assertMultiLine(actual, expected) {
    var actualParts = actual.split("\n");
    var expectParts = expected.split("\n");
    chai_1.assert.equal(actualParts.length, expectParts.length, "Different numbers of lines");
    actualParts.forEach(function (actualPart, index) {
        chai_1.assert.equal(actualPart, expectParts[index]);
    });
}
exports.assertMultiLine = assertMultiLine;
// Runs tslint against the specified file and checks there are no errors.
function tslintFile(fileContents) {
    // const linter = new Linter({fix: false, formatter: "json"});
    // const configuration = Configuration.loadConfigurationFromPath("./tslint.json");
    // linter.lint("test_output.ts", fileContents, configuration);
    // const failures = linter.getResult().failures.map((failure) =>
    //     `${failure.getRuleName()} ${failure.getStartPosition().getLineAndCharacter().line}`,
    // );
    // assert.deepEqual(failures, []);
}
exports.tslintFile = tslintFile;
//# sourceMappingURL=utilities.js.map