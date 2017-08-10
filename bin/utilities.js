"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Convert path separator from windows to unix */
function convertPathSeparator(path) {
    return path.replace(/\\+/g, "/");
}
exports.convertPathSeparator = convertPathSeparator;
exports.isTypeScriptFile = /\.tsx?$/m;
exports.nonAlphaNumeric = /\W+/g;
exports.thisDirectory = /^\.[\\\/]/g;
exports.indentation = "  ";
//# sourceMappingURL=utilities.js.map