import { assert } from "chai";

import { getSemicolonCharacter } from "./noSemicolon";

describe("options/noSemicolon module has a", () => {
  describe("getSemicolonCharacter function that", () => {
    it("should correctly return the semicolon", () => {
      assert.equal(getSemicolonCharacter(false), ";");
    });
    it("should correctly return the empty string", () => {
      assert.equal(getSemicolonCharacter(true), "");
    });
  });
});
