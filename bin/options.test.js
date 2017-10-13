"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Yargs = require("yargs");
const Options = require("./options");
describe("options module has a", () => {
    describe("getOptions function that", () => {
        it("should load the configuration options", () => {
            Yargs([
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
            Yargs([]);
            const options = Options.getOptions();
            chai_1.assert.notEqual(options.logger, console.log);
        });
        it("should not append .ts to the name option if already present", () => {
            Yargs(["--name", "barrel.ts"]);
            const options = Options.getOptions();
            chai_1.assert.equal(options.barrelName, "barrel.ts");
        });
        it("should resolve the baseUrl if specified", () => {
            Yargs(["--baseUrl", "/base/url"]);
            const options = Options.getOptions();
            chai_1.assert.match(options.combinedBaseUrl, /base[\\/]url$/);
        });
    });
});
//# sourceMappingURL=options.test.js.map