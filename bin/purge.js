"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const fileTree_1 = require("./fileTree");
function purge(rootTree, options) {
    // Delete any existing barrels.
    if (options.delete) {
        fileTree_1.walkTree(rootTree, (directory) => {
            directory.files
                .filter((file) => {
                return file.name === options.barrelName;
            })
                .forEach((file) => {
                options.logger(`Deleting existing barrel @ ${file.path}`);
                // Delete barrel file and clean up tree model.
                fs.unlinkSync(file.path);
                directory.files.splice(directory.files.indexOf(file), 1);
                directory.barrel = undefined;
            });
        });
    }
}
exports.purge = purge;
//# sourceMappingURL=purge.js.map