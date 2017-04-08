"use strict";
var chai_1 = require("chai");
var fs = require("fs");
var MockFs = require("mock-fs");
var TestUtilities = require("./test/utilities");
var Purge = require("./purge");
describe("purge module has a", function () {
    describe("purge function that", function () {
        var directory;
        var options;
        var logged;
        beforeEach(function () {
            MockFs(TestUtilities.mockFsConfiguration());
            directory = TestUtilities.mockDirectoryTree();
            logged = [];
            options = TestUtilities.mockOptions(logged);
        });
        afterEach(function () {
            MockFs.restore();
        });
        it("should delete existing barrels if the delete flag is enabled", function () {
            options.delete = true;
            Purge.purge(directory, options);
            // Check directory has been manipulated.
            chai_1.assert.lengthOf(directory.files, 2);
            chai_1.assert.lengthOf(directory.files.filter(function (file) { return file.name === "barrel.ts"; }), 0);
            // Check FS has been manipulated.
            chai_1.assert.isNotOk(fs.existsSync("directory1/barrel.ts"));
        });
        it("should do nothing if the delete flag is disabled", function () {
            options.delete = false;
            Purge.purge(directory, options);
            // Check directory has not been manipulated.
            chai_1.assert.lengthOf(directory.files, 3);
            chai_1.assert.lengthOf(directory.files.filter(function (file) { return file.name === "barrel.ts"; }), 1);
            // Check FS has not been manipulated.
            chai_1.assert.isOk(fs.existsSync("directory1/barrel.ts"));
        });
        it("should log useful information to the logger", function () {
            options.delete = true;
            Purge.purge(directory, options);
            chai_1.assert.lengthOf(logged, 1);
            options.logger("Deleting existing index @ directory1/barrel.ts");
        });
    });
});
//# sourceMappingURL=purge.test.js.map