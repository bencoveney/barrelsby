import { assert } from "chai";

import { getQuoteCharacter } from "./quoteCharacter";

describe("options/quoteCharacter module has a", () => {
  describe("getQuoteCharacter function that", () => {
    it("should correctly return the singlequote", () => {
      assert.equal(getQuoteCharacter(true), "'");
    });
    it("should correctly return the doublequote", () => {
      assert.equal(getQuoteCharacter(false), '"');
    });
  });
});
