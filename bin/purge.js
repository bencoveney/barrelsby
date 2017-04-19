"use strict";
const fs = require("fs");
const fileTree_1 = require("./fileTree");
function purge(rootTree, options) {
    // Delete any existing indexes.
    if (options.delete) {
        fileTree_1.walkTree(rootTree, (directory) => {
            directory.files
                .filter((file) => {
                return file.name === options.indexName;
            })
                .forEach((file) => {
                options.logger(`Deleting existing index @ ${file.path}`);
                // Delete barrel file and clean up tree model.
                fs.unlinkSync(file.path);
                directory.files.splice(directory.files.indexOf(file), 1);
                directory.index = undefined;
            });
        });
    }
}
exports.purge = purge;
//# sourceMappingURL=purge.js.map