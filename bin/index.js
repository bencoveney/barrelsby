#! /usr/bin/env node
"use strict";
var fs = require("fs");
var path = require("path");
var Yargs = require("yargs");
var argv = Yargs
    .usage("Usage: barrelsby [options]")
    .example("barrelsby", "Run barrelsby")
    .config("c")
    .alias("c", "config")
    .describe("c", "The location of the config file.")
    .string("d")
    .alias("d", "directory")
    .nargs("d", 1)
    .describe("d", "The directory to create barrels for.")
    .default("d", "./")
    .boolean("D")
    .alias("D", "delete")
    .describe("D", "Delete existing index files.")
    .default("D", false)
    .array("e")
    .alias("e", "exclude")
    .describe("e", "Excludes any files whose paths match any of the regular expressions.")
    .help("h")
    .alias("h", "help")
    .default("h", false)
    .array("i")
    .alias("i", "include")
    .describe("i", "Only include files whose paths match any of the regular expressions.")
    .string("l")
    .alias("l", "location")
    .describe("l", "The mode for picking barrel file locations")
    .choices("l", ["top", "below", "all", "replace", "branch"])
    .default("l", "top")
    .string("n")
    .alias("n", "name")
    .describe("n", "The name to give barrel files")
    .default("n", "index")
    .string("s")
    .alias("s", "structure")
    .describe("s", "The mode for structuring barrel file exports")
    .choices("s", ["flat", "filesystem"])
    .default("s", "flat")
    .version()
    .alias("v", "version")
    .default("v", false)
    .boolean("V")
    .alias("V", "verbose")
    .describe("V", "Display additional logging information")
    .default("D", false)
    .argv;
// tslint:disable-next-line:no-empty
var logger = argv.verbose ? console.log : function (message) { };
var rootPath = path.resolve(argv.directory);
var isTypeScriptFile = /\.ts$/m;
var nonAlphaNumeric = /\W+/g;
var indentation = "  ";
// Resolve index name.
var nameArgument = argv.name;
var indexName = nameArgument.match(isTypeScriptFile) ? nameArgument : nameArgument + ".ts";
logger("Using name " + indexName);
/** Build directory information recursively. */
function buildTree(directory) {
    logger("Building directory tree for " + directory);
    var names = fs.readdirSync(directory);
    var result = {
        directories: [],
        files: [],
        name: path.basename(directory),
        path: directory,
    };
    names.forEach(function (name) {
        var fullPath = path.join(directory, name);
        if (fs.statSync(fullPath).isDirectory()) {
            result.directories.push(buildTree(fullPath));
        }
        else {
            var file = {
                name: name,
                path: fullPath,
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
switch (argv.location) {
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
    directory.directories.forEach(function (childDirectory) {
        // Recurse.
        files.push.apply(files, getModules(childDirectory));
    });
    // Only return files that look like TypeScript modules.
    return files.filter(function (file) { return file.name.match(isTypeScriptFile); });
}
// Filter a set of modules down to those matching the include/exclude rules.
function buildRegexList(patterns) {
    if (!Array.isArray(patterns)) {
        return null;
    }
    return patterns.map(function (pattern) { return new RegExp(pattern); });
}
var whitelistTests = buildRegexList(argv.include);
var blacklistTests = buildRegexList(argv.exclude);
function filterModules(locations) {
    var result = locations;
    if (whitelistTests !== null) {
        result = result.filter(function (location) {
            return whitelistTests.some(function (test) {
                var isMatch = !!location.path.match(test);
                if (isMatch) {
                    logger(location.path + " is included by " + test);
                }
                return isMatch;
            });
        });
    }
    if (blacklistTests !== null) {
        result = result.filter(function (location) {
            return !blacklistTests.some(function (test) {
                var isMatch = !!location.path.match(test);
                if (isMatch) {
                    logger(location.path + " is excluded by " + test);
                }
                return isMatch;
            });
        });
    }
    return result;
}
function buildImportPath(directory, target) {
    // Get the route from the current directory to the module.
    var relativePath = path.relative(directory.path, target.path);
    // Get the route and ensure it's relative
    var directoryPath = path.dirname(relativePath);
    if (directoryPath !== ".") {
        directoryPath = "." + path.sep + directoryPath;
    }
    // Strip off the .ts from the file name.
    var fileName = path.basename(relativePath, ".ts");
    // Build the final path string. Use posix-style seperators.
    var location = "" + directoryPath + path.sep + fileName;
    return location.replace(/\\+/g, "/");
}
function buildFlatBarrel(directory, modules) {
    return modules.reduce(function (previous, current) {
        var importPath = buildImportPath(directory, current);
        logger("Including path " + importPath);
        return previous += "export * from \"" + importPath + "\";\n";
    }, "");
}
function buildStructureSubsection(structure, pathParts, name, reference) {
    var pathPart = pathParts.shift();
    var subsection = pathPart === "." ? structure : structure[pathPart];
    if (!subsection) {
        subsection = {};
        structure[pathPart] = subsection;
    }
    if (pathParts.length === 0) {
        subsection[name] = reference;
    }
    else {
        buildStructureSubsection(subsection, pathParts, name, reference);
    }
}
function stringify(structure, previousIndentation) {
    var nextIndentation = previousIndentation + indentation;
    var content = "";
    for (var _i = 0, _a = Object.keys(structure).sort(); _i < _a.length; _i++) {
        var key = _a[_i];
        content += "\n" + nextIndentation + "\"" + key + "\": ";
        var exported = structure[key];
        if (typeof exported === "string") {
            content += exported;
        }
        else {
            content += stringify(exported, nextIndentation);
        }
        content += ",";
    }
    return "{" + content + "\n" + previousIndentation + "}";
}
function buildFileSystemBarrel(directory, modules) {
    var structure = {};
    var content = "";
    modules.forEach(function (module) {
        var relativePath = path.relative(directory.path, module.path);
        var directoryPath = path.dirname(relativePath);
        var parts = directoryPath.split(path.sep);
        var alias = relativePath.replace(nonAlphaNumeric, "");
        var importPath = buildImportPath(directory, module);
        content += "import * as " + alias + " from \"" + importPath + "\";\n";
        var fileName = path.basename(module.name, ".ts");
        buildStructureSubsection(structure, parts, fileName, alias);
    });
    for (var _i = 0, _a = Object.keys(structure).sort(); _i < _a.length; _i++) {
        var key = _a[_i];
        var exported = structure[key];
        if (typeof exported === "string") {
            content += "export {" + exported + " as " + key + "};\n";
        }
        else {
            content += "export const " + key + " = " + stringify(exported, "") + ";\n";
        }
    }
    return content;
}
var barrelBuilder;
switch (argv.structure) {
    default:
    case "flat":
        barrelBuilder = buildFlatBarrel;
        break;
    case "filesystem":
        barrelBuilder = buildFileSystemBarrel;
        break;
}
// Build a barrel for the specified directory.
function buildBarrel(directory) {
    logger("Building barrel @ " + directory.path);
    var barrelContent = barrelBuilder(directory, filterModules(getModules(directory)));
    var indexPath = path.resolve(directory.path, indexName);
    fs.writeFileSync(indexPath, barrelContent);
    // Update the file tree model with the new index.
    if (!directory.files.some(function (file) { return file.name === indexName; })) {
        var index = {
            name: indexName,
            path: indexPath,
        };
        logger("Updating model index @ " + indexPath);
        directory.files.push(index);
        directory.index = index;
    }
}
// Build the barrels.
destinations.forEach(buildBarrel);
