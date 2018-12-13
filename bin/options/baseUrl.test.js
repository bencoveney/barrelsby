"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const baseUrl_1 = require("./baseUrl");
describe("options/baseUrl module has a", () => {
    describe("getCombinedBaseUrl function that", () => {
        it("should resolve the correct baseUrl", () => {
            chai_1.assert.match(baseUrl_1.getCombinedBaseUrl(".", "base/url"), /base[\\/]url$/);
            chai_1.assert.isUndefined(baseUrl_1.getCombinedBaseUrl(".", undefined));
        });
    });
});
//# sourceMappingURL=baseUrl.test.js.map