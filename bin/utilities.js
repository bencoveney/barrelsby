"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function convertPathSeparator(path) {
    return path.replace(/\\+/g, "/");
}
exports.convertPathSeparator = convertPathSeparator;
exports.isTypeScriptFile = /\.ts$/m;
exports.nonAlphaNumeric = /\W+/g;
exports.indentation = "  ";
//# sourceMappingURL=utilities.js.map