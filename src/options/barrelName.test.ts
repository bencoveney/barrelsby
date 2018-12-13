import { assert } from "chai";
import Sinon from "sinon";

import { getBarrelName } from "./barrelName";

describe("options/barrelName module has a", () => {
  describe("getBarrelName function that", () => {
    let spySandbox: sinon.SinonSandbox;
    let logger: Sinon.SinonSpy;
    beforeEach(() => {
      spySandbox = Sinon.createSandbox();
      logger = spySandbox.spy();
    });
    afterEach(() => {
      spySandbox.restore();
    });
    it("should ensure the name has .ts attached", () => {
      assert.equal(getBarrelName("barrel.ts", logger), "barrel.ts");
      assert.equal(getBarrelName("barrel", logger), "barrel.ts");
    });
    it("should log the barrel name", () => {
      getBarrelName("barrel.ts", logger);
      assert(logger.calledOnceWithExactly("Using name barrel.ts"));
    });
  });
});
