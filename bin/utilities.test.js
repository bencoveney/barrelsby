"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Utilities = __importStar(require("./utilities"));
describe("utilities module has a", () => {
    describe("isTypeScriptFile regular expression that", () => {
        it("should match a typescript file", () => {
            chai_1.assert.notEqual("instructions.ts".search(Utilities.isTypeScriptFile), -1);
        });
        it("should match a typescript file in a directory", () => {
            chai_1.assert.notEqual("src/code/scripts/instructions.ts".search(Utilities.isTypeScriptFile), -1);
        });
        it("should match a typescript definition file", () => {
            chai_1.assert.notEqual("definitions.d.ts".search(Utilities.isTypeScriptFile), -1);
        });
        it("should match a typescript jsx (.tsx) file", () => {
            chai_1.assert.notEqual("other.tsx".search(Utilities.isTypeScriptFile), -1);
        });
        it("should not match a non-typescript file", () => {
            chai_1.assert.equal("other.cs".search(Utilities.isTypeScriptFile), -1);
        });
    });
    describe("nonAlphaNumeric regular expression that", () => {
        it("should match any non-alpha-numeric characters", () => {
            const input = 'aA1!bB2"cC3£dD4$';
            const output = input.replace(Utilities.nonAlphaNumeric, "");
            chai_1.assert.equal(output, "aA1bB2cC3dD4");
        });
    });
    describe("indentation constant that", () => {
        it("is only whitespace", () => {
            chai_1.assert.equal(Utilities.indentation.trim(), "");
        });
    });
    describe("convertPathSeparator function that", () => {
        it("should window path seperators with unix ones", () => {
            const result = Utilities.convertPathSeparator("my\\long/path");
            chai_1.assert.equal(result, "my/long/path");
        });
    });
});
//# sourceMappingURL=utilities.test.js.map