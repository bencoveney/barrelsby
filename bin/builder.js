"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const fileSystem_1 = require("./builders/fileSystem");
const flat_1 = require("./builders/flat");
const modules_1 = require("./modules");
const utilities_1 = require("./utilities");
/**
 * Builds barrels in the specified destinations.
 * @param destinations The locations to build barrels in.
 * @param options Barrelsby options.
 */
function buildBarrels(destinations, options) {
    // Determine which builder to use.
    let builder;
    switch (options.structure) {
        default:
        case "flat":
            builder = flat_1.buildFlatBarrel;
            break;
        case "filesystem":
            builder = fileSystem_1.buildFileSystemBarrel;
            break;
    }
    // Build the barrels.
    destinations.forEach((destination) => buildBarrel(destination, builder, options));
}
exports.buildBarrels = buildBarrels;
/**
 * Builds a barrel in the specified directory.
 * @param directory The directory to build a barrel for.
 * @param builder The builder to use to create barrel content.
 * @param options Barrelsby options.
 */
function buildBarrel(directory, builder, options) {
    options.logger(`Building barrel @ ${directory.path}`);
    // Get barrel content.
    const content = builder(directory, modules_1.loadDirectoryModules(directory, options), options);
    // Write the barrel to disk.
    const destination = path.join(directory.path, options.barrelName);
    fs.writeFileSync(destination, content);
    // We might need to update the file tree model with the new barrel.
    if (!directory.files.some((file) => file.name === options.barrelName)) {
        // Build the location model.
        const convertedPath = utilities_1.convertPathSeparator(destination);
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
/**
 * Creates the TypeScript import path from the barrel to the file.
 * @param directory The directory the barrel is being created in.
 * @param target The module being imported.
 * @param options Barrelsby options.
 * @returns The import path.
 */
function buildImportPath(directory, target, options) {
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
    const convertedLocation = utilities_1.convertPathSeparator(location);
    return stripThisDirectory(convertedLocation, options);
}
exports.buildImportPath = buildImportPath;
/**
 * Gets the filename from a path without the .ts or .tsx extension.
 * @param relativePath The path to the file.
 * @returns The filename.
 */
function getBasename(relativePath) {
    return path.basename(path.basename(relativePath, ".ts"), ".tsx");
}
exports.getBasename = getBasename;
/**
 * Removes leading dots from import paths.
 * @param location The import path.
 * @param options Barrelsby options.
 * @returns The import path.
 */
function stripThisDirectory(location, options) {
    return options.combinedBaseUrl ? location.replace(utilities_1.thisDirectory, "") : location;
}
//# sourceMappingURL=builder.js.map