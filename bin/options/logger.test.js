"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
describe("options/logger module has a", () => {
    describe("getLogger function that", () => {
        it("should get the correct logger", () => {
            // tslint:disable:no-console
            const verboseLogger = (0, logger_1.getLogger)({ isVerbose: true });
            expect(verboseLogger).toEqual(console.log);
            const silentLogger = (0, logger_1.getLogger)({ isVerbose: false });
            expect(silentLogger).not.toEqual(console.log);
            expect(silentLogger).toBeDefined();
            // tslint:enable:no-console
        });
    });
});
//# sourceMappingURL=logger.test.js.map