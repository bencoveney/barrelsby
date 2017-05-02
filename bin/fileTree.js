"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var utilities_1 = require("./utilities");
/** Build directory information recursively. */
function buildTree(directory, options) {
    options.logger("Building directory tree for " + utilities_1.convertPathSeparator(directory));
    var names = fs.readdirSync(directory);
    var result = {
        directories: [],
        files: [],
        name: path.basename(directory),
        path: utilities_1.convertPathSeparator(directory),
    };
    names.forEach(function (name) {
        var fullPath = path.join(directory, name);
        if (fs.statSync(fullPath).isDirectory()) {
            result.directories.push(buildTree(fullPath, options));
        }
        else {
            var convertedPath = utilities_1.convertPathSeparator(fullPath);
            var file = {
                name: name,
                path: convertedPath,
            };
            result.files.push(file);
            if (file.name === options.indexName) {
                options.logger("Found existing index @ " + convertedPath);
                result.index = file;
            }
        }
    });
    return result;
}
exports.buildTree = buildTree;
/** Walk an entire directory tree recursively. */
function walkTree(directory, callback) {
    callback(directory);
    for (var _i = 0, _a = Object.keys(directory.directories); _i < _a.length; _i++) {
        var name_1 = _a[_i];
        walkTree(directory.directories[name_1], callback);
    }
}
exports.walkTree = walkTree;
//# sourceMappingURL=fileTree.js.map