"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseUrl_1 = require("./baseUrl");
describe("options/baseUrl module has a", () => {
    describe("getCombinedBaseUrl function that", () => {
        it("should resolve the correct baseUrl", () => {
            expect((0, baseUrl_1.getCombinedBaseUrl)(".", "base/url")).toMatch(/base[\\/]url$/);
            expect((0, baseUrl_1.getCombinedBaseUrl)(".", undefined)).not.toBeDefined();
        });
    });
});
//# sourceMappingURL=baseUrl.test.js.map