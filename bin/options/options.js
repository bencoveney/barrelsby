"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptionsConfig = void 0;
function getOptionsConfig(configParser) {
    return {
        b: {
            type: "string",
            alias: "baseUrl",
            nargs: 1,
            description: "The base url relative to 'directory' for non-relative imports (with tsconfig's baseUrl).",
        },
        c: {
            config: true,
            configParser,
            alias: "config",
            description: "The location of the config file.",
        },
        d: {
            type: "array",
            alias: "directory",
            description: "A list of directories to create barrels for.",
            default: ["./"],
        },
        D: {
            type: "boolean",
            alias: "delete",
            description: "Delete existing barrel files.",
            default: false,
        },
        e: {
            type: "array",
            alias: "exclude",
            description: "Excludes any files whose paths match any of the regular expressions.",
        },
        E: {
            type: "array",
            alias: "exportDefault",
            description: "Also export the default export of the file. Currently works only with the `flat` mode.",
        },
        i: {
            type: "array",
            alias: "include",
            description: "Only include files whose paths match any of the regular expressions.",
        },
        l: {
            type: "string",
            alias: "location",
            description: "The mode for picking barrel file locations",
            choices: ["top", "below", "all", "replace", "branch"],
            default: "top",
        },
        L: {
            type: "boolean",
            alias: "local",
            description: "Barrels only include files from same directory.",
            default: false,
        },
        n: {
            type: "string",
            alias: "name",
            description: "The name to give barrel files",
            default: "index",
        },
        s: {
            type: "string",
            alias: "structure",
            description: "The mode for structuring barrel file exports",
            choices: ["flat", "filesystem"],
            default: "flat",
        },
        q: {
            type: "boolean",
            alias: "singleQuotes",
            description: "Use single quotes for paths instead of the default double quotes",
            default: false,
        },
        S: {
            type: "boolean",
            alias: "noSemicolon",
            description: "Omit semicolons from the end of lines in the generated barrel files.",
            default: false,
        },
        V: {
            type: "boolean",
            alias: "verbose",
            description: "Display additional logging information",
            default: false,
        },
    };
}
exports.getOptionsConfig = getOptionsConfig;
//# sourceMappingURL=options.js.map