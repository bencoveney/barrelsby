import * as fs from "fs";
import * as path from "path";

import {Options} from "./options";
import {convertPathSeparator, Directory, Location} from "./utilities";

import {buildFileSystemBarrel} from "./builders/fileSystem";
import {buildFlatBarrel} from "./builders/flat";
import {loadDirectoryModules} from "./modules";

/**
 * Builds the barrels for the specified directories.
 * @param destinations The directories that will contain the barrels.
 * @param options The options for building barrels.
 */
export function buildBarrels(destinations: Directory[], options: Options): void {
    // Determine which builder will be used.
    let builder: BarrelBuilder;
    const resolvedStructure = options.structure || "flat";
    switch (resolvedStructure) {
        case "flat":
            builder = buildFlatBarrel;
            break;
        case "filesystem":
            builder = buildFileSystemBarrel;
            break;
        default:
            builder = loadCustomBuilder(resolvedStructure, options);
            break;
    }
    // Build the barrels.
    destinations.forEach((destination: Directory) => buildBarrel(destination, builder, options));
}

// Build a barrel for the specified directory.
function buildBarrel(directory: Directory, builder: BarrelBuilder, options: Options) {
    options.logger(`Building barrel @ ${directory.path}`);
    // Determine the referenced modules and build the barrel content.
    const content = builder(directory, loadDirectoryModules(directory, options), options);
    // Write the barrel to disk.
    const destination = path.join(directory.path, options.barrelName);
    fs.writeFileSync(destination, content);
    // Update the file tree model with the new barrel.
    if (!directory.files.some((file: Location) => file.name === options.barrelName)) {
        const convertedPath = convertPathSeparator(destination);
        const barrel = {
            name: options.barrelName,
            path: convertedPath,
        };
        options.logger(`Updating model barrel @ ${convertedPath}`);
        directory.files.push(barrel);
        directory.barrel = barrel;
    }
}

// The interface a barrel builder function must satisfy.
export type BarrelBuilder = (directory: Directory, modules: Location[], options: Options) => string;

/** Builds the import path from the current directory (or baseUrl) to the target location. */
export function buildImportPath(directory: Directory, target: Location, options: Options): string {
    const usingBaseUrl = !!options.combinedBaseUrl;
    // If the base URL option is set then imports should be relative to there.
    const startLocation = usingBaseUrl ? options.combinedBaseUrl as string : directory.path;
    const relativePath = path.relative(startLocation, target.path);
    // Get the route.
    let directoryPath = path.dirname(relativePath);
    // If it's relative we might need to perpend "this" directory.
    if (!usingBaseUrl && directoryPath !== ".") {
        directoryPath = `.${path.sep}${directoryPath}`;
    }
    // Strip off the .ts or .tsx from the file name.
    const fileName = getBasename(relativePath);
    // Build the final path string. Use posix-style seperators.
    const location = `${directoryPath}${path.sep}${fileName}`;
    return convertPathSeparator(location);
}

/** Strips the .ts or .tsx file extension from a path and returns the base filename. */
export function getBasename(relativePath: string) {
     const strippedTsPath = path.basename(relativePath, ".ts");
     const strippedTsxPath = path.basename(relativePath, ".tsx");

     // Return whichever path is shorter. If they're the same length then nothing was stripped.
     return strippedTsPath.length < strippedTsxPath.length ? strippedTsPath : strippedTsxPath;
}

function loadCustomBuilder(location: string, options: Options): BarrelBuilder {
    let builder: BarrelBuilder;
    options.logger(`Loading custom builder from ${location}`);
    builder = require(fs.realpathSync(location)) as BarrelBuilder;
    const logger = (message: string) => options.logger(`Loading Builder: ${message}`);
    if (typeof(builder) !== "function") {
        throw new Error("Custom builder is not a function");
    }
    switch (builder.length) {
        case 0:

        case 1:

        case 2:

        default:
    }
    logger(builder.length.toString());
    return builder;
}
