import {assert} from "chai";
import {ITestCallbackContext} from "mocha";
import Yargs from "yargs";

import * as Options from "./options";

describe("options module has a", () => {
    describe("getOptions function that", () => {
        it("should load the configuration options", function(this: ITestCallbackContext) {
            // Allow extra time for yargs.
            this.slow(500);
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
            // tslint:disable-next-line:no-console
            assert.equal(options.logger, console.log);
            assert.match(options.rootPath, /test$/);
            assert.equal(options.barrelName, "barrel.ts");
            // From yargs
            assert.isUndefined(options.config);
            assert.equal(options.delete, true);
            assert.equal(options.directory, "./test");
            assert.sameMembers(options.exclude as string[], ["zeta.ts$"]);
            assert.sameMembers(options.include as string[], ["a.ts$"]);
            assert.equal(options.location, "top");
            assert.equal(options.name, "barrel");
            assert.equal(options.structure, "filesystem");
            assert.equal(options.verbose, true);
        });
        it("should not use the console if logging is disabled", () => {
            Yargs([]);
            const options = Options.getOptions();
            // tslint:disable-next-line:no-console
            assert.notEqual(options.logger, console.log);
        });
        it("should not append .ts to the name option if already present", () => {
            Yargs(["--name", "barrel.ts"]);
            const options = Options.getOptions();
            assert.equal(options.barrelName, "barrel.ts");
        });
        it("should resolve the baseUrl if specified", () => {
            Yargs(["--baseUrl", "/base/url"]);
            const options = Options.getOptions();
            assert.match(options.combinedBaseUrl as string, /base[\\/]url$/);
        });
    });
});
