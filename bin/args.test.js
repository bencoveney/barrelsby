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
        expect(args === null || args === void 0 ? void 0 : args.config).not.toBeDefined();
        expect(args === null || args === void 0 ? void 0 : args.delete).toEqual(true);
        expect(args.directory).toEqual(["./test"]);
        expect(args.include).toEqual(["a.ts$"]);
        expect(args.exclude).toEqual(["zeta.ts$"]);
        expect(args.location).toEqual("top");
        expect(args.local).toEqual(true);
        expect(args.name).toEqual("barrel");
        expect(args.structure).toEqual("filesystem");
        expect(args.verbose).toEqual(true);
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
        expect(args === null || args === void 0 ? void 0 : args.config).toBeDefined();
        expect(args === null || args === void 0 ? void 0 : args.directory).toEqual(["test"]);
    }));
});
//# sourceMappingURL=args.test.js.map