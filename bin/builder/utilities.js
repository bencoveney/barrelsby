"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
function buildImportPath(directory, target) {
    // Get the route from the current directory to the module.
    var relativePath = path.relative(directory.path, target.path);
    // Get the route and ensure it's relative
    var directoryPath = path.dirname(relativePath);
    if (directoryPath !== ".") {
        directoryPath = "." + path.sep + directoryPath;
    }
    // Strip off the .ts from the file name.
    var fileName = path.basename(relativePath, ".ts");
    // Build the final path string. Use posix-style seperators.
    var location = "" + directoryPath + path.sep + fileName;
    return location.replace(/\\+/g, "/");
}
exports.buildImportPath = buildImportPath;
