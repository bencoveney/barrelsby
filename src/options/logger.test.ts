import { assert } from "chai";

import { getLogger } from "./logger";

describe("options/logger module has a", () => {
  describe("getLogger function that", () => {
    it("should get the correct logger", () => {
      // tslint:disable:no-console
      assert.equal(getLogger(true), console.log);
      assert.notEqual(getLogger(false), console.log);
      // tslint:enable:no-console
    });
  });
});
