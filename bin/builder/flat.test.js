"use strict";
var chai_1 = require("chai");
var Sinon = require("sinon");
var TestUtilities = require("../test/utilities");
var Flat = require("./flat");
describe("builder/flat module has a", function () {
    describe("buildFlatBarrel function that", function () {
        var output;
        var spySandbox;
        var logger;
        beforeEach(function () {
            var directory = TestUtilities.mockDirectoryTree().directories[0];
            var modules = directory.directories.reduce(function (previous, current) { return previous.concat(current.files); }, directory.files);
            spySandbox = Sinon.sandbox.create();
            logger = spySandbox.spy();
            var options = {
                indexName: "barrel.ts",
                logger: logger,
                rootPath: ".",
            };
            output = Flat.buildFlatBarrel(directory, modules, options);
        });
        afterEach(function () {
            spySandbox.restore();
        });
        it("should produce the correct output", function () {
            TestUtilities.assertMultiLine(output, "export * from \"./script\";\nexport * from \"./directory4/deeplyNested\";\n");
        });
        it("should log useful information to the logger", function () {
            var messages = [
                "Including path ./script",
                "Including path ./directory4/deeplyNested",
            ];
            chai_1.assert.equal(logger.callCount, messages.length);
            messages.forEach(function (message, index) {
                chai_1.assert.equal(logger.getCall(index).args[0], message);
            });
        });
    });
});
//# sourceMappingURL=flat.test.js.map