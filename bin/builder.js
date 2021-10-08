"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBaseNameWithoutExtension = exports.buildImportPath = exports.buildBarrels = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const fileSystem_1 = require("./builders/fileSystem");
const flat_1 = require("./builders/flat");
const header_1 = require("./builders/header");
const modules_1 = require("./modules");
const utilities_1 = require("./utilities");
function buildBarrels(destinations, quoteCharacter, semicolonCharacter, barrelName, logger, baseUrl, exportDefault, structure, local, include, exclude, extension) {
    let builder;
    switch (structure) {
        default:
        case "flat":
            builder = flat_1.buildFlatBarrel;
            break;
        case "filesystem":
            builder = fileSystem_1.buildFileSystemBarrel;
            break;
    }
    // Build the barrels.
    destinations.forEach((destination) => buildBarrel(destination, builder, quoteCharacter, semicolonCharacter, barrelName, logger, baseUrl, exportDefault, local, include, exclude, extension));
}
exports.buildBarrels = buildBarrels;
// Build a barrel for the specified directory.
function buildBarrel(directory, builder, quoteCharacter, semicolonCharacter, barrelName, logger, baseUrl, exportDefault, local, include, exclude, extension) {
    logger(`Building barrel @ ${directory.path}`);
    const content = builder(directory, (0, modules_1.loadDirectoryModules)(directory, logger, include, exclude, local), quoteCharacter, semicolonCharacter, logger, baseUrl, exportDefault, extension);
    const destination = path_1.default.join(directory.path, barrelName);
    if (content.length === 0) {
        // Skip empty barrels.
        return;
    }
    // Add the header
    const contentWithHeader = (0, header_1.addHeaderPrefix)(content);
    fs_1.default.writeFileSync(destination, contentWithHeader);
    // Update the file tree model with the new barrel.
    if (!directory.files.some((file) => file.name === barrelName)) {
        const convertedPath = (0, utilities_1.convertPathSeparator)(destination);
        const barrel = {
            name: barrelName,
            path: convertedPath,
        };
        logger(`Updating model barrel @ ${convertedPath}`);
        directory.files.push(barrel);
        directory.barrel = barrel;
    }
}
/** Builds the TypeScript */
function buildImportPath(directory, target, baseUrl, extension) {
    var _a;
    // If the base URL option is set then imports should be relative to there.
    const startLocation = baseUrl ? baseUrl : directory.path;
    const relativePath = path_1.default.relative(startLocation, target.path);
    // Get the route and ensure it's relative
    let directoryPath = path_1.default.dirname(relativePath);
    if (directoryPath !== ".") {
        directoryPath = `.${path_1.default.sep}${directoryPath}`;
    }
    let fileName;
    if (extension) {
        // Replace extension with compiled version if possible, or leave extension.
        fileName =
            (_a = getBaseNameWithCompiledExtension(relativePath)) !== null && _a !== void 0 ? _a : path_1.default.basename(relativePath);
    }
    else {
        // Strip off the .ts or .tsx from the file name.
        fileName = getBaseNameWithoutExtension(relativePath);
    }
    // Build the final path string. Use posix-style seperators.
    const location = `${directoryPath}${path_1.default.sep}${fileName}`;
    const convertedLocation = (0, utilities_1.convertPathSeparator)(location);
    return stripThisDirectory(convertedLocation, baseUrl);
}
exports.buildImportPath = buildImportPath;
function stripThisDirectory(location, baseUrl) {
    return baseUrl ? location.replace(utilities_1.thisDirectory, "") : location;
}
/** Strips the .ts or .tsx file extension from a path and returns the base filename. */
function getBaseNameWithoutExtension(relativePath) {
    const mayBeSuffix = [".ts", ".tsx", ".d.ts"];
    let mayBePath = relativePath;
    mayBeSuffix.forEach((suffix) => {
        const tmpPath = path_1.default.basename(relativePath, suffix);
        if (tmpPath.length < mayBePath.length) {
            mayBePath = tmpPath;
        }
    });
    // Return whichever path is shorter. If they're the same length then nothing was stripped.
    return mayBePath;
}
exports.getBaseNameWithoutExtension = getBaseNameWithoutExtension;
/** Keep extension or replace with with js compatible suffix if possible. */
function getBaseNameWithCompiledExtension(suffixedPath) {
    let fileName;
    Object.keys(utilities_1.compiledExtensions).forEach((suffix) => {
        if (path_1.default.basename(suffixedPath, suffix) < path_1.default.basename(suffixedPath)) {
            // Remove and append the associated compiled file extension
            fileName =
                path_1.default.basename(suffixedPath, suffix) + utilities_1.compiledExtensions[suffix];
        }
    });
    return fileName;
}
//# sourceMappingURL=builder.js.map