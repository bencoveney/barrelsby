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
    const barrelContent = builder(directory, modules_1.loadDirectoryModules(directory, options), options);
    const indexPath = path.join(directory.path, options.indexName);
    fs.writeFileSync(indexPath, barrelContent);
    // Update the file tree model with the new index.
    if (!directory.files.some((file) => file.name === options.indexName)) {
        const convertedPath = utilities_1.convertPathSeparator(indexPath);
        const index = {
            name: options.indexName,
            path: convertedPath,
        };
        options.logger(`Updating model index @ ${convertedPath}`);
        directory.files.push(index);
        directory.index = index;
    }
}
//# sourceMappingURL=builder.js.map