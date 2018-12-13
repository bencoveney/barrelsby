import { assert } from "chai";

import { getLogger } from "./logger";

describe("options/logger module has a", () => {
  describe("getLogger function that", () => {
    it("should get the correct logger", () => {
      // tslint:disable:no-console
      const verboseLogger = getLogger(true);
      assert.equal(verboseLogger, console.log);

      const silentLogger = getLogger(false);
      assert.notEqual(silentLogger, console.log);
      assert.isUndefined(silentLogger("test"));
      // tslint:enable:no-console
    });
  });
});
