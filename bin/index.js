#! /usr/bin/env node
"use strict";
var fs = require("fs");
var path = require("path");
var Yargs = require("yargs");
var argv = Yargs
    .usage("Usage: barrelsby [options]")
    .example("barrelsby", "Run barrelsby")
    .string("d")
    .alias("d", "directory")
    .nargs("d", 1)
    .describe("d", "The directory to create barrels for.")
    .default("d", "./")
    .boolean("D")
    .alias("D", "delete")
    .describe("D", "Delete existing index files.")
    .default("D", false)
    .help("h")
    .alias("h", "help")
    .default("h", false)
    .version()
    .alias("v", "version")
    .default("v", false)
    .argv;
var rootPath = path.resolve(argv.directory);
;
function buildTree(directory) {
    var names = fs.readdirSync(directory);
    var result = {
        path: directory,
        name: path.dirname(directory),
        directories: [],
        files: []
    };
    names.forEach(function (name) {
        var fullPath = path.join(directory, name);
        if (fs.statSync(fullPath).isDirectory()) {
            result.directories.push(buildTree(fullPath));
        }
        else {
            result.files.push({
                path: directory,
                name: name
            });
        }
    });
    return result;
}
function walkTree(fileTree, callback) {
    callback(fileTree);
    for (var _i = 0, _a = Object.keys(fileTree.directories); _i < _a.length; _i++) {
        var name_1 = _a[_i];
        walkTree(fileTree.directories[name_1], callback);
    }
}
var rootTree = buildTree(rootPath);
if (argv.D) {
    walkTree(rootTree, function (fileTree) {
        fileTree.files
            .filter(function (file) {
            return file.name === "index.ts";
        })
            .forEach(function (file) {
            fs.unlinkSync(path.resolve(file.path, file.name));
        });
    });
}
function getModules(fileTree, localOnly) {
    if (localOnly === void 0) { localOnly = false; }
    var files;
    if (localOnly) {
        files = fileTree.files;
    }
    else {
        files = [];
        walkTree(fileTree, function (currentLocation) {
            files = files.concat(currentLocation.files);
        });
    }
    return files.filter(function (file) { return file.name.match(/\.ts$/m) && file.name !== "index.ts"; });
}
function buildBarrel(fileTree) {
    fs.writeFileSync(path.resolve(fileTree.path, "index.ts"), getModules(fileTree).reduce(function (previous, current) {
        var relativePath = path.relative(fileTree.path, current.path);
        var location = "." + path.sep + relativePath;
        if (relativePath) {
            location += path.sep;
        }
        location += path.basename(current.name, ".ts");
        location = location.replace(/\\+/g, "/");
        return previous += "export * from \"" + location + "\";\n";
    }, ""));
}
buildBarrel(rootTree);
