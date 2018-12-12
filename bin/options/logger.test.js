"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const logger_1 = require("./logger");
describe("options/logger module has a", () => {
    describe("getLogger function that", () => {
        it("should get the correct logger", () => {
            // tslint:disable:no-console
            chai_1.assert.equal(logger_1.getLogger(true), console.log);
            chai_1.assert.notEqual(logger_1.getLogger(false), console.log);
            // tslint:enable:no-console
        });
    });
});
//# sourceMappingURL=logger.test.js.map