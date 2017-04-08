"use strict";
var chai_1 = require("chai");
var TestUtilities = require("../test/utilities");
var Utilities = require("./utilities");
describe("builder/utilities module has a", function () {
    describe("buildImportPath function that", function () {
        var directory;
        beforeEach(function () {
            directory = TestUtilities.mockDirectoryTree();
        });
        it("should correctly build a path to a file in the same directory", function () {
            var target = TestUtilities.getLocationByName(directory.files, "index.ts");
            var result = Utilities.buildImportPath(directory, target);
            chai_1.assert.equal(result, "./index");
        });
        it("should correctly build a path to a file in a child directory", function () {
            var childDirectory = TestUtilities.getLocationByName(directory.directories, "directory2");
            var target = TestUtilities.getLocationByName(childDirectory.files, "script.ts");
            var result = Utilities.buildImportPath(directory, target);
            chai_1.assert.equal(result, "./directory2/script");
        });
    });
});
//# sourceMappingURL=utilities.test.js.map