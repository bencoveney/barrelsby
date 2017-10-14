"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Convert path separator from windows to unix.
 * @param path The path to convert.
 * @returns The converted path.
 */
function convertPathSeparator(path) {
    return path.replace(/\\+/g, "/");
}
exports.convertPathSeparator = convertPathSeparator;
/** Determines whether the path is to a TypeScript module. */
exports.isTypeScriptFile = /\.tsx?$/m;
/** Determines whether the value is non-alphanumeric. */
exports.nonAlphaNumeric = /\W+/g;
/** Determines whether a path points to "this" directory. */
exports.thisDirectory = /^\.[\\\/]/g;
/** The default indentation. */
exports.indentation = "  ";
//# sourceMappingURL=utilities.js.map