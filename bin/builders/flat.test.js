"use strict";
const chai_1 = require("chai");
const Sinon = require("sinon");
const TestUtilities = require("../testUtilities");
const Flat = require("./flat");
describe("builder/flat module has a", () => {
    describe("buildFlatBarrel function that", () => {
        let output;
        let spySandbox;
        let logger;
        beforeEach(() => {
            const directory = TestUtilities.mockDirectoryTree().directories[0];
            const modules = directory.directories.reduce((previous, current) => previous.concat(current.files), directory.files);
            spySandbox = Sinon.sandbox.create();
            logger = spySandbox.spy();
            const options = {
                barrelName: "barrel.ts",
                logger,
                rootPath: ".",
            };
            output = Flat.buildFlatBarrel(directory, modules, options);
        });
        afterEach(() => {
            spySandbox.restore();
        });
        it("should produce the correct output", () => {
            TestUtilities.assertMultiLine(output, `export * from "./script";
export * from "./directory4/deeplyNested";
`);
        });
        it("should log useful information to the logger", () => {
            const messages = [
                "Including path ./script",
                "Including path ./directory4/deeplyNested",
            ];
            chai_1.assert.equal(logger.callCount, messages.length);
            messages.forEach((message, index) => {
                chai_1.assert.equal(logger.getCall(index).args[0], message);
            });
        });
        it("should produce output compatible with the recommended tslint ruleset", () => {
            TestUtilities.tslint(output);
        });
    });
});
//# sourceMappingURL=flat.test.js.map