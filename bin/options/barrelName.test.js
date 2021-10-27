"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sinon_1 = __importDefault(require("sinon"));
const barrelName_1 = require("./barrelName");
const signale_1 = require("signale");
describe("options/barrelName module has a", () => {
    describe("getBarrelName function that", () => {
        let spySandbox;
        let logger;
        let loggerSpy;
        beforeEach(() => {
            spySandbox = sinon_1.default.createSandbox();
            logger = new signale_1.Signale();
            loggerSpy = spySandbox.spy(logger, "debug");
        });
        afterEach(() => {
            spySandbox.restore();
        });
        it("should ensure the name has .ts attached", () => {
            expect((0, barrelName_1.getBarrelName)("barrel.ts", logger)).toEqual("barrel.ts");
            expect((0, barrelName_1.getBarrelName)("barrel", logger)).toEqual("barrel.ts");
        });
        it("should log the barrel name", () => {
            (0, barrelName_1.getBarrelName)("barrel.ts", logger);
            expect(loggerSpy.calledOnceWithExactly("Using name barrel.ts")).toBeTruthy();
        });
    });
});
//# sourceMappingURL=barrelName.test.js.map