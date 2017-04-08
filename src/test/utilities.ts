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

export function mockOptions(loggerTarget: string[]): Options {
    return {
        indexName: "barrel.ts",
        logger: (message: string) => loggerTarget.push(message),
        rootPath: "some/path",
    };
}

export function getLocationByName(locations: Location[], name: string): Location {
    return locations.filter((location) => location.name === name)[0];
}
