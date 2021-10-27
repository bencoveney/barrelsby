"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rootPath_1 = require("./rootPath");
describe("options/rootPath module has a", () => {
    describe("resolveRootPath function that", () => {
        it("should resolve the correct rootPath", () => {
            expect((0, rootPath_1.resolveRootPath)("test")).toMatch(/test$/);
        });
    });
});
//# sourceMappingURL=rootPath.test.js.map