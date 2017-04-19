"use strict";
const path = require("path");
const utilities_1 = require("../utilities");
function buildImportPath(directory, target) {
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
    const location = `${directoryPath}${path.sep}${fileName}`;
    return utilities_1.convertPathSeparator(location);
}
exports.buildImportPath = buildImportPath;
//# sourceMappingURL=utilities.js.map