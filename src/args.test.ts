import { assert } from "chai";
import Yargs from "yargs";

import { getArgs } from "./args";

describe("args module", () => {
  it("should load the get the configuration options from yargs", () => {
    // Set up yargs.
    getArgs();

    const args = Yargs.parse([
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

    assert.isUndefined(args.config);
    assert.equal(args.delete, true);
    assert.sameMembers(args.directory as string[], ["./test"]);
    assert.sameMembers(args.include as string[], ["a.ts$"]);
    assert.sameMembers(args.exclude as string[], ["zeta.ts$"]);
    assert.equal(args.location, "top");
    assert.equal(args.local, true);
    assert.equal(args.name, "barrel");
    assert.equal(args.structure, "filesystem");
    assert.equal(args.verbose, true);
  });
  // TODO: Check things are defaulted correctly.
});

describe("args module", () => {
  it("should handle legacy directory configuration options from yargs", () => {
    // Set up yargs.
    getArgs();

    const args = Yargs.parse(["--config", "./barrelsby-legacy-directory.json"]);

    assert.isDefined(args.config);
    assert.deepEqual(args.directory, ["test"]);
  });
});
