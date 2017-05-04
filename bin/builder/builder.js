"use strict";
const fs = require("fs");
const path = require("path");
const utilities_1 = require("../utilities");
const fileSystem_1 = require("./fileSystem");
const flat_1 = require("./flat");
const modules_1 = require("./modules");
function buildBarrels(destinations, options) {
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
// Build a barrel for the specified directory.
function buildBarrel(directory, builder, options) {
    options.logger(`Building barrel @ ${directory.path}`);
    const content = builder(directory, modules_1.loadDirectoryModules(directory, options), options);
    const destination = path.join(directory.path, options.barrelName);
    fs.writeFileSync(destination, content);
    // Update the file tree model with the new barrel.
    if (!directory.files.some((file) => file.name === options.barrelName)) {
        const convertedPath = utilities_1.convertPathSeparator(destination);
        const barrel = {
            name: options.barrelName,
            path: convertedPath,
        };
        options.logger(`Updating model barrel @ ${convertedPath}`);
        directory.files.push(barrel);
        directory.barrel = barrel;
    }
}
//# sourceMappingURL=builder.js.map