"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const quoteCharacter_1 = require("./quoteCharacter");
describe("options/quoteCharacter module has a", () => {
    describe("getQuoteCharacter function that", () => {
        it("should correctly return the singlequote", () => {
            expect((0, quoteCharacter_1.getQuoteCharacter)(true)).toEqual("'");
        });
        it("should correctly return the doublequote", () => {
            expect((0, quoteCharacter_1.getQuoteCharacter)(false)).toEqual('"');
        });
    });
});
//# sourceMappingURL=quoteCharacter.test.js.map