import {assert} from "chai";
import {Configuration, Linter} from "tslint";

import {Options} from "./options";
import {Directory, Location} from "./utilities";

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

export function mockModules(rootDirectory: Directory): Location[] {
    const getModules = (directory: Directory): Location[] => directory.directories.reduce(
        (previous: Location[], current: Directory) => {
            return previous.concat(getModules(current));
        },
        directory.files,
    );
    return getModules(rootDirectory).filter((module) => module.name.indexOf(".ts") >= 0);
}

// Gets a mock Options object.
export function mockOptions(loggerTarget: string[]): Options {
    return {
        barrelName: "barrel.ts",
        logger: (message: string) => loggerTarget.push(message),
        quoteCharacter: "\"",
        rootPath: "some/path",
    };
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
export function tslint(content: string, options: Options) {
    const linter = new Linter({fix: false, formatter: "json"});
    const configuration = Configuration.loadConfigurationFromPath("./tslint.json");
    if (options.quoteCharacter === "'") {
        configuration.rules.set("quotemark", { ruleArguments: ["single", "avoid-escape"]});
    }
    console.info(configuration.rules.get("quotemark")); //tslint:disable-line
    linter.lint("test_output.ts", content, configuration);
    const failures = linter.getResult().failures.map((failure) =>
        `${failure.getRuleName()} ${failure.getStartPosition().getLineAndCharacter().line}`,
    );
    assert.deepEqual(failures, []);
}
