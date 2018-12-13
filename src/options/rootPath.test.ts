import { assert } from "chai";
import { resolveRootPath } from "./rootPath";

describe("options/rootPath module has a", () => {
  describe("resolveRootPath function that", () => {
    it("should resolve the correct rootPath", () => {
      assert.match(resolveRootPath("test"), /test$/);
    });
  });
});
