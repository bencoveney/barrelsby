"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const rootPath_1 = require("./rootPath");
describe("options/rootPath module has a", () => {
    describe("resolveRootPath function that", () => {
        it("should resolve the correct rootPath", () => {
            chai_1.assert.match(rootPath_1.resolveRootPath("test"), /test$/);
        });
    });
});
//# sourceMappingURL=rootPath.test.js.map