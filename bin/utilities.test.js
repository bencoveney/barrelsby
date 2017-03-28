"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var Utilities = require("./utilities");
describe("Utilities module has a", function () {
    describe("isTypeScriptFile regular expression that", function () {
        it("should match a typescript file", function () {
            assert.notEqual("instructions.ts".search(Utilities.isTypeScriptFile), -1);
        });
        it("should match a typescript file in a directory", function () {
            assert.notEqual("src/code/scripts/instructions.ts".search(Utilities.isTypeScriptFile), -1);
        });
        it("should match a typescript definition file", function () {
            assert.notEqual("definitions.d.ts".search(Utilities.isTypeScriptFile), -1);
        });
        it("should not match a non-typescript file", function () {
            assert.equal("other.tsx".search(Utilities.isTypeScriptFile), -1);
        });
    });
    describe("nonAlphaNumeric regular expression that", function () {
        it("should match any non-alpha-numeric characters", function () {
            var input = "aA1!bB2\"cC3£dD4$";
            var output = input.replace(Utilities.nonAlphaNumeric, "");
            assert.equal(output, "aA1bB2cC3dD4");
        });
    });
    describe("indentation constant that", function () {
        it("is only whitespace", function () {
            assert.equal(Utilities.indentation.trim(), "");
        });
    });
});
