"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fileTree_1 = require("./fileTree");
/** Assess which directories in the tree should contain barrels. */
function getDestinations(rootTree, options) {
    var destinations;
    switch (options.location) {
        case "top":
        default:
            destinations = [rootTree];
            break;
        case "below":
            destinations = rootTree.directories;
            break;
        case "all":
            destinations = [];
            fileTree_1.walkTree(rootTree, function (directory) {
                destinations.push(directory);
            });
            break;
        case "replace":
            destinations = [];
            fileTree_1.walkTree(rootTree, function (directory) {
                if (directory.files.some(function (location) { return location.name === options.indexName; })) {
                    destinations.push(directory);
                }
            });
            break;
        case "branch":
            destinations = [];
            fileTree_1.walkTree(rootTree, function (directory) {
                if (directory.directories.length > 0) {
                    destinations.push(directory);
                }
            });
            break;
    }
    // Sort by length. This means barrels will be created deepest first.
    destinations = destinations.sort(function (a, b) {
        return b.path.length - a.path.length;
    });
    options.logger("Destinations:");
    destinations.forEach(function (destination) { return options.logger(destination.path); });
    return destinations;
}
exports.getDestinations = getDestinations;
