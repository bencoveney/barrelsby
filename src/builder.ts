import * as fs from "fs";
import * as path from "path";

import {buildFileSystemBarrel} from "./builders/fileSystem";
import {buildFlatBarrel} from "./builders/flat";
import {loadDirectoryModules} from "./modules";
import {Options} from "./options";
import {convertPathSeparator, Directory, Location, thisDirectory} from "./utilities";

/**
 * Builds barrels in the specified destinations.
 * @param destinations The locations to build barrels in.
 * @param options Barrelsby options.
 */
export function buildBarrels(destinations: Directory[], options: Options): void {
    // Determine which builder to use.
    let builder: BarrelBuilder;
    switch (options.structure) {
        default:
        case "flat":
            builder = buildFlatBarrel;
            break;
        case "filesystem":
            builder = buildFileSystemBarrel;
            break;
    }
    // Build the barrels.
    destinations.forEach((destination: Directory) => buildBarrel(destination, builder, options));
}

/**
 * Builds a barrel in the specified directory.
 * @param directory The directory to build a barrel for.
 * @param builder The builder to use to create barrel content.
 * @param options Barrelsby options.
 */
function buildBarrel(directory: Directory, builder: BarrelBuilder, options: Options) {
    options.logger(`Building barrel @ ${directory.path}`);

    // Get barrel content.
    const content = builder(directory, loadDirectoryModules(directory, options), options);

    // Write the barrel to disk.
    const destination = path.join(directory.path, options.barrelName);
    fs.writeFileSync(destination, content);

    // We might need to update the file tree model with the new barrel.
    if (!directory.files.some((file: Location) => file.name === options.barrelName)) {
        // Build the location model.
        const convertedPath = convertPathSeparator(destination);
        const barrel = {
            name: options.barrelName,
            path: convertedPath,
        };
        // Insert it into the tree.
        options.logger(`Updating model barrel @ ${convertedPath}`);
        directory.files.push(barrel);
        directory.barrel = barrel;
    }
}

/** Defines a barrel content creation function. */
export type BarrelBuilder = (directory: Directory, modules: Location[], options: Options) => string;

/**
 * Creates the TypeScript import path from the barrel to the file.
 * @param directory The directory the barrel is being created in.
 * @param target The module being imported.
 * @param options Barrelsby options.
 * @returns The import path.
 */
export function buildImportPath(directory: Directory, target: Location, options: Options): string {
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
    const convertedLocation = convertPathSeparator(location);
    return stripThisDirectory(convertedLocation, options);
}

/**
 * Gets the filename from a path without the .ts or .tsx extension.
 * @param relativePath The path to the file.
 * @returns The filename.
 */
export function getBasename(relativePath: string) {
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
