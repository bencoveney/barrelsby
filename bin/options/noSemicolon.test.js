"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const noSemicolon_1 = require("./noSemicolon");
describe("options/noSemicolon module has a", () => {
    describe("getSemicolonCharacter function that", () => {
        it("should correctly return the semicolon", () => {
            chai_1.assert.equal(noSemicolon_1.getSemicolonCharacter(false), ";");
        });
        it("should correctly return the empty string", () => {
            chai_1.assert.equal(noSemicolon_1.getSemicolonCharacter(true), "");
        });
    });
});
//# sourceMappingURL=noSemicolon.test.js.map