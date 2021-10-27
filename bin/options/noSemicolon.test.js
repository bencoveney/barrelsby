"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const noSemicolon_1 = require("./noSemicolon");
describe("options/noSemicolon module has a", () => {
    describe("getSemicolonCharacter function that", () => {
        it("should correctly return the semicolon", () => {
            expect((0, noSemicolon_1.getSemicolonCharacter)(false)).toEqual(";");
        });
        it("should correctly return the empty string", () => {
            expect((0, noSemicolon_1.getSemicolonCharacter)(true)).toEqual("");
        });
    });
});
//# sourceMappingURL=noSemicolon.test.js.map