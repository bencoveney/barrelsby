"use strict";
var chai_1 = require("chai");
var Utilities = require("./utilities");
describe("utilities module has a", function () {
    describe("isTypeScriptFile regular expression that", function () {
        it("should match a typescript file", function () {
            chai_1.assert.notEqual("instructions.ts".search(Utilities.isTypeScriptFile), -1);
        });
        it("should match a typescript file in a directory", function () {
            chai_1.assert.notEqual("src/code/scripts/instructions.ts".search(Utilities.isTypeScriptFile), -1);
        });
        it("should match a typescript definition file", function () {
            chai_1.assert.notEqual("definitions.d.ts".search(Utilities.isTypeScriptFile), -1);
        });
        it("should not match a non-typescript file", function () {
            chai_1.assert.equal("other.tsx".search(Utilities.isTypeScriptFile), -1);
        });
    });
    describe("nonAlphaNumeric regular expression that", function () {
        it("should match any non-alpha-numeric characters", function () {
            var input = "aA1!bB2\"cC3£dD4$";
            var output = input.replace(Utilities.nonAlphaNumeric, "");
            chai_1.assert.equal(output, "aA1bB2cC3dD4");
        });
    });
    describe("indentation constant that", function () {
        it("is only whitespace", function () {
            chai_1.assert.equal(Utilities.indentation.trim(), "");
        });
    });
    describe("convertPathSeparator function that", function () {
        it("should window path seperators with unix ones", function () {
            var result = Utilities.convertPathSeparator("my\\long/path");
            chai_1.assert.equal(result, "my/long/path");
        });
    });
});
//# sourceMappingURL=utilities.test.js.map