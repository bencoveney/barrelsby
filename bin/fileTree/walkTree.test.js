"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const TestUtilities = __importStar(require("../testUtilities"));
const WalkTree = __importStar(require("./walkTree"));
describe("walkTree module has a", () => {
    describe("walkTree function that", () => {
        it("should should call the callback once for each directory in the tree", () => {
            const fakeTree = TestUtilities.mockDirectoryTree();
            // Build a collection all all directories.
            let allDirectories = [fakeTree];
            fakeTree.directories.forEach(directory => {
                // Child/grandchild directories.
                allDirectories = allDirectories
                    .concat([directory])
                    .concat(directory.directories);
            });
            const calledDirectories = [];
            const callback = (directory) => calledDirectories.push(directory);
            WalkTree.walkTree(fakeTree, callback);
            chai_1.assert.deepEqual(allDirectories, calledDirectories);
        });
    });
});
//# sourceMappingURL=walkTree.test.js.map