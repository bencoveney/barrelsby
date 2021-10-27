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
const Utilities = __importStar(require("./utilities"));
describe("utilities module has a", () => {
    describe("isTypeScriptFile regular expression that", () => {
        it("should match a typescript file", () => {
            expect("instructions.ts".search(Utilities.isTypeScriptFile)).not.toEqual(-1);
        });
        it("should match a typescript file in a directory", () => {
            expect("src/code/scripts/instructions.ts".search(Utilities.isTypeScriptFile)).not.toEqual(-1);
        });
        it("should match a typescript definition file", () => {
            expect("definitions.d.ts".search(Utilities.isTypeScriptFile)).not.toEqual(-1);
        });
        it("should match a typescript jsx (.tsx) file", () => {
            expect("other.tsx".search(Utilities.isTypeScriptFile)).not.toEqual(-1);
        });
        it("should not match a non-typescript file", () => {
            expect("other.cs".search(Utilities.isTypeScriptFile)).toEqual(-1);
        });
    });
    describe("nonAlphaNumeric regular expression that", () => {
        it("should match any non-alpha-numeric characters", () => {
            const input = 'aA1!bB2"cC3£dD4$';
            const output = input.replace(Utilities.nonAlphaNumeric, "");
            expect(output).toEqual("aA1bB2cC3dD4");
        });
    });
    describe("indentation constant that", () => {
        it("is only whitespace", () => {
            expect(Utilities.indentation.trim()).toEqual("");
        });
    });
    describe("convertPathSeparator function that", () => {
        it("should window path seperators with unix ones", () => {
            const result = Utilities.convertPathSeparator("my\\long/path");
            expect(result).toEqual("my/long/path");
        });
    });
});
//# sourceMappingURL=utilities.test.js.map