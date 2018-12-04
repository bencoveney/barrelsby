import { assert } from "chai";

import * as Utilities from "./utilities";

describe("utilities module has a", () => {
  describe("isTypeScriptFile regular expression that", () => {
    it("should match a typescript file", () => {
      assert.notEqual("instructions.ts".search(Utilities.isTypeScriptFile), -1);
    });
    it("should match a typescript file in a directory", () => {
      assert.notEqual(
        "src/code/scripts/instructions.ts".search(Utilities.isTypeScriptFile),
        -1
      );
    });
    it("should match a typescript definition file", () => {
      assert.notEqual(
        "definitions.d.ts".search(Utilities.isTypeScriptFile),
        -1
      );
    });
    it("should match a typescript jsx (.tsx) file", () => {
      assert.notEqual("other.tsx".search(Utilities.isTypeScriptFile), -1);
    });
    it("should not match a non-typescript file", () => {
      assert.equal("other.cs".search(Utilities.isTypeScriptFile), -1);
    });
  });
  describe("nonAlphaNumeric regular expression that", () => {
    it("should match any non-alpha-numeric characters", () => {
      const input = 'aA1!bB2"cC3£dD4$';
      const output = input.replace(Utilities.nonAlphaNumeric, "");
      assert.equal(output, "aA1bB2cC3dD4");
    });
  });
  describe("indentation constant that", () => {
    it("is only whitespace", () => {
      assert.equal(Utilities.indentation.trim(), "");
    });
  });
  describe("convertPathSeparator function that", () => {
    it("should window path seperators with unix ones", () => {
      const result = Utilities.convertPathSeparator("my\\long/path");
      assert.equal(result, "my/long/path");
    });
  });
});
