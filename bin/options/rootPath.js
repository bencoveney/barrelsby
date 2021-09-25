"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveRootPath = void 0;
const path_1 = __importDefault(require("path"));
function resolveRootPath(directory) {
    return path_1.default.resolve(directory);
}
exports.resolveRootPath = resolveRootPath;
//# sourceMappingURL=rootPath.js.map