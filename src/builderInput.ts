import * as path from "path";

import {Options} from "./options";
import {convertPathSeparator, Directory, indentation, Location, nonAlphaNumeric, thisDirectory} from "./utilities";

interface AnyInput {
    // The name of the input item.
    name: string;

    // Whether the input item is a module.
    isModule: boolean;
    // Whether the input item is a directory.
    isDirectory: boolean;

    // Indentation level.
    indent: string;
}

// Builder input describing a module.
interface ModuleInput extends AnyInput {
    isModule: true;
    isDirectory: false;

    // A unique typescript-safe identifier.
    identifier: string;
    // The resolved path to the module including quotes.
    quotedPath: string;
}

// Builder input describing a directory.
interface DirectoryInput extends AnyInput {
    isModule: false;
    isDirectory: true;

    // The modules and files in the directory, sorted alphabetically.
    content: Array<ModuleInput | DirectoryInput>;
    // The modules in the directory, sorted alphabetically.
    modules: ModuleInput[];
    // The directories in the directory, sorted alphabetically.
    directories: DirectoryInput[];
}

// Input for a builder template.
export interface BuilderInput {
    // All modules as a flat array.
    modules: ModuleInput[];
    // Modules arranged in a directory structure.
    tree: DirectoryInput;
}

/**
 * Creates input structured for barrel builder templates.
 * @param directory The directory to create the barrel within.
 * @param modules The modules included within the barrel.
 * @param options Barrelsby options.
 * @returns The builder input.
 */
export function createBuilderInput(
    directory: Directory,
    modules: Location[],
    options: Options,
): BuilderInput {
    const rootDirectory = convertDirectory(".", 0);
    const builderInput: BuilderInput = {
        modules: [],
        tree: rootDirectory,
    };

    modules
        .sort(compareModules)
        .forEach((location: Location) => {
            // Split up the path to the module.
            const relativePath = path.relative(
                directory.path,
                location.path,
            );
            const parts = path.dirname(relativePath)
                .split(path.sep);

            const moduleInput = buildTree(
                directory,
                rootDirectory,
                parts,
                location,
                0,
                options,
            );

            builderInput.modules.push(moduleInput);
        });

    return builderInput;
}

/**
 * Compiles the module path into the export structure.
 * @param directory The directory the barrel is being created within.
 * @param currentDirectory The export structure being compiled.
 * @param pathParts The parts of the path to the module.
 * @param location Module being added to the tree.
 * @param depth The depth of nesting.
 * @param options Barrelsby options.
 * @returns The module for builder input.
 */
function buildTree(
    barrelLocation: Directory,
    currentDirectory: DirectoryInput,
    pathParts: string[],
    location: Location,
    depth: number,
    options: Options,
): ModuleInput {
    // Move on to the next part of the path.
    const pathPart = pathParts.shift() as string;

    // Work out where the module should live.
    let nextDirectory: DirectoryInput;
    let nextDepth: number;
    if (pathPart === ".") {
        // The module is in "this" directory.
        nextDirectory = currentDirectory;
        nextDepth = depth;
    } else {
        // There may be an existing directory.
        const foundDirectory = getDirectory(
            currentDirectory.directories,
            pathPart,
        );

        if (foundDirectory) {
            nextDirectory = foundDirectory;
        } else {
            // Otherwise create a new one.
            nextDirectory = convertDirectory(
                pathPart,
                depth,
            );

            currentDirectory.content.push(nextDirectory);
            currentDirectory.directories.push(nextDirectory);
        }

        nextDepth = depth + 1;
    }

    if (pathParts.length === 0) {
        // If we have reached the end of the path, create the module.
        const moduleInput = convertModule(
            barrelLocation,
            location,
            nextDepth,
            options,
        );

        nextDirectory.content.push(moduleInput);
        nextDirectory.modules.push(moduleInput);

        return moduleInput;
    } else {
        // If we aren't at the bottom yet, keep on building.
        return buildTree(
            barrelLocation,
            nextDirectory,
            pathParts,
            location,
            nextDepth,
            options,
        );
    }
}

/**
 * Converts a module to its input equivalent.
 * @param barrelLocation The location of the barrel.
 * @param targetModule The module being converted.
 * @param indentLevel The level of indentation for the module.
 * @param options Barrelsby options.
 * @returns The module input for the builder.
 */
function convertModule(
    barrelLocation: Directory,
    targetModule: Location,
    indentLevel: number,
    options: Options,
): ModuleInput {
    const name = getBasename(targetModule.name);

    // Resolve the path from barrel to module to use for importing.
    const relativePath = path.relative(
        barrelLocation.path,
        targetModule.path,
    );

    // Create a safe identifier the module can be referred to by.
    const identifier = relativePath.replace(nonAlphaNumeric, "");

    // Resolve the quoted path for import statements.
    const quotedPath = buildImportPath(
        barrelLocation,
        targetModule,
        options,
    );

    return {
        identifier,
        indent: indentation.repeat(indentLevel),
        isDirectory: false,
        isModule: true,
        name,
        quotedPath,
    };
}

/**
 * Convert a directory for its input equivalent.
 * @param directoryName The name of the directory.
 * @param indentLevel The level of indentation for the module.
 * @returns The directory input for the builder.
 */
function convertDirectory(
    directoryName: string,
    indentLevel: number,
): DirectoryInput {
    return {
        content: [],
        directories: [],
        indent: indentation.repeat(indentLevel),
        isDirectory: true,
        isModule: false,
        modules: [],
        name: directoryName,
    };
}

/**
 * Creates the TypeScript import path from the barrel to the file.
 * @param directory The directory the barrel is being created in.
 * @param target The module being imported.
 * @param options Barrelsby options.
 * @returns The import path.
 */
function buildImportPath(directory: Directory, target: Location, options: Options): string {
    // If the base URL option is set then imports should be relative to there.
    const startLocation = options.combinedBaseUrl ? options.combinedBaseUrl : directory.path;
    const relativePath = path.relative(startLocation, target.path);

    // Get the route and ensure it's relative
    let directoryPath = path.dirname(relativePath);
    if (directoryPath !== ".") {
        directoryPath = `.${path.sep}${directoryPath}`;
    }

    // Strip off the .ts or .tsx from the file name.
    const fileName = getBasename(relativePath);

    // Build the final path string. Use posix-style seperators.
    const location = `${directoryPath}${path.sep}${fileName}`;
    const convertedLocation = stripThisDirectory(
        convertPathSeparator(location),
        options,
    );
    return `${options.quoteCharacter}${convertedLocation}${options.quoteCharacter}`;
}

/**
 * Gets the filename from a path without the .ts or .tsx extension.
 * @param relativePath The path to the file.
 * @returns The filename.
 */
function getBasename(relativePath: string) {
     return path.basename(path.basename(relativePath, ".ts"), ".tsx");
}

/**
 * Removes leading dots from import paths.
 * @param location The import path.
 * @param options Barrelsby options.
 * @returns The import path.
 */
function stripThisDirectory(location: string, options: Options) {
    return options.combinedBaseUrl ? location.replace(thisDirectory, "") : location;
}

/**
 * Compares two modules for sorting.
 * @param a The first module.
 * @param b The second module.
 * @returns The comparison.
 */
function compareModules(a: Location, b: Location): number {
    return a.path < b.path ? -1 : 1;
}

/**
 * Gets the directory with the specified name.
 * @param directories The possible directories.
 * @param name The name of the directory to find.
 * @returns The directory, if present.
 */
function getDirectory(
    directories: DirectoryInput[],
    name: string,
): DirectoryInput | undefined {
    return directories.find((directory) => directory.name === name);
}
