"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveRootPath = void 0;
const path_1 = __importDefault(require("path"));
function resolveRootPath(directory) {
    // tslint:disable-next-line:no-console
    console.log("dir: ", directory);
    const resolved = path_1.default.resolve(directory);
    // tslint:disable-next-line:no-console
    console.log("resolved ", resolved);
    return resolved;
}
exports.resolveRootPath = resolveRootPath;
//# sourceMappingURL=rootPath.js.map