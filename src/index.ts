#! /usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import * as Yargs from "yargs";

const argv = Yargs
    .usage("Usage: barrelsby [options]")
    .example("barrelsby", "Run barrelsby")

    .config("c")
    .alias("c", "config")
    .describe("c", "The location of the config file.")

    .string("d")
    .alias("d", "directory")
    .nargs("d", 1)
    .describe("d", "The directory to create barrels for.")
    .default("d", "./")

    .boolean("D")
    .alias("D", "delete")
    .describe("D", "Delete existing index files.")
    .default("D", false)

    .array("e")
    .alias("e", "exclude")
    .describe("e", "Excludes any files whose paths match any of the regular expressions.")

    .help("h")
    .alias("h", "help")
    .default("h", false)

    .array("i")
    .alias("i", "include")
    .describe("i", "Only include files whose paths match any of the regular expressions.")

    .string("l")
    .alias("l", "location")
    .describe("l", "The mode for picking barrel file locations")
    .choices("l", ["top", "below", "all", "replace", "branch"])
    .default("l", "top")

    .string("n")
    .alias("n", "name")
    .describe("n", "The name to give barrel files")
    .default("n", "index")

    .string("s")
    .alias("s", "structure")
    .describe("s", "The mode for structuring barrel file exports")
    .choices("s", ["flat", "filesystem"])
    .default("s", "flat")

    .version()
    .alias("v", "version")
    .default("v", false)

    .boolean("V")
    .alias("V", "verbose")
    .describe("V", "Display additional logging information")
    .default("D", false)

    .argv;

// tslint:disable-next-line:no-empty
const logger: (message: string) => void = argv.verbose ? console.log : (message: string) => {};

const rootPath: string = path.resolve(argv.directory);
const isTypeScriptFile = /\.ts$/m;
const nonAlphaNumeric = /\W+/g;
const indentation = "  ";

// Resolve index name.
const nameArgument: string = argv.name;
const indexName = nameArgument.match(isTypeScriptFile) ? nameArgument : `${nameArgument}.ts`;
logger(`Using name ${indexName}`);

/** A location in the file tree. */
interface Location {
    /** The full path of the location including the name. */
    path: string;
    /** The local name of the location. */
    name: string;
}

/** A directory in the file tree. */
interface Directory extends Location {
    /** The directories within the directory. */
    directories: Directory[];
    /** The files within the directory. */
    files: Location[];
    /** The index within the directory if one exists. */
    index?: Location;
}

/** Build directory information recursively. */
function buildTree(directory: string): Directory {
    logger(`Building directory tree for ${directory}`);
    const names = fs.readdirSync(directory);
    const result: Directory = {
        directories: [],
        files: [],
        name: path.basename(directory),
        path: directory,
    };
    names.forEach((name: string) => {
        const fullPath = path.join(directory, name);
        if (fs.statSync(fullPath).isDirectory()) {
            result.directories.push(buildTree(fullPath));
        } else {
            const file = {
                name,
                path: fullPath,
            };
            result.files.push(file);
            if (file.name === indexName) {
                logger(`Found existing index @ ${fullPath}`);
                result.index = file;
            }
        }
    });
    return result;
}

/** Walk an entire directory tree recursively. */
function walkTree(directory: Directory, callback: (directory: Directory) => void) {
    callback(directory);
    for (const name of Object.keys(directory.directories)) {
        walkTree(directory.directories[name], callback);
    }
}

// Build the directory tree.
const rootTree = buildTree(rootPath);

// Work out which directories should have index files.
let destinations: Directory[];
switch (argv.location) {
    case "top":
    default:
        destinations = [rootTree];
        break;
    case "below":
        destinations = rootTree.directories;
        break;
    case "all":
        destinations = [];
        walkTree(rootTree, (directory: Directory) => {
            destinations.push(directory);
        });
        break;
    case "replace":
        destinations = [];
        walkTree(rootTree, (directory: Directory) => {
            if (directory.files.some((location: Location) => location.name === indexName)) {
                destinations.push(directory);
            }
        });
        break;
    case "branch":
        destinations = [];
        walkTree(rootTree, (directory: Directory) => {
            if (directory.directories.length > 0) {
                destinations.push(directory);
            }
        });
        break;
}

// Sort by length. This means barrels will be created deepest first.
destinations = destinations.sort((a: Directory, b: Directory) => {
    return b.path.length - a.path.length;
});

logger("Destinations:");
destinations.forEach((destination) => logger(destination.path));

// Delete any existing indexes.
if (argv.delete) {
    walkTree(rootTree, (directory: Directory) => {
        directory.files
            .filter((file: Location) => {
                return file.name === indexName;
            })
            .forEach((file: Location) => {
                logger(`Deleting existing index @ ${file.path}`);
                // Delete barrel file and clean up tree model.
                fs.unlinkSync(file.path);
                directory.files.splice(directory.files.indexOf(file), 1);
                directory.index = undefined;
            });
    });
}

// Get any typescript modules contained at any depth in the current directory.
function getModules(directory: Directory): Location[] {
    logger(`Getting modules @ ${directory.path}`);
    if (directory.index) {
        // If theres an index then use that as it *should* contain descendant modules.
        logger(`Found existing index @ ${directory.index.path}`);
        return [directory.index];
    }
    let files: Location[] = [].concat(directory.files);
    directory.directories.forEach((childDirectory: Directory) => {
        // Recurse.
        files.push(...getModules(childDirectory));
    });
    // Only return files that look like TypeScript modules.
    return files.filter((file: Location) => file.name.match(isTypeScriptFile));
}

// Filter a set of modules down to those matching the include/exclude rules.
function buildRegexList(patterns: string[]): RegExp[] | null {
    if (!Array.isArray(patterns)) {
        return null;
    }
    return patterns.map((pattern: string) => new RegExp(pattern));
}
const whitelistTests = buildRegexList(argv.include);
const blacklistTests = buildRegexList(argv.exclude);
function filterModules(locations: Location[]): Location[] {
    let result = locations;
    if (whitelistTests !== null) {
        result = result.filter((location: Location) => {
            return whitelistTests.some((test: RegExp) => {
                const isMatch = !!location.path.match(test);
                if (isMatch) {
                    logger(`${location.path} is included by ${test}`);
                }
                return isMatch;
            });
        });
    }
    if (blacklistTests !== null) {
        result = result.filter((location: Location) => {
            return !blacklistTests.some((test: RegExp) => {
                const isMatch = !!location.path.match(test);
                if (isMatch) {
                    logger(`${location.path} is excluded by ${test}`);
                }
                return isMatch;
            });
        });
    }
    return result;
}

function buildImportPath(directory: Directory, target: Location): string {
    // Get the route from the current directory to the module.
    const relativePath = path.relative(directory.path, target.path);
    // Get the route and ensure it's relative
    let directoryPath = path.dirname(relativePath);
    if (directoryPath !== ".") {
        directoryPath = `.${path.sep}${directoryPath}`;
    }
    // Strip off the .ts from the file name.
    const fileName = path.basename(relativePath, ".ts");
    // Build the final path string. Use posix-style seperators.
    let location = `${directoryPath}${path.sep}${fileName}`;
    return location.replace(/\\+/g, "/");
}

function buildFlatBarrel(directory: Directory, modules: Location[]): string {
    return modules.reduce(
        (previous: string, current: Location) => {
            const importPath = buildImportPath(directory, current);
            logger(`Including path ${importPath}`);
            return previous += `export * from "${importPath}";
`;
        },
        "",
    );
}

type ExportStructure = {
    [directoryName: string]: ExportStructure | string;
};

function buildStructureSubsection(structure: ExportStructure, pathParts: string[], name: string, reference: string) {
    const pathPart = pathParts.shift();
    let subsection: ExportStructure = pathPart === "." ? structure : structure[pathPart] as ExportStructure;
    if (!subsection) {
        subsection = {};
        structure[pathPart] = subsection;
    }
    if (pathParts.length === 0) {
        subsection[name] = reference;
    } else {
        buildStructureSubsection(subsection, pathParts, name, reference);
    }
}

function stringify(structure: ExportStructure, previousIndentation: string): string {
    let nextIndentation = previousIndentation + indentation;
    let content = "";
    for (const key of Object.keys(structure).sort()) {
        content += `
${nextIndentation}"${key}": `;
        const exported = structure[key];
        if (typeof exported === "string") {
            content += exported;
        } else {
            content += stringify(exported, nextIndentation);
        }
        content += ",";
    }
    return `{${content}
${previousIndentation}}`;
}

function buildFileSystemBarrel(directory: Directory, modules: Location[]): string {
    const structure: ExportStructure = {};
    let content = "";
    modules.forEach((module: Location) => {
        const relativePath = path.relative(directory.path, module.path);
        const directoryPath = path.dirname(relativePath);
        const parts = directoryPath.split(path.sep);
        const alias = relativePath.replace(nonAlphaNumeric, "");
        const importPath = buildImportPath(directory, module);
        content += `import * as ${alias} from "${importPath}";
`;
        const fileName = path.basename(module.name, ".ts");
        buildStructureSubsection(structure, parts, fileName, alias);
    });
    for (const key of Object.keys(structure).sort()) {
        const exported = structure[key];
        if (typeof exported === "string") {
            content += `export {${exported} as ${key}};
`;
        } else {
            content += `export const ${key} = ${stringify(exported, "")};
`;
        }
    }
    return content;
}

let barrelBuilder: (directory: Directory, modules: Location[]) => string;
switch (argv.structure) {
    default:
    case "flat":
        barrelBuilder = buildFlatBarrel;
        break;
    case "filesystem":
        barrelBuilder = buildFileSystemBarrel;
        break;
}

// Build a barrel for the specified directory.
function buildBarrel(directory: Directory) {
    logger(`Building barrel @ ${directory.path}`);
    const barrelContent = barrelBuilder(directory, filterModules(getModules(directory)));
    const indexPath = path.resolve(directory.path, indexName);
    fs.writeFileSync(indexPath, barrelContent);
    // Update the file tree model with the new index.
    if (!directory.files.some((file: Location) => file.name === indexName)) {
        const index = {
            name: indexName,
            path: indexPath,
        };
        logger(`Updating model index @ ${indexPath}`);
        directory.files.push(index);
        directory.index = index;
    }
}

// Build the barrels.
destinations.forEach(buildBarrel);
