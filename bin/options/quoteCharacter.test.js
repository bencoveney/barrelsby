"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const quoteCharacter_1 = require("./quoteCharacter");
describe("options/quoteCharacter module has a", () => {
    describe("getQuoteCharacter function that", () => {
        it("should correctly return the singlequote", () => {
            chai_1.assert.equal(quoteCharacter_1.getQuoteCharacter(true), "'");
        });
        it("should correctly return the doublequote", () => {
            chai_1.assert.equal(quoteCharacter_1.getQuoteCharacter(false), '"');
        });
    });
});
//# sourceMappingURL=quoteCharacter.test.js.map