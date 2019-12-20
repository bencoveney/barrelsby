"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const yargs_1 = __importDefault(require("yargs"));
const args_1 = require("./args");
describe("args module", () => {
    let oldEnvVarVal;
    let hadEnvVarBefore;
    beforeEach(() => {
        if (process.env.BARRELSBYCONFIG != null) {
            hadEnvVarBefore = true;
            // we have backup to environment variable because process.env is not mockable
            oldEnvVarVal = process.env.BARRELSBYCONFIG;
            delete process.env.BARRELSBYCONFIG;
        }
    });
    afterEach(() => {
        if (hadEnvVarBefore) {
            process.env.BARRELSBYCONFIG = oldEnvVarVal;
        }
        else if (process.env.BARRELSBYCONFIG != null) {
            delete process.env.BARRELSBYCONFIG;
        }
    });
    it("should load the get the configuration options from yargs", () => {
        // Set up yargs.
        args_1.getArgs();
        const args = yargs_1.default.parse([
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
            "--verbose"
        ]);
        chai_1.assert.isUndefined(args.config);
        chai_1.assert.equal(args.delete, true);
        chai_1.assert.equal(args.directory, "./test");
        chai_1.assert.sameMembers(args.include, ["a.ts$"]);
        chai_1.assert.sameMembers(args.exclude, ["zeta.ts$"]);
        chai_1.assert.equal(args.location, "top");
        chai_1.assert.equal(args.local, true);
        chai_1.assert.equal(args.name, "barrel");
        chai_1.assert.equal(args.structure, "filesystem");
        chai_1.assert.equal(args.verbose, true);
    });
    // TODO: Check things are defaulted correctly.
});
//# sourceMappingURL=args.test.js.map