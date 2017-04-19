import {assert} from "chai";

import * as TestUtilities from "../test/utilities";
import {Directory} from "../utilities";
import * as Utilities from "./utilities";

describe("builder/utilities module has a", () => {
    describe("buildImportPath function that", () => {
        let directory: Directory;
        beforeEach(() => {
            directory = TestUtilities.mockDirectoryTree();
        });
        it("should correctly build a path to a file in the same directory", () => {
            const target = TestUtilities.getLocationByName(directory.files, "index.ts");
            const result = Utilities.buildImportPath(directory, target);
            assert.equal(result, "./index");
        });
        it("should correctly build a path to a file in a child directory", () => {
            const childDirectory = TestUtilities.getLocationByName(directory.directories, "directory2") as Directory;
            const target = TestUtilities.getLocationByName(childDirectory.files, "script.ts");
            const result = Utilities.buildImportPath(directory, target);
            assert.equal(result, "./directory2/script");
        });
    });
});
