import { assert } from "chai";
import { getCombinedBaseUrl } from "./baseUrl";

describe("options/baseUrl module has a", () => {
  describe("getCombinedBaseUrl function that", () => {
    it("should resolve the correct baseUrl", () => {
      assert.match(
        getCombinedBaseUrl(".", "base/url") as string,
        /base[\\/]url$/
      );
      assert.isUndefined(getCombinedBaseUrl(".", undefined));
    });
  });
});
