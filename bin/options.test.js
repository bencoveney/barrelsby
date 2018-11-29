"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const yargs_1 = __importDefault(require("yargs"));
const Options = __importStar(require("./options"));
describe("options module has a", () => {
    describe("getOptions function that", () => {
        it("should load the configuration options", function () {
            // Allow extra time for yargs.
            this.slow(500);
            yargs_1.default([
                "--delete",
                "--directory",
                "./test",
                "--exclude",
                "zeta.ts$",
                "--include",
                "a.ts$",
                "--location",
                "top",
                "--name",
                "barrel",
                "--structure",
                "filesystem",
                "--verbose",
            ]);
            const options = Options.getOptions();
            // tslint:disable-next-line:no-console
            chai_1.assert.equal(options.logger, console.log);
            chai_1.assert.match(options.rootPath, /test$/);
            chai_1.assert.equal(options.barrelName, "barrel.ts");
            // From yargs
            chai_1.assert.isUndefined(options.config);
            chai_1.assert.equal(options.delete, true);
            chai_1.assert.equal(options.directory, "./test");
            chai_1.assert.sameMembers(options.exclude, ["zeta.ts$"]);
            chai_1.assert.sameMembers(options.include, ["a.ts$"]);
            chai_1.assert.equal(options.location, "top");
            chai_1.assert.equal(options.name, "barrel");
            chai_1.assert.equal(options.structure, "filesystem");
            chai_1.assert.equal(options.verbose, true);
        });
        it("should not use the console if logging is disabled", () => {
            yargs_1.default([]);
            const options = Options.getOptions();
            // tslint:disable-next-line:no-console
            chai_1.assert.notEqual(options.logger, console.log);
        });
        it("should not append .ts to the name option if already present", () => {
            yargs_1.default(["--name", "barrel.ts"]);
            const options = Options.getOptions();
            chai_1.assert.equal(options.barrelName, "barrel.ts");
        });
        it("should resolve the baseUrl if specified", () => {
            yargs_1.default(["--baseUrl", "/base/url"]);
            const options = Options.getOptions();
            chai_1.assert.match(options.combinedBaseUrl, /base[\\/]url$/);
        });
    });
});
//# sourceMappingURL=options.test.js.map