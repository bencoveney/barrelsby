"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utilities_1 = require("./utilities");
function buildFlatBarrel(directory, modules, options) {
    return modules.reduce(function (previous, current) {
        var importPath = utilities_1.buildImportPath(directory, current);
        options.logger("Including path " + importPath);
        return previous += "export * from \"" + importPath + "\";\n";
    }, "");
}
exports.buildFlatBarrel = buildFlatBarrel;
