import {assert} from "chai";
import * as Yargs from "yargs";
import * as Options from "./options";

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
            assert.isFunction(options.logger);
            assert.match(options.rootPath, /test$/);
            assert.equal(options.barrelName, "barrel.ts");
            // From yargs
            assert.isUndefined(options.config);
            assert.equal(options.delete, true);
            assert.equal(options.directory, "./test");
            assert.equal(options.exclude, "zeta.ts$");
            assert.equal(options.include, "a.ts$");
            assert.equal(options.location, "top");
            assert.equal(options.name, "barrel");
            assert.equal(options.structure, "filesystem");
            assert.equal(options.verbose, true);
        });
    });
});
