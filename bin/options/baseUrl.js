"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCombinedBaseUrl = void 0;
const path_1 = __importDefault(require("path"));
function getCombinedBaseUrl(rootPath, baseUrl) {
    return baseUrl ? path_1.default.join(rootPath, baseUrl) : undefined;
}
exports.getCombinedBaseUrl = getCombinedBaseUrl;
//# sourceMappingURL=baseUrl.js.map