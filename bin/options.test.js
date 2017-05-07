"use strict";
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
            chai_1.assert.isFunction(options.logger);
            chai_1.assert.match(options.rootPath, /test$/);
            chai_1.assert.equal(options.barrelName, "barrel.ts");
            // From yargs
            chai_1.assert.isUndefined(options.config);
            chai_1.assert.equal(options.delete, true);
            chai_1.assert.equal(options.directory, "./test");
            chai_1.assert.equal(options.exclude, "zeta.ts$");
            chai_1.assert.equal(options.include, "a.ts$");
            chai_1.assert.equal(options.location, "top");
            chai_1.assert.equal(options.name, "barrel");
            chai_1.assert.equal(options.structure, "filesystem");
            chai_1.assert.equal(options.verbose, true);
        });
    });
});
//# sourceMappingURL=options.test.js.map