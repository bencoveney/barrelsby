import { getLogger } from "./logger";

describe("options/logger module has a", () => {
  describe("getLogger function that", () => {
    it("should get the correct logger", () => {
      // tslint:disable:no-console
      const verboseLogger = getLogger({ isVerbose: true });
      expect(verboseLogger).toEqual(console.log);

      const silentLogger = getLogger({ isVerbose: false });
      expect(silentLogger).not.toEqual(console.log);
      expect(silentLogger).toBeDefined();
      // tslint:enable:no-console
    });
  });
});
