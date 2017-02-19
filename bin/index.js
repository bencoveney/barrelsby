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
    .string("m")
    .alias("m", "mode")
    .describe("m", "The mode for creation of index files")
    .choices("m", ["top", "below", "all", "replace", "branch"])
    .default("m", "top")
    .help("h")
    .alias("h", "help")
    .default("h", false)
    .version()
    .alias("v", "version")
    .default("v", false)
    .boolean("V")
    .alias("V", "verbose")
    .describe("V", "Display additional logging information")
    .default("D", false)
    .argv;
var indexName = "index.ts";
var rootPath = path.resolve(argv.directory);
var logger = argv.verbose ? console.log : function (message) { };
;
/** Build directory information recursively. */
function buildTree(directory) {
    logger("Building directory tree for " + directory);
    var names = fs.readdirSync(directory);
    var result = {
        path: directory,
        name: path.basename(directory),
        directories: [],
        files: []
    };
    names.forEach(function (name) {
        var fullPath = path.join(directory, name);
        if (fs.statSync(fullPath).isDirectory()) {
            result.directories.push(buildTree(fullPath));
        }
        else {
            var file = {
                path: fullPath,
                name: name
            };
            result.files.push(file);
            if (file.name === indexName) {
                logger("Found existing index @ " + fullPath);
                result.index = file;
            }
        }
    });
    return result;
}
/** Walk an entire directory tree recursively. */
function walkTree(directory, callback) {
    callback(directory);
    for (var _i = 0, _a = Object.keys(directory.directories); _i < _a.length; _i++) {
        var name_1 = _a[_i];
        walkTree(directory.directories[name_1], callback);
    }
}
// Build the directory tree.
var rootTree = buildTree(rootPath);
// Work out which directories should have index files.
var destinations;
switch (argv.mode) {
    case "top":
    default:
        destinations = [rootTree];
        break;
    case "below":
        destinations = rootTree.directories;
        break;
    case "all":
        destinations = [];
        walkTree(rootTree, function (directory) {
            destinations.push(directory);
        });
        break;
    case "replace":
        destinations = [];
        walkTree(rootTree, function (directory) {
            if (directory.files.some(function (location) { return location.name === indexName; })) {
                destinations.push(directory);
            }
        });
        break;
    case "branch":
        destinations = [];
        walkTree(rootTree, function (directory) {
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
logger("Destinations:");
destinations.forEach(function (destination) { return logger(destination.path); });
// Delete any existing indexes.
if (argv.delete) {
    walkTree(rootTree, function (directory) {
        directory.files
            .filter(function (file) {
            return file.name === indexName;
        })
            .forEach(function (file) {
            logger("Deleting existing index @ " + file.path);
            // Delete barrel file and clean up tree model.
            fs.unlinkSync(file.path);
            directory.files.splice(directory.files.indexOf(file), 1);
            directory.index = undefined;
        });
    });
}
// Get any typescript modules contained at any depth in the current directory.
function getModules(directory) {
    logger("Getting modules @ " + directory.path);
    if (directory.index) {
        // If theres an index then use that as it *should* contain descendant modules.
        logger("Found existing index @ " + directory.index.path);
        return [directory.index];
    }
    var files = [].concat(directory.files);
    directory.directories.forEach(function (directory) {
        // Recurse.
        files.push.apply(files, getModules(directory));
    });
    // Only return files that look like TypeScript modules.
    return files.filter(function (file) { return file.name.match(/\.ts$/m); });
}
// Build a barrel for the specified directory.
function buildBarrel(directory) {
    logger("Building barrel @ " + directory.path);
    var barrelContent = getModules(directory).reduce(function (previous, current) {
        // Get the route from the current directory to the module.
        var relativePath = path.relative(directory.path, current.path);
        // Get the route and ensure it's relative
        var directoryPath = path.dirname(relativePath);
        if (directoryPath !== ".") {
            directoryPath = "." + path.sep + directoryPath;
        }
        // Strip off the .ts from the file name.
        var fileName = path.basename(relativePath, ".ts");
        // Build the final path string. Use posix-style seperators.
        var location = "" + directoryPath + path.sep + fileName;
        location = location.replace(/\\+/g, "/");
        logger("Including path " + location);
        return previous += "export * from \"" + location + "\";\n";
    }, "");
    var indexPath = path.resolve(directory.path, indexName);
    fs.writeFileSync(indexPath, barrelContent);
    // Update the file tree model with the new index.
    if (!directory.files.some(function (file) { return file.name === indexName; })) {
        var index = {
            path: indexPath,
            name: indexName
        };
        logger("Updating model index @ " + indexPath);
        directory.files.push(index);
        directory.index = index;
    }
}
// Build the barrels.
destinations.forEach(buildBarrel);
