"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const logger_1 = require("./logger");
describe("options/logger module has a", () => {
    describe("getLogger function that", () => {
        it("should get the correct logger", () => {
            // tslint:disable:no-console
            const verboseLogger = logger_1.getLogger(true);
            chai_1.assert.equal(verboseLogger, console.log);
            const silentLogger = logger_1.getLogger(false);
            chai_1.assert.notEqual(silentLogger, console.log);
            chai_1.assert.isUndefined(silentLogger("test"));
            // tslint:enable:no-console
        });
    });
});
//# sourceMappingURL=logger.test.js.map