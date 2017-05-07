import {assert} from "chai";

import * as TestUtilities from "../test/utilities";
import {Directory, Location} from "../utilities";
import * as Utilities from "./utilities";

// Gets a location from a list by name.
function getLocationByName(locations: Location[], name: string): Location {
    return locations.filter((location) => location.name === name)[0];
}

describe("builder/utilities module has a", () => {
    describe("buildImportPath function that", () => {
        let directory: Directory;
        beforeEach(() => {
            directory = TestUtilities.mockDirectoryTree();
        });
        it("should correctly build a path to a file in the same directory", () => {
            const target = getLocationByName(directory.files, "index.ts");
            const result = Utilities.buildImportPath(directory, target);
            assert.equal(result, "./index");
        });
        it("should correctly build a path to a file in a child directory", () => {
            const childDirectory = getLocationByName(directory.directories, "directory2") as Directory;
            const target = getLocationByName(childDirectory.files, "script.ts");
            const result = Utilities.buildImportPath(directory, target);
            assert.equal(result, "./directory2/script");
        });
    });
});
