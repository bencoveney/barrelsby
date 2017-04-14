import {assert} from "chai";
import * as Mocha from "mocha";

import * as TestUtilities from "../test/utilities";
import {Directory, Location} from "../utilities";
import * as FileSystem from "./fileSystem";

describe("builder/fileSystem module has a", () => {
    describe("buildFileSystemBarrel function that", () => {
        let output: string;
        beforeEach(() => {
            const directory = TestUtilities.mockDirectoryTree().directories[0];
            const modules = directory.directories.reduce(
                (previous: Location[], current: Directory) => previous.concat(current.files),
                directory.files,
            );
            output = FileSystem.buildFileSystemBarrel(directory, modules);
        });
        it("should produce the correct output", () => {
            TestUtilities.assertMultiLine(
                output,
                `import * as scriptts from "./script";
import * as directory4deeplyNestedts from "./directory4/deeplyNested";
export const directory4 = {
  "deeplyNested": directory4deeplyNestedts,
};
export {scriptts as script};
`);
        });
    });
});
