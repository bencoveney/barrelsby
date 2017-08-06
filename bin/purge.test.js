"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const fs = require("fs");
const MockFs = require("mock-fs");
const TestUtilities = require("./testUtilities");
const Purge = require("./purge");
describe("purge module has a", () => {
    describe("purge function that", () => {
        let directory;
        let options;
        let logged;
        beforeEach(() => {
            MockFs(TestUtilities.mockFsConfiguration());
            directory = TestUtilities.mockDirectoryTree();
            logged = [];
            options = TestUtilities.mockOptions(logged);
        });
        afterEach(() => {
            MockFs.restore();
        });
        it("should delete existing barrels if the delete flag is enabled", () => {
            options.delete = true;
            Purge.purge(directory, options);
            // Check directory has been manipulated.
            chai_1.assert.lengthOf(directory.files, 2);
            chai_1.assert.lengthOf(directory.files.filter((file) => file.name === "barrel.ts"), 0);
            // Check FS has been manipulated.
            chai_1.assert.isNotOk(fs.existsSync("directory1/barrel.ts"));
        });
        it("should do nothing if the delete flag is disabled", () => {
            options.delete = false;
            Purge.purge(directory, options);
            // Check directory has not been manipulated.
            chai_1.assert.lengthOf(directory.files, 3);
            chai_1.assert.lengthOf(directory.files.filter((file) => file.name === "barrel.ts"), 1);
            // Check FS has not been manipulated.
            chai_1.assert.isOk(fs.existsSync("directory1/barrel.ts"));
        });
        it("should log useful information to the logger", () => {
            options.delete = true;
            Purge.purge(directory, options);
            chai_1.assert.sameMembers(logged, ["Deleting existing barrel @ directory1/barrel.ts"]);
        });
    });
});
//# sourceMappingURL=purge.test.js.map