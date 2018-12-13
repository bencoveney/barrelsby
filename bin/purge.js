"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const fileTree_1 = require("./fileTree");
function purge(rootTree, shouldPurge, barrelName, logger) {
    // Delete any existing barrels.
    if (shouldPurge) {
        fileTree_1.walkTree(rootTree, (directory) => {
            directory.files
                .filter((file) => {
                return file.name === barrelName;
            })
                .forEach((file) => {
                logger(`Deleting existing barrel @ ${file.path}`);
                // Delete barrel file and clean up tree model.
                fs_1.default.unlinkSync(file.path);
                directory.files.splice(directory.files.indexOf(file), 1);
                directory.barrel = undefined;
            });
        });
    }
}
exports.purge = purge;
//# sourceMappingURL=purge.js.map