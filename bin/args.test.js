"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const args_1 = require("./args");
const yargs_1 = __importDefault(require("yargs"));
describe("args module", () => {
    it("should load the get the configuration options from yargs", () => __awaiter(void 0, void 0, void 0, function* () {
        // Set up yargs.
        (0, args_1.getArgs)();
        const args = yield yargs_1.default.parse([
            "--delete",
            "--directory",
            "./test",
            "--exclude",
            "zeta.ts$",
            "--include",
            "a.ts$",
            "--location",
            "top",
            "--local",
            "--name",
            "barrel",
            "--structure",
            "filesystem",
            "--verbose",
        ]);
        chai_1.assert.isUndefined(args === null || args === void 0 ? void 0 : args.config);
        chai_1.assert.equal(args === null || args === void 0 ? void 0 : args.delete, true);
        chai_1.assert.sameMembers(args.directory, ["./test"]);
        chai_1.assert.sameMembers(args.include, ["a.ts$"]);
        chai_1.assert.sameMembers(args.exclude, ["zeta.ts$"]);
        chai_1.assert.equal(args.location, "top");
        chai_1.assert.equal(args.local, true);
        chai_1.assert.equal(args.name, "barrel");
        chai_1.assert.equal(args.structure, "filesystem");
        chai_1.assert.equal(args.verbose, true);
    }));
    // TODO: Check things are defaulted correctly.
});
describe("args module", () => {
    it("should handle legacy directory configuration options from yargs", () => __awaiter(void 0, void 0, void 0, function* () {
        // Set up yargs.
        (0, args_1.getArgs)();
        const args = yield yargs_1.default.parse([
            "--config",
            "./barrelsby-legacy-directory.json",
        ]);
        chai_1.assert.isDefined(args === null || args === void 0 ? void 0 : args.config);
        chai_1.assert.deepEqual(args === null || args === void 0 ? void 0 : args.directory, ["test"]);
    }));
});
//# sourceMappingURL=args.test.js.map