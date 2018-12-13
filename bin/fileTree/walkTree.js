"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Walk an entire directory tree recursively. */
function walkTree(directory, callback) {
    callback(directory);
    directory.directories.forEach(childDirectory => walkTree(childDirectory, callback));
}
exports.walkTree = walkTree;
//# sourceMappingURL=walkTree.js.map