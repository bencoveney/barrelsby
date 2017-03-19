"use strict";
var path = require("path");
var utilities_1 = require("../utilities");
var utilities_2 = require("./utilities");
function stringify(structure, previousIndentation) {
    var nextIndentation = previousIndentation + utilities_1.indentation;
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
function buildFileSystemBarrel(directory, modules) {
    var structure = {};
    var content = "";
    modules.forEach(function (module) {
        var relativePath = path.relative(directory.path, module.path);
        var directoryPath = path.dirname(relativePath);
        var parts = directoryPath.split(path.sep);
        var alias = relativePath.replace(utilities_1.nonAlphaNumeric, "");
        var importPath = utilities_2.buildImportPath(directory, module);
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
exports.buildFileSystemBarrel = buildFileSystemBarrel;
