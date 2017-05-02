"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var utilities_1 = require("../utilities");
var fileSystem_1 = require("./fileSystem");
var flat_1 = require("./flat");
var modules_1 = require("./modules");
function buildBarrels(destinations, options) {
    var builder;
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
    destinations.forEach(function (destination) { return buildBarrel(destination, builder, options); });
}
exports.buildBarrels = buildBarrels;
// Build a barrel for the specified directory.
function buildBarrel(directory, builder, options) {
    options.logger("Building barrel @ " + directory.path);
    var barrelContent = builder(directory, modules_1.loadDirectoryModules(directory, options), options);
    var indexPath = path.join(directory.path, options.indexName);
    fs.writeFileSync(indexPath, barrelContent);
    // Update the file tree model with the new index.
    if (!directory.files.some(function (file) { return file.name === options.indexName; })) {
        var convertedPath = utilities_1.convertPathSeparator(indexPath);
        var index = {
            name: options.indexName,
            path: convertedPath,
        };
        options.logger("Updating model index @ " + convertedPath);
        directory.files.push(index);
        directory.index = index;
    }
}
//# sourceMappingURL=builder.js.map