"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fileTree_1 = require("./fileTree");
/** Assess which directories in the tree should contain barrels. */
function getDestinations(rootTree, options) {
    let destinations;
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
            fileTree_1.walkTree(rootTree, (directory) => {
                destinations.push(directory);
            });
            break;
        case "replace":
            destinations = [];
            fileTree_1.walkTree(rootTree, (directory) => {
                if (directory.files.some((location) => location.name === options.barrelName)) {
                    destinations.push(directory);
                }
            });
            break;
        case "branch":
            destinations = [];
            fileTree_1.walkTree(rootTree, (directory) => {
                if (directory.directories.length > 0) {
                    destinations.push(directory);
                }
            });
            break;
    }
    // Sort by length. This means barrels will be created deepest first.
    destinations = destinations.sort((a, b) => {
        return b.path.length - a.path.length;
    });
    options.logger("Destinations:");
    destinations.forEach((destination) => options.logger(destination.path));
    return destinations;
}
exports.getDestinations = getDestinations;
//# sourceMappingURL=destinations.js.map