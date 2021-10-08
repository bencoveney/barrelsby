"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compiledExtensions = exports.indentation = exports.thisDirectory = exports.nonAlphaNumeric = exports.isTypeScriptFile = exports.convertPathSeparator = void 0;
/** Convert path separator from windows to unix */
function convertPathSeparator(path) {
    return path.replace(/\\+/g, "/");
}
exports.convertPathSeparator = convertPathSeparator;
exports.isTypeScriptFile = /\.tsx?$/m;
exports.nonAlphaNumeric = /\W+/g;
exports.thisDirectory = /^\.[\\\/]/g;
exports.indentation = "  ";
exports.compiledExtensions = {
    ".ts": ".js",
    ".tsx": ".jsx",
    // ".mts": ".mjs", // Not supported yet. Added with Typescript 4.5
    // ".cts": ".cjs", // Not supported yet. Added with Typescript 4.5
};
//# sourceMappingURL=utilities.js.map