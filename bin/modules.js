"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("./utilities");
// Get any typescript modules contained at any depth in the current directory.
function getModules(directory, options) {
    options.logger(`Getting modules @ ${directory.path}`);
    if (directory.barrel) {
        // If theres a barrel then use that as it *should* contain descendant modules.
        options.logger(`Found existing barrel @ ${directory.barrel.path}`);
        return [directory.barrel];
    }
    const files = [].concat(directory.files);
    directory.directories.forEach((childDirectory) => {
        // Recurse.
        files.push(...getModules(childDirectory, options));
    });
    // Only return files that look like TypeScript modules.
    return files.filter((file) => file.name.match(utilities_1.isTypeScriptFile));
}
function loadDirectoryModules(directory, options) {
    const modules = getModules(directory, options);
    return modules.filter(options.locationTest);
}
exports.loadDirectoryModules = loadDirectoryModules;
//# sourceMappingURL=modules.js.map