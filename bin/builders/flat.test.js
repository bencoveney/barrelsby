"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon_1 = __importDefault(require("sinon"));
const TestUtilities = __importStar(require("../testUtilities"));
const Flat = __importStar(require("./flat"));
describe("builder/flat module has a", () => {
    describe("buildFlatBarrel function that", () => {
        describe("when using the default settings", () => {
            let output;
            let spySandbox;
            let logger;
            beforeEach(() => {
                const directory = TestUtilities.mockDirectoryTree();
                spySandbox = sinon_1.default.createSandbox();
                logger = spySandbox.spy();
                output = Flat.buildFlatBarrel(directory, TestUtilities.mockModules(directory), '"', ";", logger, undefined, false, false);
            });
            afterEach(() => {
                spySandbox.restore();
            });
            it("should produce the correct output", () => {
                TestUtilities.assertMultiLine(output, `export * from "./barrel";
export * from "./index";
export * from "./directory2/script";
export * from "./directory2/directory4/deeplyNested";
export * from "./directory3/program";
`);
            });
            it("should log useful information to the logger", () => {
                const messages = [
                    "Including path ./barrel",
                    "Including path ./index",
                    "Including path ./directory2/script",
                    "Including path ./directory2/directory4/deeplyNested",
                    "Including path ./directory3/program",
                ];
                chai_1.assert.equal(logger.callCount, messages.length);
                messages.forEach((message, index) => {
                    chai_1.assert.equal(logger.getCall(index).args[0], message);
                });
            });
            it("should produce output compatible with the recommended tslint ruleset", () => {
                TestUtilities.tslint(output, '"');
            });
        });
        describe("when using single quotes", () => {
            let output;
            let spySandbox;
            let logger;
            beforeEach(() => {
                const directory = TestUtilities.mockDirectoryTree();
                spySandbox = sinon_1.default.createSandbox();
                logger = spySandbox.spy();
                output = Flat.buildFlatBarrel(directory, TestUtilities.mockModules(directory), "'", ";", logger, undefined, false, false);
            });
            afterEach(() => {
                spySandbox.restore();
            });
            it("should produce the correct output", () => {
                TestUtilities.assertMultiLine(output, `export * from './barrel';
export * from './index';
export * from './directory2/script';
export * from './directory2/directory4/deeplyNested';
export * from './directory3/program';
`);
            });
            it("should log useful information to the logger", () => {
                const messages = [
                    "Including path ./barrel",
                    "Including path ./index",
                    "Including path ./directory2/script",
                    "Including path ./directory2/directory4/deeplyNested",
                    "Including path ./directory3/program",
                ];
                chai_1.assert.equal(logger.callCount, messages.length);
                messages.forEach((message, index) => {
                    chai_1.assert.equal(logger.getCall(index).args[0], message);
                });
            });
            it("should produce output compatible with the recommended tslint ruleset", () => {
                TestUtilities.tslint(output, "'");
            });
        });
        describe("when using no semicolon", () => {
            let output;
            let spySandbox;
            let logger;
            beforeEach(() => {
                const directory = TestUtilities.mockDirectoryTree();
                spySandbox = sinon_1.default.createSandbox();
                logger = spySandbox.spy();
                output = Flat.buildFlatBarrel(directory, TestUtilities.mockModules(directory), '"', "", logger, undefined, false, false);
            });
            afterEach(() => {
                spySandbox.restore();
            });
            it("should produce the correct output", () => {
                TestUtilities.assertMultiLine(output, `export * from "./barrel"
export * from "./index"
export * from "./directory2/script"
export * from "./directory2/directory4/deeplyNested"
export * from "./directory3/program"
`);
            });
            it("should log useful information to the logger", () => {
                const messages = [
                    "Including path ./barrel",
                    "Including path ./index",
                    "Including path ./directory2/script",
                    "Including path ./directory2/directory4/deeplyNested",
                    "Including path ./directory3/program",
                ];
                chai_1.assert.equal(logger.callCount, messages.length);
                messages.forEach((message, index) => {
                    chai_1.assert.equal(logger.getCall(index).args[0], message);
                });
            });
        });
        describe("when using the exportDefault setting", () => {
            let output;
            let spySandbox;
            let logger;
            beforeEach(() => {
                const directory = TestUtilities.mockDirectoryTree();
                spySandbox = sinon_1.default.createSandbox();
                logger = spySandbox.spy();
                output = Flat.buildFlatBarrel(directory, TestUtilities.mockModules(directory), '"', ";", logger, undefined, true, false);
            });
            afterEach(() => {
                spySandbox.restore();
            });
            it("should produce the correct output", () => {
                TestUtilities.assertMultiLine(output, `export { default as barrel } from "./barrel";
export * from "./barrel";
export { default as index } from "./index";
export * from "./index";
export { default as script } from "./directory2/script";
export * from "./directory2/script";
export { default as deeplyNested } from "./directory2/directory4/deeplyNested";
export * from "./directory2/directory4/deeplyNested";
export { default as program } from "./directory3/program";
export * from "./directory3/program";
`);
            });
            it("should produce output compatible with the recommended tslint ruleset", () => {
                TestUtilities.tslint(output, '"');
            });
        });
    });
});
//# sourceMappingURL=flat.test.js.map