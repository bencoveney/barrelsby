import {assert} from "chai";
// import {Configuration, Linter} from "tslint";

import {Options} from "../options";
import {Directory, Location} from "../utilities";

export function mockFsConfiguration() {
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

export function mockDirectoryTree(): Directory {
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

// Gets a mock Options object.
export function mockOptions(loggerTarget: string[]): Options {
    return {
        indexName: "barrel.ts",
        logger: (message: string) => loggerTarget.push(message),
        rootPath: "some/path",
    };
}

// Gets a location from a list by name.
export function getLocationByName(locations: Location[], name: string): Location {
    return locations.filter((location) => location.name === name)[0];
}

// Multiline string assertion to give more useful output messages.
export function assertMultiLine(actual: string, expected: string): void {
    const actualParts = actual.split("\n");
    const expectParts = expected.split("\n");
    assert.equal(actualParts.length, expectParts.length, "Different numbers of lines");
    actualParts.forEach((actualPart, index) => {
        assert.equal(actualPart, expectParts[index]);
    });
}

// Runs tslint against the specified file and checks there are no errors.
export function tslintFile(fileContents: string) {
    // const linter = new Linter({fix: false, formatter: "json"});
    // const configuration = Configuration.loadConfigurationFromPath("./tslint.json");
    // linter.lint("test_output.ts", fileContents, configuration);
    // const failures = linter.getResult().failures.map((failure) =>
    //     `${failure.getRuleName()} ${failure.getStartPosition().getLineAndCharacter().line}`,
    // );
    // assert.deepEqual(failures, []);
}
