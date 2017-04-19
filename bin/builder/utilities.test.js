"use strict";
const chai_1 = require("chai");
const TestUtilities = require("../test/utilities");
const Utilities = require("./utilities");
describe("builder/utilities module has a", () => {
    describe("buildImportPath function that", () => {
        let directory;
        beforeEach(() => {
            directory = TestUtilities.mockDirectoryTree();
        });
        it("should correctly build a path to a file in the same directory", () => {
            const target = TestUtilities.getLocationByName(directory.files, "index.ts");
            const result = Utilities.buildImportPath(directory, target);
            chai_1.assert.equal(result, "./index");
        });
        it("should correctly build a path to a file in a child directory", () => {
            const childDirectory = TestUtilities.getLocationByName(directory.directories, "directory2");
            const target = TestUtilities.getLocationByName(childDirectory.files, "script.ts");
            const result = Utilities.buildImportPath(directory, target);
            chai_1.assert.equal(result, "./directory2/script");
        });
    });
});
//# sourceMappingURL=utilities.test.js.map