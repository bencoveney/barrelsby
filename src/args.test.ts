import { assert } from "chai";
import Yargs from "yargs";

import { getArgs } from "./args";

describe("args module", () => {
  let oldEnvVarVal: string;
  let hadEnvVarBefore: boolean;

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
    } else if (process.env.BARRELSBYCONFIG != null) {
      delete process.env.BARRELSBYCONFIG;
    }
  });

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
    assert.equal(args.directory, "./test");
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
