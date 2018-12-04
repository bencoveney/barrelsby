import { assert } from "chai";

import * as Options from "./options";

describe("options module has a", () => {
  describe("getOptions function that", () => {
    let defaultOptions: any;
    beforeEach(() => {
      // Options that we are certain we will get from Yargs.
      // TODO: Enforce this using the type system - remove the anys.
      defaultOptions = {
        delete: false,
        directory: "test",
        location: "top",
        name: "barrel.ts",
        singleQuotes: false,
        structure: "flat",
        verbose: true
      };
    });
    it("should process the given configuration options", () => {
      const options = { ...defaultOptions, verbose: true };

      const processed = Options.getOptions(options);

      // tslint:disable-next-line:no-console
      assert.equal(processed.logger, console.log);
      assert.match(processed.rootPath, /test$/);
      assert.equal(processed.barrelName, "barrel.ts");
    });
    it("should not use the console if logging is disabled", () => {
      const options = { ...defaultOptions, verbose: false };

      const processed = Options.getOptions(options);

      // tslint:disable-next-line:no-console
      assert.notEqual(processed.logger, console.log);
    });
    it("should not append .ts to the name option if already present", () => {
      const options = { ...defaultOptions, name: "barrel" };

      const processed = Options.getOptions(options);

      assert.equal(processed.barrelName, "barrel.ts");
    });
    it("should resolve the baseUrl if specified", () => {
      const options = { ...defaultOptions, baseUrl: "/base/url" };

      const processed = Options.getOptions(options);

      assert.match(processed.combinedBaseUrl as string, /base[\\/]url$/);
    });
  });
});
