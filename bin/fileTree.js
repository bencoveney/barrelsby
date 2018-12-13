"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const utilities_1 = require("./utilities");
/** Build directory information recursively. */
function buildTree(directory, barrelName, logger) {
    logger(`Building directory tree for ${utilities_1.convertPathSeparator(directory)}`);
    const names = fs_1.default.readdirSync(directory);
    const result = {
        directories: [],
        files: [],
        name: path_1.default.basename(directory),
        path: utilities_1.convertPathSeparator(directory)
    };
    names.forEach((name) => {
        const fullPath = path_1.default.join(directory, name);
        if (fs_1.default.statSync(fullPath).isDirectory()) {
            result.directories.push(buildTree(fullPath, barrelName, logger));
        }
        else {
            const convertedPath = utilities_1.convertPathSeparator(fullPath);
            const file = {
                name,
                path: convertedPath
            };
            result.files.push(file);
            if (file.name === barrelName) {
                logger(`Found existing barrel @ ${convertedPath}`);
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
    directory.directories.forEach(childDirectory => walkTree(childDirectory, callback));
}
exports.walkTree = walkTree;
//# sourceMappingURL=fileTree.js.map