"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon_1 = __importDefault(require("sinon"));
const barrelName_1 = require("./barrelName");
describe("options/barrelName module has a", () => {
    describe("getBarrelName function that", () => {
        let spySandbox;
        let logger;
        beforeEach(() => {
            spySandbox = sinon_1.default.createSandbox();
            logger = spySandbox.spy();
        });
        afterEach(() => {
            spySandbox.restore();
        });
        it("should ensure the name has .ts attached", () => {
            chai_1.assert.equal(barrelName_1.getBarrelName("barrel.ts", logger), "barrel.ts");
            chai_1.assert.equal(barrelName_1.getBarrelName("barrel", logger), "barrel.ts");
        });
        it("should log the barrel name", () => {
            barrelName_1.getBarrelName("barrel.ts", logger);
            chai_1.assert(logger.calledOnceWithExactly("Using name barrel.ts"));
        });
    });
});
//# sourceMappingURL=barrelName.test.js.map