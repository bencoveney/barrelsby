"use strict";
const chai_1 = require("chai");
const TestUtilities = require("../test/utilities");
const Utilities = require("./utilities");
// Gets a location from a list by name.
function getLocationByName(locations, name) {
    return locations.filter((location) => location.name === name)[0];
}
describe("builder/utilities module has a", () => {
    describe("buildImportPath function that", () => {
        let directory;
        beforeEach(() => {
            directory = TestUtilities.mockDirectoryTree();
        });
        it("should correctly build a path to a file in the same directory", () => {
            const target = getLocationByName(directory.files, "index.ts");
            const result = Utilities.buildImportPath(directory, target);
            chai_1.assert.equal(result, "./index");
        });
        it("should correctly build a path to a file in a child directory", () => {
            const childDirectory = getLocationByName(directory.directories, "directory2");
            const target = getLocationByName(childDirectory.files, "script.ts");
            const result = Utilities.buildImportPath(directory, target);
            chai_1.assert.equal(result, "./directory2/script");
        });
    });
});
//# sourceMappingURL=utilities.test.js.map