"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const utilities_1 = require("./utilities");
/** Build directory information recursively. */
function buildTree(directory, options) {
    options.logger(`Building directory tree for ${utilities_1.convertPathSeparator(directory)}`);
    const names = fs.readdirSync(directory);
    const result = {
        directories: [],
        files: [],
        name: path.basename(directory),
        path: utilities_1.convertPathSeparator(directory),
    };
    names.forEach((name) => {
        const fullPath = path.join(directory, name);
        if (fs.statSync(fullPath).isDirectory()) {
            result.directories.push(buildTree(fullPath, options));
        }
        else {
            const convertedPath = utilities_1.convertPathSeparator(fullPath);
            const file = {
                name,
                path: convertedPath,
            };
            result.files.push(file);
            if (file.name === options.barrelName) {
                options.logger(`Found existing barrel @ ${convertedPath}`);
                result.barrel = file;
            }
        }
    });
    return result;
}
exports.buildTree = buildTree;
/** Walk an entire directory tree recursively. */
function walkTree(directory, callback) {
    callback(directory);
    for (const name of Object.keys(directory.directories)) {
        walkTree(directory.directories[name], callback);
    }
}
exports.walkTree = walkTree;
//# sourceMappingURL=fileTree.js.map