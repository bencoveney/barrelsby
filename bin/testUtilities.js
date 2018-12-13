"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const tslint_1 = require("tslint");
function mockFsConfiguration() {
    return {
        "code.ts": "export const code = 'Hello Saturn!'",
        directory1: {
            "barrel.ts": "export const code = 'Hello Graham!'",
            directory2: {
                directory4: {
                    "deeplyNested.ts": "export const code = 'Heya Wurrl"
                },
                "script.ts": "export const code = 'Hello Detroit!'"
            },
            directory3: {
                "program.ts": "export const code = 'Hello Detroit!'"
            },
            "ignore.txt": "export const code = 'Goodbye World!'",
            "index.ts": "export const code = 'Hello World!'"
        }
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
                                path: "directory1/directory2/directory4/deeplyNested.ts"
                            }
                        ],
                        name: "directory4",
                        path: "directory1/directory2/directory4"
                    }
                ],
                files: [
                    {
                        name: "script.ts",
                        path: "directory1/directory2/script.ts"
                    }
                ],
                name: "directory2",
                path: "directory1/directory2"
            },
            {
                directories: [],
                files: [
                    {
                        name: "program.ts",
                        path: "directory1/directory3/program.ts"
                    }
                ],
                name: "directory3",
                path: "directory1/directory3"
            }
        ],
        files: [
            {
                name: "barrel.ts",
                path: "directory1/barrel.ts"
            },
            {
                name: "ignore.txt",
                path: "directory1/ignore.txt"
            },
            {
                name: "index.ts",
                path: "directory1/index.ts"
            }
        ],
        name: "directory1",
        path: "./directory1"
    };
}
exports.mockDirectoryTree = mockDirectoryTree;
function mockModules(rootDirectory) {
    const getModules = (directory) => directory.directories.reduce((previous, current) => {
        return previous.concat(getModules(current));
    }, directory.files);
    return getModules(rootDirectory).filter(module => module.name.indexOf(".ts") >= 0);
}
exports.mockModules = mockModules;
// Gets a mock Options object.
function mockLogger(loggerTarget) {
    return (message) => loggerTarget.push(message);
}
exports.mockLogger = mockLogger;
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
function tslint(content, quoteCharacter) {
    const linter = new tslint_1.Linter({ fix: false, formatter: "json" });
    const configuration = tslint_1.Configuration.loadConfigurationFromPath("./tslint.json");
    if (quoteCharacter === "'") {
        configuration.rules.set("quotemark", {
            ruleArguments: ["single", "avoid-escape"]
        });
    }
    linter.lint("test_output.ts", content, configuration);
    /* istanbul ignore next: Should not be hit during successful test execution. */
    const failures = linter
        .getResult()
        .failures.map(failure => `${failure.getRuleName()} ${failure.getStartPosition().getLineAndCharacter().line}`);
    chai_1.assert.deepEqual(failures, []);
}
exports.tslint = tslint;
//# sourceMappingURL=testUtilities.js.map