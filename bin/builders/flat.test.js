"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Sinon = require("sinon");
const TestUtilities = require("../testUtilities");
const Flat = require("./flat");
describe("builder/flat module has a", () => {
    describe("buildFlatBarrel function that", () => {
        describe("when using double quotes", () => {
            let output;
            let spySandbox;
            let logger;
            let options;
            beforeEach(() => {
                const directory = TestUtilities.mockDirectoryTree();
                spySandbox = Sinon.sandbox.create();
                logger = spySandbox.spy();
                options = {
                    barrelName: "barrel.ts",
                    logger,
                    quoteCharacter: "\"",
                    rootPath: ".",
                };
                output = Flat.buildFlatBarrel(directory, TestUtilities.mockModules(directory), options);
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
                TestUtilities.tslint(output, options);
            });
        });
        describe("when using single quotes", () => {
            let output;
            let spySandbox;
            let logger;
            let options;
            beforeEach(() => {
                const directory = TestUtilities.mockDirectoryTree();
                spySandbox = Sinon.sandbox.create();
                logger = spySandbox.spy();
                options = {
                    barrelName: "barrel.ts",
                    logger,
                    quoteCharacter: "'",
                    rootPath: ".",
                };
                output = Flat.buildFlatBarrel(directory, TestUtilities.mockModules(directory), options);
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
                TestUtilities.tslint(output, options);
            });
        });
    });
});
//# sourceMappingURL=flat.test.js.map